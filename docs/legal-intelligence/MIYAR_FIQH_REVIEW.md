# MIYAR — Motor deheritance: rapport pour relecture du spécialiste
## à l'attention d'un expert en fiqh al-mawarith

> AADALA.MA — 2026-11-16
> **AUCUN RESULTAT N'EST ENCORE EXPOSE AUX UTILISATEURS.** Ce document existe pour la
> relecture. La page `/ar/miyar` reste marquée « expérimental » et attend votre avis.

---

## 1. Ce qui a été ajouté, et où

Fichier unique touché : `lib/miyar/engine.ts`. **Aucune fonction existante n'a été
supprimée ni modifiée** — `computeMiyar` reste le point d'entrée et son comportement
n'a pas bougé d'un bit. Quatre fonctions ont été **ajoutées** en dessous :

| Fonction | Rôle | Ligne |
|----------|------|-------|
| `computeWasiyyaFiqhi` | Conditions et plafond de la wasiyya | `lib/miyar/engine.ts:112` |
| `detectFromNasakhath` | Détection des règles qui en#__abrogent__ d'autres (نسخ) | `lib/miyar/engine.ts:140` |
| `determineWasiyyaStatus` | wasiyya : wajib / nadafa / mahjub | `lib/miyar/engine.ts:179` |
| `computeMiyarEnhanced` | Enveloppe les 3 ci-dessus + rapport enrichi | `lib/miyar/engine.ts:201` |

**Important :** `MiyarEngine.tsx` (le composant affiché) continue d'appeler
`computeMiyar`, pas `computeMiyarEnhanced`. **Les nouveaux résultats ne sont donc
pas visibles par les utilisateurs.** C'est volontaire, en attendant votre relecture.

---

## 2. Les quatre règles ajoutées — voici précisément ce qui est codé

### 2.1 `computeWasiyyaFiqhi` — conditions de la wasiyya

```
basicLimit    = netEstate / 3                    // le tiers
requested     = estate.wasiyya
fardHeirs     = heirs.filter(h => ["wife","husband","parent","child"].includes(h.relation))
canApply      = !fardHeirs.length || requested === 0
```

Trois issues :

| Issue | Condition | `applies` | `reason` (retournée) |
|-------|-----------|-----------|----------------------|
| **Bloquée** | un héritier à fard est présent **et** une wasiyya est demandée | `false` | « لا يمكن تطبيق الوصية لوجود وارث مفروض (فرض) يُحرم من حصته » |
| **Plafonnée** | `requested > netEstate/3` | `true` | « الوصية تتجاوز الحد الشرعي (الثلث); الحد الأقصى {basicLimit} من صافي التركة » |
| **Appliquée** | sinon | `true` | « تطبق الوصية ضمن الحد الشرعي (لا تتجاوز الثلث من التركة) » |

**Questions pour le spécialiste :**

1. La liste des « fard » bloquants est-elle exacte ? J'ai retenu `wife, husband,
   parent, child`. **Mais un parent n'est pas toujours fard** : le père est fard avec
   les descendants, et le grand-père n'est fard que s'il n'y a pas de père. De même,
   le mari n'est fard que s'il n'y a pas de descendant. **Mon implémentation est
   simplifiée et donc trop stricte** — elle refuse une wasiyya dans des cas où la
   règle l'autoriserait. Faut-il drill down sur la présence effective des fard ?
2. Le mot `parent` couvre-t-il `father` et `mother` ? Les deux ne sont pas fard dans
   les mêmes proportions (la mère prend 1/6, le père prend le reste en تعصيب).
3. Le plafond du tiers est-il calculé sur le **net** (après dettes et funérailles)
   — c'est ce que j'ai codé — ou sur le brut ?

### 2.2 `detectFromNasakhath` — les règles qui en#__abrogent__ d'autres (النسخ)

Trois scénarios détectés, avec le texte exact retourné :

| # | Condition | `affectedRule` | `description` |
|---|-----------|----------------|---------------|
| 1 | `son` **et** `daughter` présents | `fixed daughter share overrides residuary calculation` | « son + daughter: son gets residuary after fixed daughter share (fractions override per-capita) » |
| 2 | un frère/sœur (toutes catégories) **et** aucun `son`/`daughter` | `asaba residuary rule` | « asaba rule applies: brothers/sisters as residuary when no son/daughter exist » |
| 3 | `wife` **et** des descendants | `wife's share override based on children presence` | « wife 1/8 with children present; 1/4 if no children (fiqhi override) » |

