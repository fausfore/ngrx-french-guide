# Petit Bonus

## Schematics
Dans sa version 5, Angular introduit les **schematics**  (*templates* de fichiers personnalisés).
NGRX a crée des schémas pour permettre d'avoir des *stores*, *reducers*, *effects* ... en ligne de commande :

```javascript
ng generate effect App --root --module app.module.ts --collection @ngrx/schematics

```
Disponible sur ce lien : **[@ngrx/schematics](https://github.com/ngrx/platform/blob/master/docs/schematics/README.md)**  .



## Testings basics

Les fichiers **.specs** de test sont mis à jour sur la branche **step-13** ainsi que les *imports* des modules, pour faciliter la gestion des dépendances.

![Karma](https://github.com/fausfore/ngrx-guide/blob/master/assets/images/karma.png)

## Change Detection OnPush


>Angular effectue la détection des modifications sur tous les components (de haut en bas) chaque fois que quelque chose change dans votre application, à partir d'un événement utilisateur ou de données reçues d'une requête.

La détection des changements est très performante, mais au fur et à mesure que l'application devient plus complexe et que la quantité de composants augmentent, la détection des changements devra effectuer de plus en plus de travail. 

Il existe cependant un moyen de le contourner et de définir la stratégie de détection des modifications sur OnPush sur des composants spécifiques. Cela demandera à Angular d'exécuter la détection des modifications sur ces composants et leur sous-arborescence uniquement lorsque de nouvelles références leur sont transmises et lorsque les données sont  mutées.

Article : https://alligator.io/angular/change-detection-strategy/


Pour faire simple l'architechure Ngrx permet d'appliquer le **OnPush** sur tous vos components.
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTk3MDQzOTk0MF19
-->