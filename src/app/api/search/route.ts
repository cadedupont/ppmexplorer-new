import { NextRequest, NextResponse } from "next/server";

import { cosmosContainer } from "@/lib/cosmos";
import { openaiClient } from "@/lib/openai";
import { TOTAL_PPM_ITEMS } from "@/lib/utils";

const embeddingCache: Map<string, number[]> = new Map();

const getEmbedding = async (query: string) => {
  try {
    if (embeddingCache.has(query)) {
      return embeddingCache.get(query);
    }
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-3-large",
      dimensions: 1024,
      input: [query],
    });
    const embedding = response.data[0].embedding;
    embeddingCache.set(query, embedding);
    return embedding;
  } catch (err: any) {
    console.error(`Failed to get embedding for "${query}"`, err);
    return null;
  }
};

export const GET = async (req: NextRequest) => {
  const offset = Number(req.nextUrl.searchParams.get("offset"));
  const limit = Number(req.nextUrl.searchParams.get("limit"));
  const location = req.nextUrl.searchParams.get("location");
  const query = req.nextUrl.searchParams.get("query");

  try {
    const embedding = query ? await getEmbedding(query) : null;
    if (!embedding) {
      return NextResponse.json(
        { error: "Failed to get query embedding" },
        { status: 500 }
      );
    }

    let itemQuery = `SELECT c.id, c.imageURL, c.caption_it, c.caption_en, c.volume, c.page, c.imageIndex, c.location, c.imageVector, c.captionVector,VectorDistance(c.captionVector, @vector) AS similarityScore FROM c`;
    const itemParameters: { name: string; value: any }[] = [
      { name: "@vector", value: embedding },
      { name: "@offset", value: offset },
      { name: "@limit", value: limit },
    ];
    if (location) {
      itemQuery += ` WHERE CONTAINS(c.location.geojson.id, @location)`;
      itemParameters.push({ name: "@location", value: location });
    }
    itemQuery += ` ORDER BY VectorDistance(c.captionVector, @vector) OFFSET @offset LIMIT @limit`;

    const { resources: items } = await cosmosContainer.items
      .query({
        query: itemQuery,
        parameters: itemParameters,
      })
      .fetchAll();

    return NextResponse.json({ items, count: TOTAL_PPM_ITEMS });
  } catch (err: any) {
    console.error(`Failed to fetch items`, err);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
};
