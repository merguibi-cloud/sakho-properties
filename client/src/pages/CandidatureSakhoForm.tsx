/**
 * CandidatureSakhoForm – Formulaire de candidature Sakho Properties.
 * Design: Dubai Noir Opulence. Postes immobilier avec questions détaillées.
 * Option "Autre" avec champ texte libre pour le poste.
 */
import { useState } from "react";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { submitToGoogleSheets, validateContact } from "@/hooks/useGoogleSheets";
import FormLayout, {
  ContactFields,
  FormSection,
  FormField,
  RadioGroup,
  TextArea,
  TextInput,
  SubmitButton,
} from "@/components/FormLayout";

const FORM_BG = "https://private-us-east-1.manuscdn.com/sessionFile/DygVo6WBqHSArQIDndnU9n/sandbox/cMuJsP4v14dzXHln2wtUFX-img-2_1771277926000_na1fn_c2FraG8tZm9ybS1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRHlnVm82V0JxSFNBclFJRG5kblU5bi9zYW5kYm94L2NNdUpzUDR2MTRkelhIbG4yd3RVRlgtaW1nLTJfMTc3MTI3NzkyNjAwMF9uYTFmbl9jMkZyYUc4dFptOXliUzFpWncuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=heDQYWeLDOxT4NnXkJjbvznG99e1j94Ul0RA~SIVzBjOh4h3HyAigxsFGNEGxPoWKdNdiTsTWci5J0PvHkpyNayjCAA6r4b5W1goW8xFOs9REpjLIcO~yXnmOtpJ0nn5pQY0q54m88LWTE9wiqJYqRua7iN0OinYJHxesQBVqJxLeM7qZyM2CTiuNKnq-qNPS2Ew-JCUWI2UOKFACWpNhauomUMOINK0TgrNeIzs7CNILqs97ypOb1jOmNjQCXxqqftZyAZ3cqjyzmODPhZUrfT68gxkvdfVf3TR5VgN1B6mGqLIGgrviwO70N-wXjgs8IG60KL1qMc65TnH10MaMQ__";

const LABELS: Record<string, string> = {
  "rh": "RH",
  "agent-immobilier": "Agent immobilier",
  "directeur-agence": "Directeur d'agence (francophone)",
  "autre": "Autre",
  "oui": "Oui",
  "non": "Non",
  "projet": "Projet d'installation",
  "immediatement": "Immédiatement",
  "1-3-mois": "1 à 3 mois",
  "plus-3-mois": "+3 mois",
  "debutant": "Débutant (0-1 an)",
  "intermediaire": "Intermédiaire (1-3 ans)",
  "confirme": "Confirmé (3-5 ans)",
  "expert": "Expert (5+ ans)",
  "francais": "Français",
  "anglais": "Anglais",
  "arabe": "Arabe",
  "francais-anglais": "Français + Anglais",
  "trilingue": "Trilingue (Français, Anglais, Arabe)",
};

