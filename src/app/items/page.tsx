"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { Table, Grid2x2, Map } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import PolaroidGrid from "@/components/ui/polaroid-grid";
import LoadingSpinner from "@/components/ui/loading-spinner";
import DataTable from "./data-table";
import CollectionMap from "./collection-map";
import TablePagination from "./pagination";
import columns from "./columns";

import type { PPMItem } from "@/lib/types";

const ITEMS_PER_PAGE = 5;

const Page = () => {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<PPMItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const location = searchParams.get("location");

    let url = `/api/items?offset=${offset}&limit=${ITEMS_PER_PAGE}`;
    if (location) {
      url += `&location=${location}`;
    }

    const getItems = async () => {
      setIsLoading(true);
      setError(null);
      const response = await fetch(url);
      const data = await response.json();
      data.error ? setError(data.error) : setItems(data);
      setIsLoading(false);
    };

    getItems();
    setCurrentPage(page);
  }, [searchParams]);

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="table">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="table">
              <Table className="h-4 w-4 mr-2" />
              Table
            </TabsTrigger>
            <TabsTrigger value="grid">
              <Grid2x2 className="h-4 w-4 mr-2" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="h-4 w-4 mr-2" />
              Map
            </TabsTrigger>
          </TabsList>
          <Input type="text" placeholder="Search..." value={searchQuery} />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <TabsContent value="table">
              <DataTable columns={columns} data={items} />
            </TabsContent>
            <TabsContent value="grid">
              <PolaroidGrid items={items} />
            </TabsContent>
            <TabsContent value="map">
              <CollectionMap
                itemLocations={items.map((item) => item.location.geojson)}
              />
            </TabsContent>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <TablePagination currentPage={currentPage} />
        </div>
      </Tabs>
    </div>
  );
};

export default Page;
