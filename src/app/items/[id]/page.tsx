'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import Image from 'next/image';
import { Captions, BookOpenText, MapPin } from 'lucide-react';
import { GeoJSON } from 'react-leaflet';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PompeiiMap from '@/components/ui/pompeii-map';
import LoadingSpinner from '@/components/ui/loading-spinner';
import PolaroidGrid from '@/components/ui/polaroid-grid';
import BreadcrumbTrail from './breadcrumb-trail';

import { getColorByScope } from '@/lib/utils';
import { regios } from '@/lib/constants';

const Page = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const searchParams = useSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const response = await fetch(`/api/items/${id}`);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    },
    staleTime: Infinity,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error?.message || `Failed to get data for item ${id}. Please try again later.`}
      </div>
    );
  }

  return (
    <div>
      <BreadcrumbTrail searchParams={searchParams} currentItem={data.item.id} />
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <CardContent className="flex items-center justify-center">
            <Image
              src={data.item.imageURL}
              alt={data.item.id}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto max-h-[50vh] w-full object-contain"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          </CardContent>
          <CardContent className="flex items-center justify-center">
            <PompeiiMap
              centroid={[
                data.item.location.geojson.properties.centroid.lat,
                data.item.location.geojson.properties.centroid.lon,
              ]}
              zoom={
                data.item.location.geojson.properties.scope === 'room' ||
                data.item.location.geojson.properties.scope === 'property'
                  ? 20
                  : 17
              }
              width={'100%'}
              height={'50vh'}
            >
              <GeoJSON
                key={JSON.stringify(data.item.location.geojson)}
                data={data.item.location.geojson}
                style={{
                  color: getColorByScope(data.item.location.geojson.properties.scope),
                  fillOpacity: 0.8,
                }}
              />
              {data.item.location.geojson.properties.scope !== 'regio' && (
                <GeoJSON
                  key={JSON.stringify(regios[data.item.location.regio])}
                  data={regios[data.item.location.regio]}
                  style={{ color: 'blue', fillOpacity: 0.1 }}
                />
              )}
            </PompeiiMap>
          </CardContent>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InfoCard title="Caption (English)" content={data.item.caption_en} icon={<Captions />} />
          <InfoCard title="Caption (Italian)" content={data.item.caption_it} icon={<Captions />} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          <InfoCard title="Volume" content={data.item.volume} icon={<BookOpenText />} />
          <InfoCard title="Page" content={data.item.page} icon={<BookOpenText />} />
          <InfoCard title="Regio" content={data.item.location.regio} icon={<MapPin />} />
          <InfoCard title="Insula" content={data.item.location.insula} icon={<MapPin />} />
          <InfoCard title="Property" content={data.item.location.property} icon={<MapPin />} />
          <InfoCard title="Room" content={data.item.location.room || 'N/A'} icon={<MapPin />} />
        </div>
      </div>
      <div className="mb-8">
        <h2 className="mb-4 mt-8 text-2xl font-bold">Similar Images</h2>
        <PolaroidGrid
          items={data.similarImages}
          searchParams={(() => {
            const newParams = new URLSearchParams(searchParams.toString());
            const previous = newParams.get('previous');
            if (previous) {
              newParams.set('previous', `${previous},${data.item.id}`);
            } else {
              newParams.set('previous', data.item.id);
            }
            return newParams.toString();
          })()}
        />
      </div>
      <div className="mb-8">
        <h2 className="mb-4 mt-8 text-2xl font-bold">Similar Captions</h2>
        <PolaroidGrid
          items={data.similarCaptions}
          searchParams={(() => {
            const newParams = new URLSearchParams(searchParams.toString());
            const previous = newParams.get('previous');
            if (previous) {
              newParams.set('previous', `${previous},${data.item.id}`);
            } else {
              newParams.set('previous', data.item.id);
            }
            return newParams.toString();
          })()}
        />
      </div>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  content: string | number;
  icon?: React.ReactNode;
}
const InfoCard = ({ title, content, icon }: InfoCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between text-xl text-primary">
        <span>{title}</span>
        {icon}
      </CardTitle>
    </CardHeader>
    <CardContent>{content}</CardContent>
  </Card>
);

export default Page;
