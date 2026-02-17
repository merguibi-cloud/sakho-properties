/**
 * ImmobilierForm – Formulaire immobilier Sakho Properties.
 * Design: Dubai Noir Opulence. Envoie les données vers Google Sheets.
 * Inclut le type de bien (Studio, 1 bed, 2 bed, 3 bed, Villa/maison, Commercial).
 */
import { useState } from "react";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { submitToGoogleSheets } from "@/hooks/useGoogleSheets";
import FormLayout, {
  ContactFields,
  FormSection,
  FormField,
  RadioGroup,
  SubmitButton,
} from "@/components/FormLayout";

const DUBAI_SKYLINE = "https://private-us-east-1.manuscdn.com/sessionFile/DygVo6WBqHSArQIDndnU9n/sandbox/cMuJsP4v14dzXHln2wtUFX-img-3_1771277933000_na1fn_c2FraG8tZHViYWktc2t5bGluZQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRHlnVm82V0JxSFNBclFJRG5kblU5bi9zYW5kYm94L2NNdUpzUDR2MTRkelhIbG4yd3RVRlgtaW1nLTNfMTc3MTI3NzkzMzAwMF9uYTFmbl9jMkZyYUc4dFpIVmlZV2t0YzJ0NWJHbHVaUS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=NA4~-qhVECWvIChsKMlWOBRtnmnNkREd43Y6IUHzSgPx5Gah3zVxwJyONwfvgtWclsGlnxqcvmV4b-n~aFYAFNtYlZeheDTMsiDa8Lc0BnNduIDAjSg370l6fY1hC4uvCGtGSmPaso3II3X9LwNZHPUdy13a6KCGMJR8YkF-QXuwZ05671faG~F525ncDe0ebE1RJBEl86ohOtEdJuHEdf0Y0IrTHoCcjm0Yl9~NvSZ3-EI71VDE00DsOSwB4kDfbU0WzGefkU6uC8X8Uf~Ny1XlkV51IEnosOOCwywtP-U3rydocYsAvJyUXBtm6ro~z38eo2yC9y3NrSn0n1zXTQ__";

const LABELS: Record<string, string> = {
  "investissement-locatif": "Investissement locatif",
  "residence-principale": "Résidence principale",
  "studio": "Studio",
  "1-bed": "1 bed",
  "2-bed": "2 bed",
  "3-bed": "3 bed",
  "villa-maison": "Villa / Maison",
  "commercial": "Commercial",
  "150k-350k": "150 000 – 350 000 €",
  "350k-500k": "350 000 € – 500 000 €",
  "500k-plus": "500 000 € et +",
  "immediatement": "Immédiatement",
  "1-3-mois": "1 à 3 mois",
  "3-6-mois": "3 à 6 mois",
  "plus-6-mois": "+6 mois",
  "oui": "Oui",
  "non": "Non",
};

export default function ImmobilierForm() {
  const [contact, setContact] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [objectif, setObjectif] = useState("");
  const [typeBien, setTypeBien] = useState("");
  const [budget, setBudget] = useState("");
  const [echeance, setEcheance] = useState("");
  const [dejaInvesti, setDejaInvesti] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objectif) { toast.error("Veuillez sélectionner votre objectif immobilier."); return; }
    if (!typeBien) { toast.error("Veuillez sélectionner le type de bien."); return; }
    if (!budget) { toast.error("Veuillez indiquer votre budget estimé."); return; }
    if (!echeance) { toast.error("Veuillez indiquer votre échéance."); return; }
    if (!dejaInvesti) { toast.error("Veuillez indiquer si vous avez déjà investi."); return; }

    await submitToGoogleSheets({
      domain: "immobilier",
      nom: contact.nom,
      prenom: contact.prenom,
      email: contact.email,
      telephone: contact.telephone,
      objectif: LABELS[objectif] || objectif,
      typeBien: LABELS[typeBien] || typeBien,
      budget: LABELS[budget] || budget,
      echeance: LABELS[echeance] || echeance,
      dejaInvesti: LABELS[dejaInvesti] || dejaInvesti,
    });

    setSubmitted(true);
  };

  return (
    <FormLayout
      title="Immobilier"
      subtitle="Investissez dans le prestige à Dubaï"
      icon={<Building2 className="w-7 h-7 text-[#B8960C]" />}
      backgroundImage={DUBAI_SKYLINE}
      onSubmit={handleSubmit}
      isSubmitted={submitted}
    >
      <ContactFields
        data={contact}
        onChange={(field, value) => setContact((prev) => ({ ...prev, [field]: value }))}
      />

      <FormSection title="Votre projet immobilier">
        <FormField label="Quel est votre objectif immobilier ?" required>
          <RadioGroup
            name="objectif"
            value={objectif}
            onChange={setObjectif}
            options={[
              { label: "Investissement locatif", value: "investissement-locatif" },
              { label: "Résidence principale", value: "residence-principale" },
            ]}
          />
        </FormField>

        <FormField label="Quel type de bien recherchez-vous ?" required>
          <RadioGroup
            name="typeBien"
            value={typeBien}
            onChange={setTypeBien}
            options={[
              { label: "Studio", value: "studio" },
              { label: "1 bed", value: "1-bed" },
              { label: "2 bed", value: "2-bed" },
              { label: "3 bed", value: "3-bed" },
              { label: "Villa / Maison", value: "villa-maison" },
              { label: "Commercial", value: "commercial" },
            ]}
          />
        </FormField>

        <FormField label="Quel est votre budget estimé ?" required>
          <RadioGroup
            name="budget"
            value={budget}
            onChange={setBudget}
            options={[
              { label: "150 000 – 350 000 €", value: "150k-350k" },
              { label: "350 000 € – 500 000 €", value: "350k-500k" },
              { label: "500 000 € et +", value: "500k-plus" },
            ]}
          />
        </FormField>

        <FormField label="À quelle échéance souhaitez-vous concrétiser votre projet ?" required>
          <RadioGroup
            name="echeance"
            value={echeance}
            onChange={setEcheance}
            options={[
              { label: "Immédiatement", value: "immediatement" },
              { label: "1 à 3 mois", value: "1-3-mois" },
              { label: "3 à 6 mois", value: "3-6-mois" },
              { label: "+6 mois", value: "plus-6-mois" },
            ]}
          />
        </FormField>

        <FormField label="Avez-vous déjà investi dans l'immobilier ?" required>
          <RadioGroup
            name="dejaInvesti"
            value={dejaInvesti}
            onChange={setDejaInvesti}
            options={[
              { label: "Oui", value: "oui" },
              { label: "Non", value: "non" },
            ]}
          />
        </FormField>
      </FormSection>

      <SubmitButton label="Envoyer ma demande" />
    </FormLayout>
  );
}
