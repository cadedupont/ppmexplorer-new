import { Feature, Polygon } from 'geojson';

type CustomGeoJsonProperties = {
  title: string;
  scope: 'room' | 'property' | 'insula' | 'regio';
  center: [number, number];
};
export type CustomGeoJsonFeature = Feature<Polygon, CustomGeoJsonProperties>;

export type PPMItem = {
  id: string;
  imageURL: string;
  caption_it: string;
  caption_en: string;
  volume: number;
  page: number;
  location: {
    regio: number;
    insula: number;
    property: string | undefined;
    room: string | undefined;
    geojson: CustomGeoJsonFeature;
  }
  captionVector: number[];
  imageVector: number[];
}