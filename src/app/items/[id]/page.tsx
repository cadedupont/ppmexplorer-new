"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

import Image from "next/image";
import { Captions, BookOpenText, MapPin } from "lucide-react";
import { GeoJSON } from "react-leaflet";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PompeiiMap from "@/components/ui/pompeii-map";
import LoadingSpinner from "@/components/ui/loading-spinner";
import PolaroidGrid from "@/components/ui/polaroid-grid";
import BreadcrumbTrail from "./breadcrumb-trail";

import { getColorByScope } from "@/lib/utils";
import { regios } from "@/lib/constants";
import type { PPMItem } from "@/lib/types";

const Page = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const searchParams = useSearchParams();

  const [item, setItem] = useState<PPMItem | null>(null);
  const [similarImages, setSimilarImages] = useState<PPMItem[]>([]);
  const [similarCaptions, setSimilarCaptions] = useState<PPMItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getItem = async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/items/${id}`);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setItem(data.item);
          setSimilarImages(data.similarImages);
          setSimilarCaptions(data.similarCaptions);
        }
        setIsLoading(false);
      } catch (err) {
        setError(`Failed to fetch item with id: ${id}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };

    getItem(id);
  }, [id]);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        item && (
          <>
            <BreadcrumbTrail
              searchParams={searchParams}
              currentItem={item.id}
            />
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <CardContent className="flex items-center justify-center">
                  <Image
                    src={item.imageURL}
                    alt={item.id}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto max-h-[50vh] object-contain"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </CardContent>
                <CardContent className="flex items-center justify-center">
                  <PompeiiMap
                    centroid={item.location.geojson.properties.centroid}
                    zoom={
                      item.location.geojson.properties.scope === "room" ||
                      item.location.geojson.properties.scope === "property"
                        ? 20
                        : 17
                    }
                    width={"100%"}
                    height={"50vh"}
                  >
                    <GeoJSON
                      key={JSON.stringify(item.location.geojson)}
                      data={item.location.geojson}
                      style={{
                        color: getColorByScope(
                          item.location.geojson.properties.scope
                        ),
                        fillOpacity: 0.8,
                      }}
                    />
                    {item.location.geojson.properties.scope !== "regio" && (
                      <GeoJSON
                        key={JSON.stringify(regios[item.location.regio])}
                        data={regios[item.location.regio]}
                        style={{ color: "blue", fillOpacity: 0.1 }}
                      />
                    )}
                  </PompeiiMap>
                </CardContent>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InfoCard
                  title="Caption (English)"
                  content={item.caption_en}
                  icon={<Captions />}
                />
                <InfoCard
                  title="Caption (Italian)"
                  content={item.caption_it}
                  icon={<Captions />}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <InfoCard
                  title="Volume"
                  content={item.volume}
                  icon={<BookOpenText />}
                />
                <InfoCard
                  title="Page"
                  content={item.page}
                  icon={<BookOpenText />}
                />
                <InfoCard
                  title="Regio"
                  content={item.location.regio}
                  icon={<MapPin />}
                />
                <InfoCard
                  title="Insula"
                  content={item.location.insula}
                  icon={<MapPin />}
                />
                <InfoCard
                  title="Property"
                  content={item.location.property}
                  icon={<MapPin />}
                />
                <InfoCard
                  title="Room"
                  content={item.location.room || "N/A"}
                  icon={<MapPin />}
                />
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4">Similar Images</h2>
              <PolaroidGrid
                items={similarImages}
                searchParams={(() => {
                  const newParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  const previous = newParams.get("previous");
                  previous
                    ? newParams.set("previous", `${previous},${item.id}`)
                    : newParams.set("previous", item.id);
                  return newParams.toString();
                })()}
              />
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mt-8 mb-4">Similar Captions</h2>
              <PolaroidGrid
                items={similarCaptions}
                searchParams={(() => {
                  const newParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  const previous = newParams.get("previous");
                  previous
                    ? newParams.set("previous", `${previous},${item.id}`)
                    : newParams.set("previous", item.id);
                  return newParams.toString();
                })()}
              />
            </div>
          </>
        )
      )}
    </div>
  );
};

interface InfoCardProps {
  title: string;
  content: string | number;
  icon?: React.ReactNode;
}
const InfoCard = ({ title, content, icon }: InfoCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-primary text-xl flex justify-between items-center">
        <span>{title}</span>
        {icon}
      </CardTitle>
    </CardHeader>
    <CardContent>{content}</CardContent>
  </Card>
);

export default Page;
