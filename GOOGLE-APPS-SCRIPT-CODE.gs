/**
 * Google Apps Script - Sakho Properties Leads Manager
 *
 * Ce script reçoit les soumissions des formulaires et les ajoute automatiquement
 * aux onglets correspondants du Google Sheets.
 *
 * Instructions :
 * 1. Copiez ce code entièrement
 * 2. Ouvrez votre Google Sheets
 * 3. Allez à Extensions > Apps Script
 * 4. Remplacez le contenu de Code.gs par ce code
 * 5. Cliquez sur Déployer > Nouveau déploiement > Type : Application Web
 * 6. Exécuter en tant que : Moi / Accès : Tout le monde
 * 7. Copiez l'URL du webhook générée
 *
 * IMPORTANT : Après chaque modification de ce script, vous devez créer un
 * NOUVEAU déploiement pour que les changements prennent effet.
 */

// Configuration des onglets par domaine
const SHEET_MAPPING = {
  "immobilier": "Immobilier",
  "archispace": "Archispace",
  "conciergerie": "Conciergerie",
  "partenariat": "Partenariat",
  "candidature-sakho": "Candidature Sakho",
  "candidature-archispace": "Candidature Archispace",
};

// En-têtes pour chaque onglet
const HEADERS = {
  "Immobilier": ["Date", "Nom", "Prénom", "Email", "Téléphone", "Objectif", "Type de bien", "Budget", "Échéance", "Déjà investi"],
  "Archispace": ["Date", "Nom", "Prénom", "Email", "Téléphone", "Type de bien", "Ville", "Démarrage", "Budget design"],
  "Conciergerie": ["Date", "Nom", "Prénom", "Email", "Téléphone", "Durée séjour", "Période", "Services recherchés"],
  "Partenariat": ["Date", "Nom", "Prénom", "Email", "Téléphone", "Type partenariat", "Nature activité", "Vision"],
  "Candidature Sakho": ["Date", "Nom", "Prénom", "Email", "Téléphone", "Poste", "Basé à Dubaï", "Expérience immobilier", "Niveau expérience", "Langues", "Disponibilité", "Motivation"],
  "Candidature Archispace": ["Date", "Nom", "Prénom", "Email", "Téléphone", "Poste", "Basé à Dubaï", "Expérience vente", "Niveau expérience", "Langues", "Disponibilité", "Motivation"],
};

/**
 * Fonction principale - Reçoit les données du formulaire (POST)
 */
