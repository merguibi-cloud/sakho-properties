/**
 * FormLayout – Shared layout wrapper for all Sakho Properties forms.
 * Design: Dubai Noir Opulence – dark background, gold accents, Playfair Display headings.
 */
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663251323115/fOqdbIPZftQfSzJk.png";

interface FormLayoutProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  backgroundImage?: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitted?: boolean;
}

export default function FormLayout({
  title,
  subtitle,
  icon,
  children,
  backgroundImage,
  onSubmit,
  isSubmitted = false,
}: FormLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/95 to-[#0A0A0A]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-5 px-6 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 group">
              <ArrowLeft className="w-5 h-5 text-[#B8960C] group-hover:-translate-x-1 transition-transform duration-300" />
              <img
                src={LOGO_URL}
                alt="Sakho Properties"
                className="h-8 invert brightness-200"
              />
            </div>
          </Link>
        </header>

        {/* Main */}
        <main className="flex-1 flex items-start justify-center px-4 pb-12 pt-4">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-2xl"
              >
                <div className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#B8960C]/30 rounded-lg p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-[#B8960C] mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-[#F5F0E8] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    Merci pour votre soumission
                  </h2>
                  <p className="text-[#B8960C]/80 text-lg mb-8">
                    Notre équipe vous contactera dans les plus brefs délais.
                  </p>
                  <Link href="/">
                    <button className="px-8 py-3 bg-[#B8960C] text-[#0A0A0A] font-semibold rounded hover:bg-[#D4AF37] transition-colors duration-300">
                      Retour à l'accueil
                    </button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
              >
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8960C]/40 bg-[#B8960C]/10 mb-4">
                    {icon}
                  </div>
                  <h1
                    className="text-3xl md:text-4xl font-bold text-[#F5F0E8] mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h1>
                  <p className="text-[#B8960C]/70 text-base">{subtitle}</p>
                </div>

                {/* Form Card */}
                <div className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#B8960C]/20 rounded-lg p-6 md:p-8 hover:border-[#B8960C]/40 transition-colors duration-500">
                  <form onSubmit={onSubmit} className="space-y-6">
                    {children}
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-sm text-[#B8960C]/40">
          &copy; {new Date().getFullYear()} Sakho Properties. Tous droits réservés.
        </footer>
      </div>
    </div>
  );
}

/* Reusable form field components */

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-semibold text-[#B8960C] border-b border-[#B8960C]/20 pb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#F5F0E8]/90">
        {label}
        {required && <span className="text-[#B8960C] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

export function TextInput({
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-4 py-3 bg-[#0A0A0A]/60 border border-[#B8960C]/20 rounded text-[#F5F0E8] placeholder-[#F5F0E8]/30 focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C]/50 focus:outline-none transition-all duration-300"
    />
  );
}

export function TextArea({
  placeholder,
  value,
  onChange,
  rows = 4,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-4 py-3 bg-[#0A0A0A]/60 border border-[#B8960C]/20 rounded text-[#F5F0E8] placeholder-[#F5F0E8]/30 focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C]/50 focus:outline-none transition-all duration-300 resize-none"
    />
  );
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center gap-3 px-4 py-3 rounded border cursor-pointer transition-all duration-300 ${
            value === option.value
              ? "border-[#B8960C] bg-[#B8960C]/10"
              : "border-[#B8960C]/15 bg-[#0A0A0A]/40 hover:border-[#B8960C]/40"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-300 flex-shrink-0 ${
              value === option.value ? "border-[#B8960C]" : "border-[#B8960C]/40"
            }`}
          >
            {value === option.value && (
              <div className="w-2 h-2 rounded-full bg-[#B8960C]" />
            )}
          </div>
          <span className="text-sm text-[#F5F0E8]/90 flex-1">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export function CheckboxGroup({
  options,
  values,
  onChange,
}: {
  options: { label: string; value: string }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => toggle(option.value)}
          className={`flex items-center gap-3 px-4 py-3 rounded border cursor-pointer transition-all duration-300 ${
            values.includes(option.value)
              ? "border-[#B8960C] bg-[#B8960C]/10"
              : "border-[#B8960C]/15 bg-[#0A0A0A]/40 hover:border-[#B8960C]/40"
          }`}
        >
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors duration-300 ${
              values.includes(option.value) ? "border-[#B8960C] bg-[#B8960C]" : "border-[#B8960C]/40"
            }`}
          >
            {values.includes(option.value) && (
              <svg className="w-3 h-3 text-[#0A0A0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm text-[#F5F0E8]/90">{option.label}</span>
        </div>
      ))}
    </div>
  );
}

export function SubmitButton({ label = "Envoyer", isLoading = false }: { label?: string; isLoading?: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      whileHover={isLoading ? {} : { scale: 1.02 }}
      whileTap={isLoading ? {} : { scale: 0.98 }}
      className={`w-full py-4 font-bold text-lg rounded transition-all duration-500 shadow-lg shadow-[#B8960C]/20 ${
        isLoading
          ? "bg-[#B8960C]/50 text-[#0A0A0A]/60 cursor-not-allowed"
          : "bg-gradient-to-r from-[#B8960C] to-[#D4AF37] text-[#0A0A0A] hover:from-[#D4AF37] hover:to-[#B8960C]"
      }`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Envoi en cours...
        </span>
      ) : (
        label
      )}
    </motion.button>
  );
}

export function ContactFields({
  data,
  onChange,
}: {
  data: { nom: string; prenom: string; email: string; telephone: string };
  onChange: (field: string, value: string) => void;
}) {
  return (
    <FormSection title="Informations personnelles">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Nom" required>
          <TextInput
            placeholder="Votre nom"
            value={data.nom}
            onChange={(v) => onChange("nom", v)}
            required
          />
        </FormField>
        <FormField label="Prénom" required>
          <TextInput
            placeholder="Votre prénom"
            value={data.prenom}
            onChange={(v) => onChange("prenom", v)}
            required
          />
        </FormField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Email" required>
          <TextInput
            placeholder="votre@email.com"
            value={data.email}
            onChange={(v) => onChange("email", v)}
            type="email"
            required
          />
        </FormField>
        <FormField label="Téléphone" required>
          <TextInput
            placeholder="+33 6 00 00 00 00"
            value={data.telephone}
            onChange={(v) => onChange("telephone", v)}
            type="tel"
            required
          />
        </FormField>
      </div>
    </FormSection>
  );
}
