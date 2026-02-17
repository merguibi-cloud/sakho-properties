/**
 * Home – Hub central de navigation vers les formulaires Sakho Properties.
 * Design: Dubai Noir Opulence – fond noir, accents dorés, cartes avec bordures animées.
 * Ordre: Immo, Archispace, Conciergerie, Partenariat, Candidature SP, Candidature Archispace
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Users,
  Handshake,
  Building2,
  ConciergeBell,
  Gem,
  LayoutGrid,
} from "lucide-react";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663251323115/fOqdbIPZftQfSzJk.png";
const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/DygVo6WBqHSArQIDndnU9n/sandbox/cMuJsP4v14dzXHln2wtUFX-img-1_1771277930000_na1fn_c2FraG8taGVyby1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRHlnVm82V0JxSFNBclFJRG5kblU5bi9zYW5kYm94L2NNdUpzUDR2MTRkelhIbG4yd3RVRlgtaW1nLTFfMTc3MTI3NzkzMDAwMF9uYTFmbl9jMkZyYUc4dGFHVnlieTFpWncuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fOpGi0xNQmolSA~f4oLd7XDHhTUtRpL2x46ua6M1xb53xaJeu-U6zT0m~zbsu7S1btL3JAFGkWCx2ZLhKZ5kJuqsyv~Ol91dFlldsOVXXsZzZrbqSI82Vtvi9U3mjnFYH3p54SYhPy1iBFcRqkK4JThjC3H15XpxpwDR22RsR8r2-Hb5xis5yS70omJJrMjL6SEAJ4f0EM4QqKgl8q2BZ5FSQHVtnguOMA2H6seAqLbAOWsMtPhoW2-YDonUjBpoXavD1tS4Cti6xKwFuIS27gbH5DhtG4N3iyyFWOLVCj6nx7FCyfphBvwW0Xghbyy85W63IZZpagnnLil3lpFfzA__";

const formCards = [
  {
    title: "Immobilier",
    description: "Investissez dans le prestige à Dubaï",
    icon: Building2,
    href: "/immobilier",
  },
  {
    title: "Archispace",
    description: "Design d'intérieur d'exception",
    icon: Gem,
    href: "/archispace",
  },
  {
    title: "Conciergerie",
    description: "Un service sur-mesure à Dubaï",
    icon: ConciergeBell,
    href: "/conciergerie",
  },
  {
    title: "Partenariat",
    description: "Construisons ensemble l'avenir",
    icon: Handshake,
    href: "/partenariat",
  },
  {
    title: "Candidature – Sakho Properties",
    description: "Rejoignez l'équipe immobilière",
    icon: Building2,
    href: "/candidature-sakho",
  },
  {
    title: "Candidature – Archispace",
    description: "Rejoignez l'univers du design",
    icon: Users,
    href: "/candidature-archispace",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/85 via-[#0A0A0A]/90 to-[#0A0A0A]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-6 flex items-center justify-center">
          <motion.img
            src={LOGO_URL}
            alt="Sakho Properties"
            className="h-10 md:h-12 invert brightness-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
        </header>

        {/* Hero */}
        <motion.div
          className="text-center px-4 pt-8 pb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F0E8] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Comment pouvons-nous
            <br />
            <span className="gold-shimmer">vous accompagner ?</span>
          </h1>
          <p className="text-[#F5F0E8]/60 text-lg max-w-xl mx-auto">
            Sélectionnez le domaine qui correspond à votre besoin
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="flex-1 px-4 md:px-8 pb-8 max-w-6xl mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {formCards.map((card) => (
              <motion.div key={card.href} variants={cardVariants}>
                <Link href={card.href}>
                  <div className="group relative bg-[#1A1A1A]/70 backdrop-blur-sm border border-[#B8960C]/15 rounded-lg p-6 hover:border-[#B8960C]/50 transition-all duration-500 cursor-pointer h-full">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[#B8960C]/5 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-full border border-[#B8960C]/30 bg-[#B8960C]/10 flex items-center justify-center mb-4 group-hover:bg-[#B8960C]/20 group-hover:border-[#B8960C]/50 transition-all duration-500">
                        <card.icon className="w-5 h-5 text-[#B8960C]" />
                      </div>
                      <h3
                        className="text-xl font-bold text-[#F5F0E8] mb-2 group-hover:text-[#D4AF37] transition-colors duration-300"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {card.title}
                      </h3>
                      <p className="text-sm text-[#F5F0E8]/50 group-hover:text-[#F5F0E8]/70 transition-colors duration-300">
                        {card.description}
                      </p>

                      {/* Arrow */}
                      <div className="mt-4 flex items-center text-[#B8960C]/50 group-hover:text-[#B8960C] transition-all duration-300">
                        <span className="text-sm font-medium">Accéder au formulaire</span>
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Central Form Card – Larger */}
            <motion.div variants={cardVariants} className="md:col-span-2 lg:col-span-3">
              <Link href="/formulaire-central">
                <div className="group relative bg-gradient-to-r from-[#1A1A1A]/80 to-[#1A1A1A]/60 backdrop-blur-sm border border-[#B8960C]/25 rounded-lg p-6 md:p-8 hover:border-[#B8960C]/60 transition-all duration-500 cursor-pointer">
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#B8960C]/5 via-[#B8960C]/8 to-[#B8960C]/5 pointer-events-none" />

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-full border-2 border-[#B8960C]/40 bg-[#B8960C]/10 flex items-center justify-center group-hover:bg-[#B8960C]/20 group-hover:border-[#B8960C]/60 transition-all duration-500">
                      <LayoutGrid className="w-7 h-7 text-[#B8960C]" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h3
                        className="text-2xl font-bold text-[#F5F0E8] mb-1 group-hover:text-[#D4AF37] transition-colors duration-300"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Formulaire Central
                      </h3>
                      <p className="text-[#F5F0E8]/50 group-hover:text-[#F5F0E8]/70 transition-colors duration-300">
                        Un formulaire unique qui regroupe tous les domaines — idéal si vous avez plusieurs besoins
                      </p>
                    </div>
                    <div className="flex items-center text-[#B8960C]/60 group-hover:text-[#B8960C] transition-all duration-300">
                      <span className="text-sm font-medium mr-2 hidden md:inline">Accéder</span>
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="py-4 text-center text-sm text-[#B8960C]/30">
          &copy; {new Date().getFullYear()} Sakho Properties. Tous droits réservés.
        </footer>
      </div>
    </div>
  );
}
