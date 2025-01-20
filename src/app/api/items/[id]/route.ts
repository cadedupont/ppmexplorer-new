import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`http://localhost:4000/items/${id}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(`Failed to fetch item ${id}:`, err);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
};
