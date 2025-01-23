import { NextRequest, NextResponse } from 'next/server';

interface PLodResponse {
  urn: string; // e.g. urn:p-lod:id:r7-i10-p3
  type: string; // e.g. urn:p-lod:id:property
  label: string; // e.g. Property VVII.10.3
  geojson: string; // needs to be explicitly parsed to JSON
}

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'P-LOD ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.p-lod.org/spatial-ancestors/${id}`);
    const data = await response.json();

    const geojsons: GeoJSON.Feature[] = data
      .filter((item: PLodResponse) => item.label !== 'Pompeii' && item.geojson !== 'None')
      .map((item: PLodResponse) => JSON.parse(item.geojson))
      .reverse();
    geojsons.forEach((geojson: GeoJSON.Feature) => {
      if (geojson.properties) {
        geojson.properties.name = geojson.properties.title
          .replace('urn:p-lod:id:r', 'Regio ')
          .replace('-i', ', Insula ')
          .replace('-p', ', Property ')
          .replace('-space-', ', Room ');
        delete geojson.properties.title;
        if (geojson.properties.name.toLowerCase().includes('room')) {
          geojson.properties.scope = 'room';
        } else if (geojson.properties.name.toLowerCase().includes('property')) {
          geojson.properties.scope = 'property';
        } else if (geojson.properties.name.toLowerCase().includes('insula')) {
          geojson.properties.scope = 'insula';
        } else {
          geojson.properties.scope = 'regio';
        }
      }
    });

    return NextResponse.json(geojsons);
  } catch (err) {
    console.error(`Failed to fetch spatial ancestors for ${id}:`, err);
    return NextResponse.json({ error: 'Failed to fetch spatial ancestors' }, { status: 500 });
  }
};
