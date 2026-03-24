"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Award } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://cdn.abacus.ai/images/31f74caf-5d2c-4805-be8e-accbeb7f450f.png"
          alt="Trading profesional"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">Método Probado para Traders Exitosos</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Transforma tu Vida con el{" "}
            <span className="gradient-text">Trading Inteligente</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Aprende el método que te llevará del 95% que pierde al{" "}
            <strong className="text-emerald-400">5% que GANA</strong> consistentemente en los mercados financieros.
          </p>

          <div className="max-w-4xl mx-auto text-slate-300 space-y-4 mb-8">
            <p>
              El trading es una habilidad real que puede generar ingresos consistentes cuando se aprende
              correctamente. Nuestra formación está diseñada para que avances paso a paso, con
              acompañamiento práctico en cada etapa y un enfoque claro en resultados tangibles.
            </p>
            <p>
              No se trata solo de teoría, sino de desarrollar las habilidades necesarias para operar con
              confianza y consistencia en los mercados.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-6 p-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-900/30 to-blue-900/30 text-slate-200">
            <p className="mb-4">
              <strong className="text-emerald-300">Comenzamos con Trading Binario</strong> porque es la forma
              más efectiva de que empieces a generar resultados reales <strong className="text-emerald-300">mientras aprendes</strong>
              : imagina poder aplicar lo que estudias hoy y ver resultados en horas, no en meses.
            </p>
            <p>
              Una vez domines los fundamentos y desarrolles la disciplina necesaria, darás el salto natural
              al trading en Forex con una base sólida.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-8 p-6 rounded-2xl border border-purple-500/40 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 text-slate-200">
            <p className="mb-4">
              <strong className="text-cyan-300">🤖 Nuestros Bots de Trading Automático</strong> — Actualmente
              contamos con bots que operan en:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">Forex</div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">Criptomonedas 24/7</div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">Índices Sintéticos</div>
            </div>
          </div>

          <p className="text-amber-300 italic mb-8">
            Aquí no tenemos límites, lleguemos más allá de la meta porque no hay fronteras que nos detenga.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">+2,500</div>
              <div className="text-sm text-slate-400">Estudiantes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">95%</div>
              <div className="text-sm text-slate-400">Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">7 Años</div>
              <div className="text-sm text-slate-400">Experiencia</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/registro"
              className="btn-primary text-lg flex items-center justify-center gap-2"
            >
              Comienza Tu Transformación
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/metodo"
              className="bg-slate-800/50 border border-slate-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2"
            >
              Conoce el Método
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Shield className="h-5 w-5 text-emerald-500" />
              Garantía 7 Días
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Award className="h-5 w-5 text-emerald-500" />
              Certificación Incluida
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
