# Petit Bonus

## Schematics
Depuis la version 5, Angular introduit les schematics, des templates de fichiers customizables, NGRX à créer des schémas pour vous permettre d'avoir vos stores, reducers, effects ... en ligne de commande :

```javascript
ng generate effect App --root --module app.module.ts --collection @ngrx/schematics

```
Disponible sur ce lien : **[@ngrx/schematics](https://github.com/ngrx/platform/blob/master/docs/schematics/README.md)**  .



## Testings basics

Les fichiers **specs** de tests sont mis à jour sur la branche step-13 ainsi que les imports des modules pour faciliter la gestion de dépendances.

![Karma](https://github.com/fausfore/ngrx-guide/blob/master/assets/images/karma.png)

## Change Detection OnPush


Angular effectue la détection des modifications sur tous les components (de haut en bas) chaque fois que quelque chose change dans votre application à partir d'un événement utilisateur ou de données reçues d'une requête réseau.

La détection des changements est très performante, mais au fur et à mesure que l'application devient plus complexe et que la quantité de composants augmente, la détection des changements devra effectuer de plus en plus de travail. 

Il existe cependant un moyen de contourner cela et de définir la stratégie de détection des modifications sur OnPush sur des composants spécifiques. Cela demandera à Angular d'exécuter la détection des modifications sur ces composants et leur sous-arborescence uniquement lorsque de nouvelles références leur sont transmises et lorsque les données sont simplement mutées.

Article : https://alligator.io/angular/change-detection-strategy/


Pour faire simple l'architechure Ngrx permet d'être d'appliquer le **OnPush** sur tous vos components un gain de performance gratuit.
<!--stackedit_data:
eyJoaXN0b3J5IjpbMjEyNjgyMzMxMV19
-->