import PPMPolaroid from "@/components/ui/ppm-polaroid";
import columns from "./columns";
import DataTable from "./data-table";

import type { PPMItem } from "@/lib/types";

async function fetchItems() {
  const response = await fetch("http://localhost:4000/items");
  return response.json();
}

export default async function Page() {
  const items = await fetchItems();
  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={items} />
      </div>
      <div className="flex items-center justify-center">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: PPMItem) => (
            <PPMPolaroid key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
