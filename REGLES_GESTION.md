# RÈGLES DE GESTION MÉTIER (BUSINESS RULES)
## Système d'Information de Restauration Hospitalière & Sécurité Alimentaire (HIS-Catering)

---

## 1. Principes et Typologie des Règles Métier

Dans une clinique hospitalière, la restauration ne relève pas d'une simple logistique hôtelière : c'est un **acte de soin thérapeutique et de sécurité sanitaire majeure**. 
Les règles de gestion ci-dessous sont extraites des fonctionnalités réelles du code, des interfaces médicales et des contraintes réglementaires de santé publique (HACCP, traçabilité des séjours, prévention du choc anaphylactique et de l'inhalation sous anesthésie).

---

## 2. Référentiel Exhaustif des Règles de Gestion

| ID | Règle de Gestion Métier | Entités Concernées |
| :--- | :--- | :--- |
| **RG-ADM-01** | Chaque utilisateur du système doit posséder un compte nominatif associé à une adresse email unique et rattaché à exactement un profil de rôle applicatif. | `User`, `Role` |
| **RG-ADM-02** | L'accès aux écrans et aux fonctionnalités de validation est strictement cloisonné selon le rôle simulé ou authentifié (`chef`, `soignant`, `caisse`, `admin`). | `User`, `Role` |
| **RG-PAT-01** | Tout patient hospitalisé doit obligatoirement posséder un numéro d'IPP (Identifiant Permanent du Patient) unique et immuable dans tout le système d'information clinique. | `Patient` |
| **RG-PAT-02** | Un patient actif doit être assigné à un unique lit physique (ex: Lit A, Lit B) situé dans une chambre identifiée d'un service de soin spécifique. | `Patient`, `Bed`, `Room`, `ServiceUnit` |
| **RG-PAT-03** | Tout patient hospitalisé doit faire l'objet d'une prescription diététique active formalisant son régime alimentaire (Normal, Diabétique, Sans Sel, Mixé, etc.) et la texture adaptée. | `Patient`, `Diet` |
| **RG-DST-01** | Chaque plateau-repas confectionné est obligatoirement rattaché à un patient unique et doit être scellé par un jeton QR code cryptographique nominatif et unique (`qrToken`). | `Tray`, `Patient` |
| **RG-DST-02** | La réimpression d'un QR code plateau annule et invalide immédiatement le jeton cryptographique antérieur pour empêcher tout risque de double distribution ou de fraude. | `Tray`, `AuditLog` |
| **RG-DST-03** | Le régime alimentaire et les allergènes indiqués sur l'étiquette QR du plateau doivent correspondre rigoureusement à la prescription médicale du dossier patient au moment du dressage. | `Tray`, `Patient`, `Diet` |
| **RG-DST-04** | Un plateau peut intégrer une prestation optionnelle payante d'accompagnant (`isExtraAccompagnant = true`), qui doit être explicitement libellée et imputée administrativement. | `Tray` |
| **RG-BLC-01** | Toute consigne médicale de mise « À JEUN » (programmée ou déclarée en urgence pour bloc opératoire ou examen) entraîne le blocage immédiat (`isBlocked = true`, `status = A_JEUN_BLOQUE`) de l'ensemble des plateaux en cours du patient. | `Patient`, `Tray`, `AuditLog` |
| **RG-BLC-02** | L'activation du statut « À JEUN » déclenche une alerte visuelle sonore et prioritaire sur le bandeau supérieur de l'application et actualise instantanément le compteur de plateaux bloqués dans la barre latérale. | `Patient`, `Tray` |
| **RG-BLC-03** | Un plateau consigné « À JEUN » est interdit de départ cuisine et ne peut en aucun cas être validé lors du contrôle de sortie ou du scan au lit. | `Tray`, `Cart`, `AuditLog` |
| **RG-PRD-01** | Les ordres de fabrication en cuisine centrale (`ProductionRun`) sont calculés et agrégés quotidiennement par créneau de service (Déjeuner, Dîner) et par régime nutritionnel à partir du recensement des lits occupés. | `ProductionRun`, `Diet`, `Patient` |
| **RG-PRD-02** | L'heure limite de clôture des commandes et modifications de régimes pour le service du midi est fixée à 10h00 (cut-off cuisine). | `ProductionRun`, `ServiceUnit` |
| **RG-LOG-01** | Tout départ de chariot isotherme depuis la cuisine centrale exige un contrôle systématique des températures : la liaison chaude doit être supérieure ou égale à +63°C et la liaison froide inférieure ou égale à +3°C. | `Cart` |
| **RG-LOG-02** | Le départ d'un chariot requiert la validation du scellé physique, le décompte exact des plateaux scellés et l'identification de l'agent opérateur de départ. | `Cart`, `Tray` |
| **RG-LOG-03** | Un chariot isotherme dessert une unité de soin et un étage prédéterminés pour respecter le plan de distribution horaire de la clinique. | `Cart`, `ServiceUnit` |
| **RG-FRG-01** | Les frigos relais d'étage sont réservés aux collations et admissions nocturnes imprévues survenant après la fermeture de la cuisine centrale (post-20h00). | `EmergencyFridge` |
| **RG-FRG-02** | Tout retrait nocturne dans un frigo relais requiert le scan préalable du bracelet du patient admis afin d'imputer le repas et déclencher un ordre de réassort automatique à 06h00 pour la cuisine. | `EmergencyFridge`, `Patient` |
| **RG-MOB-01** | La remise d'un plateau au patient exige impérativement la procédure inviolable du **Double Scan au Lit** : 1) Scan du code-barres du bracelet patient (IPP) ; 2) Scan du QR code sécurisé du plateau-repas. | `Patient`, `Tray`, `AuditLog` |
| **RG-MOB-02** | Le système effectue une vérification en temps réel (< 500 ms) de la concordance absolue entre l'identité du patient scanné, le lit occupé, le régime prescrit et l'absence d'interdiction médicale (« À Jeun »). | `Patient`, `Tray`, `AuditLog` |
| **RG-MOB-03** | En cas de discordance entre le bracelet et le plateau, ou si le patient est signalé « À Jeun », l'application mobile déclenche une alarme rouge sonore bloquante et consigne immédiatement l'incident dans le registre anti-fraude. | `AuditLog`, `Tray` |
| **RG-MOB-04** | En cas de conformité totale, le plateau passe à l'état `LIVRE_CONFORME` et la transaction est horodatée avec mention du soignant certificateur. | `Tray`, `AuditLog` |
| **RG-AUD-01** | Tout plateau sorti de la cuisine centrale et non scanné au lit dans un délai imparti de 45 minutes déclenche une alerte rouge de dépassement thermique sur le tableau de bord de la direction. | `Tray`, `Cart`, `AuditLog` |
| **RG-AUD-02** | Le registre du journal d'audit (`AuditLog`) est infalsifiable et strictement immuable : aucune mise à jour ni suppression manuelle n'est autorisée sur les événements de scan certifiés. | `AuditLog` |
| **RG-HAC-01** | Les températures des chambres froides positives doivent être surveillées en continu et demeurer dans la plage légale de +2°C à +4°C ; les chambres froides négatives doivent être à <= -18°C. | `ColdRoom` |
| **RG-HAC-02** | Un plat témoin scellé de 100g de chaque préparation servie en restauration collective doit être prélevé à chaque service et conservé en chambre froide pendant 7 jours francs révolus. | `SampleMeal` |
| **RG-HAC-03** | Tout plat chaud en liaison chaude ou en maintien bain-marie doit être mesuré et enregistré à une température strictement supérieure ou égale à +63,0°C. | `HotTempLog` |
| **RG-POS-01** | Chaque membre du personnel hospitalier est identifié par son matricule RH unique encodé sur son badge sans contact RFID. | `StaffMember` |
| **RG-POS-02** | Le compte du personnel fonctionne sur un modèle prépayé débité à chaque passage en caisse selon le tarif de la formule ou de l'article choisi. | `StaffMember`, `PosArticle`, `PosTransaction` |
| **RG-POS-03** | Un découvert exceptionnel autorisé d'un montant maximal équivalent à un repas standard (35,00 MAD) est accordé pour garantir la continuité du service soignant. | `StaffMember`, `PosTransaction` |
| **RG-POS-04** | La formule « Collation Garde Nuit » destinée aux équipes de garde nocturne est tarifée à 0,00 MAD et prise en charge à 100% par la clinique. | `PosArticle`, `PosTransaction` |
| **RG-POS-05** | Le rechargement du solde du badge peut s'effectuer par paliers prédéfinis (+100 MAD, +200 MAD, +500 MAD) par carte bancaire, espèces ou retenue sur salaire RH. | `StaffMember`, `PosTransaction` |
| **RG-STK-01** | La gestion des denrées alimentaires en économat applique strictement la méthode **FEFO** (*First Expired, First Out*) selon la Date Limite de Consommation la plus proche. | `StockItem` |
| **RG-STK-02** | Lorsque le stock physique d'une denrée franchit à la baisse son seuil critique de sécurité (`physicalStock <= thresholdStock`), le système génère automatiquement un Bon de Commande fournisseur en attente de validation. | `StockItem`, `PurchaseOrder` |
| **RG-STK-03** | La validation d'un Bon de Commande par l'économe déclenche le changement de statut en `TRANSMIS`, lance l'ordre d'impression du bon d'achat et notifie le fournisseur agréé. | `PurchaseOrder` |
| **RG-STK-04** | Tout écart de rendement matières premières déstockées par rapport aux portions théoriques déclarées supérieur à 3% génère automatiquement une alerte d'audit adressée à la Direction Financière. | `StockItem`, `ProductionRun`, `AuditLog` |
