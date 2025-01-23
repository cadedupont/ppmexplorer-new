import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "P-LOD ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.p-lod.org/spatial-ancestors/${id}`
    );
    const data = await response.json();

    const geojsons = data
      .filter(
        (item: any) => item.label !== "Pompeii" && item.geojson !== "None"
      )
      .map((item: any) => JSON.parse(item.geojson))
      .reverse();
    geojsons.forEach((geojson: any) => {
      geojson.properties.name = geojson.properties.title
        .replace("urn:p-lod:id:r", "Regio ")
        .replace("-i", ", Insula ")
        .replace("-p", ", Property ")
        .replace("-space-", ", Room ");
      delete geojson.properties.title;
      if (geojson.properties.name.toLowerCase().includes("room")) {
        geojson.properties.scope = "room";
      } else if (geojson.properties.name.toLowerCase().includes("property")) {
        geojson.properties.scope = "property";
      } else if (geojson.properties.name.toLowerCase().includes("insula")) {
        geojson.properties.scope = "insula";
      } else {
        geojson.properties.scope = "regio";
      }
    });

    return NextResponse.json(geojsons);
  } catch (err: any) {
    console.error(`Failed to fetch spatial ancestors for ${id}:`, err);
    return NextResponse.json(
      { error: "Failed to fetch spatial ancestors" },
      { status: 500 }
    );
  }
};
