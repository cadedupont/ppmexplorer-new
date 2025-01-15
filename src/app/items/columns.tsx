"use client";

import { ColumnDef } from "@tanstack/react-table";

import PPMImage from "@/components/ui/ppm-image";

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
      <div className="h-[100px] w-[100px] overflow-hidden">
        <PPMImage
          src={row.original.imageURL}
          alt={row.original.id}
          width={100}
          height={100}
          className="object-cover h-full"
        />
      </div>
    ),
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
    cell: ({ row }) => row.original.location.property || "N/A",
  },
  {
    accessorKey: "room",
    header: "Room",
    cell: ({ row }) => row.original.location.room || "N/A",
  },
];

export default columns;
