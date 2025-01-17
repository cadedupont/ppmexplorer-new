"use client";

import Image from "next/image";

import { Captions, House, BookOpenText, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PPMItemLocation from "./ppm-item-location";

import type { PPMItem } from "@/lib/types";

const PPMItemDashboard = ({ item }: { item: PPMItem }) => {
  const renderCard = (
    title: string,
    content: string | number,
    icon: React.ReactNode,
    className?: string
  ) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-primary text-xl flex justify-between items-center">
          <span>{title}</span>
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <CardContent className="flex items-center justify-center">
          <Image
            src={item.imageURL}
            alt={item.id}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto max-h-[50vh] object-contain"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </CardContent>
        <CardContent className="flex items-center justify-center">
          <PPMItemLocation
            geojson={item.location.geojson}
            regioNum={item.location.regio}
          />
        </CardContent>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderCard("Caption (English)", item.caption_en, <Captions />)}
        {renderCard("Caption (Italian)", item.caption_it, <Captions />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {renderCard("Room Type", item.roomType, <House />)}
        {renderCard("Volume", item.volume, <BookOpenText />)}
        {renderCard("Page", item.page, <BookOpenText />)}
        {renderCard("Regio", item.location.regio, <MapPin />)}
        {renderCard("Insula", item.location.insula, <MapPin />)}
        {renderCard("Property", item.location.property, <MapPin />)}
        {renderCard("Room", item.location.room || "N/A", <MapPin />)}
      </div>
    </div>
  );
};

export default PPMItemDashboard;
