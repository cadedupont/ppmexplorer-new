"use client";

import { ReactNode } from "react";
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
  center,
  zoom,
  width,
  height,
}: {
  children?: ReactNode;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  width: string;
  height: string;
}) => {
  return (
    <MapContainer
      center={center}
      minZoom={13}
      maxZoom={20}
      zoom={zoom}
      style={{ height: height, width: width }}
    >
      <TileLayer
        url="https://palp.art/xyz-tiles/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxNativeZoom={19}
        maxZoom={20}
      />
      {children}
    </MapContainer>
  );
};

export default PompeiiMap;
