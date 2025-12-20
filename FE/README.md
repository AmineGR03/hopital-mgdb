# HealthCare Pro - Frontend

Une interface web complète pour la gestion d'un système médical, développée avec HTML, JavaScript et Bootstrap.

## Fonctionnalités

### 🏥 Dashboard Principal
- **Statistiques en temps réel** : Nombre total de patients, médecins, rendez-vous et prescriptions
- **Aperçu des rendez-vous récents** : Liste des derniers RDV avec détails
- **Actions rapides** : Boutons pour créer rapidement des patients, médecins, RDV et prescriptions

### 👥 Gestion des Patients
- **CRUD complet** : Créer, lire, modifier et supprimer des patients
- **Informations médicales** : Groupe sanguin, allergies, antécédents médicaux
- **Filtres avancés** : Recherche par nom, groupe sanguin, genre
- **Catégorisation** : Patients récents, cas critiques
- **Export CSV** : Télécharger les données des patients

### 👨‍⚕️ Gestion des Médecins
- **CRUD complet** : Créer, lire, modifier et supprimer des médecins
- **Spécialités médicales** : Plus de 10 spécialités disponibles
- **Répartition par spécialité** : Graphiques et statistiques
- **Filtres par spécialité** : Recherche ciblée
- **Disponibilité** : Indicateurs de statut

### 📅 Gestion des Rendez-vous
- **Planification complète** : Créer et gérer les consultations
- **Relations automatiques** : Liaison patient-médecin
- **Statuts des RDV** : Planifié, confirmé, annulé, terminé
- **Filtrage temporel** : Aujourd'hui, à venir, passés
- **Vues détaillées** : Informations complètes sur chaque RDV

### 💊 Gestion des Prescriptions
- **Prescriptions médicales** : Créer des ordonnances complètes
- **Médicaments multiples** : Ajouter plusieurs médicaments par prescription
- **Validité temporelle** : Durée de validité configurable
- **Instructions détaillées** : Recommandations médicales
- **Statuts** : Actives vs expirées

## Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles personnalisés avec Bootstrap 5
- **JavaScript ES6+** : Logique applicative
- **Bootstrap 5** : Framework CSS responsive
- **Font Awesome** : Icônes professionnelles
- **Fetch API** : Communication avec le backend

## Architecture

### Fichiers Principaux
- `index.html` - Dashboard principal
- `patients.html` - Gestion des patients
- `doctors.html` - Gestion des médecins
- `appointments.html` - Gestion des rendez-vous
- `prescriptions.html` - Gestion des prescriptions
- `style.css` - Styles personnalisés
- `script.js` - Utilitaires JavaScript communs
- `patients.js` - Logique patients
- `doctors.js` - Logique médecins
- `appointments.js` - Logique rendez-vous
- `prescriptions.js` - Logique prescriptions

### API Backend
L'application communique avec une API REST sur `http://localhost:3000` :

- **Patients** : `GET/POST/PUT/DELETE /patients`
- **Médecins** : `GET/POST/PUT/DELETE /doctors`
- **Rendez-vous** : `GET/POST/PUT/DELETE /appointments`
- **Prescriptions** : `GET/POST/PUT/DELETE /prescriptions`

## Démarrage

1. **Démarrer le backend** :
   ```bash
   cd ../BE
   npm install
   npm start
   ```

2. **Ouvrir le frontend** :
   - Ouvrez `index.html` dans votre navigateur
   - Ou utilisez un serveur local (Live Server, etc.)

## Fonctionnalités Clés

### 🔍 Filtres et Recherche
- **Recherche en temps réel** : Filtrage instantané des données
- **Filtres multiples** : Combinaison de critères
- **Navigation par catégories** : Onglets latéraux pour un accès rapide

### 📊 Dashboard Interactif
- **Mises à jour automatiques** : Statistiques en temps réel
- **Navigation intuitive** : Menu responsive
- **Actions contextuelles** : Boutons adaptés à chaque section

### 🎨 Interface Professionnelle
- **Design moderne** : Thème médical professionnel
- **Responsive design** : Compatible mobile et desktop
- **Feedback utilisateur** : Messages de confirmation et d'erreur
- **Animations fluides** : Transitions et effets visuels

### 🔄 CRUD Complet
- **Validation côté client** : Vérification des données
- **Gestion d'erreurs** : Messages d'erreur informatifs
- **Confirmation d'actions** : Dialogues de confirmation pour les suppressions
- **Exports de données** : Téléchargement CSV

## Sécurité et Performance

- **Validation des données** : Vérifications côté client
- **Gestion d'erreurs** : Try/catch et messages utilisateur
- **Optimisation** : Chargement asynchrone des données
- **Interface sécurisée** : Prévention des injections XSS

## Maintenance

### Ajout de Nouvelles Fonctionnalités
1. Créer les nouvelles pages HTML
2. Ajouter la logique JavaScript correspondante
3. Mettre à jour la navigation
4. Tester l'intégration avec l'API

### Personnalisation du Thème
- Modifier `style.css` pour les couleurs et styles
- Utiliser les variables CSS pour la cohérence
- Respecter la charte graphique médicale

## Support

Pour toute question ou problème :
1. Vérifier que le backend est démarré sur le port 3000
2. Consulter la console du navigateur pour les erreurs JavaScript
3. Vérifier les logs du serveur backend

---

**HealthCare Pro** - Système de gestion médicale moderne et intuitif.
