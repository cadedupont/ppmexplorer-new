import { Feature, Polygon } from "geojson";
import { roomTypes } from "./utils";

type CustomGeoJsonProperties = {
  title: string;
  scope: "room" | "property" | "insula" | "regio";
  center: [number, number];
};
export type CustomGeoJsonFeature = Feature<Polygon, CustomGeoJsonProperties>;

export type PPMItem = {
  id: string; // e.g. "Volume_01_Page_002_image_1"
  imageURL: string; // e.g. https://ppmdata.blob.core.windows.net/ppm/images/{id}.jpg
  imageIndex: 1 | 2 | 3 | 4;
  caption_it: string;
  caption_en: string;
  roomType: typeof roomTypes[number];
  volume: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  page: number;
  location: {
    regio: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    insula: number;
    property: string;
    room: string | null; // null if couldn't be identified in caption
    geojson: CustomGeoJsonFeature;
  };
  captionVector: number[]; // length 1024
  imageVector: number[]; // length 1024
};
