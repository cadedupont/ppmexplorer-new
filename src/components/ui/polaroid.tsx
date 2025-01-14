"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import Image from "next/image";
import type { PPMItem } from "@/lib/types";

const Polaroid = ({ item }: { item: PPMItem }) => {
  const { imageURL, caption_en, volume, page, location } = item;
  const { regio, insula, property } = location;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Volume {volume}, Page {page}
        </CardTitle>
        <CardDescription>
          Regio {regio}, Insula {insula}, Property {property || "N/A"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={imageURL}
          alt={caption_en}
          height={400}
          width={400}
          unselectable="on"
          onContextMenu={(e) => e.preventDefault()}
          style={{ pointerEvents: "none" }}
        />
      </CardContent>
      <CardFooter>{caption_en}</CardFooter>
    </Card>
  );
};

export default Polaroid;
