import Polaroid from "@/components/ui/polaroid";
import type { PPMItem } from "@/lib/types";

async function fetchItems() {
  const response = await fetch("http://localhost:4000/items");
  return response.json()
}

export default async function Page() {
  const items = await fetchItems();
  return (
    <div className="flex items-center justify-center">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item: PPMItem) => (
          <Polaroid key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}