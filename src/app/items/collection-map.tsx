"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import L, { map } from "leaflet";
const icon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [30, 40],
  iconAnchor: [15, 30],
});

const GeoJSON = dynamic(
  () => import("react-leaflet").then((module) => module.GeoJSON),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((module) => module.Marker),
  { ssr: false }
);
const PompeiiMap = dynamic(() => import("@/components/ui/pompeii-map"), {
  ssr: false,
});

import { regios } from "@/lib/constants";
import { PPMItem } from "@/lib/types";
import Polaroid from "@/components/ui/polaroid";

const CollectionMap = ({ items }: { items: PPMItem[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [featureCollection, setFeatureCollection] =
    useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    });
  const [selectedItems, setSelectedItems] = useState<PPMItem[]>(items);
  const [domLoaded, setDomLoaded] = useState<boolean>(false);

  const getSpatialChildren = async (location: string) => {
    const response = await fetch(`/api/geojson/${location}/spatial-children`);
    const data = await response.json();
    return data;
  };

  const handleFeatureClick = async (clickedFeature: GeoJSON.Feature) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("location", clickedFeature.id as string);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
    setFeatureCollection({
      type: "FeatureCollection",
      features: await getSpatialChildren(clickedFeature.id as string),
    });
  };

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    const location = searchParams.get("location");
    (async () => {
      setFeatureCollection({
        type: "FeatureCollection",
        features: location ? await getSpatialChildren(location) : regios,
      });
    })();
  }, [searchParams]);

  const groupedMarkers = new Map<string, PPMItem[]>();
  items.forEach((item) => {
    if (!item.location.geojson) {
      console.log(item);
      return;
    }
    const key = JSON.stringify(item.location.geojson.properties.centroid);
    groupedMarkers.has(key)
      ? groupedMarkers.get(key)?.push(item)
      : groupedMarkers.set(key, [item]);
  });

  return (
    <>
      {domLoaded && (
        <div className="flex h-screen">
          <div className="w-2/3">
            <PompeiiMap
              centroid={{ lat: 40.75103, lon: 14.4884 }}
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
                  layer.on("onmouseover", () => {
                    layer.bindPopup(feature.properties.name).openPopup();
                  });
                  layer.on("click", async () => {
                    handleFeatureClick(feature);
                  });
                }}
              />
              {Array.from(groupedMarkers.entries()).map(
                ([geoJsonId, groupedItems], index) => {
                  const centroid = JSON.parse(geoJsonId);
                  return (
                    <Marker
                      position={centroid}
                      key={geoJsonId}
                      icon={icon}
                      eventHandlers={{
                        click: () => {
                          setSelectedItems(groupedItems);
                        },
                      }}
                    />
                  );
                }
              )}
            </PompeiiMap>
          </div>
          <div className="w-1/3 overflow-y-auto p-4">
            {selectedItems &&
              selectedItems.map((item: PPMItem) => {
                return (
                  <div key={item.id} className="mb-4">
                    <Polaroid
                      item={item}
                      searchParams={searchParams.toString()}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default CollectionMap;
