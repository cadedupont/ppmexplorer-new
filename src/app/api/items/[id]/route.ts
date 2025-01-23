import { NextRequest, NextResponse } from 'next/server';

import { cosmosContainer } from '@/lib/cosmos';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const { resources: items } = await cosmosContainer.items
      .query({
        query: `SELECT c.id, c.imageURL, c.caption_it, c.caption_en, c.volume, c.page, c.imageIndex, c.location, c.imageVector, c.captionVector FROM c WHERE c.id = @id`,
        parameters: [{ name: '@id', value: id }],
      })
      .fetchAll();
    const item = items[0];

    const { resources: similarImages } = await cosmosContainer.items
      .query({
        query: `SELECT c.id, c.imageURL, c.caption_it, c.caption_en, c.volume, c.page, c.imageIndex, c.location FROM c ORDER BY VectorDistance(c.imageVector, @vector) OFFSET 1 LIMIT 8`,
        parameters: [{ name: '@vector', value: item.imageVector }],
      })
      .fetchAll();
    const { resources: similarCaptions } = await cosmosContainer.items
      .query({
        query: `SELECT c.id, c.imageURL, c.caption_it, c.caption_en, c.volume, c.page, c.imageIndex, c.location FROM c ORDER BY VectorDistance(c.captionVector, @vector) OFFSET 1 LIMIT 8`,
        parameters: [{ name: '@vector', value: item.captionVector }],
      })
      .fetchAll();

    return NextResponse.json({ item, similarImages, similarCaptions });
  } catch (err) {
    console.error(`Failed to fetch item ${id}:`, err);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
};
