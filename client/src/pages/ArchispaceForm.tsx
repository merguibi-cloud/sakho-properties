/**
 * ArchispaceForm – Formulaire Archispace (design d'intérieur).
 * Design: Dubai Noir Opulence. Envoie les données vers Google Sheets.
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
  TextInput,
  SubmitButton,
} from "@/components/FormLayout";

const INTERIOR_BG = "https://private-us-east-1.manuscdn.com/sessionFile/DygVo6WBqHSArQIDndnU9n/sandbox/cMuJsP4v14dzXHln2wtUFX-img-4_1771277929000_na1fn_c2FraG8taW50ZXJpb3ItbHV4dXJ5.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRHlnVm82V0JxSFNBclFJRG5kblU5bi9zYW5kYm94L2NNdUpzUDR2MTRkelhIbG4yd3RVRlgtaW1nLTRfMTc3MTI3NzkyOTAwMF9uYTFmbl9jMkZyYUc4dGFXNTBaWEpwYjNJdGJIVjRkWEo1LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=IKSu6F0j9SwyQqWft3EerueO96oQP8KzynfN-r9vBV4O7A48-GwyKGvXv0TceI~hhmgLVx6jmc0XH1rtkwwxsY5bZDlFU-N6mddX-EGBQuYIiXWtkeqWAprYH834M1HLtWG6BLivupA~0~EJB4nIUR51RbCy0mhxQ2csCegSWQHRkb-ty0wQtP1dRSz7lpbUtjcB-yhVGFYnoZR~MULt~U6o95Eb1d3lbgI-T3lD6o6UEUy-IGfD8kAWcjeiDxxmrYd-EfA0dE~pUO1UEtIACletKFP2FIkzh1MGaOe-4uzbDFIZ3N9C2dq7MX621Sl76BWU0YuO42ybIj3Y1iDkzg__";

const LABELS: Record<string, string> = {
  "appartement": "Appartement",
  "villa": "Villa",
  "local-commercial": "Local commercial",
  "immediatement": "Immédiatement",
  "1-3-mois": "1 à 3 mois",
  "3-mois-plus": "3 mois et plus",
  "20k-50k": "20 000 € – 50 000 €",
  "50k-plus": "+50 000 €",
};

export default function ArchispaceForm() {
  const [contact, setContact] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [typeBien, setTypeBien] = useState("");
  const [ville, setVille] = useState("");
  const [demarrage, setDemarrage] = useState("");
  const [budgetDesign, setBudgetDesign] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeBien) { toast.error("Veuillez sélectionner le type de bien."); return; }
    if (!ville.trim()) { toast.error("Veuillez indiquer la ville."); return; }
    if (!demarrage) { toast.error("Veuillez indiquer quand vous souhaitez démarrer."); return; }
    if (!budgetDesign) { toast.error("Veuillez indiquer votre budget estimé."); return; }

    await submitToGoogleSheets({
      domain: "archispace",
      nom: contact.nom,
      prenom: contact.prenom,
      email: contact.email,
      telephone: contact.telephone,
      typeBien: LABELS[typeBien] || typeBien,
      ville: ville,
      demarrage: LABELS[demarrage] || demarrage,
      budgetDesign: LABELS[budgetDesign] || budgetDesign,
    });

    setSubmitted(true);
  };

  return (
    <FormLayout
      title="Archispace"
      subtitle="Design d'intérieur d'exception"
      icon={<Gem className="w-7 h-7 text-[#B8960C]" />}
      backgroundImage={INTERIOR_BG}
      onSubmit={handleSubmit}
      isSubmitted={submitted}
    >
      <ContactFields
        data={contact}
        onChange={(field, value) => setContact((prev) => ({ ...prev, [field]: value }))}
      />

      <FormSection title="Votre projet d'aménagement">
        <FormField label="Quel type de bien est concerné ?" required>
          <RadioGroup
            name="typeBien"
            value={typeBien}
            onChange={setTypeBien}
            options={[
              { label: "Appartement", value: "appartement" },
              { label: "Villa", value: "villa" },
              { label: "Local commercial", value: "local-commercial" },
            ]}
          />
        </FormField>

        <FormField label="Dans quelle ville se situe votre logement ?" required>
          <TextInput
            placeholder="Ex : Dubaï, Paris, Londres..."
            value={ville}
            onChange={setVille}
            required
          />
        </FormField>

        <FormField label="Quand souhaitez-vous démarrer l'aménagement ?" required>
          <RadioGroup
            name="demarrage"
            value={demarrage}
            onChange={setDemarrage}
            options={[
              { label: "Immédiatement", value: "immediatement" },
              { label: "1 à 3 mois", value: "1-3-mois" },
              { label: "3 mois et plus", value: "3-mois-plus" },
            ]}
          />
        </FormField>

        <FormField label="Quel est votre budget estimé pour le design / aménagement ?" required>
          <RadioGroup
            name="budgetDesign"
            value={budgetDesign}
            onChange={setBudgetDesign}
            options={[
              { label: "20 000 € – 50 000 €", value: "20k-50k" },
              { label: "+50 000 €", value: "50k-plus" },
            ]}
          />
        </FormField>
      </FormSection>

      <SubmitButton label="Demander un devis" />
    </FormLayout>
  );
}
