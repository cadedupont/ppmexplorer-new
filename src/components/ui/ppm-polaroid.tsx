"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";

import type { PPMItem } from "@/lib/types";

const PPMPolaroid = ({ item }: { item: PPMItem }) => {
  const { id, imageURL, imageIndex, caption_it, volume, page, location } = item;
  const { regio, insula, property, room } = location;

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="relative">
        <CardTitle className="flex flex-row items-center justify-between space-y-0">
            Volume {volume}, Page {page}, Image {imageIndex}
          <Link href={`/items/${item.id}`}>
            <Button variant="link" size="icon">
              <ExternalLink />
            </Button>
          </Link>
        </CardTitle>
        <CardDescription>
          Regio {regio}, Insula {insula}, Property {property}
          {room && `, Room ${room}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Image
          src={imageURL}
          alt={id}
          width={300}
          height={300}
          className="w-[275px] h-[275px] object-contain"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </CardContent>
      <CardFooter className="overflow-y-auto">{caption_it}</CardFooter>
    </Card>
  );
};

export default PPMPolaroid;
