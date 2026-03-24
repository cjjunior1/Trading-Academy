import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";
import { createLocalCourse, getLocalCourses } from "@/lib/local-courses-store";

export const dynamic = "force-dynamic";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const courses = await (prisma as any).course.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Courses GET error, using local fallback:", error);
    return NextResponse.json({
      success: true,
      courses: getLocalCourses(),
      fallback: true,
    });
  }
}

function getUniqueLocalSlug(baseSlug: string) {
  const courses = getLocalCourses();
  let slug = baseSlug;
  let attempt = 1;

  while (courses.some((course) => course.slug === slug)) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  return slug;
}

async function isAdminAllowed() {
  const bypassAdmin = process.env.DEV_BYPASS_ADMIN === "true";
  if (bypassAdmin) return true;

  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  return role === "admin";
}

export async function POST(request: Request) {
  try {
    const canCreate = await isAdminAllowed();
    if (!canCreate) {
      return NextResponse.json(
        { error: "No autorizado para crear cursos" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, priceUsd, level, isPublished } = body;

    if (!title || !description || priceUsd === undefined || priceUsd === null) {
      return NextResponse.json(
        { error: "Título, descripción y precio son obligatorios" },
        { status: 400 }
      );
    }

    const parsedPrice = Number(priceUsd);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: "El precio debe ser un número válido" },
        { status: 400 }
      );
    }

    const baseSlug = toSlug(title);
    let slug = baseSlug;
    let attempt = 1;

    try {
      while (await (prisma as any).course.findUnique({ where: { slug } })) {
        attempt += 1;
        slug = `${baseSlug}-${attempt}`;
      }

      const course = await (prisma as any).course.create({
        data: {
          title: title.trim(),
          slug,
          description: description.trim(),
          priceUsd: Math.round(parsedPrice),
          level: level || "basico",
          isPublished: Boolean(isPublished),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Curso creado exitosamente",
        course,
      });
    } catch (dbError) {
      console.error("Courses POST db error, using local fallback:", dbError);
      const localCourse = createLocalCourse({
        title: title.trim(),
        slug: getUniqueLocalSlug(baseSlug),
        description: description.trim(),
        priceUsd: Math.round(parsedPrice),
        level: level || "basico",
        isPublished: Boolean(isPublished),
      });

      return NextResponse.json({
        success: true,
        message: "Curso creado en modo local (sin base de datos)",
        course: localCourse,
        fallback: true,
      });
    }
  } catch (error) {
    console.error("Courses POST error:", error);
    return NextResponse.json(
      { error: "Error al crear el curso" },
      { status: 500 }
    );
  }
}
