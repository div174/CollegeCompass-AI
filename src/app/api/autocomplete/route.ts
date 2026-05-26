import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const colleges = await prisma.college.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { location: { contains: query } },
          { stream: { contains: query } },
        ],
      },
      select: {
        id: true,
        name: true,
        location: true,
        state: true,
        stream: true,
      },
      take: 8, // Fast query limit
    });

    return NextResponse.json({ success: true, data: colleges });
  } catch (error) {
    console.error("GET /api/autocomplete error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
