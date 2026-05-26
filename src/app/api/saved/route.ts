import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch all saved colleges for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: {
        college: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: savedColleges.map((sc) => sc.college),
    });
  } catch (error) {
    console.error("GET /api/saved error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Toggle save/unsave college
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
    const { collegeId } = body;

    if (!collegeId) {
      return NextResponse.json(
        { success: false, error: "College ID is required" },
        { status: 400 }
      );
    }

    // Check if the college is already saved
    const existingSave = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: collegeId,
        },
      },
    });

    if (existingSave) {
      // Unsave college
      await prisma.savedCollege.delete({
        where: {
          userId_collegeId: {
            userId: session.user.id,
            collegeId: collegeId,
          },
        },
      });
      return NextResponse.json({
        success: true,
        saved: false,
        message: "College removed from wishlist",
      });
    } else {
      // Save college
      await prisma.savedCollege.create({
        data: {
          userId: session.user.id,
          collegeId: collegeId,
        },
      });
      return NextResponse.json({
        success: true,
        saved: true,
        message: "College saved to wishlist",
      });
    }
  } catch (error) {
    console.error("POST /api/saved error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
