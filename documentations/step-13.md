## schematics

Depuis la version 5 de Ngrx et de Angular qui a introduit les schematics


Bibliothèque d'échafaudages pour applications angulaires utilisant des bibliothèques NgRx.

**[@ngrx/schematics](https://github.com/ngrx/platform/blob/master/docs/schematics/README.md)**  fournit des templates pour générer des fichiers type reducer, effect, etc ...
Extension du devkit de [*angular/schematics*](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2) , il s'intègre au CLI Angular pour faciliter la mise en place et l'extension de NgRx au sein d'une application.

Avec ça vous pouvez directement créer des éléments Ngrx en ligne de commande

```javascript
ng generate effect App --root --module app.module.ts --collection @ngrx/schematics

```

## Testings

Les fichiers specs de test sont mis à jour sur la branche step-13 (  ) ainsi que les imports au niveau des modules pour faciliter la rédaction de test

![Karma](https://github.com/fausfore/ngrx-guide/blob/master/assets/images/karma.png)
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTUyODcxMDc0OF19
-->