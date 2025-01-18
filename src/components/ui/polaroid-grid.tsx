"use client";

import Polaroid from "@/components/ui/polaroid";

import { PPMItem } from "@/lib/types";

const PolaroidGrid = ({ items }: { items: PPMItem[] }) => {
  return (
    <>
      {items.length > 0 ? (
        <div className="flex items-center justify-center">
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item: PPMItem) => (
              <Polaroid key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-4">No results.</div>
      )}
    </>
  );
};

export default PolaroidGrid;
