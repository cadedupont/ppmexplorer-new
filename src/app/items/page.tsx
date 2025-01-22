"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Table, Grid2x2, Map, X, Key } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PolaroidGrid from "@/components/ui/polaroid-grid";
import LoadingSpinner from "@/components/ui/loading-spinner";
import DataTable from "./data-table";
import CollectionMap from "./collection-map";
import TablePagination from "./pagination";
import columns from "./columns";

import type { PPMItem } from "@/lib/types";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;
  const view = searchParams.get("view") || "table";
  const location = searchParams.get("location");
  const query = searchParams.get("query") || "";

  const [items, setItems] = useState<PPMItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("query", searchQuery);
    router.push(`/items?${newParams.toString()}`);
  };

  const parseLocation = (location: string) => {
    const parts = location.split(":")[3].split("-");
    const regio = parts[0] ? `Regio: ${parts[0].slice(1)}` : "";
    const insula = parts[1] ? `Insula: ${parts[1].slice(1)}` : "";
    const property = parts[2] ? `Property: ${parts[2].slice(1)}` : "";
    const room = parts[4] ? `Room: ${parts[4]}` : "";
    return { regio, insula, property, room };
  };

  useEffect(() => {
    const getItems = async () => {
      const base = query ? "/api/search" : "/api/items";
      let url = `${base}?offset=${offset}&limit=${limit}`;
      if (location) url += `&location=${location}`;
      if (query) url += `&query=${encodeURIComponent(query)}`;

      setIsLoading(true);
      setError(null);
      const response = await fetch(url);
      const data = await response.json();
      data.error ? setError(data.error) : setItems(data);
      setIsLoading(false);
    };

    getItems();
  }, [limit, offset, location, query]);

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs
        value={view}
        onValueChange={(value) => {
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set("view", value);
          router.push(`/items?${newParams.toString()}`);
        }}
      >
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
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>
        {location && (
          <div className="flex gap-2 mb-4">
            {Object.entries(parseLocation(location)).map(([key, value]) =>
              value ? (
                <Badge variant="secondary" key={key}>
                  {value}
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      const newParams = new URLSearchParams(
                        searchParams.toString()
                      );
                      const location = newParams.get("location") as string;

                      if (key === "room") {
                        newParams.set(
                          "location",
                          location?.replace(/-space-.*/, "")
                        );
                      } else if (key === "insula") {
                        newParams.set(
                          "location",
                          location?.replace(/-i.*/, "")
                        );
                      } else if (key === "property") {
                        newParams.set(
                          "location",
                          location?.replace(/-p.*/, "")
                        );
                      } else {
                        newParams.delete("location");
                      }

                      router.push(`/items?${newParams.toString()}`);
                    }}
                  >
                    <X />
                  </Button>
                </Badge>
              ) : null
            )}
          </div>
        )}
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
        <div className="flex justify-between items-center mt-8 gap-4">
          <TablePagination />
          <div className="flex items-center gap-4">
            <Select
              value={String(limit)}
              onValueChange={(value: string) => {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.set("page", "1");
                newParams.set("limit", value);
                router.push(`/items?${newParams.toString()}`);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Items Per Page</SelectLabel>
                  {["5", "10", "20", "50", "100"].map((num: string) => (
                    <SelectItem key={num} value={num}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Page;
