# Guide d'installation – Google Sheets pour Sakho Properties

Ce guide vous explique comment connecter vos formulaires Sakho Properties à un Google Sheets organisé pour recevoir automatiquement tous vos leads.

---

## Étape 1 : Créer le Google Sheets

1. Rendez-vous sur [Google Sheets](https://sheets.google.com)
2. Cliquez sur **"+ Nouveau"** pour créer un nouveau tableur
3. Nommez-le **"Sakho Properties – Leads"**

---

## Étape 2 : Installer le script Apps Script

1. Dans votre Google Sheets, allez dans le menu **Extensions** puis **Apps Script**
2. Supprimez tout le code par défaut dans l'éditeur
3. Copiez-collez l'intégralité du code du fichier `google-apps-script.js` (fourni dans le projet)
4. Cliquez sur **Enregistrer** (icône disquette ou Ctrl+S)

---

## Étape 3 : Exécuter le setup initial

1. Dans l'éditeur Apps Script, sélectionnez la fonction **`initialSetup`** dans le menu déroulant en haut
2. Cliquez sur le bouton **Exécuter** (icône ▶)
3. Google vous demandera d'**autoriser les permissions** : acceptez-les
4. Retournez dans votre Google Sheets : vous verrez les **6 onglets** créés automatiquement :

| Onglet | Contenu |
|---|---|
| **Tableau de bord** | Récapitulatif avec compteur de leads par domaine |
| **Candidature** | Leads du formulaire Candidature |
| **Partenariat** | Leads du formulaire Partenariat |
| **Immobilier** | Leads du formulaire Immobilier |
| **Conciergerie** | Leads du formulaire Conciergerie |
| **Interior Design** | Leads du formulaire Interior Design |

---

## Étape 4 : Déployer en tant qu'Application Web

1. Dans Apps Script, cliquez sur **Déployer** puis **Nouveau déploiement**
2. Cliquez sur l'icône d'engrenage à côté de "Sélectionner le type" et choisissez **Application Web**
3. Configurez comme suit :

| Paramètre | Valeur |
|---|---|
| Description | Sakho Properties Forms |
| Exécuter en tant que | **Moi** |
| Qui a accès | **Tout le monde** |

4. Cliquez sur **Déployer**
5. **Copiez l'URL** qui s'affiche (elle ressemble à : `https://script.google.com/macros/s/XXXX/exec`)

---

## Étape 5 : Connecter les formulaires

Pour connecter vos formulaires au Google Sheets, ouvrez la console de votre navigateur sur le site des formulaires (F12) et tapez :

```javascript
localStorage.setItem("sakho_webhook_url", "COLLEZ_VOTRE_URL_ICI");
```

Remplacez `COLLEZ_VOTRE_URL_ICI` par l'URL copiée à l'étape 4.

**Alternative** : Vous pouvez aussi me donner l'URL et je l'intégrerai directement dans le code du site.

---

## Structure du Google Sheets

Chaque onglet contient les colonnes suivantes :

### Candidature
Date, Nom, Prénom, Email, Téléphone, Poste souhaité, Basé(e) à Dubaï, Expérience immobilier/vente, Disponibilité

### Partenariat
Date, Nom, Prénom, Email, Téléphone, Type de partenariat, Nature de l'activité, Vision

### Immobilier
Date, Nom, Prénom, Email, Téléphone, Objectif immobilier, Budget estimé, Échéance, Déjà investi

### Conciergerie
Date, Nom, Prénom, Email, Téléphone, Durée du séjour, Période souhaitée, Services recherchés

### Interior Design
Date, Nom, Prénom, Email, Téléphone, Type de bien, Ville, Démarrage souhaité, Budget design

---

## Tableau de bord automatique

L'onglet **Tableau de bord** se met à jour automatiquement et affiche le nombre total de leads par domaine ainsi que la date du dernier lead reçu.
