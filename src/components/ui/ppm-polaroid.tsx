"use client";

import Link from "next/link";

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

const PPMPolaroid: React.FC<{ item: PPMItem }> = ({ item }) => {
  const { imageURL, caption_en, volume, page, location } = item;
  const { regio, insula, property } = location;

  return (
    <Link href={`/items/${item.id}`}>
      <Card className="w-[300px] h-[600px] flex flex-col hover:z-5 hover:scale-105 transition-transform">
        <CardHeader>
          <CardTitle>
            Volume {volume}, Page {page}
          </CardTitle>
          <CardDescription>
            Regio {regio}, Insula {insula}, Property {property || "N/A"}
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
    </Link>
  );
};

export default PPMPolaroid;
