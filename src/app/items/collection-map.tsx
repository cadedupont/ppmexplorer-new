"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

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
import { CustomGeoJsonFeature } from "@/lib/types";

const CollectionMap = ({
  itemLocations,
}: {
  itemLocations: CustomGeoJsonFeature[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [featureCollection, setFeatureCollection] =
    useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    });

  const getSpatialChildren = async (location: string) => {
    const response = await fetch(`/api/geojson/${location}/spatial-children`);
    const data = await response.json();
    return data;
  };

  const handleFeatureClick = async (clickedFeature: GeoJSON.Feature) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("location", clickedFeature.id as string);
    router.push(`?${newParams.toString()}`);
    setFeatureCollection({
      type: "FeatureCollection",
      features: await getSpatialChildren(clickedFeature.id as string),
    });
  };

  useEffect(() => {
    const location = searchParams.get("location");
    (async () => {
      setFeatureCollection({
        type: "FeatureCollection",
        features: location ? await getSpatialChildren(location) : regios,
      });
    })();
  }, [searchParams]);

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
        style={{
          color: "red",
          fillOpacity: 0.1,
        }}
        onEachFeature={(feature, layer) => {
          layer.on("mouseover", () => {
            layer.bindPopup(feature.properties.name).openPopup();
          });
          layer.on("click", async () => {
            handleFeatureClick(feature);
          });
        }}
      />
      {itemLocations.length > 0 &&
        itemLocations.map((location, index) => (
          <Circle
            key={`${JSON.stringify(location)}-${index}`}
            center={location.properties.centroid}
            fillColor="blue"
            radius={5}
          />
        ))}
    </Map>
  );
};

export default CollectionMap;
