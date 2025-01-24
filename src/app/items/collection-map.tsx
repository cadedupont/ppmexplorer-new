'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import MarkerClusterGroup from 'react-leaflet-markercluster';
import { GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
const icon = new L.Icon({
  iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

const PompeiiMap = dynamic(() => import('@/components/ui/pompeii-map'), {
  ssr: false,
});
import Polaroid from '@/components/ui/polaroid';

import { regios } from '@/lib/constants';
import { PPMItem } from '@/lib/types';
import { getColorByScope } from '@/lib/utils';

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';

const CollectionMap = ({ items }: { items: PPMItem[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const location = searchParams.get('location');

  const { data, error } = useQuery({
    queryKey: ['geojson', { location }],
    queryFn: async () => {
      const response = await fetch(`/api/geojson/${location}/spatial-ancestors`);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return {
        features: data,
      };
    },
    staleTime: Infinity,
    enabled: !!location,
  });
  const featureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: data?.features || regios,
  };

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-red-500">
        {error?.message || 'An error occurred. Please try again later.'}
      </div>
    );
  }

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PompeiiMap centroid={[40.75103, 14.4884]} zoom={16} width={'100%'} height={'100vh'}>
          <GeoJSON
            key={JSON.stringify(featureCollection)}
            data={featureCollection}
            style={(feature) => ({
              color: getColorByScope(feature?.properties.scope) || 'blue',
              fillOpacity: 0.1,
            })}
          />
          <MarkerClusterGroup animate={true} zoomToBoundsOnClick={true} showCoverageOnHover={false}>
            {items.map((item: PPMItem) => (
              <Marker
                position={[
                  item.location.geojson.properties.centroid.lat,
                  item.location.geojson.properties.centroid.lon,
                ]}
                key={item.id}
                icon={icon || undefined}
                eventHandlers={{
                  click:
                    !location || (location && !location.includes('space'))
                      ? () => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set('location', item.location.geojson.id);
                          newParams.set('page', '1');
                          router.replace(`items?${newParams.toString()}`);
                        }
                      : undefined,
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  mouseout: (e) => {
                    e.target.closePopup();
                  },
                }}
              >
                <Popup>{item.location.geojson.properties.name}</Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </PompeiiMap>
      </div>
      <div className="overflow-y-auto lg:col-span-1">
        {items.length > 0 ? (
          items.map((item: PPMItem) => {
            return (
              <div key={item.id} className="mb-4 ml-4">
                <Polaroid item={item} searchParams={searchParams.toString()} />
              </div>
            );
          })
        ) : (
          <div className="text-center">No results.</div>
        )}
      </div>
    </div>
  );
};

export default CollectionMap;
