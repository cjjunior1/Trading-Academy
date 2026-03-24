"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Loader2, ShieldAlert, CircleDollarSign, BookOpen } from "lucide-react";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  priceUsd: number;
  level: string;
  isPublished: boolean;
  createdAt: string;
};

export default function DashboardCursosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const bypassAuth = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true";
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");

  const isAdmin = useMemo(
    () => bypassAuth || (session?.user as any)?.role === "admin",
    [bypassAuth, session]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || status === "loading") return;
    if (!bypassAuth && status === "unauthenticated") router.replace("/login");
  }, [mounted, status, router, bypassAuth]);

  useEffect(() => {
    const loadCourses = async () => {
      if (!mounted) return;
      if (!bypassAuth && status !== "authenticated") return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/courses", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar los cursos");
        }

        setCourses(data.courses || []);
      } catch (err: any) {
        setError(err.message || "Error al obtener cursos");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [mounted, status, bypassAuth]);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!bypassAuth && status === "unauthenticated") return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card text-center">
            <ShieldAlert className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Acceso restringido</h1>
            <p className="text-slate-400 mb-6">
              Esta sección es solo para administradores.
            </p>
            <Link href="/dashboard" className="btn-primary inline-flex">
              Volver al dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestión de cursos</h1>
            <p className="text-slate-400">Crea, publica y administra tus cursos.</p>
          </div>
          <Link href="/dashboard/cursos/nuevo" className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Nuevo curso
          </Link>
        </motion.div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="card flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="card text-center py-14">
            <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">Aún no hay cursos creados</p>
            <p className="text-slate-400 mb-6">Empieza creando tu primer curso.</p>
            <Link href="/dashboard/cursos/nuevo" className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Crear primer curso
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-xl font-bold text-white">{course.title}</h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      course.isPublished
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-700 text-slate-300 border border-slate-600"
                    }`}
                  >
                    {course.isPublished ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <CircleDollarSign className="h-4 w-4 text-emerald-400" /> ${course.priceUsd} USD
                  </span>
                  <span className="uppercase text-xs bg-slate-700 px-2 py-1 rounded">{course.level}</span>
                </div>
                <p className="text-xs text-slate-500">Slug: {course.slug}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
