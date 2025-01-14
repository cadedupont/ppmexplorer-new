export type PPMItem = {
  id: string;
  imageURL: string;
  caption: string;
  caption_en: string;
  volume: number;
  page: number;
  location: {
    regio: number;
    insula: number;
    property: string | undefined;
    coordinates: [number, number];
  }
  captionVector: number[];
  imageVector: number[];
}