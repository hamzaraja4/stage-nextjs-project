git # MATRICE DES DROITS D'ACCÈS ET OPÉRATIONS CRUD
## Système d'Information de Restauration Hospitalière & Sécurité Alimentaire (HIS-Catering)

---

## 1. Définition des Acteurs et Profils Applicatifs

Dans l'architecture du système, 6 profils d'acteurs opérationnels et décisionnels sont définis :

1. **ADMIN** : Direction Médicale, Direction des Systèmes d'Information et Contrôle de Gestion.
2. **CHEF** : Chef de Cuisine Centrale, Chef de Partie et Économe principal.
3. **SOIGNANT** : Infirmier(e) d'étage, Aide-soignant(e), Responsable de distribution au lit.
4. **CAISSE** : Agent de caisse de la cantine / cafétéria du personnel.
5. **QUALITE** : Responsable Hygiène, Diététicien(ne) clinique et Auditeur HACCP.
6. **MAGASINIER** : Gestionnaire des stocks de denrées, approvisionneur et réceptionnaire.

---

## 2. Légende des Droits CRUD

* **C** (*Create*) : Droit de création d'un nouvel enregistrement.
* **R** (*Read*) : Droit de consultation et d'affichage des données.
* **U** (*Update*) : Droit de modification et mise à jour d'un enregistrement existant.
* **D** (*Delete*) : Droit de suppression physique ou logique.
* **—** : Aucun accès autorisé (accès refusé).

---

## 3. Matrice Globale Acteurs / Entités

| Entité Métier | ADMIN | CHEF | SOIGNANT | CAISSE | QUALITE | MAGASINIER |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`Role`** | CRUD | R | — | — | R | — |
| **`User`** | CRUD | R | — | — | R | — |
| **`ServiceUnit`** | CRUD | R | R | — | R | R |
| **`Room`** | CRUD | R | R | — | R | — |
| **`Bed`** | CRUD | R | R | — | R | — |
| **`Diet`** | CRUD | CRU | R | — | CRUD | — |
| **`Patient`** | CRUD | R | RU (À Jeun) | — | R | — |
| **`Tray`** | CRUD | CRUD | RU (Scan/Remise) | — | R | — |
| **`ProductionRun`** | CRUD | CRUD | R | — | R | R |
| **`Cart`** | CRUD | CRU | RU (Réception) | — | R | — |
| **`EmergencyFridge`**| CRUD | RU | RU (Sortie nuit) | — | R | — |
| **`AuditLog`** | R (Export) | R | C (Double scan) | — | R (Audit) | — |
| **`StaffMember`** | CRUD | — | R (Son profil) | CRU (Solde) | — | — |
| **`PosArticle`** | CRUD | R | R (Menu) | R | — | — |
| **`PosTransaction`** | R (Clôture) | — | R (Ses débits) | CR | — | — |
| **`StockItem`** | CRUD | CRU | — | — | R | CRUD |
| **`PurchaseOrder`** | CRUD | CRU | — | — | — | CRU |
| **`ColdRoom`** | CRUD | RU | — | — | CRUD | R |
| **`SampleMeal`** | CRUD | CRU | — | — | CRUD | — |
| **`HotTempLog`** | CRUD | CRU | — | — | CRUD | — |

---

## 4. Spécifications Détaillées des Permissions Critiques

### 4.1 Sécurité de la Procédure « À JEUN » (Patient & Tray)
* Le profil **SOIGNANT** dispose d'une autorisation médicale prioritaire lui permettant de basculer l'attribut `isAJeun` d'un patient à `VRAI`.
* Cette action met à jour automatiquement les plateaux en statut `A_JEUN_BLOQUE` et génère un événement critique dans `AuditLog`.
* Ni le chef de cuisine ni l'agent de caisse ne peuvent lever une consigne médicale de mise à jeun sans validation préalable du personnel soignant.

### 4.2 Inviolabilité du Registre Anti-Fraude (AuditLog)
* L'entité **`AuditLog`** fonctionne selon le principe du registre à écriture unique (*Append-Only* / WORM).
* Aucun profil, y compris l'administrateur système, ne dispose des droits de modification (**U**) ou de suppression (**D**).
* Seule la création automatique (**C**) lors de la transmission du scan terminal mobile et la lecture (**R**) à des fins d'inspection sont permises.

### 4.3 Monétique du Personnel (StaffMember & PosTransaction)
* L'agent de **CAISSE** a le droit d'effectuer des transactions de débit et de rechargement (**C** sur `PosTransaction`, entraînant l'**U** du solde `StaffMember`).
* La modification directe du solde sans pièce justificative ou transaction associée est interdite par les règles de comptabilité hospitalière.

### 4.4 Approvisionnement & Commandes Fournisseurs (PurchaseOrder)
* L'économe (**CHEF**) et le **MAGASINIER** préparent les ordres d'achats (**CRU**).
* La validation finale et le paiement comptable relèvent de la direction clinique (**ADMIN**).