function doPost(e) {
  // Acquérir un verrou pour éviter les doublons en cas de clics rapides
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Serveur occupé, veuillez réessayer."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Validation basique côté serveur
    if (!data.email || !data.nom || !data.prenom) {
      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Champs obligatoires manquants (nom, prénom, email)"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Déterminer l'onglet cible
    const domain = data.domain;
    const sheetName = SHEET_MAPPING[domain];

    if (!sheetName) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Domaine non reconnu: " + domain
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Obtenir ou créer l'onglet
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      // Ajouter les en-têtes
      const headers = HEADERS[sheetName] || [];
      if (headers.length > 0) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
        sheet.getRange(1, 1, 1, headers.length).setBackground("#B8960C");
        sheet.getRange(1, 1, 1, headers.length).setFontColor("white");
        sheet.setFrozenRows(1);
      }
    }

    // Détection de doublons : même email + domaine dans les 60 dernières secondes
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const emailCol = 4; // Colonne D = Email
      const dateCol = 1;  // Colonne A = Date
      // Vérifier les 5 dernières lignes pour les doublons récents
      const checkStart = Math.max(2, lastRow - 4);
      const range = sheet.getRange(checkStart, 1, lastRow - checkStart + 1, emailCol);
      const values = range.getValues();
      const now = new Date();
      for (let i = values.length - 1; i >= 0; i--) {
        if (values[i][emailCol - 1] === data.email) {
          const rowDate = new Date(values[i][dateCol - 1]);
          const diffSeconds = (now - rowDate) / 1000;
          if (diffSeconds < 60) {
            lock.releaseLock();
            return ContentService.createTextOutput(JSON.stringify({
              success: true,
              message: "Soumission déjà enregistrée"
            })).setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
    }

    // Préparer la ligne de données
    const row = prepareRow(domain, data);

    // Ajouter la ligne au Sheets
    sheet.appendRow(row);

    // Formater la dernière ligne (alternance de couleurs)
    const newLastRow = sheet.getLastRow();
    if (newLastRow % 2 === 0) {
      sheet.getRange(newLastRow, 1, 1, row.length).setBackground("#f5f5f5");
    }

    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Lead enregistré dans " + sheetName,
      row: newLastRow
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Fonction GET - Pour tester que le script est accessible
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Sakho Properties Forms API is running"
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Prépare la ligne de données selon le domaine
 * Les noms de champs correspondent exactement aux formulaires React
 */
function prepareRow(domain, data) {
  const date = new Date().toLocaleString("fr-FR", { timeZone: "Asia/Dubai" });

  switch (domain) {
    case "immobilier":
      return [
        date,
        data.nom || "",
        data.prenom || "",
        data.email || "",
        data.telephone || "",
        data.objectif || "",
        data.typeBien || "",
        data.budget || "",
        data.echeance || "",
        data.dejaInvesti || "",
      ];

    case "archispace":
      return [
        date,
        data.nom || "",
        data.prenom || "",
        data.email || "",
        data.telephone || "",
        data.typeBien || "",
        data.ville || "",
        data.demarrage || "",
        data.budgetDesign || "",
      ];

    case "conciergerie":
      return [
        date,
        data.nom || "",
        data.prenom || "",
        data.email || "",
        data.telephone || "",
        data.duree || "",
        data.periode || "",
        data.services || "",
      ];

    case "partenariat":
      return [
        date,
        data.nom || "",
        data.prenom || "",
        data.email || "",
        data.telephone || "",
        data.typePartenariat || "",
        data.natureActivite || "",
        data.vision || "",
      ];

    case "candidature-sakho":
      return [
        date,
        data.nom || "",
        data.prenom || "",
        data.email || "",
        data.telephone || "",
        data.poste || "",
        data.baseDubai || "",
        data.experienceImmo || "",
        data.niveauExperience || "",
        data.langues || "",
        data.disponibilite || "",
        data.motivation || "",
      ];

    case "candidature-archispace":
      return [
        date,
        data.nom || "",
        data.prenom || "",
        data.email || "",
        data.telephone || "",
        data.poste || "",
        data.baseDubai || "",
        data.experienceVente || "",
        data.niveauExperience || "",
        data.langues || "",
        data.disponibilite || "",
        data.motivation || "",
      ];

    default:
      return [date, "Domaine inconnu: " + domain];
  }
}

/**
 * Setup initial - Exécutez une seule fois pour créer tous les onglets
 */
function initialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  for (const [domain, sheetName] of Object.entries(SHEET_MAPPING)) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    const headers = HEADERS[sheetName];
    if (headers) {
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#B8960C");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);

      for (let j = 1; j <= headers.length; j++) {
        sheet.setColumnWidth(j, 180);
      }
    }
  }

  Logger.log("Setup terminé ! Tous les onglets ont été créés.");
}

/**
 * Fonction de test - Exécutez-la pour vérifier que le script fonctionne
 */
function testWebhook() {
  const testData = {
    domain: "immobilier",
    nom: "Test",
    prenom: "Utilisateur",
    email: "test@example.com",
    telephone: "+971501234567",
    objectif: "Investissement locatif",
    typeBien: "Appartement 2 chambres",
    budget: "350 000 € - 500 000 €",
    echeance: "1 à 3 mois",
    dejaInvesti: "Oui"
  };

  const response = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });

  Logger.log(response.getContent());
}
