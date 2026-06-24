# KITEA Room Remix

Prototype tablette paysage 16:9 pour le parcours "Réaménagez votre pièce avec KITEA".

## Lancer

```bash
pnpm install
pnpm dev
```

## Ce qui est couvert

- Accueil KITEA, choix pièce, choix style, import QR/téléphone, caméra tablette, mode démonstration.
- Analyse IA simulée en moins de 15 secondes.
- Avant/après, produits recommandés, orientation rayon/allée/zone, QR de récupération.
- Redirection vers l'animation "Roue des Coupons".
- Back-office visuel pour import Excel/CSV/API, gestion catalogue, rayons, magasins, leads et simulations.

## Point d'intégration réel

Le fichier `data/catalog.ts` représente la base catalogue KITEA. En production, cette couche serait remplacée par PostgreSQL + import Excel/CSV/API catalogue, avec images stockées sur S3 ou Firebase Storage. La génération IA doit recevoir uniquement les produits issus de cette base et rejeter toute référence hors catalogue.
