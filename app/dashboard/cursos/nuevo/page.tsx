"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save, ShieldAlert } from "lucide-react";

export default function NuevoCursoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const bypassAuth = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true";
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceUsd: "",
    level: "basico",
    isPublished: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = useMemo(
    () => bypassAuth || (session?.user as any)?.role === "admin",
    [bypassAuth, session]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim() || !formData.description.trim() || !formData.priceUsd) {
      setError("Completa título, descripción y precio");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          priceUsd: Number(formData.priceUsd),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear el curso");
      }

      setSuccess("Curso creado correctamente");
      setTimeout(() => {
        router.push("/dashboard/cursos");
      }, 900);
    } catch (err: any) {
      setError(err.message || "Error al crear curso");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!bypassAuth && !session) {
    router.replace("/login");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card text-center">
            <ShieldAlert className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Acceso restringido</h1>
            <p className="text-slate-400 mb-6">Solo administradores pueden crear cursos.</p>
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
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard/cursos" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Crear nuevo curso</h1>
          <p className="text-slate-400">Completa los datos base del curso.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="card space-y-5"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-2">Título</label>
            <input
              type="text"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Curso Básico de Trading"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Descripción</label>
            <textarea
              className="input-field min-h-[130px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el objetivo, público y contenido principal..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Precio (USD)</label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={formData.priceUsd}
                onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })}
                placeholder="97"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Nivel</label>
              <select
                className="input-field"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="profesional">Profesional</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            />
            Publicar inmediatamente
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Crear curso
              </>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
