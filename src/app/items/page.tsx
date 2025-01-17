import { Table, Grid2x2 } from "lucide-react";

import PPMPolaroid from "@/components/ui/ppm-polaroid";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DataTable from "./data-table";
import columns from "./columns";

import type { PPMItem } from "@/lib/types";

const fetchItems = async () => {
  const response = await fetch("http://localhost:4000/items");
  return response.json();
};

const Page = async () => {
  const items = await fetchItems();

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="table">
        <div className="max-w-[400px] mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="table">
              <Table className="h-4 w-4 mr-2" />
              Table
            </TabsTrigger>
            <TabsTrigger value="grid">
              <Grid2x2 className="h-4 w-4 mr-2" />
              Grid
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="table">
          <DataTable columns={columns} data={items} />
        </TabsContent>
        <TabsContent value="grid">
          <div className="flex items-center justify-center">
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item: PPMItem) => (
                <PPMPolaroid key={item.id} item={item} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
