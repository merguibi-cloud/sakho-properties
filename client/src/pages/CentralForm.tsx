/**
 * CentralForm – Formulaire centralisé multi-domaines Sakho Properties.
 * Design: Dubai Noir Opulence. Multi-step form with domain selection.
 * Ordre: Immo, Archispace, Conciergerie, Partenariat, Candidature SP, Candidature Archispace.
 */
import { useState } from "react";
import { LayoutGrid, ArrowLeft, ArrowRight, Users, Handshake, Building2, ConciergeBell, Gem } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { submitToGoogleSheets } from "@/hooks/useGoogleSheets";
import {
  ContactFields,
  FormSection,
  FormField,
  RadioGroup,
  CheckboxGroup,
  TextInput,
  TextArea,
} from "@/components/FormLayout";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/DygVo6WBqHSArQIDndnU9n/sandbox/cMuJsP4v14dzXHln2wtUFX-img-1_1771277930000_na1fn_c2FraG8taGVyby1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRHlnVm82V0JxSFNBclFJRG5kblU5bi9zYW5kYm94L2NNdUpzUDR2MTRkelhIbG4yd3RVRlgtaW1nLTFfMTc3MTI3NzkzMDAwMF9uYTFmbl9jMkZyYUc4dGFHVnlieTFpWncuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fOpGi0xNQmolSA~f4oLd7XDHhTUtRpL2x46ua6M1xb53xaJeu-U6zT0m~zbsu7S1btL3JAFGkWCx2ZLhKZ5kJuqsyv~Ol91dFlldsOVXXsZzZrbqSI82Vtvi9U3mjnFYH3p54SYhPy1iBFcRqkK4JThjC3H15XpxpwDR22RsR8r2-Hb5xis5yS70omJJrMjL6SEAJ4f0EM4QqKgl8q2BZ5FSQHVtnguOMA2H6seAqLbAOWsMtPhoW2-YDonUjBpoXavD1tS4Cti6xKwFuIS27gbH5DhtG4N3iyyFWOLVCj6nx7FCyfphBvwW0Xghbyy85W63IZZpagnnLil3lpFfzA__";
const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663251323115/fOqdbIPZftQfSzJk.png";

type Domain = "immobilier" | "archispace" | "conciergerie" | "partenariat" | "candidature-sakho" | "candidature-archispace";

const domains: { id: Domain; label: string; icon: typeof Users; description: string }[] = [
  { id: "immobilier", label: "Immobilier", icon: Building2, description: "Investissez dans le prestige" },
  { id: "archispace", label: "Archispace", icon: Gem, description: "Design d'intérieur d'exception" },
  { id: "conciergerie", label: "Conciergerie", icon: ConciergeBell, description: "Service sur-mesure" },
  { id: "partenariat", label: "Partenariat", icon: Handshake, description: "Collaborons ensemble" },
  { id: "candidature-sakho", label: "Candidature – Sakho Properties", icon: Building2, description: "Postes immobilier" },
  { id: "candidature-archispace", label: "Candidature – Archispace", icon: Users, description: "Postes design & showroom" },
];

