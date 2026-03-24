import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";
import {
  deleteLocalCourse,
  getLocalCourseById,
  updateLocalCourse,
} from "@/lib/local-courses-store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await (prisma as any).course.findUnique({
      where: { id: params.id },
    });

    if (!course) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Course GET by id db error, using local fallback:", error);
    const localCourse = getLocalCourseById(params.id);

    if (!localCourse) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, course: localCourse, fallback: true });
  }
}

async function isAdminAllowed() {
  const bypassAdmin = process.env.DEV_BYPASS_ADMIN === "true";
  if (bypassAdmin) return true;

  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  return role === "admin";
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const canEdit = await isAdminAllowed();
    if (!canEdit) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const data: Record<string, any> = {};

    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.description !== undefined) {
      data.description = String(body.description).trim();
    }
    if (body.priceUsd !== undefined) data.priceUsd = Math.round(Number(body.priceUsd));
    if (body.level !== undefined) data.level = String(body.level);
    if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);

    let updated;
    try {
      updated = await (prisma as any).course.update({
        where: { id: params.id },
        data,
      });
    } catch (dbError) {
      console.error("Course PATCH db error, using local fallback:", dbError);
      updated = updateLocalCourse(params.id, data);
      if (!updated) {
        return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    console.error("Course PATCH error:", error);
    return NextResponse.json({ error: "Error al actualizar curso" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const canDelete = await isAdminAllowed();
    if (!canDelete) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    try {
      await (prisma as any).course.delete({
        where: { id: params.id },
      });
    } catch (dbError) {
      console.error("Course DELETE db error, using local fallback:", dbError);
      const removed = deleteLocalCourse(params.id);
      if (!removed) {
        return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, message: "Curso eliminado" });
  } catch (error) {
    console.error("Course DELETE error:", error);
    return NextResponse.json({ error: "Error al eliminar curso" }, { status: 500 });
  }
}
