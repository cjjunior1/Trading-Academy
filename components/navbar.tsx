"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  TrendingUp,
  BookOpen,
  Bot,
  Users,
  LogIn,
  LogOut,
  User,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio", icon: TrendingUp },
  { href: "/metodo", label: "El Método", icon: BookOpen },
  { href: "/cursos", label: "Cursos", icon: BookOpen },
  { href: "/bots", label: "Bots", icon: Bot },
  { href: "/testimonios", label: "Testimonios", icon: Users },
];

export function Navbar() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status ?? "loading";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-emerald-500" />
            <span className="text-xl font-bold text-white">
              Trading <span className="text-emerald-500">Academy</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            {mounted && status === "authenticated" ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">
                  <User className="h-4 w-4 inline mr-1" />
                  {session?.user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </button>
              </div>
            ) : mounted ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link href="/registro" className="btn-primary text-sm py-2 px-4">
                  Registrarse
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 py-2"
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-700">
                {mounted && status === "authenticated" ? (
                  <button
                    onClick={() => signOut()}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                  </button>
                ) : mounted ? (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center py-2 text-slate-300"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/registro"
                      onClick={() => setIsOpen(false)}
                      className="block w-full btn-primary text-center"
                    >
                      Registrarse Gratis
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
