# MODÈLE LOGIQUE DE DONNÉES (MLD) — MERISE
## Système d'Information de Restauration Hospitalière & Sécurité Alimentaire (HIS-Catering)

---

## 1. Principes et Règles de Passage MCD -> MLD

La dérivation du **Modèle Conceptuel de Données (MCD)** vers le **Modèle Logique de Données Relationnel (MLD)** applique les théorèmes standards de la méthode **MERISE** :

### Règle 1 : Association binaire aux cardinalités (1,1) — (0,n) ou (1,1) — (1,n)
* **Principe** : La clé primaire de l'entité située du côté `(0,n)` ou `(1,n)` migre dans la relation située du côté `(1,1)` où elle devient une **clé étrangère (FK)** obligatoire (`NOT NULL`).
* **Applications dans le projet** :
  * `COMPORTER` (SERVICE_UNIT 1,n — 1,1 CHAMBRE) : `id_service` migre dans `CHAMBRE` en clé étrangère `serviceUnitId*`.
  * `CONTENIR` (CHAMBRE 1,n — 1,1 LIT) : `id_chambre` migre dans `LIT` en clé étrangère `roomId*`.
  * `OCCUPER` (LIT 0,n — 1,1 PATIENT) : `id_lit` migre dans `PATIENT` en clé étrangère `bedId*`.
  * `HEBERGER` (SERVICE_UNIT 0,n — 1,1 PATIENT) : `id_service` migre dans `PATIENT` en `serviceUnitId*`.
  * `PRESCRIRE` (REGIME 0,n — 1,1 PATIENT) : `id_regime` migre dans `PATIENT` en `dietId*`.
  * `DESTINER` (PATIENT 0,n — 1,1 PLATEAU) : `id_patient` migre dans `PLATEAU` en `patientId*`.
  * `RESPECTER` (REGIME 0,n — 1,1 PLATEAU) : `id_regime` migre dans `PLATEAU` en `dietId*`.
  * `DESSERVIR` (SERVICE_UNIT 0,n — 1,1 CHARIOT) : `id_service` migre dans `CHARIOT` en `serviceUnitId*`.
  * `PROGRAMMER` (REGIME 0,n — 1,1 LOT_PRODUCTION) : `id_regime` migre dans `LOT_PRODUCTION` en `dietId*`.
  * `OPERER` (MEMBRE_PERSONNEL 0,n — 1,1 TRANSACTION_POS) : `id_personnel` migre dans `TRANSACTION_POS` en `staffMemberId*`.
  * `ACHETER` (ARTICLE_SELF 0,n — 1,1 TRANSACTION_POS) : `id_article` migre dans `TRANSACTION_POS` en `articleId*`.
  * `ATTRIBUER` (ROLE 0,n — 1,1 UTILISATEUR) : `id_role` migre dans `UTILISATEUR` en `roleId*`.

### Règle 2 : Association binaire aux cardinalités (0,1) — (0,n)
* **Principe** : La clé primaire de l'entité côté `(0,n)` migre dans la relation côté `(0,1)` en tant que **clé étrangère nullable** (`NULL` possible).
* **Applications dans le projet** :
  * `TRANSPORTER` (CHARIOT 0,n — 0,1 PLATEAU) : Un plateau en cours de dressage n'est pas encore assigné à un chariot. `id_chariot` migre dans `PLATEAU` sous le nom `cartId*` (nullable).
  * `CONCERNER` (PATIENT 0,n — 0,1 JOURNAL_AUDIT) : Un audit de contrôle technique global ou de recalage système peut ne pas être lié à un séjour actif. `id_patient` migre dans `JOURNAL_AUDIT` sous le nom `patientId*` (nullable).

### Règle 3 : Association de type (0,n) — (0,n) ou (1,n) — (1,n)
* **Principe** : Création d'une table associative de jonction dont la clé primaire est la concaténation des clés primaires des entités participantes.
* **Situation dans le projet** : Chaque repas est nominatif pour un patient et un créneau, et chaque transaction de caisse concerne un article précis. Le schéma relationnel ne nécessite pas de table associative N:N directe superflue, ce qui optimise les performances de lecture.

### Règle 4 : Associations porteuses de propriétés
* Les propriétés de traçabilité (horodatage, température, statut) sont directement portées par les tables d'événements et d'exécution (`PLATEAU`, `TRANSACTION_POS`, `JOURNAL_AUDIT`).

