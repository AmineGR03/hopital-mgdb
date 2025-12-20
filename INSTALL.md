# Installation et Configuration - Système de Gestion Médicale

Ce guide explique comment installer et exécuter le système de gestion médicale complet.

## Prérequis

- **Node.js** (version 16 ou supérieure) - [Télécharger](https://nodejs.org/)
- **MongoDB** (version 4.4 ou supérieure) - [Télécharger](https://www.mongodb.com/try/download/community)
- **Git** - [Télécharger](https://git-scm.com/)

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/AmineGR03/hopital-mgdb.git
cd hopital-mgdb
```

### 2. Installer les dépendances

#### Backend
```bash
cd BE
npm install
```

#### Frontend
```bash
cd ../FE
# Le frontend n'a pas de dépendances npm (HTML/CSS/JS pur)
cd ..
```

### 3. Configuration de la base de données

#### Démarrer MongoDB
Assurez-vous que MongoDB est installé et en cours d'exécution :

**Windows (avec MongoDB installé) :**
```bash
# Démarrer MongoDB (si pas en service)
net start MongoDB
# ou
mongod
```

**Linux/Mac :**
```bash
sudo systemctl start mongod
# ou
mongod
```

### 4. Configuration des variables d'environnement

Créer un fichier `.env` dans le dossier `BE` :

```env
MONGO_URI=mongodb://localhost:27017/hospitalDB
PORT=3000
```

## Démarrage du projet

### 1. Alimenter la base de données (optionnel mais recommandé)

```bash
cd BE
node seed.js
```

Cette commande crée :
- 2 patients avec des antécédents médicaux
- 2 médecins avec leurs spécialités
- 2 rendez-vous
- 2 prescriptions

### 2. Démarrer le serveur backend

```bash
# Depuis le dossier BE
node server.js
```

Le serveur démarrera sur `http://localhost:3000`

### 3. Ouvrir l'application frontend

Ouvrez votre navigateur web et allez à :
```
http://localhost:3000/index.html
```

Ou simplement ouvrez le fichier `FE/index.html` directement dans votre navigateur.

## Structure du projet

```
hopital-mgdb/
├── BE/                          # Backend (API)
│   ├── config/
│   │   └── db.js               # Configuration MongoDB
│   ├── controllers/            # Logique métier
│   │   ├── patient.controller.js
│   │   ├── doctor.controller.js
│   │   ├── appointment.controller.js
│   │   └── prescription.controller.js
│   ├── models/                 # Schémas MongoDB
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   └── Prescription.js
│   ├── routes/                 # Routes API
│   │   ├── patient.routes.js
│   │   ├── doctor.routes.js
│   │   ├── appointment.routes.js
│   │   └── prescription.routes.js
│   ├── server.js               # Point d'entrée serveur
│   ├── seed.js                 # Données de test
│   └── package.json
├── FE/                         # Frontend
│   ├── index.html              # Dashboard principal
│   ├── patients.html           # Gestion patients
│   ├── doctors.html            # Gestion médecins
│   ├── appointments.html       # Gestion rendez-vous
│   ├── prescriptions.html      # Gestion prescriptions
│   ├── style.css               # Styles CSS
│   ├── script.js               # Utilitaires JavaScript
│   ├── patients.js             # Logique patients
│   ├── doctors.js              # Logique médecins
│   ├── appointments.js         # Logique rendez-vous
│   ├── prescriptions.js        # Logique prescriptions
│   └── README.md               # Documentation frontend
└── README.md                   # Documentation générale
```

## Commandes principales

### Développement

```bash
# Démarrer le serveur backend
cd BE && node server.js

# Alimenter la base avec des données de test
cd BE && node seed.js

# Ouvrir le frontend (depuis le dossier FE)
# Ouvrir index.html dans le navigateur
```

### API Endpoints

Le serveur backend fournit les endpoints suivants :

#### Patients
- `GET /patients` - Liste des patients
- `GET /patients/:id` - Détails d'un patient
- `POST /patients` - Créer un patient
- `PUT /patients/:id` - Modifier un patient
- `DELETE /patients/:id` - Supprimer un patient

#### Médecins
- `GET /doctors` - Liste des médecins
- `GET /doctors/:id` - Détails d'un médecin
- `POST /doctors` - Créer un médecin
- `PUT /doctors/:id` - Modifier un médecin
- `DELETE /doctors/:id` - Supprimer un médecin

#### Rendez-vous
- `GET /appointments` - Liste des rendez-vous
- `GET /appointments/:id` - Détails d'un rendez-vous
- `POST /appointments` - Créer un rendez-vous
- `PUT /appointments/:id` - Modifier un rendez-vous
- `DELETE /appointments/:id` - Supprimer un rendez-vous

#### Prescriptions
- `GET /prescriptions` - Liste des prescriptions
- `GET /prescriptions/:id` - Détails d'une prescription
- `POST /prescriptions` - Créer une prescription
- `PUT /prescriptions/:id` - Modifier une prescription
- `DELETE /prescriptions/:id` - Supprimer une prescription

## Fonctionnalités

- **Dashboard interactif** avec statistiques en temps réel
- **Gestion complète des patients** avec antécédents médicaux
- **Gestion des médecins** avec spécialités
- **Planification des rendez-vous** avec liaison patient-médecin
- **Gestion des prescriptions** médicales
- **Interface responsive** adaptée mobile/desktop
- **Recherche et filtrage** avancés
- **Export de données** (CSV)

## Dépannage

### Erreur de connexion MongoDB
- Vérifiez que MongoDB est démarré : `net start MongoDB` (Windows)
- Vérifiez l'URI dans le fichier `.env`

### Port 3000 déjà utilisé
- Changez le PORT dans `.env` : `PORT=3001`

### Erreur "Cannot find module"
- Assurez-vous d'avoir exécuté `npm install` dans le dossier BE

### Données vides
- Exécutez `node seed.js` pour alimenter la base de données

## Support

Pour toute question ou problème :
1. Vérifiez les logs de la console du navigateur (F12)
2. Vérifiez les logs du serveur backend
3. Assurez-vous que MongoDB est en cours d'exécution

---

**Système de Gestion Médicale - Version complète** 🚀