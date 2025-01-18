"use client";

import { ExternalLink } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import Lightbox from "@/components/ui/lightbox";
import { Button } from "@/components/ui/button";

import type { PPMItem } from "@/lib/types";

const columns: ColumnDef<PPMItem>[] = [
  {
    accessorKey: "volume",
    header: "Volume",
  },
  {
    accessorKey: "page",
    header: "Page",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="h-[100px] w-[100px] overflow-hidden flex items-center">
        <Lightbox
          src={row.original.imageURL}
          alt={row.original.id}
          caption={row.original.caption_it}
        />
      </div>
    ),
  },
  {
    accessorKey: "roomType",
    header: "Room Type",
  },
  {
    accessorKey: "regio",
    header: "Regio",
    cell: ({ row }) => row.original.location.regio,
  },
  {
    accessorKey: "insula",
    header: "Insula",
    cell: ({ row }) => row.original.location.insula,
  },
  {
    accessorKey: "property",
    header: "Property",
    cell: ({ row }) => row.original.location.property,
  },
  {
    accessorKey: "room",
    header: "Room",
    cell: ({ row }) => row.original.location.room || "N/A",
  },
  {
    accessorKey: "open",
    header: "",
    cell: ({ row }) => (
      <Link href={`/${row.original.id}`}>
        <Button variant="link" size="icon">
          <ExternalLink />
        </Button>
      </Link>
    ),
  },
];

export default columns;
