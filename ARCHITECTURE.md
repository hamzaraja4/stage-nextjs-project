# ARCHITECTURE TECHNIQUE & FONCTIONNELLE DU SYSTÈME
## Système d'Information de Restauration Hospitalière & Sécurité Alimentaire (HIS-Catering)

---

## 1. Schéma d'Architecture Globale en Couches

L'application **HIS-Catering** est conçue selon une architecture Web moderne en couches (*Layered Clean Architecture*), garantissant une séparation stricte des responsabilités entre la présentation, la logique métier, l'accès aux données et l'intégration matérielle.

```text
+-------------------------------------------------------------------------------+
|                             COUCHE DE PRÉSENTATION                            |
|  - Next.js 16 (App Router) + React 19 + TypeScript                            |
|  - Interface utilisateur responsive Tailwind CSS (Thème Médical Haute Lisibilité)|
|  - Composants interactifs Client & Rendus optimisés Server Components         |
|  - Moteur vectoriel de QR Codes embarqué (qrEngine.ts sans dépendance tierce) |
+-------------------------------------------------------------------------------+
                                       │
                                       ▼
+-------------------------------------------------------------------------------+
|                    GESTION D'ÉTAT & CONTEXTE APPLICATIF                       |
|  - AppContext : Gestion des modales, alertes « À Jeun », compteurs temps réel |
|  - ToastContext : Notifications visuelles d'actions (Succès, Alerte, Erreur)  |
|  - Sélecteur de rôle simulé (Chef, Soignant, Caisse, Direction Qualité)      |
+-------------------------------------------------------------------------------+
                                       │
                                       ▼
+-------------------------------------------------------------------------------+
|                     COUCHE DE COMMUNICATION & CONTRÔLEURS                     |
|  - Routes API Next.js App Router (src/app/api/*/route.ts)                    |
|  - Endpoints REST sécurisés : /distribution, /stocks, /pos, /haccp, etc.      |
|  - Validation des entrées JSON & Contrôle des contraintes métier              |
|  - Gestion des statuts HTTP (200 OK, 201 Created, 400 Bad Request, 409)      |
+-------------------------------------------------------------------------------+
                                       │
                                       ▼
+-------------------------------------------------------------------------------+
|                   COUCHE DE PERSISTANCE & MODÉLISATION ORM                    |
|  - Prisma ORM 7 (Client singleton lib/prisma.ts)                             |
|  - Schéma relationnel strict (prisma/schema.prisma : 20 modèles, relations)   |
|  - Transactions ACID (Garantie de cohérence des débits et déstockages)        |
+-------------------------------------------------------------------------------+
                                       │
                                       ▼
+-------------------------------------------------------------------------------+
|                            SOCLE BASE DE DONNÉES                              |
|  - Mode Développement / Embarqué : SQLite (stockage localisé zero-config)     |
|  - Mode Production Vercel / Hébergé : PostgreSQL Managé (URL via DATABASE_URL)|
+-------------------------------------------------------------------------------+
```

---

## 2. Analyse des Couches Logicielles

### 2.1 Couche Présentation & Composants UI
* **Next.js 16 & React 19** : Utilisation de l'App Router (`src/app/`). Les pages principales sont réparties par domaines d'activité :
  * `/distribution` : Gestion centrale des plateaux, impression des étiquettes QR, filtrage par régime et gestion des blocages.
  * `/production` : Planification de la confection en cuisine centrale et répartition par régime nutritionnel.
  * `/logistique` : Suivi des départs de chariots isothermes et contrôle des frigos relais d'étage.
  * `/mobile` : Terminal de mobilité pour infirmiers avec simulateur de lecteur code-barres et QR code (double scan au lit).
  * `/antifraude` : Tableau de bord de réconciliation en temps réel et journal d'audit infalsifiable des distributions.
  * `/pos` : Caisse tactile du self du personnel avec simulation de badge RFID et gestion de compte prépayé.
  * `/stocks` : Économat alimentaire, alertes de seuil critique et émission de bons de commande automatisés.
  * `/haccp` : Surveillance thermique des chambres froides, enregistrement de liaison chaude et traçabilité des plats témoins légaux.
* **Génération de QR Codes pure TypeScript (`src/lib/qrEngine.ts`)** :
  * Moteur de génération de matrices QR Version 2 (25x25) avec correction d'erreur Reed-Solomon autonome.
  * Export direct sous forme de flux SVG vectoriel et Data URLs pour affichage instantané et impression sans latence réseau.
* **Moteur d'Export et d'Impression (`src/lib/exportUtils.ts`)** :
  * Exportation tabulaire CSV avec encodage UTF-8 et gestion du BOM (`\uFEFF`) pour compatibilité immédiate avec Microsoft Excel.
  * Impression thermique et PDF via injection de feuilles de style d'impression dédiées (`@media print`).

### 2.2 Couche État Global & Communication Réactive
* **`AppContext.tsx`** : Assure la synchronisation applicative globale :
  * Propagation instantanée de l'événement critique de mise à jeun d'un patient.
  * Maintien du compteur de sécurité des plateaux bloqués visible en permanence sur le menu latéral.
  * Gestion de l'affichage des fenêtres modales (aperçu d'étiquette QR, confirmation de consigne opératoire).
* **`ToastContext.tsx`** : Fournit une interface utilisateur non bloquante pour l'information immédiate des soignants et cuisiniers.

