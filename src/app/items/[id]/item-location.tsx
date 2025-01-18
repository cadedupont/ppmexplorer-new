"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { regios } from "@/lib/utils";
import { LocationScope, CustomGeoJsonFeature } from "@/lib/types";

import "leaflet/dist/leaflet.css";

const Map = dynamic(() => import("@/components/ui/map"), {
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

const ItemLocation = ({
  geojson,
  regioNum,
}: {
  geojson: CustomGeoJsonFeature;
  regioNum: number;
}) => {
  const [regio, setRegio] = useState<GeoJSON.Feature | null>(null);

  useEffect(() => {
    if (geojson.properties.scope !== "regio") {
      const regio = regios[regioNum];
      setRegio(regio);
    }
  }, [geojson, regioNum]);

  return (
    <Map
      center={geojson.properties.center}
      zoom={geojson.properties.scope === "regio" ? 13 : 20}
      width={"100%"}
      height={"50vh"}
    >
      <GeoJSON
        key={geojson.id}
        data={geojson}
        style={{
          color: getColorByScope(geojson.properties.scope),
          fillOpacity: 0.7,
        }}
      />
      {regio && (
        <GeoJSON key={regio.id} data={regio} style={{ color: "blue" }} />
      )}
    </Map>
  );
};

export default ItemLocation;
