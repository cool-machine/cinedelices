# Présentation Sprint 0 - Conception
# Projet : Ciné Délices

---

## 1. Introduction

### Le Projet Ciné Délices 🎬 🍽️

**Concept** : Une plateforme web mariant **Cinéma** et **Gastronomie**.
**Objectif** : Permettre aux fans de reproduire les plats iconiques de leurs films et séries préférés.

**L'Équipe** :
*   Lead Backend
*   Lead Frontend
*   DevOps
*   Design/UX

---

## 2. Cahier des Charges

### Vision & Fonctionnalités

**MVP (Minimum Viable Product)** :
*   🔐 **Authentification** sécurisée
*   📖 **Catalogue** de recettes filtres & recherche
*   📄 **Fiches Recettes** détaillées (ingrédients, films)
*   ⚙️ **Back-office** d'administration

**Cible** :
*   Amateurs de pop-culture (16-50+ ans)
*   Cinéphiles gourmands
*   Cuisiniers amateurs

---

## 3. Architecture

### Arborescence du site

Structure claire et intuitive pour l'utilisateur :

*   **Accueil** : Point d'entrée central
*   **Recettes / Films** : Double entrée catalogue
*   **Espace Membre** : Profil, Favoris, Ajout de recette
*   **Admin** : Gestion globale

*(Voir schéma arborescence détaillé dans le dossier 02)*

---

## 4. Design & UX

### Identité Visuelle

Une ambiance "Salle Obscure" élégante.

*   🎨 **Palette** :
    *   **Or Cinéma** (#D4AF37)
    *   **Rouge Tapis** (#8B0000)
    *   **Noir Profond** (#1A1A1A)
*   ✒️ **Typographie** :
    *   Titres : *Bebas Neue* (Impact affiche de film)
    *   Texte : *Montserrat* (Lisibilité moderne)

---

### Maquettes (Mockups)

**Page d'Accueil** :
Immersion immédiate avec des visuels "Affiche de film".

**Page Recette** :
Mise en page éditoriale, claire, mettant en valeur le plat et l'œuvre source.

*(Voir les maquettes haute-fidélité dans le dossier 04)*

---

## 5. Base de Données

### Conception (Merise)

Nous avons structuré les données pour garantir intégrité et évolutivité.

**4 Entités MVP** :
1.  **UTILISATEUR** (Comptes, Rôles)
2.  **RECETTE** (Cœur du système)
3.  **FILM** (L'œuvre source)
4.  **CATEGORIE** (Classification)

---

### Modèle Physique (MPD)

Implémentation choisie : **PostgreSQL**

*   Sécurité des données (Clés étrangères strictes)
*   Performance (Index sur les recherches)
*   Types de données adaptés et contraintes de validation

*(Voir le dictionnaire des données V2 dans le dossier 05)*

---

## 6. Conclusion & Prochaines Étapes

### Bilan Sprint 0

✅ **Cahier des charges** validé
✅ **Design System** défini
✅ **Architecture BDD** prête

### Cap sur le Sprint 1 🚀

*   Initialisation du dépôt & CI/CD
*   Mise en place de la base de données
*   Début du développement Backend (API)
*   Squelette Frontend

**Merci de votre écoute !**