### Règle 5 : Traitement des entités faibles (Identification relative)
* `CHAMBRE` et `LIT` dépendent fonctionnellement de leur unité d'hébergement. Le MLD assure cette cohérence par des clés étrangères obligatoires et des index composites d'unicité (`numero_chambre + serviceUnitId`, `code_lit + roomId`).

---

## 2. Formalisme Textuel Relationnel du MLD

Conventions de notation :
* Clé primaire précédée du symbole **`#`**
* Clé étrangère suivie du symbole **`*`**

1. **ROLE** (#id, name, type, createdAt)
2. **USER** (#id, name, email, roleId*, createdAt, updatedAt)
3. **SERVICE_UNIT** (#id, code, name, floor)
4. **ROOM** (#id, number, serviceUnitId*)
5. **BED** (#id, code, roomId*)
6. **DIET** (#id, code, name, texture, description)
7. **PATIENT** (#id, ipp, firstName, lastName, serviceUnitId*, bedId*, dietId*, isAJeun, aJeunReason, createdAt, updatedAt)
8. **TRAY** (#id, patientId*, dietId*, cartId*, qrToken, status, mealService, starter, mainCourse, sideDish, dessert, allergens, isExtraAccompagnant, extraDescription, isBlocked, createdAt, updatedAt)
9. **PRODUCTION_RUN** (#id, code, mealService, dietId*, quantity, status, productionDate, createdAt, updatedAt)
10. **CART** (#id, code, serviceUnitId*, traysCount, tempHot, tempCold, status, scannedBy, departureTime, createdAt, updatedAt)
11. **EMERGENCY_FRIDGE** (#id, name, service, capacityTrays, capacitySnacks, availableTrays, lastConsumedAt, lastConsumedInfo, updatedAt)
12. **AUDIT_LOG** (#id, timestamp, patientId*, patientName, ipp, location, agentName, mealType, scanResult, scanDuration, status)
13. **STAFF_MEMBER** (#id, name, role, matricule, balance, createdAt, updatedAt)
14. **POS_ARTICLE** (#id, name, subtitle, price, icon, isNightShift)
15. **POS_TRANSACTION** (#id, reference, type, status, paymentMethod, staffMemberId*, articleId*, amount, createdAt, updatedAt)
16. **STOCK_ITEM** (#id, name, physicalStock, unit, thresholdStock, dlc, statusAlert, updatedAt)
17. **PURCHASE_ORDER** (#id, code, supplier, itemDetails, amount, status, createdAt)
18. **COLD_ROOM** (#id, name, type, temperature, normMin, normMax, lastCheckAt, sensorType)
19. **SAMPLE_MEAL** (#id, mealService, content, sampledDate, daysLeft, isSealed)
20. **HOT_TEMP_LOG** (#id, dishOrDevice, temperature, isCompliant, recordedAt)

---

## 3. Spécification Complète des Tables Logiques

### Table : ROLE
* **Clé primaire** : `#id`
* **Contrainte d'unicité** : `name` (UNIQUE)

### Table : USER
* **Clé primaire** : `#id`
* **Clé étrangère** : `roleId*` référence `ROLE(#id)` [ON DELETE RESTRICT, ON UPDATE CASCADE]
* **Contrainte d'unicité** : `email` (UNIQUE)

### Table : SERVICE_UNIT
* **Clé primaire** : `#id`
* **Contrainte d'unicité** : `code` (UNIQUE)

### Table : ROOM
* **Clé primaire** : `#id`
* **Clé étrangère** : `serviceUnitId*` référence `SERVICE_UNIT(#id)` [ON DELETE CASCADE, ON UPDATE CASCADE]
* **Contrainte composite** : `(number, serviceUnitId)`

### Table : BED
* **Clé primaire** : `#id`
* **Clé étrangère** : `roomId*` référence `ROOM(#id)` [ON DELETE CASCADE, ON UPDATE CASCADE]
* **Contrainte composite** : `(code, roomId)`

### Table : DIET
* **Clé primaire** : `#id`
* **Contrainte d'unicité** : `code` (UNIQUE)

### Table : PATIENT
* **Clé primaire** : `#id`
* **Clés étrangères** :
  * `serviceUnitId*` référence `SERVICE_UNIT(#id)` [ON DELETE RESTRICT]
  * `bedId*` référence `BED(#id)` [ON DELETE RESTRICT]
  * `dietId*` référence `DIET(#id)` [ON DELETE RESTRICT]
* **Contrainte d'unicité** : `ipp` (UNIQUE)

### Table : TRAY
* **Clé primaire** : `#id`
* **Clés étrangères** :
  * `patientId*` référence `PATIENT(#id)` [ON DELETE CASCADE]
  * `dietId*` référence `DIET(#id)` [ON DELETE RESTRICT]
  * `cartId*` référence `CART(#id)` [ON DELETE SET NULL] (nullable)
* **Contrainte d'unicité** : `qrToken` (UNIQUE)
* **Contrainte de domaine** : `status IN ('PREPARATION', 'SCELLE_QR', 'A_JEUN_BLOQUE', 'PRET_DEPART', 'EN_DISTRIBUTION', 'LIVRE_CONFORME', 'DISCORDANCE')`

### Table : PRODUCTION_RUN
* **Clé primaire** : `#id`
* **Clé étrangère** : `dietId*` référence `DIET(#id)` [ON DELETE RESTRICT]
* **Contrainte d'unicité** : `code` (UNIQUE)

### Table : CART
* **Clé primaire** : `#id`
* **Clé étrangère** : `serviceUnitId*` référence `SERVICE_UNIT(#id)` [ON DELETE RESTRICT]
* **Contrainte d'unicité** : `code` (UNIQUE)

### Table : EMERGENCY_FRIDGE
* **Clé primaire** : `#id`
* **Contrainte d'unicité** : `name` (UNIQUE)

### Table : AUDIT_LOG
* **Clé primaire** : `#id`
* **Clé étrangère** : `patientId*` référence `PATIENT(#id)` [ON DELETE SET NULL] (nullable)
* **Contrainte d'intégrité** : Journal immuable (interdiction logique de modification/suppression).

### Table : STAFF_MEMBER
* **Clé primaire** : `#id`
* **Contrainte d'unicité** : `matricule` (UNIQUE)

### Table : POS_ARTICLE
* **Clé primaire** : `#id`

### Table : POS_TRANSACTION
* **Clé primaire** : `#id`
* **Clés étrangères** :
  * `staffMemberId*` référence `STAFF_MEMBER(#id)` [ON DELETE RESTRICT]
  * `articleId*` référence `POS_ARTICLE(#id)` [ON DELETE RESTRICT]

### Table : STOCK_ITEM
* **Clé primaire** : `#id`
* **Contrainte de domaine** : `physicalStock >= 0`, `thresholdStock >= 0`

### Table : PURCHASE_ORDER
* **Clé primaire** : `#id`
* **Contrainte d'unicité** : `code` (UNIQUE)

### Table : COLD_ROOM
* **Clé primaire** : `#id`
* **Contrainte de domaine** : `normMin <= normMax`

### Table : SAMPLE_MEAL
* **Clé primaire** : `#id`
* **Contrainte légale** : `daysLeft >= 0` (Délai légal de conservation de 7 jours)

### Table : HOT_TEMP_LOG
* **Clé primaire** : `#id`
* **Contrainte sanitaire HACCP** : Liaison chaude conforme si `temperature >= 63.0`

---

## 4. Analyse de la Normalisation (1FN, 2FN, 3FN)

### Première Forme Normale (1FN)
* **Critère** : Tous les attributs sont atomiques (indivisibles) et chaque entité possède une clé primaire identifiante sans groupe répétitif.
* **Validation** : Respectée sur l'ensemble des tables. Les listes d'allergènes et de composantes de repas sont stockées sous forme de libellés descriptifs finis ; les plateaux et transactions sont chacun représentés par un enregistrement distinct.

### Deuxième Forme Normale (2FN)
* **Critère** : Le schéma est en 1FN et tout attribut non-clé dépend pleinement et en totalité de la clé primaire (pas de dépendance partielle vis-à-vis d'une partie de la clé).
* **Validation** : Toutes les clés primaires sont mono-attributs (`#id`), ce qui garantit par définition mathématique le respect absolu de la 2FN (aucune dépendance partielle possible).

### Troisième Forme Normale (3FN)
* **Critère** : Le schéma est en 2FN et il n'existe aucune dépendance fonctionnelle transitive entre attributs non-clés (un attribut non-clé ne doit pas dépendre d'un autre attribut non-clé).
* **Validation** :
  * Dans `PATIENT`, les attributs de localisation (`serviceUnitId*`, `bedId*`) font référence aux tables parentes correspondantes sans duplication de libellés.
  * Dans `AUDIT_LOG`, une dénormalisation contrôlée (`patientName`, `ipp`, `location`) est volontairement appliquée afin de figer l'état au moment précis du scan : en cas de sortie ou de transfert du patient, le registre légal d'audit demeure immuable et historiquement exact (conformité traçabilité médico-légale).