### 2.3 Couche Contrôleurs API & Server Actions
* Architecture d'API REST standardisée au format JSON située dans `src/app/api/` :
  * `/api/distribution` : Récupération des plateaux ordonnancés, création de plateau, consignation « À Jeun » et mise à jour de statut.
  * `/api/stocks` : Consultation des stocks avec recherche plein-texte, création d'article, mise à jour des niveaux physiques et transmission des bons de commande.
  * `/api/pos` : Consultation du solde du badge RFID, débit après sélection d'article tactile, et rechargement de porte-monnaie.
  * `/api/haccp` : Télémétrie des chambres froides, enregistrement horodaté des mesures chaudes manuelles et vérification des plats témoins.
  * `/api/logistique` : Déclaration de départ de chariot isotherme et relevé des frigos d'étage.
  * `/api/antifraude` : Journal d'audit et archivage des doubles scans conformes ou discordants.

### 2.4 Couche Accès aux Données & ORM Prisma
* **Singleton d'instance (`src/lib/prisma.ts`)** :
  * Empêche l'épuisement du pool de connexions lors du rechargement à chaud en développement grâce à la mise en cache sur `globalThis`.
* **Relations typées de bout en bout** :
  * Le compilateur TypeScript valide à la compilation la conformité des types entre la base de données et les props de composants React.

---

## 3. Flux Fonctionnels Maîtres du Système

### Flux 1 : Confection, Validation et Départ des Plateaux
```text
Cuisine Centrale               Système HIS-Catering                 Chariot Isotherme
      │                                 │                                   │
      ├─ Saisie/Ordonnancement du repas ─► Création Tray (status: PREPARATION)
      │                                 │
      ├─ Assemblage & Scellé physique ───► Génération QR Code unique cryptographique
      │                                 │ (status: SCELLE_QR)
      │                                 │
      ├─ Contrôle départ vers chariot ───► Scan validation intégration chariot
      │                                 │ (Vérification liaison chaude >= 63°C)
      │                                 │                                   │
      └─────────────────────────────────┴── Chariot scellé en distribution ─►
```

### Flux 2 : Procédure Inviolable de Double Scan au Lit
```text
Soignant d'Étage              Terminal Mobile                    Base de Données HIS
      │                              │                                    │
      ├─ 1. Scan Bracelet IPP ───────► Décodage identité patient          │
      │                              ├─ Requête concordance séjour/régime ─►
      │                              │                                    │
      ├─ 2. Scan QR Plateau-Repas ───► Décodage jeton cryptographique     │
      │                              │                                    │
      │                              ├── VÉRIFICATION EN < 500 ms ────────┤
      │                              │   - Même identité ?                │
      │                              │   - Régime prescrit respecté ?     │
      │                              │   - Patient NON À JEUN ?           │
      │                              │                                    │
      │◄── DISCORDANCE / ALERTE ─────┤ SI ERREUR : Alerte rouge sonore    │
      │                              │             Enregistrement Fraude ─► AuditLog
      │                              │                                    │
      │◄── VALIDATION CONFORME ──────┤ SI SUCCÈS : Plateau livré conforme │
      │                              │             Horodatage certifié ───► AuditLog
```

### Flux 3 : Déclenchement d'Urgence de la Consigne « À JEUN »
```text
Service Chirurgie / Bloc          Système HIS-Catering           Cuisine & Chariots
           │                                │                            │
           ├─ Consigne mise à jeun patient ─► UPDATE Patient.isAJeun = true
           │                                │
           │                                ├─ UPDATE Tray.isBlocked = true
           │                                │  Tray.status = A_JEUN_BLOQUE
           │                                │
           │                                ├─ Notification sonore d'urgence
           │                                ├─ Incrémentation badge bloqués
           │                                │                            │
           │                                └─ Verrouillage distribution ┼── Blocage physique
```

### Flux 4 : Caisse Tactile du Personnel & Monétique RFID
```text
Agent Hospitalier              Caisse Tactile Self              Serveur POS / Prisma
        │                               │                                 │
        ├─ Présentation Badge RFID ─────► Lecture Matricule RH (ex: RH-4091)
        │                               ├─ Récupération Solde & Profil ───►
        │                               │                                 │
        ├─ Sélection Formule / Repas ───► Calcul montant (ou 0 MAD nuit)  │
        │                               ├─ Contrôle solde (ou découvert 35M)
        │                               │                                 │
        │◄── Débit & Billet Validé ─────┴─ TRANSACTION DÉBIT ATOMIQUE ────┤
        │                                  - Décrément solde StaffMember  │
        │                                  - Insertion PosTransaction     │
```

---

## 4. Intégrations Périphériques et Matérielles

| Périphérique | Norme / Protocole | Rôle Fonctionnel dans l'Application |
| :--- | :--- | :--- |
| **Douchette Code-barres 1D** | Émulation clavier USB / HID | Lecture optique instantanée du bracelet patient (IPP) au lit d'hôpital. |
| **Lecteur Optique 2D / Caméra** | Décryptage QR Code matrice 25x25 | Validation du jeton cryptographique apposé sur la cloche du plateau scellé. |
| **Lecteur Badge RFID / NFC** | Proximité 13.56 MHz (Mifare / Desfire) | Identification sans contact du personnel soignant à la caisse du self. |
| **Sondes Thermiques IoT** | Télémesure sans fil 868MHz / BLE | Surveillance automatique continue des chambres froides positives et négatives. |
| **Imprimante Thermique d'Étiquettes** | ESC/POS ou impression Web standard | Impression des étiquettes sanitaires autocollantes avec QR code et liste d'allergènes. |
