/**
 * ============================================================
 * SAKHO PROPERTIES – Google Apps Script
 * ============================================================
 * Ce script reçoit les soumissions des formulaires web et les
 * enregistre dans les onglets correspondants du Google Sheets.
 *
 * INSTALLATION :
 * 1. Ouvrez votre Google Sheets
 * 2. Allez dans Extensions > Apps Script
 * 3. Supprimez le contenu par défaut et collez ce code
 * 4. Cliquez sur "Exécuter" > "initialSetup" (une seule fois)
 * 5. Autorisez les permissions demandées
 * 6. Allez dans "Déployer" > "Nouveau déploiement"
 * 7. Type : "Application Web"
 * 8. Exécuter en tant que : "Moi"
 * 9. Accès : "Tout le monde"
 * 10. Cliquez "Déployer" et copiez l'URL générée
 * ============================================================
 */

// ---- CONFIGURATION ----
var SHEET_NAMES = {
  "candidature": "Candidature",
  "partenariat": "Partenariat",
  "immobilier": "Immobilier",
  "conciergerie": "Conciergerie",
  "interior-design": "Interior Design"
};

var HEADERS = {
  "Candidature": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Poste souhaité", "Basé(e) à Dubaï", "Expérience immobilier/vente", "Disponibilité"
  ],
  "Partenariat": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Type de partenariat", "Nature de l'activité", "Vision"
  ],
  "Immobilier": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Objectif immobilier", "Budget estimé", "Échéance", "Déjà investi"
  ],
  "Conciergerie": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Durée du séjour", "Période souhaitée", "Services recherchés"
  ],
  "Interior Design": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Type de bien", "Ville", "Démarrage souhaité", "Budget design"
  ]
};

// ---- INITIAL SETUP (run once) ----
function initialSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create sheets with headers
  var sheetNames = Object.values(SHEET_NAMES);
  for (var i = 0; i < sheetNames.length; i++) {
    var name = sheetNames[i];
    var sheet = ss.getSheetByName(name);

    if (!sheet) {
      sheet = ss.insertSheet(name);
    }

    // Set headers
    var headers = HEADERS[name];
    if (headers) {
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#B8960C");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setHorizontalAlignment("center");

      // Auto-resize columns
      for (var j = 1; j <= headers.length; j++) {
        sheet.setColumnWidth(j, 180);
      }

      // Freeze header row
      sheet.setFrozenRows(1);
    }
  }

  // Remove default "Sheet1" if it exists and is empty
  var defaultSheet = ss.getSheetByName("Sheet1") || ss.getSheetByName("Feuille 1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  // Create "Tableau de bord" summary sheet
  var dashboard = ss.getSheetByName("Tableau de bord");
  if (!dashboard) {
    dashboard = ss.insertSheet("Tableau de bord", 0);
  }

  // Dashboard headers
  var dashHeaders = ["Domaine", "Nombre de leads", "Dernier lead"];
  dashboard.getRange(1, 1, 1, 3).setValues([dashHeaders]);
  dashboard.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#0A0A0A").setFontColor("#B8960C");

  // Dashboard formulas
  var domaines = ["Candidature", "Partenariat", "Immobilier", "Conciergerie", "Interior Design"];
  for (var k = 0; k < domaines.length; k++) {
    var row = k + 2;
    dashboard.getRange(row, 1).setValue(domaines[k]);
    dashboard.getRange(row, 2).setFormula('=COUNTA(\'' + domaines[k] + '\'!A:A)-1');
    dashboard.getRange(row, 3).setFormula('=IF(\'' + domaines[k] + '\'!A2="","Aucun",INDEX(\'' + domaines[k] + '\'!A:A,COUNTA(\'' + domaines[k] + '\'!A:A)))');
  }

  // Total row
  dashboard.getRange(8, 1).setValue("TOTAL LEADS").setFontWeight("bold");
  dashboard.getRange(8, 2).setFormula("=SUM(B2:B6)").setFontWeight("bold");
  dashboard.getRange(8, 1, 1, 3).setBackground("#B8960C").setFontColor("#FFFFFF");

  // Styling
  dashboard.setColumnWidth(1, 200);
  dashboard.setColumnWidth(2, 180);
  dashboard.setColumnWidth(3, 200);
  dashboard.setFrozenRows(1);

  Logger.log("✅ Setup terminé ! Les onglets ont été créés avec succès.");
}

// ---- HANDLE POST REQUESTS ----
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var domain = data.domain;
    var sheetName = SHEET_NAMES[domain];

    if (!sheetName) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Domaine inconnu: " + domain
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Onglet non trouvé: " + sheetName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var timestamp = new Date().toLocaleString("fr-FR", { timeZone: "Asia/Dubai" });
    var row = [];

    switch (domain) {
      case "candidature":
        row = [
          timestamp, data.nom, data.prenom, data.email, data.telephone,
          data.poste, data.baseDubai, data.experience, data.disponibilite
        ];
        break;
      case "partenariat":
        row = [
          timestamp, data.nom, data.prenom, data.email, data.telephone,
          data.typePartenariat, data.natureActivite, data.vision || ""
        ];
        break;
      case "immobilier":
        row = [
          timestamp, data.nom, data.prenom, data.email, data.telephone,
          data.objectif, data.budget, data.echeance, data.dejaInvesti
        ];
        break;
      case "conciergerie":
        row = [
          timestamp, data.nom, data.prenom, data.email, data.telephone,
          data.duree, data.periode, (data.services || []).join(", ")
        ];
        break;
      case "interior-design":
        row = [
          timestamp, data.nom, data.prenom, data.email, data.telephone,
          data.typeBien, data.ville, data.demarrage, data.budgetDesign
        ];
        break;
    }

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead enregistré dans " + sheetName
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ---- HANDLE GET REQUESTS (for testing) ----
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "Sakho Properties Forms API is running"
  })).setMimeType(ContentService.MimeType.JSON);
}
