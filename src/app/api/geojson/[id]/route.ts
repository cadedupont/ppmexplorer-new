import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'P-LOD ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.p-lod.org/geojson/${id}`);
    const data = await response.json();

    if (!data) {
      return NextResponse.json({ error: 'No geojson found' }, { status: 404 });
    }
    const geojson: GeoJSON.Feature = JSON.parse(data.geojson);

    if (geojson.properties) {
      geojson.properties.name = geojson.properties.title
        .replace('urn:p-lod:id:r', 'Regio ')
        .replace('-i', ', Insula ')
        .replace('-p', ', Property ')
        .replace('-space-', ', Room ');
      if (geojson.properties.name.toLowerCase().includes('room')) {
        geojson.properties.scope = 'room';
      } else if (geojson.properties.name.toLowerCase().includes('property')) {
        geojson.properties.scope = 'property';
      } else if (geojson.properties.name.toLowerCase().includes('insula')) {
        geojson.properties.scope = 'insula';
      } else {
        geojson.properties.scope = 'regio';
      }
      delete geojson.properties.title;
    }

    return NextResponse.json(geojson);
  } catch (err) {
    console.error(`Error fetching geojson for ${id}:`, err);
    return NextResponse.json({ error: 'Failed to fetch geojson' }, { status: 500 });
  }
};
