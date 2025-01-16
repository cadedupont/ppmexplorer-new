"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "./button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import PPMImage from "./ppm-image";

import type { PPMItem } from "@/lib/types";

const PPMPolaroid = ({ item }: { item: PPMItem }) => {
  const { imageURL, imageIndex, caption_en, volume, page, location } = item;
  const { regio, insula, property, room } = location;

  return (
    <Card className="w-[300px] h-[600px] flex flex-col">
      <CardHeader className="relative">
        <CardTitle className="flex flex-row items-center justify-between space-y-0">
            Volume {volume}, Page {page}, Image {imageIndex}
          <Link href={`/items/${item.id}`}>
            <Button variant="secondary" size="icon">
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
        <PPMImage
          src={imageURL}
          alt={caption_en}
          width={300}
          height={300}
          className="w-[275px] h-[275px] object-contain"
        />
      </CardContent>
      <CardFooter className="overflow-y-auto">{caption_en}</CardFooter>
    </Card>
  );
};

export default PPMPolaroid;
