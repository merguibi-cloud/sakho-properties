/**
 * CandidatureArchispaceForm – Formulaire de candidature Archispace.
 * Design: Dubai Noir Opulence. Même structure que CandidatureSakhoForm.
 * Postes: Show room Manager, Sales, Receptionist, Coffee boy, Autre.
 */
import { useState } from "react";
import { Gem } from "lucide-react";
import { toast } from "sonner";
import { submitToGoogleSheets } from "@/hooks/useGoogleSheets";
import FormLayout, {
  ContactFields,
  FormSection,
  FormField,
  RadioGroup,
  TextArea,
  TextInput,
  SubmitButton,
} from "@/components/FormLayout";

const INTERIOR_BG = "https://private-us-east-1.manuscdn.com/sessionFile/DygVo6WBqHSArQIDndnU9n/sandbox/cMuJsP4v14dzXHln2wtUFX-img-4_1771277929000_na1fn_c2FraG4taW50ZXJpb3ItbHV4dXJ5.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRHlnVm82V0JxSFNBclFJRG5kblU5bi9zYW5kYm94L2NNdUpzUDR2MTRkelhIbG4yd3RVRlgtaW1nLTRfMTc3MTI3NzkyOTAwMF9uYTFmbl9jMkZyYUc4dGFXNTBaWEpwYjNJdGJIVjRkWEo1LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=IKSu6F0j9SwyQqWft3EerueO96oQP8KzynfN-r9vBV4O7A48-GwyKGvXv0TceI~hhmgLVx6jmc0XH1rtkwwxsY5bZDlFU-N6mddX-EGBQuYIiXWtkeqWAprYH834M1HLtWG6BLivupA~0~EJB4nIUR51RbCy0mhxQ2csCegSWQHRkb-ty0wQtP1dRSz7lpbUtjcB-yhVGFYnoZR~MULt~U6o95Eb1d3lbgI-T3lD6o6UEUy-IGfD8kAWcjeiDxxmrYd-EfA0dE~pUO1UEtIACletKFP2FIkzh1MGaOe-4uzbDFIZ3N9C2dq7MX621Sl76BWU0YuO42ybIj3Y1iDkzg__";

const LABELS: Record<string, string> = {
  "show-room-manager": "Show room Manager",
  "sales": "Sales",
  "receptionist": "Receptionist",
  "coffee-boy": "Coffee boy",
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
  "anglais": "Anglais",
  "francais": "Français",
  "arabe": "Arabe",
  "russe": "Russe",
  "francais-anglais": "Français + Anglais",
  "anglais-arabe": "Anglais + Arabe",
  "trilingue-plus": "Trilingue ou plus",
};

export default function CandidatureArchispaceForm() {
  const [contact, setContact] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [poste, setPoste] = useState("");
  const [posteAutre, setPosteAutre] = useState("");
  const [baseDubai, setBaseDubai] = useState("");
  const [experienceVente, setExperienceVente] = useState("");
  const [niveauExperience, setNiveauExperience] = useState("");
  const [langues, setLangues] = useState("");
  const [disponibilite, setDisponibilite] = useState("");
  const [motivation, setMotivation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poste) { toast.error("Veuillez sélectionner un poste souhaité."); return; }
    if (poste === "autre" && !posteAutre.trim()) { toast.error("Veuillez préciser le poste souhaité."); return; }
    if (!baseDubai) { toast.error("Veuillez indiquer si vous êtes basé(e) à Dubaï."); return; }
    if (!experienceVente) { toast.error("Veuillez indiquer votre expérience en vente."); return; }
    if (!niveauExperience) { toast.error("Veuillez indiquer votre niveau d'expérience."); return; }
    if (!langues) { toast.error("Veuillez indiquer les langues parlées."); return; }
    if (!disponibilite) { toast.error("Veuillez indiquer votre disponibilité."); return; }

    const posteLabel = poste === "autre" ? `Autre : ${posteAutre}` : (LABELS[poste] || poste);

    await submitToGoogleSheets({
      domain: "candidature-archispace",
      nom: contact.nom,
      prenom: contact.prenom,
      email: contact.email,
      telephone: contact.telephone,
      poste: posteLabel,
      baseDubai: LABELS[baseDubai] || baseDubai,
      experienceVente: LABELS[experienceVente] || experienceVente,
      niveauExperience: LABELS[niveauExperience] || niveauExperience,
      langues: LABELS[langues] || langues,
      disponibilite: LABELS[disponibilite] || disponibilite,
      motivation,
    });

    setSubmitted(true);
  };

  return (
    <FormLayout
      title="Candidature – Archispace"
      subtitle="Rejoignez l'univers du design d'intérieur"
      icon={<Gem className="w-7 h-7 text-[#B8960C]" />}
      backgroundImage={INTERIOR_BG}
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
              { label: "Show room Manager", value: "show-room-manager" },
              { label: "Sales", value: "sales" },
              { label: "Receptionist", value: "receptionist" },
              { label: "Coffee boy", value: "coffee-boy" },
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

        <FormField label="Disposez-vous d'une expérience en vente ou en commerce ?" required>
          <RadioGroup
            name="experienceVente"
            value={experienceVente}
            onChange={setExperienceVente}
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
              { label: "Russe", value: "russe" },
              { label: "Français + Anglais", value: "francais-anglais" },
              { label: "Anglais + Arabe", value: "anglais-arabe" },
              { label: "Trilingue ou plus", value: "trilingue-plus" },
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

        <FormField label="Pourquoi souhaitez-vous rejoindre Archispace ?">
          <TextArea
            placeholder="Décrivez votre motivation, votre parcours et ce que vous pouvez apporter à l'équipe..."
            value={motivation}
            onChange={setMotivation}
            rows={5}
          />
        </FormField>
      </FormSection>

      <SubmitButton label="Envoyer ma candidature" />
    </FormLayout>
  );
}
