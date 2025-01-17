"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import { LocationScope, CustomGeoJsonFeature } from "@/lib/types";

import "leaflet/dist/leaflet.css";

const PompeiiMap = dynamic(() => import("@/components/ui/pompeii-map"), {
  ssr: false,
});

const GeoJSON = dynamic(
  () => import("react-leaflet").then((module) => module.GeoJSON),
  {
    ssr: false,
  }
);

const getColorByScope = (scope: LocationScope) => {
  const colorMap: Record<LocationScope, string> = {
    room: "red",
    property: "yellow",
    insula: "green",
    regio: "blue",
  };
  return colorMap[scope];
};

const PPMItemLocation = ({ geojson }: { geojson: CustomGeoJsonFeature }) => {
  const style = useMemo(
    () => ({
      color: getColorByScope(geojson.properties.scope),
      fillOpacity: 1.0,
    }),
    [geojson.properties.scope]
  );

  return (
    <PompeiiMap
      center={geojson.properties.center}
      zoom={20}
      width={"100%"}
      height={"50vh"}
    >
      <GeoJSON key={geojson.id} data={geojson} style={style} />
    </PompeiiMap>
  );
};

export default PPMItemLocation;
