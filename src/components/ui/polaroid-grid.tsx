'use client';

import Polaroid from '@/components/ui/polaroid';

import { PPMItem } from '@/lib/types';

const PolaroidGrid = ({ items, searchParams }: { items: PPMItem[]; searchParams: string }) => {
  return (
    <>
      {items.length > 0 ? (
        <div className="flex items-center justify-center">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item: PPMItem) => (
              <Polaroid key={item.id} item={item} searchParams={searchParams} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex justify-center">No results.</div>
      )}
    </>
  );
};

export default PolaroidGrid;
