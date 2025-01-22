import { adapter } from "next/dist/server/web/adapter";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { location } = await req.json();
  if (!location) {
    return NextResponse.json(
      { error: "Location is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.p-lod.org/spatial-children/${location}`
    );
    const data = await response.json();

    const geojsons = data
      .filter((item: any) => item.geojson !== "None") // spaces without geojson in P-LOD are marked "None" instead of null or undefined
      .map((item: any) => JSON.parse(item.geojson));
    geojsons.forEach((geojson: any) => {
      geojson.properties.name = geojson.properties.title
        .replace("urn:p-lod:id:r", "Regio ")
        .replace("-i", ", Insula ")
        .replace("-p", ", Property ")
        .replace("-space-", ", Room ");
      delete geojson.properties.title;
    });

    return NextResponse.json(geojsons);
  } catch (error) {
    console.error("Error fetching spatial children:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
};
