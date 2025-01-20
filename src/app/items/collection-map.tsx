"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { CustomGeoJsonFeature } from "@/lib/types";

const GeoJSON = dynamic(
  () => import("react-leaflet").then((module) => module.GeoJSON),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((module) => module.Circle),
  { ssr: false }
);
const Map = dynamic(() => import("@/components/ui/map"), { ssr: false });

import { regios } from "@/lib/utils";

const CollectionMap = ({
  itemLocations,
}: {
  itemLocations: CustomGeoJsonFeature[];
}) => {
  const [featureCollection, setFeatureCollection] =
    useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: regios,
    });

  const handleFeatureClick = async (location: string) => {
    const response = await fetch("/api/get-spatial-children", {
      method: "POST",
      body: JSON.stringify({ location }),
    });
    const data = await response.json();
    const newFeatures = data
      .filter((feature: any) => feature.geojson !== "None") // spaces without geojson in P-LOD are marked "None" instead of null or undefined
      .map((feature: any) => JSON.parse(feature.geojson));

    setFeatureCollection(() => ({
      type: "FeatureCollection",
      features: newFeatures,
    }));
  };

  return (
    <Map
      center={{ lat: 40.75103, lng: 14.4884 }}
      zoom={16}
      width={"100%"}
      height={"100vh"}
    >
      <GeoJSON
        key={JSON.stringify(featureCollection)}
        data={featureCollection}
        style={() => ({ color: "red", fillOpacity: 0.1 })}
        onEachFeature={(feature, layer) => {
          layer.on("mouseover", () => {
            layer.bindPopup(feature.properties.title).openPopup();
          });
          layer.on("click", async () => {
            handleFeatureClick(feature.properties.title);
          });
        }}
      />
      {itemLocations.length > 0 &&
        itemLocations.map((location, index) => (
          <Circle
            key={`${JSON.stringify(location)}-${index}`}
            center={location.properties.center}
            fillColor="blue"
            radius={5}
          />
        ))}
    </Map>
  );
};

export default CollectionMap;
