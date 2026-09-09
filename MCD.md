# MODÈLE CONCEPTUEL DE DONNÉES (MCD) — MERISE
## Système d'Information de Restauration Hospitalière & Sécurité Alimentaire (HIS-Catering)

---

## 1. Principes Méthodologiques MERISE Respectés

Le présent document est élaboré selon les principes stricts du niveau **Conceptuel** de la méthode **MERISE** :
* **Indépendance vis-à-vis des contraintes d'implémentation physique et des SGBD** : Aucun type technique SQL (`VARCHAR`, `INT`, `BIGINT`, `UUID`, `TIMESTAMP`), aucun index physique, aucune clé étrangère (`FK`) ne figure dans le modèle conceptuel.
* **Typage conceptuel sémantique** : Seuls les types de données abstraits et sémantiques sont utilisés : `Identifiant`, `Texte`, `Numérique`, `Monétaire`, `Booléen`, `Date`, `Heure`, `DateHeure`, `Température`.
* **Formalisme des associations** : Chaque relation est modélisée par une association nommée à l'infinitif, caractérisée par ses cardinalités minimales et maximales `(min, max)` vis-à-vis de chacune des entités participantes.
* **Principe d'identification** : Chaque entité possède une propriété soulignée et discriminante servant d'identifiant conceptuel pérenne.

---

## 2. Inventaire Détaillé des Entités Conceptuelles

### Domaine 1 : Structure Médicale & Patients
1. **SERVICE_UNIT** (Unité de Soin Clinique)
   * *Description* : Département hospitalier assurant la prise en charge médicale des patients (ex: Chirurgie, Médecine Interne, Maternité).
   * *Identifiant* : <u>id_service</u> (Identifiant)
   * *Propriétés* : code_service (Texte), nom_service (Texte), etage (Texte)

