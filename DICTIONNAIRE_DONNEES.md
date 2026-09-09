# DICTIONNAIRE DE DONNÉES CONCEPTUEL
## Système d'Information de Restauration Hospitalière & Sécurité Alimentaire (HIS-Catering)

---

## 1. Principes du Typage Logique / Conceptuel

Conformément aux normes d'ingénierie logicielle et de modélisation MERISE, ce dictionnaire utilise exclusivement des **types logiques et conceptuels** :
* **Identifiant** : Clé d'identification unique universelle.
* **Texte** : Chaîne de caractères alphanumérique avec indication de taille maximale conceptuelle.
* **Entier** : Nombre entier naturel ou relatif (quantités, compteurs).
* **Décimal** : Nombre à virgule fixe ou flottante de précision (températures, montants).
* **Booléen** : Indicateur logique binaire (`Vrai` / `Faux`).
* **Date** : Date calendaire sans information horaire.
* **DateHeure** : Horodatage précis (date et heure).
* **Enumération** : Domaine fini de valeurs autorisées prédéfinies.

---

## 2. Table Complète du Dictionnaire de Données

| Entité | Attribut | Description | Type logique | Taille | Null | Unique | PK | FK |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ROLE** | id | Identifiant unique du rôle | Identifiant | 36 | Non | Oui | Oui | Non |
| **ROLE** | name | Nom unique du rôle (chef, soignant, etc.) | Texte | 50 | Non | Oui | Non | Non |
| **ROLE** | type | Catégorie fonctionnelle du profil | Texte | 50 | Non | Non | Non | Non |
| **ROLE** | createdAt | Date et heure de création | DateHeure | - | Non | Non | Non | Non |
| **USER** | id | Identifiant unique de l'utilisateur | Identifiant | 36 | Non | Oui | Oui | Non |
| **USER** | name | Nom et prénom de l'utilisateur | Texte | 120 | Non | Non | Non | Non |
| **USER** | email | Adresse électronique professionnelle | Texte | 150 | Non | Oui | Non | Non |
| **USER** | roleId | Référence au rôle attribué | Identifiant | 36 | Non | Non | Non | Oui (ROLE) |
| **USER** | createdAt | Date et heure de création | DateHeure | - | Non | Non | Non | Non |
| **USER** | updatedAt | Date et heure de dernière modification | DateHeure | - | Non | Non | Non | Non |
| **SERVICE_UNIT** | id | Identifiant unique du service | Identifiant | 36 | Non | Oui | Oui | Non |
| **SERVICE_UNIT** | code | Code mnémonique du service | Texte | 30 | Non | Oui | Non | Non |
| **SERVICE_UNIT** | name | Intitulé complet du service | Texte | 100 | Non | Non | Non | Non |
| **SERVICE_UNIT** | floor | Étage d'implantation dans la clinique | Texte | 30 | Non | Non | Non | Non |
| **ROOM** | id | Identifiant unique de la chambre | Identifiant | 36 | Non | Oui | Oui | Non |
| **ROOM** | number | Numéro physique de la chambre | Texte | 10 | Non | Non | Non | Non |
| **ROOM** | serviceUnitId | Référence au service de rattachement | Identifiant | 36 | Non | Non | Non | Oui (SERVICE_UNIT) |
| **BED** | id | Identifiant unique du lit | Identifiant | 36 | Non | Oui | Oui | Non |
| **BED** | code | Lettre / code du lit dans la chambre | Texte | 10 | Non | Non | Non | Non |
| **BED** | roomId | Référence à la chambre d'hébergement | Identifiant | 36 | Non | Non | Non | Oui (ROOM) |
| **DIET** | id | Identifiant unique du régime alimentaire | Identifiant | 36 | Non | Oui | Oui | Non |
| **DIET** | code | Code mnémonique du régime | Texte | 40 | Non | Oui | Non | Non |
| **DIET** | name | Libellé médical du régime | Texte | 100 | Non | Non | Non | Non |
| **DIET** | texture | Texture requise (Normale, Lisse, Mixé) | Texte | 50 | Non | Non | Non | Non |
| **DIET** | description | Description clinique et restrictions | Texte | 255 | Oui | Non | Non | Non |
| **PATIENT** | id | Identifiant unique du patient | Identifiant | 36 | Non | Oui | Oui | Non |
| **PATIENT** | ipp | Identifiant Permanent du Patient | Texte | 30 | Non | Oui | Non | Non |
| **PATIENT** | firstName | Prénom du patient | Texte | 60 | Non | Non | Non | Non |
| **PATIENT** | lastName | Nom de famille du patient | Texte | 60 | Non | Non | Non | Non |
| **PATIENT** | serviceUnitId | Référence au service d'hospitalisation | Identifiant | 36 | Non | Non | Non | Oui (SERVICE_UNIT) |
| **PATIENT** | bedId | Référence au lit assigné | Identifiant | 36 | Non | Non | Non | Oui (BED) |
| **PATIENT** | dietId | Référence au régime prescrit | Identifiant | 36 | Non | Non | Non | Oui (DIET) |
| **PATIENT** | isAJeun | Indicateur médical de mise à jeun stricte | Booléen | - | Non | Non | Non | Non |
| **PATIENT** | aJeunReason | Motif médical du jeûne (Bloc, Examen) | Texte | 150 | Oui | Non | Non | Non |
| **PATIENT** | createdAt | Date et heure d'enregistrement | DateHeure | - | Non | Non | Non | Non |
| **PATIENT** | updatedAt | Date et heure de dernière mise à jour | DateHeure | - | Non | Non | Non | Non |
| **TRAY** | id | Identifiant unique du plateau | Identifiant | 36 | Non | Oui | Oui | Non |
| **TRAY** | patientId | Référence au patient destinataire | Identifiant | 36 | Non | Non | Non | Oui (PATIENT) |
| **TRAY** | dietId | Référence au régime conforme | Identifiant | 36 | Non | Non | Non | Oui (DIET) |
| **TRAY** | cartId | Référence au chariot de tournée (optionnel) | Identifiant | 36 | Oui | Non | Non | Oui (CART) |
| **TRAY** | qrToken | Jeton cryptographique unique du QR code | Texte | 50 | Non | Oui | Non | Non |
| **TRAY** | status | Statut du plateau dans la chaîne | Enumération | 30 | Non | Non | Non | Non |
| **TRAY** | mealService | Service de repas (Déjeuner, Dîner) | Texte | 30 | Non | Non | Non | Non |
| **TRAY** | starter | Désignation de l'entrée servie | Texte | 120 | Oui | Non | Non | Non |
| **TRAY** | mainCourse | Désignation du plat de résistance chaud | Texte | 150 | Oui | Non | Non | Non |
| **TRAY** | sideDish | Désignation de la garniture / féculent | Texte | 120 | Oui | Non | Non | Non |
| **TRAY** | dessert | Désignation du dessert / laitage / fruit | Texte | 120 | Oui | Non | Non | Non |
| **TRAY** | allergens | Mentions d'allergènes ou exclusions | Texte | 150 | Oui | Non | Non | Non |
| **TRAY** | isExtraAccompagnant | Présence d'une prestation accompagnant | Booléen | - | Non | Non | Non | Non |
| **TRAY** | extraDescription | Détail de la prestation supplémentaire | Texte | 150 | Oui | Non | Non | Non |
| **TRAY** | isBlocked | Blocage de sécurité actif | Booléen | - | Non | Non | Non | Non |
| **TRAY** | createdAt | Date et heure d'assemblage du plateau | DateHeure | - | Non | Non | Non | Non |
| **TRAY** | updatedAt | Date et heure du dernier changement d'état | DateHeure | - | Non | Non | Non | Non |
| **PRODUCTION_RUN** | id | Identifiant unique du lot de production | Identifiant | 36 | Non | Oui | Oui | Non |
| **PRODUCTION_RUN** | code | Référence du lot de fabrication | Texte | 40 | Non | Oui | Non | Non |
| **PRODUCTION_RUN** | mealService | Créneau du repas (Déjeuner, Dîner) | Texte | 30 | Non | Non | Non | Non |
| **PRODUCTION_RUN** | dietId | Référence au régime préparé | Identifiant | 36 | Non | Non | Non | Oui (DIET) |
| **PRODUCTION_RUN** | quantity | Nombre total de portions programmées | Entier | - | Non | Non | Non | Non |
| **PRODUCTION_RUN** | status | État d'avancement de la cuisson | Enumération | 30 | Non | Non | Non | Non |
| **PRODUCTION_RUN** | productionDate | Date calendaire de la session cuisine | DateHeure | - | Non | Non | Non | Non |
| **PRODUCTION_RUN** | createdAt | Date d'ordonnancement du lot | DateHeure | - | Non | Non | Non | Non |
| **PRODUCTION_RUN** | updatedAt | Date de révision de l'ordre | DateHeure | - | Non | Non | Non | Non |
| **CART** | id | Identifiant unique du chariot | Identifiant | 36 | Non | Oui | Oui | Non |
| **CART** | code | Numéro d'identification du chariot | Texte | 30 | Non | Oui | Non | Non |
| **CART** | serviceUnitId | Référence au service de destination | Identifiant | 36 | Non | Non | Non | Oui (SERVICE_UNIT) |
| **CART** | traysCount | Nombre de plateaux scellés embarqués | Entier | - | Non | Non | Non | Non |
| **CART** | tempHot | Température mesurée du compartiment chaud | Décimal | - | Non | Non | Non | Non |
| **CART** | tempCold | Température mesurée du compartiment froid | Décimal | - | Non | Non | Non | Non |
| **CART** | status | État logistique du chariot | Enumération | 30 | Non | Non | Non | Non |
| **CART** | scannedBy | Nom de l'agent responsable du départ | Texte | 100 | Oui | Non | Non | Non |
| **CART** | departureTime | Heure effective de sortie de cuisine | DateHeure | - | Oui | Non | Non | Non |
| **CART** | createdAt | Date de mise en tournée | DateHeure | - | Non | Non | Non | Non |
| **CART** | updatedAt | Date de dernière mesure thermique | DateHeure | - | Non | Non | Non | Non |
| **EMERGENCY_FRIDGE** | id | Identifiant unique du frigo relais | Identifiant | 36 | Non | Oui | Oui | Non |
| **EMERGENCY_FRIDGE** | name | Nom d'identification de l'équipement | Texte | 100 | Non | Oui | Non | Non |
| **EMERGENCY_FRIDGE** | service | Service d'implantation d'étage | Texte | 60 | Non | Non | Non | Non |
| **EMERGENCY_FRIDGE** | capacityTrays | Capacité maximale en plateaux froids | Entier | - | Non | Non | Non | Non |
| **EMERGENCY_FRIDGE** | capacitySnacks | Capacité maximale en collations | Entier | - | Non | Non | Non | Non |
| **EMERGENCY_FRIDGE** | availableTrays | Nombre de plateaux disponibles | Entier | - | Non | Non | Non | Non |
| **EMERGENCY_FRIDGE** | lastConsumedAt | Date et heure de la dernière consommation | DateHeure | - | Oui | Non | Non | Non |
| **EMERGENCY_FRIDGE** | lastConsumedInfo | Détails de la consommation (chambre/heure) | Texte | 120 | Oui | Non | Non | Non |
| **EMERGENCY_FRIDGE** | updatedAt | Date de dernier réassort / pointage | DateHeure | - | Non | Non | Non | Non |
| **AUDIT_LOG** | id | Identifiant de la trace d'audit | Identifiant | 36 | Non | Oui | Oui | Non |
| **AUDIT_LOG** | timestamp | Horodatage certifié de l'événement | DateHeure | - | Non | Non | Non | Non |
| **AUDIT_LOG** | patientId | Référence au patient contrôlé | Identifiant | 36 | Oui | Non | Non | Oui (PATIENT) |
| **AUDIT_LOG** | patientName | Nom et prénom archivés du patient | Texte | 120 | Non | Non | Non | Non |
| **AUDIT_LOG** | ipp | Numéro d'IPP archivé au moment du scan | Texte | 30 | Non | Non | Non | Non |
| **AUDIT_LOG** | location | Chambre et lit archivés | Texte | 80 | Non | Non | Non | Non |
| **AUDIT_LOG** | agentName | Identité du soignant réalisant le scan | Texte | 100 | Non | Non | Non | Non |
| **AUDIT_LOG** | mealType | Type de repas contrôlé | Texte | 60 | Non | Non | Non | Non |
| **AUDIT_LOG** | scanResult | Résultat du double scan (Conforme, Alerte) | Texte | 60 | Non | Non | Non | Non |
| **AUDIT_LOG** | scanDuration | Latence de vérification biomédicale | Texte | 20 | Non | Non | Non | Non |
| **AUDIT_LOG** | status | Mention de certification d'inviolabilité | Texte | 40 | Non | Non | Non | Non |
| **STAFF_MEMBER** | id | Identifiant unique de l'employé | Identifiant | 36 | Non | Oui | Oui | Non |
| **STAFF_MEMBER** | name | Nom et titre de l'agent (ex: Dr. Mehdi) | Texte | 120 | Non | Non | Non | Non |
| **STAFF_MEMBER** | role | Spécialité ou métier hospitalier | Texte | 60 | Non | Non | Non | Non |
| **STAFF_MEMBER** | matricule | Numéro matricule RH unique du badge RFID | Texte | 30 | Non | Oui | Non | Non |
| **STAFF_MEMBER** | balance | Solde du porte-monnaie prépayé (MAD) | Décimal | - | Non | Non | Non | Non |
| **STAFF_MEMBER** | createdAt | Date de création du compte cantine | DateHeure | - | Non | Non | Non | Non |
| **STAFF_MEMBER** | updatedAt | Date du dernier mouvement financier | DateHeure | - | Non | Non | Non | Non |
| **POS_ARTICLE** | id | Identifiant unique de l'article | Identifiant | 36 | Non | Oui | Oui | Non |
| **POS_ARTICLE** | name | Libellé commercial de la prestation | Texte | 100 | Non | Non | Non | Non |
| **POS_ARTICLE** | subtitle | Détail descriptif du contenu du menu | Texte | 150 | Non | Non | Non | Non |
| **POS_ARTICLE** | price | Prix unitaire facturé (MAD) | Décimal | - | Non | Non | Non | Non |
| **POS_ARTICLE** | icon | Symbole ou icône d'affichage tactile | Texte | 30 | Non | Non | Non | Non |
| **POS_ARTICLE** | isNightShift | Gratuité intégrale pour garde de nuit | Booléen | - | Non | Non | Non | Non |
| **POS_TRANSACTION** | id | Identifiant unique de la transaction | Identifiant | 36 | Non | Oui | Oui | Non |
| **POS_TRANSACTION** | reference | Numéro de reçu ou ticket de caisse | Texte | 40 | Oui | Non | Non | Non |
| **POS_TRANSACTION** | type | Type de mouvement (DEBIT, RECHARGE) | Enumération | 20 | Non | Non | Non | Non |
| **POS_TRANSACTION** | status | Statut de validation de la transaction | Enumération | 20 | Non | Non | Non | Non |
| **POS_TRANSACTION** | paymentMethod | Mode de paiement (RFID, ESPECES, CB) | Texte | 30 | Non | Non | Non | Non |
| **POS_TRANSACTION** | staffMemberId | Référence au compte de l'agent débité | Identifiant | 36 | Non | Non | Non | Oui (STAFF_MEMBER) |
| **POS_TRANSACTION** | articleId | Référence à l'article consommé | Identifiant | 36 | Non | Non | Non | Oui (POS_ARTICLE) |
| **POS_TRANSACTION** | amount | Montant débité ou crédité (MAD) | Décimal | - | Non | Non | Non | Non |
| **POS_TRANSACTION** | createdAt | Date et heure de l'opération | DateHeure | - | Non | Non | Non | Non |
| **POS_TRANSACTION** | updatedAt | Date de régularisation comptable | DateHeure | - | Oui | Non | Non | Non |
| **STOCK_ITEM** | id | Identifiant unique de la denrée | Identifiant | 36 | Non | Oui | Oui | Non |
| **STOCK_ITEM** | name | Dénomination exacte de la denrée | Texte | 120 | Non | Non | Non | Non |
| **STOCK_ITEM** | physicalStock | Quantité physique actuellement en stock | Décimal | - | Non | Non | Non | Non |
| **STOCK_ITEM** | unit | Unité de mesure (Kg, Litres, Unités) | Texte | 20 | Non | Non | Non | Non |
| **STOCK_ITEM** | thresholdStock | Seuil minimum de sécurité | Décimal | - | Non | Non | Non | Non |
| **STOCK_ITEM** | dlc | Date Limite de Consommation la plus proche | Date | - | Non | Non | Non | Non |
| **STOCK_ITEM** | statusAlert | Libellé du statut d'approvisionnement | Texte | 50 | Non | Non | Non | Non |
| **STOCK_ITEM** | updatedAt | Date du dernier inventaire / déstockage | DateHeure | - | Non | Non | Non | Non |
| **PURCHASE_ORDER** | id | Identifiant unique du bon de commande | Identifiant | 36 | Non | Oui | Oui | Non |
| **PURCHASE_ORDER** | code | Référence du bon de commande (BC-2026) | Texte | 40 | Non | Oui | Non | Non |
| **PURCHASE_ORDER** | supplier | Raison sociale du fournisseur sélectionné | Texte | 120 | Non | Non | Non | Non |
| **PURCHASE_ORDER** | itemDetails | Détail des denrées et volumes à livrer | Texte | 200 | Non | Non | Non | Non |
| **PURCHASE_ORDER** | amount | Montant estimé de la commande (MAD) | Décimal | - | Oui | Non | Non | Non |
| **PURCHASE_ORDER** | status | État du bon (GENERE, TRANSMIS, RECU) | Enumération | 30 | Non | Non | Non | Non |
| **PURCHASE_ORDER** | createdAt | Date et heure d'émission du bon | DateHeure | - | Non | Non | Non | Non |
| **COLD_ROOM** | id | Identifiant de l'enceinte frigorifique | Identifiant | 36 | Non | Oui | Oui | Non |
| **COLD_ROOM** | name | Intitulé de la chambre froide | Texte | 80 | Non | Non | Non | Non |
| **COLD_ROOM** | type | Type de froid (Positive, Négative) | Texte | 30 | Non | Non | Non | Non |
| **COLD_ROOM** | temperature | Dernière température relevée (°C) | Décimal | - | Non | Non | Non | Non |
| **COLD_ROOM** | normMin | Borne basse réglementaire autorisée (°C) | Décimal | - | Non | Non | Non | Non |
| **COLD_ROOM** | normMax | Borne haute réglementaire autorisée (°C) | Décimal | - | Non | Non | Non | Non |
| **COLD_ROOM** | lastCheckAt | Date et heure de transmission de la sonde | DateHeure | - | Non | Non | Non | Non |
| **COLD_ROOM** | sensorType | Nom de la technologie de télémesure IoT | Texte | 60 | Non | Non | Non | Non |
| **SAMPLE_MEAL** | id | Identifiant unique du plat témoin | Identifiant | 36 | Non | Oui | Oui | Non |
| **SAMPLE_MEAL** | mealService | Service de prélèvement du plat (Déjeuner J) | Texte | 60 | Non | Non | Non | Non |
| **SAMPLE_MEAL** | content | Composantes du menu prélevé | Texte | 150 | Non | Non | Non | Non |
| **SAMPLE_MEAL** | sampledDate | Date de mise sous scellé réglementaire | DateHeure | - | Non | Non | Non | Non |
| **SAMPLE_MEAL** | daysLeft | Jours restants avant destruction autorisée | Entier | - | Non | Non | Non | Non |
| **SAMPLE_MEAL** | isSealed | Intégrité physique du scellé hermétique | Booléen | - | Non | Non | Non | Non |
| **HOT_TEMP_LOG** | id | Identifiant unique du relevé chaud | Identifiant | 36 | Non | Oui | Oui | Non |
| **HOT_TEMP_LOG** | dishOrDevice | Nom de la préparation ou bain-marie | Texte | 120 | Non | Non | Non | Non |
| **HOT_TEMP_LOG** | temperature | Température à cœur mesurée (°C) | Décimal | - | Non | Non | Non | Non |
| **HOT_TEMP_LOG** | isCompliant | Conforme à la norme HACCP (>= +63°C) | Booléen | - | Non | Non | Non | Non |
| **HOT_TEMP_LOG** | recordedAt | Date et heure de la mesure manuelle | DateHeure | - | Non | Non | Non | Non |
