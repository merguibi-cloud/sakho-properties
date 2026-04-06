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
  "conciergerie-emirats": "Conciergerie Émirats",
  "conciergerie-maroc": "Conciergerie Maroc",
  "conciergerie-us": "Conciergerie US",
  "conciergerie-autres": "Conciergerie Autres",
  "interior-design": "Interior Design",
  "immobilier-maroc": "Immobilier Maroc"
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
    "Objectif immobilier", "Type de bien", "Budget estimé", "Échéance", "Déjà investi"
  ],
  "Conciergerie Émirats": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Durée du séjour", "Période souhaitée", "Services recherchés"
  ],
  "Conciergerie Maroc": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Durée du séjour", "Période souhaitée", "Services recherchés"
  ],
  "Conciergerie US": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Durée du séjour", "Période souhaitée", "Services recherchés"
  ],
  "Conciergerie Autres": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Durée du séjour", "Période souhaitée", "Services recherchés"
  ],
  "Interior Design": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Type de bien", "Ville", "Démarrage souhaité", "Budget design"
  ],
  "Immobilier Maroc": [
    "Date", "Nom", "Prénom", "Email", "Téléphone",
    "Objectif immobilier", "Ville", "Type de bien", "Budget estimé", "Déjà investi"
  ]
};

// ---- INITIAL SETUP (run once) ----
function initialSetup() {
  var ss = SpreadsheetApp.openById("11cmnDPnoapyt7HFPKxNZ5PXutp6bBYrv1cEqiQ2Qbkg");

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

      // Force telephone column (col 5) to plain text on all data rows
      sheet.getRange(2, 5, sheet.getMaxRows() - 1, 1).setNumberFormat("@");

      // For Immobilier: force Échéance column (col 9) to date format
      if (name === "Immobilier") {
        sheet.getRange(2, 9, sheet.getMaxRows() - 1, 1).setNumberFormat("dd/MM/yyyy");
      }
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
  var domaines = ["Candidature", "Partenariat", "Immobilier", "Conciergerie Émirats", "Conciergerie Maroc", "Conciergerie US", "Conciergerie Autres", "Interior Design", "Immobilier Maroc"];
  for (var k = 0; k < domaines.length; k++) {
    var row = k + 2;
    dashboard.getRange(row, 1).setValue(domaines[k]);
    dashboard.getRange(row, 2).setFormula('=COUNTA(\'' + domaines[k] + '\'!A2:A)');
    dashboard.getRange(row, 3).setFormula('=IF(B' + row + '=0;"Aucun";INDEX(\'' + domaines[k] + '\'!A:A;B' + row + '+1))');
  }

  // Total row
  var totalRow = domaines.length + 2;
  dashboard.getRange(totalRow, 1).setValue("TOTAL LEADS").setFontWeight("bold");
  dashboard.getRange(totalRow, 2).setFormula("=SUM(B2:B" + (totalRow - 1) + ")").setFontWeight("bold");
  dashboard.getRange(totalRow, 1, 1, 3).setBackground("#B8960C").setFontColor("#FFFFFF");

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

    var ss = SpreadsheetApp.openById("11cmnDPnoapyt7HFPKxNZ5PXutp6bBYrv1cEqiQ2Qbkg");
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Onglet non trouvé: " + sheetName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var now = new Date();
    var timestamp = now.toLocaleString("fr-FR", { timeZone: "Asia/Dubai" });
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
        // Parse écheance: accept ISO date string (from frontend) or text label (fallback)
        var echeanceDate = new Date(data.echeance);
        if (isNaN(echeanceDate.getTime())) {
          // frontend sent the raw label (e.g. "+6 mois") — calculate from it
          echeanceDate = new Date();
          var el = (data.echeance || '').toLowerCase();
          if (el.indexOf('1') !== -1 && el.indexOf('3') !== -1) {
            echeanceDate.setMonth(echeanceDate.getMonth() + 3);
          } else if (el.indexOf('3') !== -1 && el.indexOf('6') !== -1) {
            echeanceDate.setMonth(echeanceDate.getMonth() + 6);
          } else if (el.indexOf('immédiatement') === -1 && el.indexOf('immediatement') === -1) {
            echeanceDate.setMonth(echeanceDate.getMonth() + 9);
          }
        }
        row = [
          timestamp, data.nom, data.prenom, data.email, data.telephone,
          data.objectif, data.typeBien, data.budget, echeanceDate, data.dejaInvesti
        ];
        break;
      case "conciergerie-emirats":
      case "conciergerie-maroc":
      case "conciergerie-us":
      case "conciergerie-autres":
        row = [
          timestamp, data.nom, data.prenom, data.email, data.telephone,
          data.duree, data.periode, data.services || ""
        ];
        break;
      case "interior-design":
        row = [
          timestamp, data.nom, data.prenom, data.email, data.telephone,
          data.typeBien, data.ville, data.demarrage, data.budgetDesign
        ];
        break;
      case "immobilier-maroc":
        row = [
          timestamp, data.nom, data.prenom, data.email, data.telephone,
          data.objectif, data.ville, data.typeBien, data.budget, data.dejaInvesti
        ];
        break;
    }

    // Write row without telephone (col 5) — appendRow evaluates "+" as formula
    var rowToWrite = row.slice();
    rowToWrite[4] = '';
    sheet.appendRow(rowToWrite);

    // Use getLastRow() AFTER appendRow to get the exact row that was written.
    // (Computing nextRow before appendRow caused a 1-row offset when flush()
    //  was called between them, because flush() made Apps Script count the
    //  pre-formatted empty cell as an existing row.)
    var writtenRow = sheet.getLastRow();

    // Strip spaces from telephone then write as text-formula ="..." so Google
    // Sheets never evaluates "+33XXXXXXX" as a formula.
    var phone = String(row[4] || '').replace(/\s+/g, '').replace(/"/g, '""');
    sheet.getRange(writtenRow, 5).setFormula('="' + phone + '"');

    // For immobilier: format the Échéance cell as date (after writing so we
    // know the correct row; the Date value is already stored correctly)
    if (domain === "immobilier") {
      sheet.getRange(writtenRow, 9).setNumberFormat("dd/MM/yyyy");
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead enregistré dans " + sheetName
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("ERROR: " + error.toString());
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
