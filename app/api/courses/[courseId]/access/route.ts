import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET - Check access and get course content
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has access to the course
    const access = await prisma.userCourseAccess.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    // Check if access has expired
    const hasAccess = access && (!access.expiresAt || access.expiresAt > new Date());

    if (!hasAccess) {
      return NextResponse.json({
        hasAccess: false,
        message: "No tienes acceso a este curso",
      });
    }

    // Get course with all content
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                resources: {
                  orderBy: { order: "asc" },
                },
                progress: {
                  where: { userId: user.id },
                  select: { completed: true },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Format response with progress
    const formattedCourse = {
      ...course,
      modules: course.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => ({
          ...lesson,
          completed: lesson.progress[0]?.completed || false,
          progress: undefined, // Remove progress array from response
        })),
      })),
    };

    return NextResponse.json({
      hasAccess: true,
      course: formattedCourse,
    });
  } catch (error) {
    console.error("Error checking course access:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
