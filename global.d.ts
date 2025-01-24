import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { MarkerClusterGroupProps } from 'react-leaflet-markercluster';

declare module 'react-leaflet-markercluster' {
  export const MarkerClusterGroup: React.FC<PropsWithChildren<MarkerClusterGroupProps>>;
}
