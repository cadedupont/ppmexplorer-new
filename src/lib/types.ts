import { Polygon } from "geojson";

export type LocationScope = "room" | "property" | "insula" | "regio";
type CustomGeoJsonProperties = {
  name: string;
  scope: LocationScope;
  centroid: {
    lat: number;
    lng: number;
  };
};
export type CustomGeoJsonFeature = {
  type: "Feature";
  properties: CustomGeoJsonProperties;
  geometry: Polygon;
  id: string;
}

export type PPMItem = {
  id: string; // e.g. "Volume_01_Page_002_image_1"
  imageURL: string; // e.g. https://ppmdata.blob.core.windows.net/ppm/images/{id}.jpg
  caption_it: string;
  caption_en: string;
  volume: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  page: number;
  imageIndex: 1 | 2 | 3 | 4;
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
