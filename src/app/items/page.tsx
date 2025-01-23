'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Table, Grid2x2, Map, X } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PolaroidGrid from '@/components/ui/polaroid-grid';
import LoadingSpinner from '@/components/ui/loading-spinner';
import DataTable from './data-table';
import CollectionMap from './collection-map';
import useColumns from './columns';

import type { PPMItem } from '@/lib/types';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<string>(searchParams.get('view') || 'table');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('query') || '');
  const [vectorType, setVectorType] = useState<string>(searchParams.get('vector') || 'caption');
  const [limit, setLimit] = useState<number>(Number(searchParams.get('limit')) || 10);
  const page = useMemo(() => Number(searchParams.get('page')) || 1, [searchParams]);
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);
  const location = searchParams.get('location');
  const query = searchParams.get('query');

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    router.replace(`/items?${newParams.toString()}`);
  };

  const parsedLocation = useMemo(() => {
    if (!location) return {};
    const parts = location.split(':')[3]?.split('-') || [];
    return {
      regio: parts[0] ? `Regio: ${parts[0].slice(1)}` : '',
      insula: parts[1] ? `Insula: ${parts[1].slice(1)}` : '',
      property: parts[2] ? `Property: ${parts[2].slice(1)}` : '',
      room: parts[4] ? `Room: ${parts[4]}` : '',
    };
  }, [location]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['items', { offset, limit, location, query, vectorType: query ? vectorType : null }],
    queryFn: async () => {
      let url = `${query ? `api/search` : `/api/items`}?offset=${offset}&limit=${limit}`;
      if (location) url += `&location=${location}`;
      if (query) url += `&query=${query}&vector=${vectorType}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    },
    staleTime: Infinity,
  });

  const columns = useColumns(
    data?.items.some((item: PPMItem) => item.similarityScore),
    searchParams.toString(),
  );

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-red-500">
          {error?.message || 'An error occurred. Please try again later.'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs
        value={view}
        onValueChange={(value) => {
          setView(value);
          updateSearchParams({ view: value, page: String(page) });
        }}
      >
        <div className="mb-4 grid grid-cols-2 gap-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="table">
              <Table className="mr-2 h-4 w-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="grid">
              <Grid2x2 className="mr-2 h-4 w-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="mr-2 h-4 w-4" />
              Map
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateSearchParams({ query: searchQuery, page: '1' });
                }
              }}
            />
            <Button
              onClick={() => {
                updateSearchParams({ query: searchQuery, page: '1' });
              }}
            >
              Search
            </Button>
            <Select
              value={String(limit)}
              onValueChange={(value: string) => {
                setLimit(Number(value));
                updateSearchParams({
                  limit: value,
                  page: String(page > (Math.ceil(data.count / Number(value)) || 1) ? 1 : page),
                });
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Items Per Page</SelectLabel>
                  {['5', '10', '20', '50', '100', '200', '500'].map((num: string) => (
                    <SelectItem key={num} value={num}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={String(vectorType)}
              onValueChange={(value: string) => {
                setVectorType(value);
                updateSearchParams({
                  vector: value,
                  page: query ? '1' : String(page),
                });
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Vector Search Type</SelectLabel>
                  <SelectItem key={'caption'} value="caption">
                    Caption
                  </SelectItem>
                  <SelectItem key={'image'} value="image">
                    Image
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-4 flex gap-2">
          {searchParams.has('query') && (
            <Badge variant="secondary">
              Search: {searchQuery}
              <Button
                variant="link"
                size="sm"
                className="ml-2"
                onClick={() => {
                  updateSearchParams({ query: null, page: '1' });
                  setSearchQuery('');
                }}
              >
                <X />
              </Button>
            </Badge>
          )}
          {location &&
            Object.entries(parsedLocation).map(([key, value]) =>
              value ? (
                <Badge variant="secondary" key={key}>
                  {value}
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams.toString());
                      const location = newParams.get('location') as string;
                      if (key === 'room') {
                        newParams.set('location', location?.replace(/-space-.*/, ''));
                      } else if (key === 'insula') {
                        newParams.set('location', location?.replace(/-i.*/, ''));
                      } else if (key === 'property') {
                        newParams.set('location', location?.replace(/-p.*/, ''));
                      } else {
                        newParams.delete('location');
                      }
                      router.replace(`/items?${newParams.toString()}`);
                    }}
                  >
                    <X />
                  </Button>
                </Badge>
              ) : null,
            )}
        </div>
        {isLoading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <TabsContent value="table">
              <DataTable columns={columns} data={data.items} />
            </TabsContent>
            <TabsContent value="grid">
              <PolaroidGrid items={data.items} searchParams={searchParams.toString()} />
            </TabsContent>
            <TabsContent value="map">
              <CollectionMap items={data.items} />
            </TabsContent>
            <div className="mt-8 flex items-center">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => {
                            updateSearchParams({ page: String(page - 1) });
                          }}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => {
                            updateSearchParams({ page: String(page - 1) });
                          }}
                        >
                          {page - 1}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationLink isActive>{page}</PaginationLink>
                  </PaginationItem>
                  {page < Math.ceil(data.count / limit) && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => {
                            updateSearchParams({ page: String(page + 1) });
                          }}
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => {
                            updateSearchParams({ page: String(page + 1) });
                          }}
                        />
                      </PaginationItem>
                    </>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Page;
