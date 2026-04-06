import { useState } from "react";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { submitToGoogleSheets, validateContact } from "@/hooks/useGoogleSheets";
import FormLayout, {
  ContactFields,
  FormSection,
  FormField,
  RadioGroup,
  SubmitButton,
} from "@/components/FormLayout";

const LABELS: Record<string, string> = {
  "investissement-locatif": "Investissement locatif",
  "residence-principale": "Résidence principale",
  "appartement": "Appartement",
  "villa": "Villa",
  "terrain": "Terrain",
  "80k-150k": "80 000 € – 150 000 €",
  "150k-250k": "150 000 € – 250 000 €",
  "250k-400k": "250 000 € – 400 000 €",
  "400k-plus": "400 000 € +",
  "oui": "Oui",
  "non": "Non",
};

export default function ImmobilierMarocForm() {
  const [contact, setContact] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [objectif, setObjectif] = useState("");
  const [ville, setVille] = useState("");
  const [typeBien, setTypeBien] = useState("");
  const [budget, setBudget] = useState("");
  const [dejaInvesti, setDejaInvesti] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const contactError = validateContact(contact);
    if (contactError) { toast.error(contactError); return; }
    if (!objectif) { toast.error("Veuillez sélectionner votre objectif immobilier."); return; }
    if (!ville.trim()) { toast.error("Veuillez indiquer votre ville."); return; }
    if (!typeBien) { toast.error("Veuillez sélectionner le type de bien."); return; }
    if (!budget) { toast.error("Veuillez indiquer votre budget."); return; }
    if (!dejaInvesti) { toast.error("Veuillez indiquer si vous avez déjà investi."); return; }

    setIsLoading(true);
    const result = await submitToGoogleSheets({
      domain: "immobilier-maroc",
      nom: contact.nom,
      prenom: contact.prenom,
      email: contact.email,
      telephone: contact.telephone,
      objectif: LABELS[objectif] || objectif,
      ville: ville.trim(),
      typeBien: LABELS[typeBien] || typeBien,
      budget: LABELS[budget] || budget,
      dejaInvesti: LABELS[dejaInvesti] || dejaInvesti,
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
      title="Immobilier Maroc"
      subtitle="Investissez dans l'immobilier au Maroc"
      icon={<Building2 className="w-7 h-7 text-[#B8960C]" />}
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

        <FormField label="Depuis quelle ville nous contactez-vous ?" required>
          <input
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Ex: Casablanca, Marrakech, Rabat..."
            className="w-full px-4 py-3 bg-[#0A0A0A]/60 border border-[#B8960C]/20 rounded text-[#F5F0E8] placeholder-[#F5F0E8]/30 focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C]/50 focus:outline-none transition-all duration-300"
          />
        </FormField>

        <FormField label="Quel type de bien recherchez-vous ?" required>
          <RadioGroup
            name="typeBien"
            value={typeBien}
            onChange={setTypeBien}
            options={[
              { label: "Appartement", value: "appartement" },
              { label: "Villa", value: "villa" },
              { label: "Terrain", value: "terrain" },
            ]}
          />
        </FormField>

        <FormField label="Quelle est votre tranche de budget ?" required>
          <RadioGroup
            name="budget"
            value={budget}
            onChange={setBudget}
            options={[
              { label: "80 000 € – 150 000 €", value: "80k-150k" },
              { label: "150 000 € – 250 000 €", value: "150k-250k" },
              { label: "250 000 € – 400 000 €", value: "250k-400k" },
              { label: "400 000 € +", value: "400k-plus" },
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

      <SubmitButton label="Envoyer ma demande" isLoading={isLoading} />
    </FormLayout>
  );
}
