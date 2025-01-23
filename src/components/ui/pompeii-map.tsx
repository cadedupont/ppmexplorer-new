"use client";

import { ReactNode } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  {
    ssr: false,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  {
    ssr: false,
  }
);

import "leaflet/dist/leaflet.css";

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
      minZoom={13}
      maxZoom={19}
      zoom={zoom}
      style={{ height: height, width: width }}
    >
      <TileLayer
        url={
          theme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
            : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        }
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxNativeZoom={19}
        maxZoom={20}
      />
      <TileLayer
        url="https://palp.art/xyz-tiles/{z}/{x}/{y}.png"
        maxNativeZoom={19}
        maxZoom={20}
      />
      {children}
    </MapContainer>
  );
};

export default PompeiiMap;
