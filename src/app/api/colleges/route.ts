import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const skip = (page - 1) * limit;

    // Search and Filters
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const stream = searchParams.get("stream") || "all";
    const fees = searchParams.get("fees") || "all";
    const rating = searchParams.get("rating") || "all";

    // Sorting
    const sortBy = searchParams.get("sortBy") || "name";
    const sortDir = searchParams.get("sortDir") || "asc";

    // Build Prisma query condition
    const where: Prisma.CollegeWhereInput = {};

    // Search matches name, location, state, description
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { location: { contains: search } },
        { state: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Location Filter
    if (location && location !== "all") {
      where.location = { equals: location };
    }

    // Stream Filter
    if (stream && stream !== "all") {
      where.stream = { equals: stream };
    }

    // Rating Filter
    if (rating && rating !== "all") {
      const minRating = parseFloat(rating);
      if (!isNaN(minRating)) {
        where.rating = { gte: minRating };
      }
    }

    // Fees Filter
    if (fees && fees !== "all") {
      if (fees === "under-1l") {
        where.averageFees = { lte: 100000 };
      } else if (fees === "1l-3l") {
        where.averageFees = { gte: 100000, lte: 300000 };
      } else if (fees === "3l-5l") {
        where.averageFees = { gte: 300000, lte: 500000 };
      } else if (fees === "above-5l") {
        where.averageFees = { gte: 500000 };
      }
    }

    // Build Sorting
    const orderBy: Prisma.CollegeOrderByWithRelationInput = {};
    const dir = sortDir as Prisma.SortOrder;
    if (sortBy === "fees") {
      orderBy.averageFees = dir;
    } else if (sortBy === "rating") {
      orderBy.rating = dir;
    } else if (sortBy === "placements") {
      orderBy.averagePlacement = dir;
    } else {
      orderBy.name = dir;
    }

    // Query data and count total records in parallel
    const [colleges, totalCount] = await prisma.$transaction([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          courses: {
            take: 3, // Include a few preview courses
          },
        },
      }),
      prisma.college.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: colleges,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/colleges error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
