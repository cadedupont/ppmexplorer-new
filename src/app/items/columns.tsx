'use client';

import { ExternalLink } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import Lightbox from '@/components/ui/lightbox';
import { Button } from '@/components/ui/button';

import type { PPMItem } from '@/lib/types';

const useColumns = (showSimilarity: boolean, searchParams: string): ColumnDef<PPMItem>[] => {
  const columns: ColumnDef<PPMItem>[] = showSimilarity
    ? [
        {
          accessorKey: 'similarityScore',
          header: 'Similarity',
          cell: ({ row }) =>
            row.original.similarityScore
              ? `${(row.original.similarityScore * 100).toFixed(2)}%`
              : null,
        },
      ]
    : [];

  columns.push(
    {
      accessorKey: 'volume',
      header: 'Volume',
    },
    {
      accessorKey: 'page',
      header: 'Page',
    },
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <div className="flex h-[100px] w-[100px] items-center overflow-hidden">
          <Lightbox
            src={row.original.imageURL}
            alt={row.original.id}
            caption={row.original.caption_it}
          />
        </div>
      ),
    },
    {
      accessorKey: 'regio',
      header: 'Regio',
      cell: ({ row }) => row.original.location.regio,
    },
    {
      accessorKey: 'insula',
      header: 'Insula',
      cell: ({ row }) => row.original.location.insula,
    },
    {
      accessorKey: 'property',
      header: 'Property',
      cell: ({ row }) => row.original.location.property,
    },
    {
      accessorKey: 'room',
      header: 'Room',
      cell: ({ row }) => row.original.location.room || 'N/A',
    },
    {
      accessorKey: 'open',
      header: '',
      cell: ({ row }) => (
        <Link
          href={{
            pathname: `/items/${row.original.id}`,
            query: searchParams,
          }}
        >
          <Button variant="link" size="icon">
            <ExternalLink />
          </Button>
        </Link>
      ),
    },
  );

  return columns;
};

export default useColumns;
