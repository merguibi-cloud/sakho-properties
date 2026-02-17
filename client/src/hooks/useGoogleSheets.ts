/**
 * useGoogleSheets – Hook pour envoyer les soumissions de formulaires vers Google Sheets.
 * Utilise Google Apps Script déployé en tant que Web App.
 *
 * IMPORTANT : Remplacez l'URL ci-dessous par votre URL de déploiement Web App.
 * L'URL doit être au format : https://script.google.com/macros/s/VOTRE_ID/exec
 */

// L'URL du webhook Google Apps Script (Web App)
// Copiez l'URL depuis : Déployer > Gérer les déploiements > URL de l'Application Web
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxSlSBXFXECXHLes4pYH9TVgmCc9P455nemg8IpG7lh8hPXY8xwHbyX4Q2fDa8n6A79Yg/exec";

export interface FormData {
  domain: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  [key: string]: string | string[];
}

// Validation des champs contact
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Numéro international obligatoire : doit commencer par + suivi de l'indicatif pays
const PHONE_REGEX = /^\+\d{1,4}[\s.-]?\d[\d\s.-]{6,18}$/;

export function validateContact(data: { nom: string; prenom: string; email: string; telephone: string }): string | null {
  if (!data.nom.trim()) return "Veuillez indiquer votre nom.";
  if (!data.prenom.trim()) return "Veuillez indiquer votre prénom.";
  if (!data.email.trim()) return "Veuillez indiquer votre email.";
  if (!EMAIL_REGEX.test(data.email)) return "Veuillez indiquer un email valide.";
  if (!data.telephone.trim()) return "Veuillez indiquer votre numéro de téléphone.";
  if (!PHONE_REGEX.test(data.telephone.trim())) return "Veuillez indiquer un numéro au format international (ex: +33 6 12 34 56 78 ou +971 50 123 4567).";
  return null;
}

export async function submitToGoogleSheets(data: FormData): Promise<{ success: boolean; message: string }> {
  const url = localStorage.getItem("sakho_webhook_url") || GOOGLE_SCRIPT_URL;

  if (!url) {
    console.warn("Google Sheets webhook URL non configurée. Les données sont affichées en console.");
    console.log("Données du formulaire:", JSON.stringify(data, null, 2));
    return { success: true, message: "Données enregistrées (mode hors-ligne)" };
  }

  // Convertir les arrays en chaînes pour Google Sheets
  const payload: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    payload[key] = Array.isArray(value) ? value.join(", ") : String(value);
  }

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    });

    // Avec no-cors, on ne peut pas lire la réponse,
    // mais la requête sera envoyée et traitée par Google Apps Script
    return { success: true, message: "Lead envoyé avec succès" };
  } catch (error) {
    console.error("Erreur lors de l'envoi vers Google Sheets:", error);
    return { success: false, message: "Erreur d'envoi. Veuillez réessayer." };
  }
}
