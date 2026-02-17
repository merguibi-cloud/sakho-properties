/**
 * PartenariatForm – Formulaire de partenariat Sakho Properties.
 * Design: Dubai Noir Opulence. Envoie les données vers Google Sheets.
 */
import { useState } from "react";
import { Handshake } from "lucide-react";
import { toast } from "sonner";
import { submitToGoogleSheets, validateContact } from "@/hooks/useGoogleSheets";
import FormLayout, {
  ContactFields,
  FormSection,
  FormField,
  RadioGroup,
  TextArea,
  SubmitButton,
} from "@/components/FormLayout";

const DUBAI_SKYLINE = "https://private-us-east-1.manuscdn.com/sessionFile/DygVo6WBqHSArQIDndnU9n/sandbox/cMuJsP4v14dzXHln2wtUFX-img-3_1771277933000_na1fn_c2FraG8tZHViYWktc2t5bGluZQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRHlnVm82V0JxSFNBclFJRG5kblU5bi9zYW5kYm94L2NNdUpzUDR2MTRkelhIbG4yd3RVRlgtaW1nLTNfMTc3MTI3NzkzMzAwMF9uYTFmbl9jMkZyYUc4dFpIVmlZV2t0YzJ0NWJHbHVaUS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=NA4~-qhVECWvIChsKMlWOBRtnmnNkREd43Y6IUHzSgPx5Gah3zVxwJyONwfvgtWclsGlnxqcvmV4b-n~aFYAFNtYlZeheDTMsiDa8Lc0BnNduIDAjSg370l6fY1hC4uvCGtGSmPaso3II3X9LwNZHPUdy13a6KCGMJR8YkF-QXuwZ05671faG~F525ncDe0ebE1RJBEl86ohOtEdJuHEdf0Y0IrTHoCcjm0Yl9~NvSZ3-EI71VDE00DsOSwB4kDfbU0WzGefkU6uC8X8Uf~Ny1XlkV51IEnosOOCwywtP-U3rydocYsAvJyUXBtm6ro~z38eo2yC9y3NrSn0n1zXTQ__";

const LABELS: Record<string, string> = {
  "immobilier": "Immobilier",
  "archispace": "Archispace",
  "conciergerie": "Conciergerie",
  "apporteur": "Apporteur d'affaires",
  "prestataire": "Prestataire de services",
  "investisseur": "Investisseur",
};

export default function PartenariatForm() {
  const [contact, setContact] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [typePartenariat, setTypePartenariat] = useState("");
  const [natureActivite, setNatureActivite] = useState("");
  const [vision, setVision] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const contactError = validateContact(contact);
    if (contactError) { toast.error(contactError); return; }
    if (!typePartenariat) { toast.error("Veuillez sélectionner un type de partenariat."); return; }
    if (!natureActivite) { toast.error("Veuillez indiquer la nature de votre activité."); return; }

    setIsLoading(true);
    const result = await submitToGoogleSheets({
      domain: "partenariat",
      nom: contact.nom,
      prenom: contact.prenom,
      email: contact.email,
      telephone: contact.telephone,
      typePartenariat: LABELS[typePartenariat] || typePartenariat,
      natureActivite: LABELS[natureActivite] || natureActivite,
      vision: vision,
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
      title="Partenariat"
      subtitle="Construisons ensemble l'avenir"
      icon={<Handshake className="w-7 h-7 text-[#B8960C]" />}
      backgroundImage={DUBAI_SKYLINE}
      onSubmit={handleSubmit}
      isSubmitted={submitted}
    >
      <ContactFields
        data={contact}
        onChange={(field, value) => setContact((prev) => ({ ...prev, [field]: value }))}
      />

      <FormSection title="Votre partenariat">
        <FormField label="Type de partenariat envisagé" required>
          <RadioGroup
            name="typePartenariat"
            value={typePartenariat}
            onChange={setTypePartenariat}
            options={[
              { label: "Immobilier", value: "immobilier" },
              { label: "Archispace", value: "archispace" },
              { label: "Conciergerie", value: "conciergerie" },
            ]}
          />
        </FormField>

        <FormField label="Quelle est la nature de votre activité ?" required>
          <RadioGroup
            name="natureActivite"
            value={natureActivite}
            onChange={setNatureActivite}
            options={[
              { label: "Apporteur d'affaires", value: "apporteur" },
              { label: "Prestataire de services", value: "prestataire" },
              { label: "Investisseur", value: "investisseur" },
            ]}
          />
        </FormField>

        <FormField label="Exprimez-nous votre vision">
          <TextArea
            placeholder="Décrivez votre vision et vos attentes pour ce partenariat..."
            value={vision}
            onChange={setVision}
            rows={5}
          />
        </FormField>
      </FormSection>

      <SubmitButton label="Proposer un partenariat" isLoading={isLoading} />
    </FormLayout>
  );
}
