import Polaroid from "@/components/ui/polaroid";
import PolaroidGrid from "@/components/ui/polaroid-grid";
import { TabsContent } from "@/components/ui/tabs";
import DataTable from "./data-table";
import TablePagination from "./pagination";
import ViewSwitch from "./view-switch";
import columns from "./columns";

import type { PPMItem } from "@/lib/types";

const ITEMS_PER_PAGE = 5;

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    view: string | null;
    page: string | null;
  }>;
}) => {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const response = await fetch("http://localhost:4000/items");
  const items: PPMItem[] = (await response.json()).slice(
    offset,
    offset + ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto py-10">
      <ViewSwitch>
        <TabsContent value="table">
          <DataTable columns={columns} data={items} />
        </TabsContent>
        <TabsContent value="grid">
          <PolaroidGrid items={items} />
        </TabsContent>
      </ViewSwitch>
      <div className="flex justify-center mt-4">
        <TablePagination currentPage={currentPage} />
      </div>
    </div>
  );
};

export default Page;
