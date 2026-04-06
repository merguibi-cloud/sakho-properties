import { Link } from "wouter";
import { motion } from "framer-motion";
import { Building2, ArrowLeft } from "lucide-react";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663251323115/fOqdbIPZftQfSzJk.png";

const destinations = [
  {
    title: "Dubaï",
    description: "Investissez dans le prestige à Dubaï",
    flag: "🇦🇪",
    href: "/immobilier-dubai",
  },
  {
    title: "Maroc",
    description: "Investissez dans l'immobilier au Maroc",
    flag: "🇲🇦",
    href: "/immobilier-maroc",
  },
];

export default function ImmobilierSelectPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 flex items-center justify-center relative">
        <Link href="/">
          <button className="absolute left-6 flex items-center gap-2 text-[#B8960C]/60 hover:text-[#B8960C] transition-colors duration-300">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </button>
        </Link>
        <motion.img
          src={LOGO_URL}
          alt="Sakho Properties"
          className="h-10 md:h-12 invert brightness-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="w-14 h-14 rounded-full border border-[#B8960C]/30 bg-[#B8960C]/10 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-6 h-6 text-[#B8960C]" />
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#F5F0E8] mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Immobilier
          </h1>
          <p className="text-[#F5F0E8]/50 text-lg">
            Choisissez votre destination d'investissement
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.href}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <Link href={dest.href}>
                <div className="group relative bg-[#1A1A1A]/70 backdrop-blur-sm border border-[#B8960C]/15 rounded-lg p-8 hover:border-[#B8960C]/50 transition-all duration-500 cursor-pointer text-center">
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[#B8960C]/5 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">{dest.flag}</div>
                    <h3
                      className="text-2xl font-bold text-[#F5F0E8] mb-2 group-hover:text-[#D4AF37] transition-colors duration-300"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {dest.title}
                    </h3>
                    <p className="text-sm text-[#F5F0E8]/50 group-hover:text-[#F5F0E8]/70 transition-colors duration-300 mb-5">
                      {dest.description}
                    </p>
                    <div className="flex items-center justify-center text-[#B8960C]/50 group-hover:text-[#B8960C] transition-all duration-300">
                      <span className="text-sm font-medium">Accéder au formulaire</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="py-4 text-center text-sm text-[#B8960C]/30">
        &copy; {new Date().getFullYear()} Sakho Properties. Tous droits réservés.
      </footer>
    </div>
  );
}