export default function CandidatureSakhoForm() {
  const [contact, setContact] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [poste, setPoste] = useState("");
  const [posteAutre, setPosteAutre] = useState("");
  const [baseDubai, setBaseDubai] = useState("");
  const [experienceImmo, setExperienceImmo] = useState("");
  const [niveauExperience, setNiveauExperience] = useState("");
  const [langues, setLangues] = useState("");
  const [disponibilite, setDisponibilite] = useState("");
  const [motivation, setMotivation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const contactError = validateContact(contact);
    if (contactError) { toast.error(contactError); return; }
    if (!poste) { toast.error("Veuillez sélectionner un poste souhaité."); return; }
    if (poste === "autre" && !posteAutre.trim()) { toast.error("Veuillez préciser le poste souhaité."); return; }
    if (!baseDubai) { toast.error("Veuillez indiquer si vous êtes basé(e) à Dubaï."); return; }
    if (!experienceImmo) { toast.error("Veuillez indiquer votre expérience en immobilier."); return; }
    if (!niveauExperience) { toast.error("Veuillez indiquer votre niveau d'expérience."); return; }
    if (!langues) { toast.error("Veuillez indiquer les langues parlées."); return; }
    if (!disponibilite) { toast.error("Veuillez indiquer votre disponibilité."); return; }

    const posteLabel = poste === "autre" ? `Autre : ${posteAutre}` : (LABELS[poste] || poste);

    setIsLoading(true);
    const result = await submitToGoogleSheets({
      domain: "candidature-sakho",
      nom: contact.nom,
      prenom: contact.prenom,
      email: contact.email,
      telephone: contact.telephone,
      poste: posteLabel,
      baseDubai: LABELS[baseDubai] || baseDubai,
      experienceImmo: LABELS[experienceImmo] || experienceImmo,
      niveauExperience: LABELS[niveauExperience] || niveauExperience,
      langues: LABELS[langues] || langues,
      disponibilite: LABELS[disponibilite] || disponibilite,
      motivation,
    });
    setIsLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <FormLayout
      title="Candidature – Sakho Properties"
      subtitle="Rejoignez l'équipe immobilière d'excellence"
      icon={<Building2 className="w-7 h-7 text-[#B8960C]" />}
      backgroundImage={FORM_BG}
      onSubmit={handleSubmit}
      isSubmitted={submitted}
    >
      <ContactFields
        data={contact}
        onChange={(field, value) => setContact((prev) => ({ ...prev, [field]: value }))}
      />

      <FormSection title="Poste souhaité">
        <FormField label="Pour quel poste souhaitez-vous postuler ?" required>
          <RadioGroup
            name="poste"
            value={poste}
            onChange={(val) => { setPoste(val); if (val !== "autre") setPosteAutre(""); }}
            options={[
              { label: "RH", value: "rh" },
              { label: "Agent immobilier", value: "agent-immobilier" },
              { label: "Directeur d'agence (francophone)", value: "directeur-agence" },
              { label: "Autre", value: "autre" },
            ]}
          />
          {poste === "autre" && (
            <div className="mt-3 ml-8">
              <TextInput
                placeholder="Précisez le poste souhaité..."
                value={posteAutre}
                onChange={setPosteAutre}
                required
              />
            </div>
          )}
        </FormField>
      </FormSection>

      <FormSection title="Votre profil">
        <FormField label="Êtes-vous actuellement basé(e) à Dubaï ?" required>
          <RadioGroup
            name="baseDubai"
            value={baseDubai}
            onChange={setBaseDubai}
            options={[
              { label: "Oui", value: "oui" },
              { label: "Non", value: "non" },
              { label: "Projet d'installation", value: "projet" },
            ]}
          />
        </FormField>

        <FormField label="Disposez-vous d'une expérience en immobilier ou en vente ?" required>
          <RadioGroup
            name="experienceImmo"
            value={experienceImmo}
            onChange={setExperienceImmo}
            options={[
              { label: "Oui", value: "oui" },
              { label: "Non", value: "non" },
            ]}
          />
        </FormField>

        <FormField label="Quel est votre niveau d'expérience ?" required>
          <RadioGroup
            name="niveauExperience"
            value={niveauExperience}
            onChange={setNiveauExperience}
            options={[
              { label: "Débutant (0-1 an)", value: "debutant" },
              { label: "Intermédiaire (1-3 ans)", value: "intermediaire" },
              { label: "Confirmé (3-5 ans)", value: "confirme" },
              { label: "Expert (5+ ans)", value: "expert" },
            ]}
          />
        </FormField>

        <FormField label="Quelles langues parlez-vous ?" required>
          <RadioGroup
            name="langues"
            value={langues}
            onChange={setLangues}
            options={[
              { label: "Français", value: "francais" },
              { label: "Anglais", value: "anglais" },
              { label: "Arabe", value: "arabe" },
              { label: "Français + Anglais", value: "francais-anglais" },
              { label: "Trilingue (Français, Anglais, Arabe)", value: "trilingue" },
              { label: "Autre", value: "autre" },
            ]}
          />
        </FormField>
      </FormSection>

      <FormSection title="Disponibilité & Motivation">
        <FormField label="Quand seriez-vous disponible pour démarrer ?" required>
          <RadioGroup
            name="disponibilite"
            value={disponibilite}
            onChange={setDisponibilite}
            options={[
              { label: "Immédiatement", value: "immediatement" },
              { label: "1 à 3 mois", value: "1-3-mois" },
              { label: "+3 mois", value: "plus-3-mois" },
            ]}
          />
        </FormField>

        <FormField label="Pourquoi souhaitez-vous rejoindre Sakho Properties ?">
          <TextArea
            placeholder="Décrivez votre motivation, votre parcours et ce que vous pouvez apporter à l'équipe..."
            value={motivation}
            onChange={setMotivation}
            rows={5}
          />
        </FormField>
      </FormSection>

      <SubmitButton label="Envoyer ma candidature" isLoading={isLoading} />
    </FormLayout>
  );
}
