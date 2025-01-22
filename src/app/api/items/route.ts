import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const offset = Number(req.nextUrl.searchParams.get("offset"));
  const limit = Number(req.nextUrl.searchParams.get("limit"));
  const location = req.nextUrl.searchParams.get("location");

  try {
    const response = await fetch(`http://localhost:4000/items`);
    const data = await response.json();
    const items = data.slice(offset, offset + limit);
    return NextResponse.json(items);
  } catch (err: any) {
    console.error(`Failed to fetch items`, err);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
};
