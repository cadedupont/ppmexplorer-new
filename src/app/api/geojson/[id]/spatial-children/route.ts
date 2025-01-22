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
      `https://api.p-lod.org/spatial-children/${id}`
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
  } catch (err: any) {
    console.error(`Error fetching spatial children for ${id}:`, err);
    return NextResponse.json(
      { error: "Failed to fetch spatial children" },
      { status: 500 }
    );
  }
};
