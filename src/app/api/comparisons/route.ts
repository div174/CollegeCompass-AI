import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { College } from "@/types";

// GET: Fetch saved comparisons for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const comparisons = await prisma.comparison.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // For each comparison, we want to fetch the actual college objects to return rich info!
    const richComparisons = await Promise.all(
      comparisons.map(async (comp) => {
        try {
          const collegeIds: string[] = JSON.parse(comp.collegeIds);
          const colleges = await prisma.college.findMany({
            where: {
              id: { in: collegeIds },
            },
          });
          // Preserve the original order of collegeIds if possible
          const orderedColleges = collegeIds
            .map((id) => colleges.find((c) => c.id === id))
            .filter((c): c is typeof colleges[0] => !!c);

          return {
            id: comp.id,
            name: comp.name || `Comparison of ${orderedColleges.map((c) => c.name.split(" (")[0]).join(" vs ")}`,
            colleges: orderedColleges,
            createdAt: comp.createdAt,
          };
        } catch {
          return {
            id: comp.id,
            name: comp.name || "Saved Comparison",
            colleges: [],
            createdAt: comp.createdAt,
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: richComparisons,
    });
  } catch (error) {
    console.error("GET /api/comparisons error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Save a comparison list
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { collegeIds, name } = body;

    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "An array of College IDs is required" },
        { status: 400 }
      );
    }

    if (collegeIds.length > 3) {
      return NextResponse.json(
        { success: false, error: "You can save comparison for a maximum of 3 colleges" },
        { status: 400 }
      );
    }

    const newComparison = await prisma.comparison.create({
      data: {
        userId: session.user.id,
        collegeIds: JSON.stringify(collegeIds),
        name: name || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: newComparison,
      message: "Comparison saved successfully!",
    });
  } catch (error) {
    console.error("POST /api/comparisons error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