const LABELS: Record<string, string> = {
  "rh": "RH", "agent-immobilier": "Agent immobilier", "directeur-agence": "Directeur d'agence (francophone)",
  "show-room-manager": "Show room manager", "sales-1": "Sales 1", "sales-2": "Sales 2", "sales-3": "Sales 3", "sales-4": "Sales 4", "receptionist": "Receptionist", "coffee-boy": "Coffee boy",
  "oui": "Oui", "non": "Non", "projet": "Projet d'installation",
  "immediatement": "Immédiatement", "1-3-mois": "1 à 3 mois", "plus-3-mois": "+3 mois",
  "debutant": "Débutant (0-1 an)", "intermediaire": "Intermédiaire (1-3 ans)", "confirme": "Confirmé (3-5 ans)", "expert": "Expert (5+ ans)",
  "francais": "Français", "anglais": "Anglais", "arabe": "Arabe", "russe": "Russe",
  "francais-anglais": "Français + Anglais", "anglais-arabe": "Anglais + Arabe", "trilingue": "Trilingue (Français, Anglais, Arabe)", "trilingue-plus": "Trilingue ou plus", "autre": "Autre",
  "vente-directe": "Vente directe / Porte-à-porte", "showroom-retail": "Showroom / Retail", "design-interieur": "Design d'intérieur", "accueil-service": "Accueil / Service client", "management": "Management d'équipe", "aucune": "Aucune expérience spécifique",
  "immobilier": "Immobilier", "archispace": "Archispace", "conciergerie": "Conciergerie",
  "apporteur": "Apporteur d'affaires", "prestataire": "Prestataire de services", "investisseur": "Investisseur",
  "investissement-locatif": "Investissement locatif", "residence-principale": "Résidence principale",
  "studio": "Studio", "1-bed": "1 bed", "2-bed": "2 bed", "3-bed": "3 bed", "villa-maison": "Villa / Maison", "commercial": "Commercial",
  "150k-350k": "150 000 – 350 000 €", "350k-500k": "350 000 € – 500 000 €", "500k-plus": "500 000 € et +",
  "3-6-mois": "3 à 6 mois", "plus-6-mois": "+6 mois",
  "court": "Court séjour (moins de 7 jours)", "long": "Long séjour (+ de 7 jours)",
  "15-jours": "Dans les 15 jours", "plus-15-jours": "Dans plus de 15 jours",
  "logement": "Logement", "vehicule": "Véhicule", "activite": "Activité",
  "appartement": "Appartement", "villa": "Villa", "local-commercial": "Local commercial",
  "3-mois-plus": "3 mois et plus", "20k-50k": "20 000 € – 50 000 €", "50k-plus": "+50 000 €",
};

const stepVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export default function CentralForm() {
  const [step, setStep] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<Domain | "">("");
  const [contact, setContact] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [submitted, setSubmitted] = useState(false);

  // Candidature Sakho
  const [posteSakho, setPosteSakho] = useState("");
  const [baseDubaiSakho, setBaseDubaiSakho] = useState("");
  const [experienceImmo, setExperienceImmo] = useState("");
  const [niveauExpSakho, setNiveauExpSakho] = useState("");
  const [languesSakho, setLanguesSakho] = useState("");
  const [dispoSakho, setDispoSakho] = useState("");
  const [motivSakho, setMotivSakho] = useState("");
  // Candidature Archispace
  const [posteArchi, setPosteArchi] = useState("");
  const [baseDubaiArchi, setBaseDubaiArchi] = useState("");
  const [experienceVente, setExperienceVente] = useState("");
  const [niveauExpArchi, setNiveauExpArchi] = useState("");
  const [competenceCle, setCompetenceCle] = useState("");
  const [languesArchi, setLanguesArchi] = useState("");
  const [dispoArchi, setDispoArchi] = useState("");
  const [motivArchi, setMotivArchi] = useState("");
  // Partenariat
  const [typePartenariat, setTypePartenariat] = useState("");
  const [natureActivite, setNatureActivite] = useState("");
  const [vision, setVision] = useState("");
  // Immobilier
  const [objectif, setObjectif] = useState("");
  const [typeBienImmo, setTypeBienImmo] = useState("");
  const [budget, setBudget] = useState("");
  const [echeance, setEcheance] = useState("");
  const [dejaInvesti, setDejaInvesti] = useState("");
  // Conciergerie
  const [duree, setDuree] = useState("");
  const [periode, setPeriode] = useState("");
  const [services, setServices] = useState<string[]>([]);
  // Archispace
  const [typeBien, setTypeBien] = useState("");
  const [ville, setVille] = useState("");
  const [demarrage, setDemarrage] = useState("");
  const [budgetDesign, setBudgetDesign] = useState("");

  const handleNext = () => {
    if (step === 0 && !selectedDomain) { toast.error("Veuillez sélectionner un domaine."); return; }
    if (step === 1 && (!contact.nom || !contact.prenom || !contact.email || !contact.telephone)) {
      toast.error("Veuillez remplir tous les champs de contact."); return;
    }
    setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => s - 1);

  const buildPayload = () => {
    const base = { domain: selectedDomain, nom: contact.nom, prenom: contact.prenom, email: contact.email, telephone: contact.telephone };
    switch (selectedDomain) {
      case "candidature-sakho":
        return { ...base, poste: LABELS[posteSakho] || posteSakho, baseDubai: LABELS[baseDubaiSakho] || baseDubaiSakho, experienceImmo: LABELS[experienceImmo] || experienceImmo, niveauExperience: LABELS[niveauExpSakho] || niveauExpSakho, langues: LABELS[languesSakho] || languesSakho, disponibilite: LABELS[dispoSakho] || dispoSakho, motivation: motivSakho };
      case "candidature-archispace":
        return { ...base, poste: LABELS[posteArchi] || posteArchi, baseDubai: LABELS[baseDubaiArchi] || baseDubaiArchi, experienceVente: LABELS[experienceVente] || experienceVente, niveauExperience: LABELS[niveauExpArchi] || niveauExpArchi, competenceCle: LABELS[competenceCle] || competenceCle, langues: LABELS[languesArchi] || languesArchi, disponibilite: LABELS[dispoArchi] || dispoArchi, motivation: motivArchi };
      case "partenariat":
        return { ...base, typePartenariat: LABELS[typePartenariat] || typePartenariat, natureActivite: LABELS[natureActivite] || natureActivite, vision };
      case "immobilier":
        return { ...base, objectif: LABELS[objectif] || objectif, typeBien: LABELS[typeBienImmo] || typeBienImmo, budget: LABELS[budget] || budget, echeance: LABELS[echeance] || echeance, dejaInvesti: LABELS[dejaInvesti] || dejaInvesti };
      case "conciergerie":
        return { ...base, duree: LABELS[duree] || duree, periode: LABELS[periode] || periode, services: services.map((s) => LABELS[s] || s) };
      case "archispace":
        return { ...base, typeBien: LABELS[typeBien] || typeBien, ville, demarrage: LABELS[demarrage] || demarrage, budgetDesign: LABELS[budgetDesign] || budgetDesign };
      default:
        return base;
    }
  };

  const validateStep2 = () => {
    if (selectedDomain === "candidature-sakho" && (!posteSakho || !baseDubaiSakho || !experienceImmo || !niveauExpSakho || !languesSakho || !dispoSakho)) return false;
    if (selectedDomain === "candidature-archispace" && (!posteArchi || !baseDubaiArchi || !experienceVente || !niveauExpArchi || !competenceCle || !languesArchi || !dispoArchi)) return false;
    if (selectedDomain === "partenariat" && (!typePartenariat || !natureActivite)) return false;
    if (selectedDomain === "immobilier" && (!objectif || !typeBienImmo || !budget || !echeance || !dejaInvesti)) return false;
    if (selectedDomain === "conciergerie" && (!duree || !periode || services.length === 0)) return false;
    if (selectedDomain === "archispace" && (!typeBien || !ville.trim() || !demarrage || !budgetDesign)) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) { toast.error("Veuillez remplir tous les champs obligatoires."); return; }
    await submitToGoogleSheets(buildPayload());
    setSubmitted(true);
  };

  const totalSteps = 3;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  if (submitted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/95 to-[#0A0A0A]" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#B8960C]/30 rounded-lg p-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
              <div className="w-20 h-20 rounded-full border-2 border-[#B8960C] bg-[#B8960C]/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#B8960C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-[#F5F0E8] mb-4" style={{ fontFamily: "var(--font-display)" }}>Merci pour votre soumission</h2>
            <p className="text-[#B8960C]/80 text-lg mb-8">Notre équipe vous contactera dans les plus brefs délais.</p>
            <Link href="/"><button className="px-8 py-3 bg-[#B8960C] text-[#0A0A0A] font-semibold rounded hover:bg-[#D4AF37] transition-colors duration-300">Retour à l'accueil</button></Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${HERO_BG})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/95 to-[#0A0A0A]" />
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="py-5 px-6 flex items-center justify-between">
          <Link href="/"><div className="flex items-center gap-3 group"><ArrowLeft className="w-5 h-5 text-[#B8960C] group-hover:-translate-x-1 transition-transform duration-300" /><img src={LOGO_URL} alt="Sakho Properties" className="h-8 invert brightness-200" /></div></Link>
        </header>

        <div className="px-6 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#B8960C]/60">Étape {step + 1} sur {totalSteps}</span>
            <span className="text-sm text-[#B8960C]/60">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-[#B8960C] to-[#D4AF37] rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        <div className="text-center px-4 pt-6 pb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-[#B8960C]/40 bg-[#B8960C]/10 mb-3">
            <LayoutGrid className="w-6 h-6 text-[#B8960C]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#F5F0E8] mb-1" style={{ fontFamily: "var(--font-display)" }}>Formulaire Central</h1>
          <p className="text-[#B8960C]/60 text-sm">Tous les domaines en un seul formulaire</p>
        </div>

        <main className="flex-1 flex items-start justify-center px-4 pb-12">
          <div className="w-full max-w-2xl">
            <div className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#B8960C]/20 rounded-lg p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="step0" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#B8960C] border-b border-[#B8960C]/20 pb-2" style={{ fontFamily: "var(--font-display)" }}>Sélectionnez votre domaine</h3>
                      <div className="space-y-3">
                        {domains.map((domain) => (
                          <label key={domain.id} className={`flex items-center gap-4 px-4 py-4 rounded-lg border cursor-pointer transition-all duration-300 ${selectedDomain === domain.id ? "border-[#B8960C] bg-[#B8960C]/10" : "border-[#B8960C]/15 bg-[#0A0A0A]/40 hover:border-[#B8960C]/40"}`} onClick={() => setSelectedDomain(domain.id)}>
                            <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${selectedDomain === domain.id ? "border-[#B8960C] bg-[#B8960C]/20" : "border-[#B8960C]/30 bg-[#B8960C]/5"}`}><domain.icon className="w-5 h-5 text-[#B8960C]" /></div>
                            <div className="flex-1"><span className="block text-[#F5F0E8] font-medium">{domain.label}</span><span className="block text-xs text-[#F5F0E8]/40">{domain.description}</span></div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${selectedDomain === domain.id ? "border-[#B8960C]" : "border-[#B8960C]/30"}`}>{selectedDomain === domain.id && <div className="w-2.5 h-2.5 rounded-full bg-[#B8960C]" />}</div>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                      <ContactFields data={contact} onChange={(field, value) => setContact((prev) => ({ ...prev, [field]: value }))} />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">

                      {selectedDomain === "candidature-sakho" && (
                        <>
                          <FormSection title="Poste souhaité – Sakho Properties">
                            <FormField label="Pour quel poste souhaitez-vous postuler ?" required><RadioGroup name="posteSakho" value={posteSakho} onChange={setPosteSakho} options={[{ label: "RH", value: "rh" }, { label: "Agent immobilier", value: "agent-immobilier" }, { label: "Directeur d'agence (francophone)", value: "directeur-agence" }]} /></FormField>
                          </FormSection>
                          <FormSection title="Votre profil">
                            <FormField label="Êtes-vous actuellement basé(e) à Dubaï ?" required><RadioGroup name="baseDubaiSakho" value={baseDubaiSakho} onChange={setBaseDubaiSakho} options={[{ label: "Oui", value: "oui" }, { label: "Non", value: "non" }, { label: "Projet d'installation", value: "projet" }]} /></FormField>
                            <FormField label="Disposez-vous d'une expérience en immobilier ou en vente ?" required><RadioGroup name="experienceImmo" value={experienceImmo} onChange={setExperienceImmo} options={[{ label: "Oui", value: "oui" }, { label: "Non", value: "non" }]} /></FormField>
                            <FormField label="Quel est votre niveau d'expérience ?" required><RadioGroup name="niveauExpSakho" value={niveauExpSakho} onChange={setNiveauExpSakho} options={[{ label: "Débutant (0-1 an)", value: "debutant" }, { label: "Intermédiaire (1-3 ans)", value: "intermediaire" }, { label: "Confirmé (3-5 ans)", value: "confirme" }, { label: "Expert (5+ ans)", value: "expert" }]} /></FormField>
                            <FormField label="Quelles langues parlez-vous ?" required><RadioGroup name="languesSakho" value={languesSakho} onChange={setLanguesSakho} options={[{ label: "Français", value: "francais" }, { label: "Anglais", value: "anglais" }, { label: "Arabe", value: "arabe" }, { label: "Français + Anglais", value: "francais-anglais" }, { label: "Trilingue (Français, Anglais, Arabe)", value: "trilingue" }, { label: "Autre", value: "autre" }]} /></FormField>
                          </FormSection>
                          <FormSection title="Disponibilité & Motivation">
                            <FormField label="Quand seriez-vous disponible pour démarrer ?" required><RadioGroup name="dispoSakho" value={dispoSakho} onChange={setDispoSakho} options={[{ label: "Immédiatement", value: "immediatement" }, { label: "1 à 3 mois", value: "1-3-mois" }, { label: "+3 mois", value: "plus-3-mois" }]} /></FormField>
                            <FormField label="Pourquoi souhaitez-vous rejoindre Sakho Properties ?"><TextArea placeholder="Décrivez votre motivation..." value={motivSakho} onChange={setMotivSakho} rows={4} /></FormField>
                          </FormSection>
                        </>
                      )}

                      {selectedDomain === "candidature-archispace" && (
                        <>
                          <FormSection title="Poste souhaité – Archispace">
                            <FormField label="Pour quel poste souhaitez-vous postuler ?" required><RadioGroup name="posteArchi" value={posteArchi} onChange={setPosteArchi} options={[{ label: "Show room manager", value: "show-room-manager" }, { label: "Sales 1", value: "sales-1" }, { label: "Sales 2", value: "sales-2" }, { label: "Sales 3", value: "sales-3" }, { label: "Sales 4", value: "sales-4" }, { label: "Receptionist", value: "receptionist" }, { label: "Coffee boy", value: "coffee-boy" }]} /></FormField>
                          </FormSection>
                          <FormSection title="Votre profil">
                            <FormField label="Êtes-vous actuellement basé(e) à Dubaï ?" required><RadioGroup name="baseDubaiArchi" value={baseDubaiArchi} onChange={setBaseDubaiArchi} options={[{ label: "Oui", value: "oui" }, { label: "Non", value: "non" }, { label: "Projet d'installation", value: "projet" }]} /></FormField>
                            <FormField label="Disposez-vous d'une expérience en vente ou en commerce ?" required><RadioGroup name="experienceVente" value={experienceVente} onChange={setExperienceVente} options={[{ label: "Oui", value: "oui" }, { label: "Non", value: "non" }]} /></FormField>
                            <FormField label="Quel est votre niveau d'expérience ?" required><RadioGroup name="niveauExpArchi" value={niveauExpArchi} onChange={setNiveauExpArchi} options={[{ label: "Débutant (0-1 an)", value: "debutant" }, { label: "Intermédiaire (1-3 ans)", value: "intermediaire" }, { label: "Confirmé (3-5 ans)", value: "confirme" }, { label: "Expert (5+ ans)", value: "expert" }]} /></FormField>
                            <FormField label="Quelle est votre compétence clé ?" required><RadioGroup name="competenceCle" value={competenceCle} onChange={setCompetenceCle} options={[{ label: "Vente directe / Porte-à-porte", value: "vente-directe" }, { label: "Showroom / Retail", value: "showroom-retail" }, { label: "Design d'intérieur", value: "design-interieur" }, { label: "Accueil / Service client", value: "accueil-service" }, { label: "Management d'équipe", value: "management" }, { label: "Aucune expérience spécifique", value: "aucune" }]} /></FormField>
                            <FormField label="Quelles langues parlez-vous ?" required><RadioGroup name="languesArchi" value={languesArchi} onChange={setLanguesArchi} options={[{ label: "Français", value: "francais" }, { label: "Anglais", value: "anglais" }, { label: "Arabe", value: "arabe" }, { label: "Russe", value: "russe" }, { label: "Français + Anglais", value: "francais-anglais" }, { label: "Anglais + Arabe", value: "anglais-arabe" }, { label: "Trilingue ou plus", value: "trilingue-plus" }]} /></FormField>
                          </FormSection>
                          <FormSection title="Disponibilité & Motivation">
                            <FormField label="Quand seriez-vous disponible pour démarrer ?" required><RadioGroup name="dispoArchi" value={dispoArchi} onChange={setDispoArchi} options={[{ label: "Immédiatement", value: "immediatement" }, { label: "1 à 3 mois", value: "1-3-mois" }, { label: "+3 mois", value: "plus-3-mois" }]} /></FormField>
                            <FormField label="Pourquoi souhaitez-vous rejoindre Archispace ?"><TextArea placeholder="Décrivez votre motivation..." value={motivArchi} onChange={setMotivArchi} rows={4} /></FormField>
                          </FormSection>
                        </>
                      )}

                      {selectedDomain === "partenariat" && (
                        <FormSection title="Votre partenariat">
                          <FormField label="Type de partenariat envisagé" required><RadioGroup name="typePartenariat" value={typePartenariat} onChange={setTypePartenariat} options={[{ label: "Immobilier", value: "immobilier" }, { label: "Archispace", value: "archispace" }, { label: "Conciergerie", value: "conciergerie" }]} /></FormField>
                          <FormField label="Quelle est la nature de votre activité ?" required><RadioGroup name="natureActivite" value={natureActivite} onChange={setNatureActivite} options={[{ label: "Apporteur d'affaires", value: "apporteur" }, { label: "Prestataire de services", value: "prestataire" }, { label: "Investisseur", value: "investisseur" }]} /></FormField>
                          <FormField label="Exprimez-nous votre vision"><TextArea placeholder="Décrivez votre vision et vos attentes..." value={vision} onChange={setVision} rows={5} /></FormField>
                        </FormSection>
                      )}

                      {selectedDomain === "immobilier" && (
                        <FormSection title="Votre projet immobilier">
                          <FormField label="Quel est votre objectif immobilier ?" required><RadioGroup name="objectif" value={objectif} onChange={setObjectif} options={[{ label: "Investissement locatif", value: "investissement-locatif" }, { label: "Résidence principale", value: "residence-principale" }]} /></FormField>
                          <FormField label="Quel type de bien recherchez-vous ?" required><RadioGroup name="typeBienImmo" value={typeBienImmo} onChange={setTypeBienImmo} options={[{ label: "Studio", value: "studio" }, { label: "1 bed", value: "1-bed" }, { label: "2 bed", value: "2-bed" }, { label: "3 bed", value: "3-bed" }, { label: "Villa / Maison", value: "villa-maison" }, { label: "Commercial", value: "commercial" }]} /></FormField>
                          <FormField label="Quel est votre budget estimé ?" required><RadioGroup name="budget" value={budget} onChange={setBudget} options={[{ label: "150 000 – 350 000 €", value: "150k-350k" }, { label: "350 000 € – 500 000 €", value: "350k-500k" }, { label: "500 000 € et +", value: "500k-plus" }]} /></FormField>
                          <FormField label="À quelle échéance souhaitez-vous concrétiser votre projet ?" required><RadioGroup name="echeance" value={echeance} onChange={setEcheance} options={[{ label: "Immédiatement", value: "immediatement" }, { label: "1 à 3 mois", value: "1-3-mois" }, { label: "3 à 6 mois", value: "3-6-mois" }, { label: "+6 mois", value: "plus-6-mois" }]} /></FormField>
                          <FormField label="Avez-vous déjà investi dans l'immobilier ?" required><RadioGroup name="dejaInvesti" value={dejaInvesti} onChange={setDejaInvesti} options={[{ label: "Oui", value: "oui" }, { label: "Non", value: "non" }]} /></FormField>
                        </FormSection>
                      )}

                      {selectedDomain === "conciergerie" && (
                        <FormSection title="Votre séjour">
                          <FormField label="Quelle est la durée de votre séjour à Dubaï ?" required><RadioGroup name="duree" value={duree} onChange={setDuree} options={[{ label: "Court séjour (moins de 7 jours)", value: "court" }, { label: "Long séjour (+ de 7 jours)", value: "long" }]} /></FormField>
                          <FormField label="À quelle période souhaitez-vous bénéficier des services ?" required><RadioGroup name="periode" value={periode} onChange={setPeriode} options={[{ label: "Immédiatement", value: "immediatement" }, { label: "Dans les 15 jours", value: "15-jours" }, { label: "Dans plus de 15 jours", value: "plus-15-jours" }]} /></FormField>
                          <FormField label="Quel type de services recherchez-vous principalement ?" required><CheckboxGroup options={[{ label: "Logement", value: "logement" }, { label: "Véhicule", value: "vehicule" }, { label: "Activité", value: "activite" }]} values={services} onChange={setServices} /></FormField>
                        </FormSection>
                      )}

                      {selectedDomain === "archispace" && (
                        <FormSection title="Votre projet d'aménagement">
                          <FormField label="Quel type de bien est concerné ?" required><RadioGroup name="typeBien" value={typeBien} onChange={setTypeBien} options={[{ label: "Appartement", value: "appartement" }, { label: "Villa", value: "villa" }, { label: "Local commercial", value: "local-commercial" }]} /></FormField>
                          <FormField label="Dans quelle ville se situe votre logement ?" required><TextInput placeholder="Ex : Dubaï, Paris, Londres..." value={ville} onChange={setVille} required /></FormField>
                          <FormField label="Quand souhaitez-vous démarrer l'aménagement ?" required><RadioGroup name="demarrage" value={demarrage} onChange={setDemarrage} options={[{ label: "Immédiatement", value: "immediatement" }, { label: "1 à 3 mois", value: "1-3-mois" }, { label: "3 mois et plus", value: "3-mois-plus" }]} /></FormField>
                          <FormField label="Quel est votre budget estimé pour le design / aménagement ?" required><RadioGroup name="budgetDesign" value={budgetDesign} onChange={setBudgetDesign} options={[{ label: "20 000 € – 50 000 €", value: "20k-50k" }, { label: "+50 000 €", value: "50k-plus" }]} /></FormField>
                        </FormSection>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#B8960C]/10">
                  {step > 0 ? (
                    <button type="button" onClick={handleBack} className="flex items-center gap-2 px-6 py-3 text-[#B8960C] border border-[#B8960C]/30 rounded hover:bg-[#B8960C]/10 transition-all duration-300"><ArrowLeft className="w-4 h-4" />Précédent</button>
                  ) : <div />}
                  {step < 2 ? (
                    <button type="button" onClick={handleNext} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B8960C] to-[#D4AF37] text-[#0A0A0A] font-semibold rounded hover:from-[#D4AF37] hover:to-[#B8960C] transition-all duration-300">Suivant<ArrowRight className="w-4 h-4" /></button>
                  ) : (
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#B8960C] to-[#D4AF37] text-[#0A0A0A] font-bold rounded hover:from-[#D4AF37] hover:to-[#B8960C] transition-all duration-300 shadow-lg shadow-[#B8960C]/20" style={{ fontFamily: "var(--font-display)" }}>Envoyer</motion.button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-sm text-[#B8960C]/30">&copy; {new Date().getFullYear()} Sakho Properties. Tous droits réservés.</footer>
      </div>
    </div>
  );
}
