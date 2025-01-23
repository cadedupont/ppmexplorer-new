import { NextRequest, NextResponse } from 'next/server';

import { cosmosContainer } from '@/lib/cosmos';
import { openaiClient } from '@/lib/openai';
import { TOTAL_PPM_ITEM_COUNT } from '@/lib/constants';

const embeddingCache: Map<string, number[]> = new Map();

const getImageEmbedding = async (query: string) => {
  try {
    if (embeddingCache.has(`${query}:image`)) {
      return embeddingCache.get(`${query}:image`);
    }
    const response = await fetch(
      `${String(
        process.env.AZURE_AI_VISION_ENDPOINT,
      )}computervision/retrieval:vectorizeText?api-version=${String(
        process.env.AZURE_AI_VISION_API_VERSION,
      )}&model-version=${String(process.env.AZURE_AI_VISION_MODEL_VERSION)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': String(process.env.AZURE_AI_VISION_KEY),
        },
        body: JSON.stringify({ text: query }),
      },
    );
    const data = await response.json();
    const embedding = data.vector;
    embeddingCache.set(`${query}:image`, embedding);
    return embedding;
  } catch (err) {
    console.error(`Failed to get image embedding for "${query}"`, err);
    return null;
  }
};

const getCaptionEmbedding = async (query: string) => {
  try {
    if (embeddingCache.has(`${query}:caption`)) {
      return embeddingCache.get(`${query}:caption`);
    }
    const response = await openaiClient.embeddings.create({
      model: 'text-embedding-3-large',
      dimensions: 1024,
      input: [query],
    });
    const embedding = response.data[0].embedding;
    embeddingCache.set(`${query}:caption`, embedding);
    return embedding;
  } catch (err) {
    console.error(`Failed to get embedding for "${query}"`, err);
    return null;
  }
};

export const GET = async (req: NextRequest) => {
  const offset = Number(req.nextUrl.searchParams.get('offset'));
  const limit = Number(req.nextUrl.searchParams.get('limit'));
  const location = req.nextUrl.searchParams.get('location');
  const query = req.nextUrl.searchParams.get('query');
  const vectorType = req.nextUrl.searchParams.get('vector');

  try {
    const isCaption = vectorType === 'caption';
    const embedding = query
      ? isCaption
        ? await getCaptionEmbedding(query)
        : await getImageEmbedding(query)
      : null;
    if (!embedding) {
      return NextResponse.json({ error: 'Failed to get query embedding' }, { status: 500 });
    }

    let itemQuery = `SELECT c.id, c.imageURL, c.caption_it, c.caption_en, c.volume, c.page, c.imageIndex, c.location, c.imageVector, c.captionVector, VectorDistance(${
      isCaption ? `c.captionVector` : `c.imageVector`
    }, @vector) AS similarityScore FROM c`;
    const itemParameters: { name: string; value: string | number[] }[] = [
      { name: '@vector', value: embedding },
      { name: '@offset', value: String(offset) },
      { name: '@limit', value: String(limit) },
    ];
    if (location) {
      itemQuery += ` WHERE CONTAINS(c.location.geojson.id, @location)`;
      itemParameters.push({ name: '@location', value: location });
    }
    itemQuery += ` ORDER BY VectorDistance(${
      isCaption ? `c.captionVector` : `c.imageVector`
    }, @vector) OFFSET @offset LIMIT @limit`;

    // fetch items and count in parallel since they're independent
    const [items, count] = await Promise.all([
      cosmosContainer.items
        .query({
          query: itemQuery,
          parameters: itemParameters,
        })
        .fetchAll(),
      location
        ? (async () => {
            let countQuery = `SELECT VALUE COUNT(1) FROM c`;
            const countParameters: { name: string; value: string }[] = [];
            if (location) {
              countQuery += ` WHERE CONTAINS(c.location.geojson.id, @location)`;
              countParameters.push({ name: '@location', value: location });
            }
            const { resources: count } = await cosmosContainer.items
              .query({
                query: countQuery,
                parameters: countParameters,
              })
              .fetchAll();
            return count[0];
          })()
        : TOTAL_PPM_ITEM_COUNT,
    ]);

    return NextResponse.json({ items: items.resources, count });
  } catch (err) {
    console.error(`Failed to fetch items`, err);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
};
