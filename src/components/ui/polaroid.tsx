"use client";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import Image from "next/image";
import Link from "next/link";
import type { PPMItem } from "@/lib/types";

export default function Polaroid({ item }: { item: PPMItem }) {
  const { imageURL, caption_en, volume, page, location } = item;
  const { regio, insula, property } = location;
  return (
    <Link href={`/items/${item.id}`}>
      <Card className="w-[300px] h-[600px] p-2">
        <CardHeader>
          <CardTitle>
            Volume {volume}, Page {page}
          </CardTitle>
          <CardDescription>
            Regio {regio}, Insula {insula}, Property {property || "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Image
            className="w-[250px] h-[250px] flex items-center justify-center object-contain pointer-events-none"
            src={imageURL}
            alt={caption_en}
            width={250}
            height={250}
            unselectable="on"
            onContextMenu={(e) => e.preventDefault()}
          />
        </CardContent>
        <CardFooter className="h-[250px] overflow-y-auto">
          {caption_en}
        </CardFooter>
      </Card>
    </Link>
  );
}