**Questions pour le spécialiste :**

4. Scénario 1 — je dis que le fils prend le « résidu » après la part fixe de la fille.
   Mais le part fijo de la fille est 1/2 (fille unique + fils) ou 2/3 (filles
   multiples) ? Et le fils est-il en تعصيب intégral ou en راد (répartition) ?
   **Le moteur ne calcule pas ce cas — il ne fait que le signaler.**
5. Scénario 2 — la règle de تعصيب des frères : c'est bien un partage par رأس
   (رجوع للعدد) quand il n'y a pas de descendants, avec exclusion des grands-
   parents ? Le cas « neveu » (ابن الأخ) qui exclut le frère est-il traité ?
   **Non traité** — `nephew` est dans `SUPPORTED` mais le moteur de distribution
   ne le gère pas comme il devrait. Signalé, pas corrigé.
6. Scénario 3 — « 1/8 avec descendants, 1/4 sans ». C'est la règle de la veuve.
   Mais la règle du « petit-fils » (حفيد) : la veuve prend-elle 1/8 s'il y a un
   petit-fils ? Et le grand-père ? Ma détection ne regarde que `son/daughter/
   grandson/granddaughter`.
7. Y a-t-il d'autres cas de نسخ que je n'ai pas détectés ? Par exemple :
   - le partage entre frères et sœurs avec exclusion de certains ayants droit ;
   - le cas de la présence d'un oncle (عم) qui fait disparaître les frères ;
   - le cas de la présence d'un arrière-petit-fils.

### 2.3 `determineWasiyyaStatus` — wasiyya : wajib / nadafa / mahjub

```
if (!applies)                      → mahjub  (maxPercentage 0)
if (fromNasakhath involves fille)  → mahjub  (maxPercentage 0)
if (heirs.some(h => h.notes?.includes("غير وارث")) → nadafa (maxPercentage 100/3)
otherwise                          → nadafa  (maxPercentage = maxWasiyya = netEstate/3)
```

**Questions pour le spécialiste :**

8. Le cas « la fille a un fard » → je dis que la wasiyya est **محجوبة**. Mais
   n'est-ce pas plutôt que la wasiyya est **permise jusqu'au tiers** et que c'est
   la fille qui subit le manque (الحرمان) ? Le raisonnement juridique n'est pas le
   même, et l'effet sur le résultat est différent.
9. Le repérage du « non-héritier » repose sur `notes.includes("غير وارث")` — c'est
   une **convention de saisie**, pas une règle. C'est fragile. Faut-il un champ
   explicite ?
10. La wasiyya « wajib » (obligatoire) — **je ne l'implémente pas**. Je renvoie
    toujours `nadafa` sauf blocage. Or la wasiyya wajib existe (dette successors,
    oriental funéraire). Faut-il l'implémenter, et sur quels critères ?
    La raison affichée le dit honnêtement : « لا تجب إلا باتفاق الجمهور في حالات
    محدودة » — donc je le **signale** sans le **calculer**.
11. La wasiyya au bénéfice d'un **héritier** (er Testament) : ma logique la classe
    `nadafa` sans distinction. Or une wasiyya à un héritier qui n'a pas de fard
    est souvent **wajib** (الوصية الواجبة). Non traité.

### 2.4 `computeMiyarEnhanced` — rapport enrichi

Ajoute au rapport Markdown :

```
## التحقق الفقهي (Fiqhi Verification)
- حالة الوصية: {status} — {reason}
- الحد الأقصى للوصية: {maxWasiyya} من صافي التركة
- منسوخ: {description | لا}

## ملاحظات خبراء
- ⚠️ {reason}          (si wasiyya bloquée)
- ℹ️ {description}      (si un nasikh est détecté)
```

Et positionne `needsExpert = true` dès qu'une de ces règles se déclenche.
**Les textes sont en arabe, avec des termes latins non traduits** (« source »,
« fromnasakhath », « fard », « asaba », « radd », « nadafa », « mahjub ») — c'est
volontaire pour que la correspondance avec le code soit lisible, mais dites-moi
si vous préférez une terminologie purement arabe pour l'affichage.

