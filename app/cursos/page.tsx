"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Star,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Shield,
  Zap,
} from "lucide-react";

const courses = [
  {
    id: "basico",
    title: "Curso Básico",
    subtitle: "Fundamentos del Trading",
    description:
      "Ideal para principiantes. Aprenderás los conceptos fundamentales del trading, cómo funcionan los mercados y darás tus primeros pasos con confianza.",
    price: 97,
    originalPrice: 197,
    image: "https://cdn.abacus.ai/images/9077f6c6-7652-4e22-a797-efccad168a7c.png",
    duration: "4 semanas",
    lessons: 24,
    students: "850+",
    rating: 4.8,
    modules: [
      "Introducción a los mercados financieros",
      "Tipos de activos: Forex, Acciones, Cripto",
      "Análisis técnico básico",
      "Lectura de gráficos y velas japonesas",
      "Gestión de riesgo fundamental",
      "Configuración de plataformas de trading",
    ],
    bonuses: ["Cuenta demo ilimitada", "Acceso a comunidad básica", "Certificado de finalización"],
  },
  {
    id: "intermedio",
    title: "Curso Intermedio",
    subtitle: "Estrategias Avanzadas",
    description:
      "Lleva tu trading al siguiente nivel con estrategias probadas, indicadores técnicos avanzados y psicología del trader.",
    price: 197,
    originalPrice: 397,
    image: "https://cdn.abacus.ai/images/2a4bf941-3927-4c8e-91eb-b6158caac34a.png",
    duration: "6 semanas",
    lessons: 42,
    students: "520+",
    rating: 4.9,
    popular: true,
    modules: [
      "Patrones de velas avanzados",
      "Indicadores técnicos profesionales",
      "Estrategias de entrada y salida",
      "Operaciones de contra tendencia",
      "Psicología del trader exitoso",
      "Backtesting y optimización",
    ],
    bonuses: [
      "Señales de trading por 1 mes",
      "Sesiones Q&A en vivo",
      "Comunidad premium",
      "Plantillas de estrategias",
    ],
  },
  {
    id: "profesional",
    title: "Curso Profesional",
    subtitle: "Trading Institucional",
    description:
      "El programa completo para convertirte en un trader profesional. Incluye mentoría personalizada, automatización y estrategias institucionales.",
    price: 497,
    originalPrice: 997,
    image: "https://cdn.abacus.ai/images/b7869995-98fb-4702-94e9-a39eb45ab302.png",
    duration: "12 semanas",
    lessons: 78,
    students: "180+",
    rating: 5.0,
    modules: [
      "Análisis institucional de mercados",
      "Order flow y volumen profesional",
      "Automatización con bots de trading",
      "Gestión de portafolio avanzada",
      "Trading en múltiples timeframes",
      "Mentoría 1:1 personalizada",
    ],
    bonuses: [
      "3 meses de señales premium",
      "Acceso a bot básico incluido",
      "Mentoría mensual 1:1",
      "Certificación profesional",
      "Acceso de por vida",
    ],
  },
];

const membership = {
  title: "Membresía VIP",
  subtitle: "Todo Incluido",
  price: 997,
  period: "año",
  features: [
    "Acceso a TODOS los cursos",
    "Señales de trading diarias",
    "Comunidad VIP exclusiva",
    "Mentoría grupal semanal",
    "Bot Pro incluido",
    "Soporte prioritario 24/7",
  ],
};

type ManagedCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  priceUsd: number;
  level: string;
  isPublished: boolean;
};

export default function CursosPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [managedCourses, setManagedCourses] = useState<ManagedCourse[]>([]);

  useEffect(() => {
    const loadManagedCourses = async () => {
      try {
        const response = await fetch("/api/courses", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) return;

        const published = (data.courses || []).filter(
          (course: ManagedCourse) => course.isPublished
        );
        setManagedCourses(published);
      } catch (error) {
        // no-op en página pública
      }
    };

    loadManagedCourses();
  }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">Educación de Calidad</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Cursos de <span className="gradient-text">Trading</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              Programas estructurados para llevarte de principiante a trader profesional con nuestro método probado.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-slate-400">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>Garantía 7 días</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="h-5 w-5 text-emerald-400" />
                <span>Acceso de por vida</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Award className="h-5 w-5 text-emerald-400" />
                <span>Certificación incluida</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 bg-slate-900" ref={ref}>
        <div className="max-w-7xl mx-auto px-4">
          {managedCourses.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Nuevos Cursos Publicados
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {managedCourses.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{course.title}</h3>
                      <span className="text-xs uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-1 rounded">
                        {course.level}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-5 line-clamp-4">
                      {course.description}
                    </p>
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-3xl font-bold text-white">${course.priceUsd}</span>
                      <span className="text-sm text-emerald-400">USD</span>
                    </div>
                    <Link href="/registro" className="btn-primary w-full inline-flex justify-center">
                      Inscribirse
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.15 }}
                className={`card relative overflow-hidden ${
                  course.popular ? "border-emerald-500/50 ring-2 ring-emerald-500/20" : ""
                }`}
              >
                {course.popular && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg z-10">
                    MÁS POPULAR
                  </div>
                )}

                <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                  <Image src={course.image} alt={course.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="bg-emerald-500 p-2 rounded-full">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">{course.lessons} lecciones</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">{course.title}</h3>
                <p className="text-emerald-400 font-medium mb-3">{course.subtitle}</p>
                <p className="text-slate-400 text-sm mb-4">{course.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {course.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="h-4 w-4 fill-current" /> {course.rating}
                  </span>
                </div>

                {/* Modules */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3">Contenido:</h4>
                  <ul className="space-y-2">
                    {course.modules.slice(0, 4).map((module) => (
                      <li key={module} className="text-sm text-slate-400 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {module}
                      </li>
                    ))}
                    {course.modules.length > 4 && (
                      <li className="text-sm text-emerald-400">+{course.modules.length - 4} más...</li>
                    )}
                  </ul>
                </div>

                {/* Price */}
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-3xl font-bold text-white">${course.price}</span>
                  <span className="text-lg text-slate-500 line-through">${course.originalPrice}</span>
                  <span className="text-sm text-emerald-400">USD</span>
                </div>

                <Link
                  href="/registro"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                    course.popular
                      ? "btn-primary"
                      : "bg-slate-700 hover:bg-slate-600 text-white"
                  }`}
                >
                  Inscribirse <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* VIP Membership */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-purple-900/50 to-emerald-900/50 rounded-3xl p-8 md:p-12 border border-purple-500/30"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-500/20 rounded-full px-4 py-2 mb-4">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Mejor Valor</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{membership.title}</h3>
                <p className="text-purple-300 mb-4">{membership.subtitle}</p>
                <ul className="space-y-3">
                  {membership.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center md:text-right">
                <div className="text-5xl font-bold text-white mb-2">
                  ${membership.price}
                  <span className="text-lg text-slate-400">/{membership.period}</span>
                </div>
                <p className="text-slate-400 mb-6">Ahorra $791 vs comprar por separado</p>
                <Link href="/registro" className="btn-secondary inline-flex items-center gap-2">
                  Unirse a VIP <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
