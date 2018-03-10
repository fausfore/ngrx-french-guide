# Petit Bonus

## Schematics
Depuis la version 5, Angular introduit les schematics.


**[@ngrx/schematics](https://github.com/ngrx/platform/blob/master/docs/schematics/README.md)**  fournit des templates pour générer des fichiers type reducer, effect, etc ...
Extension du devkit de [*angular/schematics*](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2) , il s'intègre au CLI Angular pour faciliter la mise en place et l'extension de NgRx au sein d'une application.

Avec ça vous pouvez directement créer des éléments Ngrx en ligne de commande

```javascript
ng generate effect App --root --module app.module.ts --collection @ngrx/schematics

```

## Testings basics

Les fichiers specs de tests sont mis à jour sur la branche step-13 ainsi que les imports au niveau des modules pour facilité la rédaction de test

![Karma](https://github.com/fausfore/ngrx-guide/blob/master/assets/images/karma.png)

## Change Detection OnPush


Angular effectue la détection des modifications sur tous les components (de haut en bas) chaque fois que quelque chose change dans votre application à partir d'un événement utilisateur ou de données reçues d'une requête réseau.

La détection des changements est très performante, mais au fur et à mesure que l'application devient plus complexe et que la quantité de composants augmente, la détection des changements devra effectuer de plus en plus de travail. 

Il existe cependant un moyen de contourner cela et de définir la stratégie de détection des modifications sur OnPush sur des composants spécifiques. Cela demandera à Angular d'exécuter la détection des modifications sur ces composants et leur sous-arborescence uniquement lorsque de nouvelles références leur sont transmises et lorsque les données sont simplement mutées.

Article : https://alligator.io/angular/change-detection-strategy/


Pour faire simple l'architechure Ngrx permet d'être d'appliquer le **OnPush** sur tous vos components un gain de performance gratuit.
<!--stackedit_data:
eyJoaXN0b3J5IjpbMjAzOTQxNzEwMV19
-->