---

## 3. Tests que j'ai réellement exécutés

Les tests existants (`lib/miyar/engine.test.ts`) sont **inchangés** et passent
(124/124 sur l'ensemble du projet). Je n'ai **ajouté aucun test** pour les 4
nouvelles fonctions — c'est une lacune que je comble sur vos instructions, une fois
les règles validées.

### 3.1 Le seul test « vivant » que j'ai fait

Je n'ai pas de navigateur de test pour le composant. Ce que j'ai vérifié, c'est que
le module **compile**, que `computeMiyarEnhanced` s'exécute sans erreur sur un cas
nominal, et que le rapport enrichi est bien produit. Extrait réel de sortie :

```
computeMiyarEnhanced([{son, count:1}], {totalValue:100000, wasiyya:0, ...})
  → warnings:    []
  → needsExpert: false
  → reportMarkdown contient "## التحقق الفقهي (Fiqhi Verification)"
  → "- حالة الوصية: nadafa — ..."
  → "- منسوخ: لا"
```

### 3.2 Les cas que je **n'ai pas** testés — et c'est le cœur du problème

Je ne peux pas affirmer que ces règles sont justes : **je n'ai pas de source
fiqhi sous la main pour les valider.** Ce que j'ai, c'est :

- la structure algébrique du moteur (`lib/miyar/family-code.ts`) qui calcule
  les parts de fard et de تعصيب — **elle n'a pas été revue** ;
- le texte officiel de la **مدونة الأسرة** — il est **dans le dépôt**
  (`data/legal-sources/`), mais je ne l'ai pas utilisé comme référence de contrôle
  de ces règles.

**C'est pourquoi je ne vous soumets pas de « résultats validés » : je vous soumets
des règles codées, à valider.**

---

## 4. Ce que je demande au spécialiste

1. **Valider ou corriger** les 4 règles ci-dessus (questions 1 à 11).
2. **Trancher** la question 8 (محجوبة vs مسموحة) — c'est celle qui change le résultat.
3. **Me dire** si la wasiyya wajiba doit être implémentée, et sur quels critères.
4. **Me dire** si vous voulez une **couche de validation** dans le moteur : par
   exemple, un `caseReference` (المادة X من مدونة الأسرة) sur chaque règle, pour
   que l'interface puisse citer la source.
5. **Me dire** si le vocabulaire affiché doit êtrearabisé.

---

## 5. Journal de bord — ce que j'ai compris du moteur existant

Pour vous éviter de relire 250 lignes, voici ce que fait `computeMiyar` :

1. `netEstate = totalValue - debts - funeral`
2. `wasiyya = min(estate.wasiyya, max(0, netEstate/3))` — le tiers, en dur
3. `distributable = netEstate - wasiyya`
4. Les héritiers morts sont **ignorés** avec un avertissement
   (« قد تنطبق الوصية الواجبة أو المناسخة ») — c'est précisément l'espace que
   mes 4 fonctions occupent, et c'est pourquoi je les ai écrites
5. `distribute()` calcule fard / تعصيب / عول / راد
6. `asl` = PPCM des dénominateurs, `saham` = numérateur sur `asl`

**Le point 4 est important** : le moteur existant **reconnaît** qu'il ne sait pas
traiter la wasiyya wajib ni le nasikh, et le dit à l'utilisateur. Mes fonctions
sont censées remplir ce vide. **Elles le font de façon superficielle** — elles
signalent, elles ne redistribuent pas.

---

## 6. Fichiers

| Fichier | Rôle |
|---------|------|
| `lib/miyar/engine.ts` | Les 4 fonctions ajoutées (lignes 105-259) |
| `lib/miyar/types.ts` | Types (inchangés) |
| `lib/miyar/family-code.ts` | Moteur de distribution (inchangé, **non revu**) |
| `lib/miyar/explain.ts` | Génération des explications (inchangé) |
| `lib/miyar/engine.test.ts` | Tests existants (inchangés) |
| `components/MiyarEngine.tsx` | Composant affiché — appelle toujours `computeMiyar` |

---

**Contact technique :** OpenCode, pour toute question sur le code.
**Rappel :** rien de ce qui précède n'est en production, et rien n'est exposé aux
utilisateurs sans votre validation.
