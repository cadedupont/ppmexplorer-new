"use client";

import { ReactNode } from "react";

import { MapContainer, TileLayer } from "react-leaflet";

import 'leaflet/dist/leaflet.css';

const PompeiiMap = ({
  children,
  center,
  zoom,
}: {
  children?: ReactNode;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}) => {
  return (
    <MapContainer
      center={center}
      minZoom={13}
      maxZoom={20}
      zoom={zoom}
      style={{ height: "800px", width: "1000px" }}
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
