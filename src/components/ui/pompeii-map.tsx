'use client';

import { ReactNode } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useMapEvents } from 'react-leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), {
  ssr: false,
});

import 'leaflet/dist/leaflet.css';

const ClickLogger = () => {
  useMapEvents({
    click(e) {
      console.log(e.latlng);
    },
  });
  return null;
};

const PompeiiMap = ({
  children,
  centroid,
  zoom,
  width,
  height,
}: {
  children?: ReactNode;
  centroid: {
    lat: number;
    lon: number;
  };
  zoom: number;
  width: string;
  height: string;
}) => {
  const { theme } = useTheme();

  return (
    <MapContainer
      center={centroid}
      minZoom={16}
      maxZoom={22}
      zoom={zoom}
      maxBounds={[
        [40.74735450024225, 14.480928193406394],
        [40.75502699708263, 14.496983919979215],
      ]}
      style={{ height: height, width: width }}
    >
      <TileLayer
        url={
          theme === 'dark'
            ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
        }
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxNativeZoom={19}
        maxZoom={22}
      />
      <TileLayer url="https://palp.art/xyz-tiles/{z}/{x}/{y}.png" maxNativeZoom={19} maxZoom={22} />
      <ClickLogger />
      {children}
    </MapContainer>
  );
};

export default PompeiiMap;
