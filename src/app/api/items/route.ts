import { NextRequest, NextResponse } from "next/server";

import { cosmosContainer } from "@/lib/cosmos";
import { TOTAL_PPM_ITEMS } from "@/lib/utils";

export const GET = async (req: NextRequest) => {
  const offset = Number(req.nextUrl.searchParams.get("offset"));
  const limit = Number(req.nextUrl.searchParams.get("limit"));
  const location = req.nextUrl.searchParams.get("location");

  try {
    let itemQuery = `SELECT c.id, c.imageURL, c.caption_it, c.caption_en, c.volume, c.page, c.imageIndex, c.location, c.imageVector, c.captionVector FROM c`;
    const itemParameters: { name: string; value: any }[] = [
      { name: "@offset", value: offset },
      { name: "@limit", value: limit },
    ];
    if (location) {
      itemQuery += ` WHERE CONTAINS(c.location.geojson.id, @location)`;
      itemParameters.push({ name: "@location", value: location });
    }
    itemQuery += ` ORDER BY c.id OFFSET @offset LIMIT @limit`;

    const { resources: items } = await cosmosContainer.items
      .query({
        query: itemQuery,
        parameters: itemParameters,
      })
      .fetchAll();

    // only need count if location is provided; otherwise, use total count
    let count = location
      ? await (async () => {
          let countQuery = `SELECT VALUE COUNT(1) FROM c`;
          const countParameters: { name: string; value: any }[] = [];
          if (location) {
            countQuery += ` WHERE CONTAINS(c.location.geojson.id, @location)`;
            countParameters.push({ name: "@location", value: location });
          }
          const { resources: count } = await cosmosContainer.items
            .query({
              query: countQuery,
              parameters: countParameters,
            })
            .fetchAll();
          return count[0];
        })()
      : TOTAL_PPM_ITEMS;

    return NextResponse.json({ items, count });
  } catch (err: any) {
    console.error(`Failed to fetch items`, err);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
};
