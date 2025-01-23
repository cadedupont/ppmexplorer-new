'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

// const MarkerClusterGroup = dynamic(
//   () => import('react-leaflet-markercluster').then((module) => module.default),
//   { ssr: false },
// );
const GeoJSON = dynamic(() => import('react-leaflet').then((module) => module.GeoJSON), {
  ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import('react-leaflet').then((module) => module.Popup), { ssr: false });

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

  const [icon, setIcon] = useState<L.Icon | null>(null);
  useEffect(() => {
    const createIcon = async () => {
      const { Icon } = await import('leaflet');
      const dynamicIcon = new Icon({
        iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -32],
      });
      setIcon(dynamicIcon);
    };

    createIcon();
  }, []);

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
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-3/4">
        <PompeiiMap centroid={[40.75103, 14.4884]} zoom={16} width={'100%'} height={'100vh'}>
          <GeoJSON
            key={JSON.stringify(featureCollection)}
            data={featureCollection}
            style={(feature) => ({
              color: getColorByScope(feature?.properties.scope) || 'blue',
              fillOpacity: 0.1,
            })}
          />
          {/* <MarkerClusterGroup animate={true} zoomToBoundsOnClick={true} showCoverageOnHover={false}> */}
          <div>
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
          </div>
          {/* </MarkerClusterGroup> */}
        </PompeiiMap>
      </div>
      <div className="w-1/4 overflow-y-auto">
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
