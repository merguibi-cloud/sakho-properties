/**
 * ConciergerieForm – Formulaire de conciergerie Sakho Properties.
 * Design: Dubai Noir Opulence. Envoie les données vers Google Sheets.
 */
import { useState } from "react";
import { ConciergeBell } from "lucide-react";
import { toast } from "sonner";
import { submitToGoogleSheets, validateContact } from "@/hooks/useGoogleSheets";
import FormLayout, {
  ContactFields,
  FormSection,
  FormField,
  RadioGroup,
  CheckboxGroup,
  SubmitButton,
} from "@/components/FormLayout";

const CONCIERGE_BG = "https://private-us-east-1.manuscdn.com/sessionFile/DygVo6WBqHSArQIDndnU9n/sandbox/cMuJsP4v14dzXHln2wtUFX-img-5_1771277926000_na1fn_c2FraG8tY29uY2llcmdl.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRHlnVm82V0JxSFNBclFJRG5kblU5bi9zYW5kYm94L2NNdUpzUDR2MTRkelhIbG4yd3RVRlgtaW1nLTVfMTc3MTI3NzkyNjAwMF9uYTFmbl9jMkZyYUc4dFkyOXVZMmxsY21kbC5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=O2A01x0DAXIrXdvtQ7k4zT1-sF1x2k3VtOEfWf2RBZ8P-BLJe6zTr0y75Ky4ovMgO4UoeopP~8XIIxhGhQ0N4lELYdMntsqRqNIjj5HG0iMEQh9BasuyuH6QIQrERwekl5T7044NFDaMDnB09PbOUEsLk5TP0VJVf~uRa51kpZ4u8qko-z56jHhzw9UZeIlZ898odRZSwo4Laqr86noY2GjDBx7Rv5F0zgWeBq7ZumHHirJe-l5UfqaYX6L3CqH7kCqvpNFwzifiWHUV8XJALa2CglwhBNzI093Ec71pdmo7Pgz4V5OjysCGmLVbcX~IQ-YuAqX4XsrhgxeoC7CZ6g__";

const LABELS: Record<string, string> = {
  "court": "Court séjour (moins de 7 jours)",
  "long": "Long séjour (+ de 7 jours)",
  "immediatement": "Immédiatement",
  "15-jours": "Dans les 15 jours",
  "plus-15-jours": "Dans plus de 15 jours",
  "logement": "Logement",
  "vehicule": "Véhicule",
  "activite": "Activité",
};

export default function ConciergerieForm() {
  const [contact, setContact] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [duree, setDuree] = useState("");
  const [periode, setPeriode] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const contactError = validateContact(contact);
    if (contactError) { toast.error(contactError); return; }
    if (!duree) { toast.error("Veuillez indiquer la durée de votre séjour."); return; }
    if (!periode) { toast.error("Veuillez indiquer la période souhaitée."); return; }
    if (services.length === 0) { toast.error("Veuillez sélectionner au moins un service."); return; }

    setIsLoading(true);
    const result = await submitToGoogleSheets({
      domain: "conciergerie",
      nom: contact.nom,
      prenom: contact.prenom,
      email: contact.email,
      telephone: contact.telephone,
      duree: LABELS[duree] || duree,
      periode: LABELS[periode] || periode,
      services: services.map((s) => LABELS[s] || s),
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
      title="Conciergerie"
      subtitle="Un service sur-mesure à Dubaï"
      icon={<ConciergeBell className="w-7 h-7 text-[#B8960C]" />}
      backgroundImage={CONCIERGE_BG}
      onSubmit={handleSubmit}
      isSubmitted={submitted}
    >
      <ContactFields
        data={contact}
        onChange={(field, value) => setContact((prev) => ({ ...prev, [field]: value }))}
      />

      <FormSection title="Votre séjour">
        <FormField label="Quelle est la durée de votre séjour à Dubaï ?" required>
          <RadioGroup
            name="duree"
            value={duree}
            onChange={setDuree}
            options={[
              { label: "Court séjour (moins de 7 jours)", value: "court" },
              { label: "Long séjour (+ de 7 jours)", value: "long" },
            ]}
          />
        </FormField>

        <FormField label="À quelle période souhaitez-vous bénéficier des services ?" required>
          <RadioGroup
            name="periode"
            value={periode}
            onChange={setPeriode}
            options={[
              { label: "Immédiatement", value: "immediatement" },
              { label: "Dans les 15 jours", value: "15-jours" },
              { label: "Dans plus de 15 jours", value: "plus-15-jours" },
            ]}
          />
        </FormField>

        <FormField label="Quel type de services recherchez-vous principalement ?" required>
          <CheckboxGroup
            options={[
              { label: "Logement", value: "logement" },
              { label: "Véhicule", value: "vehicule" },
              { label: "Activité", value: "activite" },
            ]}
            values={services}
            onChange={setServices}
          />
        </FormField>
      </FormSection>

      <SubmitButton label="Demander un service" isLoading={isLoading} />
    </FormLayout>
  );
}
