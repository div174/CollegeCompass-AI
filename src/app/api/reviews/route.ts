import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to submit a review." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { collegeId, rating, comment } = body;

    // Input Validation
    if (!collegeId) {
      return NextResponse.json({ success: false, error: "College ID is required" }, { status: 400 });
    }
    const score = parseInt(rating, 10);
    if (isNaN(score) || score < 1 || score > 5) {
      return NextResponse.json({ success: false, error: "Rating must be an integer between 1 and 5" }, { status: 400 });
    }
    if (!comment || comment.trim().length < 5) {
      return NextResponse.json({ success: false, error: "Comment must be at least 5 characters long" }, { status: 400 });
    }

    // Verify college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });
    if (!collegeExists) {
      return NextResponse.json({ success: false, error: "College not found" }, { status: 404 });
    }

    // Create the Review
    const newReview = await prisma.review.create({
      data: {
        rating: score,
        comment: comment.trim(),
        userId: session.user.id,
        collegeId: collegeId,
      },
    });

    // Dynamic Rating Recalculation:
    // Fetch all reviews for this college and recalculate overall average rating
    const allReviews = await prisma.review.findMany({
      where: { collegeId },
      select: { rating: true },
    });

    if (allReviews.length > 0) {
      const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const newAverageRating = Math.round((sum / allReviews.length) * 10) / 10;

      // Update the college overall rating
      await prisma.college.update({
        where: { id: collegeId },
        data: { rating: newAverageRating },
      });
    }

    return NextResponse.json({
      success: true,
      data: newReview,
      message: "Your review has been successfully posted!",
    });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