2. **CHAMBRE** (Chambre d'Hospitalisation)
   * *Description* : Pièce d'hébergement rattachée à un service donné.
   * *Identifiant* : <u>id_chambre</u> (Identifiant)
   * *Propriétés* : numero_chambre (Texte)

3. **LIT** (Lit d'Hospitalisation)
   * *Description* : Emplacement nominatif au sein d'une chambre (ex: Lit A, Lit B).
   * *Identifiant* : <u>id_lit</u> (Identifiant)
   * *Propriétés* : code_lit (Texte)

4. **REGIME** (Prescription Diététique)
   * *Description* : Protocole nutritionnel médical prescrit (textures, restrictions sel/glucides, exclusions).
   * *Identifiant* : <u>id_regime</u> (Identifiant)
   * *Propriétés* : code_regime (Texte), intitule_regime (Texte), texture (Texte), description (Texte)

5. **PATIENT** (Patient Hospitalisé)
   * *Description* : Personne admise, identifiée par son numéro d'IPP unique, liée à un lit et soumise à un régime.
   * *Identifiant* : <u>id_patient</u> (Identifiant)
   * *Propriétés* : ipp (Texte), nom (Texte), prenom (Texte), est_a_jeun (Booléen), motif_a_jeun (Texte), date_creation (DateHeure)

### Domaine 2 : Production & Distribution des Repas
6. **PLATEAU** (Plateau-Repas Patient)
   * *Description* : Repas complet assemblé, sécurisé par un jeton QR code cryptographique, soumis au contrôle d'état et de mise à jeun.
   * *Identifiant* : <u>id_plateau</u> (Identifiant)
   * *Propriétés* : jeton_qr (Texte), statut_distribution (Texte), service_repas (Texte), entree (Texte), plat_principal (Texte), garniture (Texte), dessert (Texte), allergenes (Texte), extra_accompagnant (Booléen), desc_extra (Texte), est_bloque (Booléen), date_creation (DateHeure)

7. **CHARIOT** (Chariot Isotherme)
   * *Description* : Chariot de transport assurant le maintien de liaison chaude (>= +63°C) et froide (<= +3°C).
   * *Identifiant* : <u>id_chariot</u> (Identifiant)
   * *Propriétés* : code_chariot (Texte), nombre_plateaux (Numérique), temp_chaud (Température), temp_froid (Température), statut_logistique (Texte), operateur_depart (Texte), date_depart (DateHeure)

8. **LOT_PRODUCTION** (Ordre de Confection Cuisine)
   * *Description* : Planification de fabrication groupée par service de repas et régime alimentaire.
   * *Identifiant* : <u>id_lot</u> (Identifiant)
   * *Propriétés* : code_lot (Texte), service_repas (Texte), quantite_planifiee (Numérique), statut_production (Texte), date_production (DateHeure)

### Domaine 3 : Traçabilité, HACCP & Sécurité Sanitaire
9. **CHAMBRE_FROIDE** (Enceinte Frigorifique)
   * *Description* : Équipement frigorifique de cuisine centrale surveillé par capteurs IoT.
   * *Identifiant* : <u>id_enceinte</u> (Identifiant)
   * *Propriétés* : nom_enceinte (Texte), type_froid (Texte), temperature_mesuree (Température), norme_min (Température), norme_max (Température), date_derniere_mesure (DateHeure), capteur_iot (Texte)

10. **PLAT_TEMOIN** (Échantillon Réglementaire)
    * *Description* : Prélèvement réglementaire de 100g conservé sous scellé pendant 7 jours légaux.
    * *Identifiant* : <u>id_temoin</u> (Identifiant)
    * *Propriétés* : service_repas (Texte), composition_menu (Texte), date_prelevement (DateHeure), jours_restants (Numérique), est_scelle (Booléen)

11. **RELEVE_TEMPERATURE_CHAUDE** (Liaison Chaude Cuisson)
    * *Description* : Relevé de température en liaison chaude supérieure ou égale à +63°C.
    * *Identifiant* : <u>id_releve</u> (Identifiant)
    * *Propriétés* : designation_preparation (Texte), temperature_mesuree (Température), est_conforme (Booléen), date_releve (DateHeure)

12. **FRIGO_URGENCE** (Frigo Relais d'Étage)
    * *Description* : Réserve tampon de nuit pour collations d'admission imprévue.
    * *Identifiant* : <u>id_frigo</u> (Identifiant)
    * *Propriétés* : nom_frigo (Texte), localisation_service (Texte), capacite_plateaux (Numérique), capacite_collations (Numérique), plateaux_disponibles (Numérique), date_derniere_conso (DateHeure), info_conso (Texte)

13. **JOURNAL_AUDIT** (Journal Anti-Fraude Double Scan)
    * *Description* : Registre horodaté infalsifiable certifiant la conformité de chaque remise au lit.
    * *Identifiant* : <u>id_audit</u> (Identifiant)
    * *Propriétés* : date_heure (DateHeure), nom_patient_trace (Texte), ipp_trace (Texte), localisation_chambre (Texte), nom_soignant (Texte), type_repas (Texte), resultat_scan (Texte), duree_scan (Texte), statut_conformite (Texte)

### Domaine 4 : Caisse & Restauration du Personnel (POS)
14. **MEMBRE_PERSONNEL** (Compte Agent Hospitalier)
    * *Description* : Employé hospitalier bénéficiant de la cantine et identifié par badge RFID.
    * *Identifiant* : <u>id_personnel</u> (Identifiant)
    * *Propriétés* : matricule_rh (Texte), nom_complet (Texte), fonction_hospitaliere (Texte), solde_porte_monnaie (Monétaire)

15. **ARTICLE_SELF** (Article de Restauration Personnel)
    * *Description* : Formule repas, plat chaud, entrée, boisson ou collation de nuit.
    * *Identifiant* : <u>id_article</u> (Identifiant)
    * *Propriétés* : libelle_article (Texte), description_formule (Texte), prix_unitaire (Monétaire), icone (Texte), est_garde_nuit (Booléen)

16. **TRANSACTION_POS** (Débit / Recharge Caisse)
    * *Description* : Mouvement financier opéré sur le solde du personnel (badge RFID).
    * *Identifiant* : <u>id_transaction</u> (Identifiant)
    * *Propriétés* : reference_operation (Texte), type_operation (Texte), mode_reglement (Texte), montant (Monétaire), statut_paiement (Texte), date_transaction (DateHeure)

### Domaine 5 : Gestion des Stocks & Achats
17. **ARTICLE_STOCK** (Denrée en Économat)
    * *Description* : Denrée alimentaire stockée avec seuil d'alerte et suivi de péremption FEFO.
    * *Identifiant* : <u>id_denree</u> (Identifiant)
    * *Propriétés* : designation_denree (Texte), unite_mesure (Texte), stock_physique (Numérique), seuil_alerte (Numérique), date_limite_conso (Date), statut_alerte (Texte)

18. **BON_COMMANDE** (Approvisionnement Fournisseur)
    * *Description* : Bon d'achat émis automatiquement en cas de franchissement de seuil de sécurité.
    * *Identifiant* : <u>id_commande</u> (Identifiant)
    * *Propriétés* : code_bon (Texte), fournisseur (Texte), detail_denrees (Texte), montant_estime (Monétaire), statut_commande (Texte), date_emission (DateHeure)

### Domaine 6 : Administration & Contrôle d'Accès
19. **ROLE** (Profil d'Habilitation)
    * *Description* : Rôle applicatif déterminant les droits d'accès aux modules du progiciel.
    * *Identifiant* : <u>id_role</u> (Identifiant)
    * *Propriétés* : code_role (Texte), type_habilitation (Texte)

20. **UTILISATEUR** (Compte Utilisateur Système)
    * *Description* : Compte de connexion au logiciel HIS-Catering.
    * *Identifiant* : <u>id_utilisateur</u> (Identifiant)
    * *Propriétés* : nom_utilisateur (Texte), email_pro (Texte), date_creation (DateHeure)

---

## 3. Associations Conceptuelles et Explication des Cardinalités

| Association | Entité A | Card. A | Entité B | Card. B | Explication et Règle Métier |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **COMPORTER** | SERVICE_UNIT | 1,n | CHAMBRE | 1,1 | Un service comprend au minimum une chambre physique (1,n). Une chambre fait partie d'une seule unité de soin (1,1). |
| **CONTENIR** | CHAMBRE | 1,n | LIT | 1,1 | Une chambre contient un ou plusieurs lits (1,n). Un lit est physiquement rattaché à une seule chambre (1,1). |
| **OCCUPER** | LIT | 0,n | PATIENT | 1,1 | Un lit accueille successivement 0 ou plusieurs patients (0,n). Un patient hospitalisé occupe un unique lit (1,1). |
| **HEBERGER** | SERVICE_UNIT | 0,n | PATIENT | 1,1 | Un service accueille 0 ou plusieurs patients (0,n). Un patient est hospitalisé dans un unique service (1,1). |
| **PRESCRIRE** | REGIME | 0,n | PATIENT | 1,1 | Un protocole diététique est prescrit à 0 ou plusieurs patients (0,n). Chaque patient se voit prescrire un régime médical (1,1). |
| **DESTINER** | PATIENT | 0,n | PLATEAU | 1,1 | Un patient reçoit au fil de son séjour 0 ou plusieurs plateaux-repas (0,n). Un plateau est nominativement attribué à un patient (1,1). |
| **RESPECTER** | REGIME | 0,n | PLATEAU | 1,1 | Un régime est respecté par 0 ou plusieurs plateaux confectionnés (0,n). Chaque plateau respecte les contraintes d'un unique régime (1,1). |
| **TRANSPORTER**| CHARIOT | 0,n | PLATEAU | 0,1 | Un chariot isotherme transporte 0 ou plusieurs plateaux scellés (0,n). Un plateau est affecté à au plus 1 chariot, ou aucun en cours d'assemblage (0,1). |
| **DESSERVIR** | SERVICE_UNIT | 0,n | CHARIOT | 1,1 | Un service clinique est desservi par 0 ou plusieurs chariots (0,n). Un chariot isotherme dessert une unité de soin dédiée lors d'une tournée (1,1). |
| **PROGRAMMER** | REGIME | 0,n | LOT_PRODUCTION | 1,1 | Un régime alimentaire est programmé dans 0 ou plusieurs ordres de fabrication (0,n). Un lot est planifié pour un unique régime (1,1). |
| **CONCERNER** | PATIENT | 0,n | JOURNAL_AUDIT | 0,1 | Un patient peut être contrôlé lors de multiples distributions (0,n). Une entrée d'audit se rapporte à un patient (0,1 si scan hors séjour). |
| **OPERER** | MEMBRE_PERSONNEL | 0,n | TRANSACTION_POS | 1,1 | Un agent hospitalier effectue 0 ou plusieurs transactions de caisse (0,n). Une transaction POS débite/recharge le compte d'un seul agent (1,1). |
| **ACHETER** | ARTICLE_SELF | 0,n | TRANSACTION_POS | 1,1 | Un article ou formule du self est consommé lors de 0 ou plusieurs transactions (0,n). Une transaction de débit concerne un article donné (1,1). |
| **ATTRIBUER** | ROLE | 0,n | UTILISATEUR | 1,1 | Un rôle applicatif est attribué à 0 ou plusieurs utilisateurs (0,n). Un utilisateur possède obligatoirement un rôle principal (1,1). |

*Registres Réglementaires Autonomes (Normes HACCP & Logistique hospitalière) :*
* **CHAMBRE_FROIDE**, **PLAT_TEMOIN**, **RELEVE_TEMPERATURE_CHAUDE**, **FRIGO_URGENCE**, **ARTICLE_STOCK**, **BON_COMMANDE** fonctionnent comme des registres légaux autonomes historisés, sans couplage conceptuel rigide avec les dossiers patients, afin de garantir l'intégrité de la traçabilité sanitaire et d'économat même en cas d'admission d'urgence ou de sortie médicale.

---

## 4. Diagramme Visuel Entité-Association (Mermaid)

```mermaid
erDiagram
    SERVICE_UNIT ||--|{ CHAMBRE : "COMPORTER (1,n - 1,1)"
    CHAMBRE ||--|{ LIT : "CONTENIR (1,n - 1,1)"
    LIT ||--o{ PATIENT : "OCCUPER (0,n - 1,1)"
    SERVICE_UNIT ||--o{ PATIENT : "HEBERGER (0,n - 1,1)"
    REGIME ||--o{ PATIENT : "PRESCRIRE (0,n - 1,1)"

    PATIENT ||--o{ PLATEAU : "DESTINER (0,n - 1,1)"
    REGIME ||--o{ PLATEAU : "RESPECTER (0,n - 1,1)"
    CHARIOT ||--o{ PLATEAU : "TRANSPORTER (0,n - 0,1)"
    SERVICE_UNIT ||--o{ CHARIOT : "DESSERVIR (0,n - 1,1)"

    REGIME ||--o{ LOT_PRODUCTION : "PROGRAMMER (0,n - 1,1)"
    PATIENT ||--o{ JOURNAL_AUDIT : "CONCERNER (0,n - 0,1)"

    MEMBRE_PERSONNEL ||--o{ TRANSACTION_POS : "OPERER (0,n - 1,1)"
    ARTICLE_SELF ||--o{ TRANSACTION_POS : "ACHETER (0,n - 1,1)"

    ROLE ||--o{ UTILISATEUR : "ATTRIBUER (0,n - 1,1)"

    SERVICE_UNIT {
        Identifiant id_service
        Texte code_service
        Texte nom_service
        Texte etage
    }

    CHAMBRE {
        Identifiant id_chambre
        Texte numero_chambre
    }

    LIT {
        Identifiant id_lit
        Texte code_lit
    }

    PATIENT {
        Identifiant id_patient
        Texte ipp
        Texte nom
        Texte prenom
        Booleen est_a_jeun
        Texte motif_a_jeun
        DateHeure date_creation
    }

    REGIME {
        Identifiant id_regime
        Texte code_regime
        Texte intitule_regime
        Texte texture
        Texte description
    }

    PLATEAU {
        Identifiant id_plateau
        Texte jeton_qr
        Texte statut_distribution
        Texte service_repas
        Texte entree
        Texte plat_principal
        Texte garniture
        Texte dessert
        Texte allergenes
        Booleen extra_accompagnant
        Texte desc_extra
        Booleen est_bloque
        DateHeure date_creation
    }

    CHARIOT {
        Identifiant id_chariot
        Texte code_chariot
        Temperature temp_chaud
        Temperature temp_froid
        Texte statut_logistique
        Texte operateur_depart
        DateHeure date_depart
    }

    LOT_PRODUCTION {
        Identifiant id_lot
        Texte code_lot
        Texte service_repas
        Numerique quantite_planifiee
        Texte statut_production
        DateHeure date_production
    }

    JOURNAL_AUDIT {
        Identifiant id_audit
        DateHeure date_heure
        Texte nom_patient_trace
        Texte ipp_trace
        Texte localisation_chambre
        Texte nom_soignant
        Texte type_repas
        Texte resultat_scan
        Texte duree_scan
        Texte statut_conformite
    }

    MEMBRE_PERSONNEL {
        Identifiant id_personnel
        Texte matricule_rh
        Texte nom_complet
        Texte fonction_hospitaliere
        Monetaire solde_porte_monnaie
    }

    ARTICLE_SELF {
        Identifiant id_article
        Texte libelle_article
        Texte description_formule
        Monetaire prix_unitaire
        Texte icone
        Booleen est_garde_nuit
    }

    TRANSACTION_POS {
        Identifiant id_transaction
        Texte reference_operation
        Texte type_operation
        Texte mode_reglement
        Monetaire montant
        Texte statut_paiement
        DateHeure date_transaction
    }

    ROLE {
        Identifiant id_role
        Texte code_role
        Texte type_habilitation
    }

    UTILISATEUR {
        Identifiant id_utilisateur
        Texte nom_utilisateur
        Texte email_pro
        DateHeure date_creation
    }
}
```
