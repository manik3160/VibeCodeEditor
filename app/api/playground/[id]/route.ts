import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  if (!id) {
    return NextResponse.json({ error: "Missing playground ID" }, { status: 400 });
  }

  // Return playground data or handle the request
  return NextResponse.json({
    success: true,
    id,
    message: "Playground endpoint"
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  if (!id) {
    return NextResponse.json({ error: "Missing playground ID" }, { status: 400 });
  }

  // Handle POST requests for playground updates
  return NextResponse.json({
    success: true,
    id,
    message: "Playground updated"
  });
}
