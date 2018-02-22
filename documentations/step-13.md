## schematics

Depuis la version 5 de Ngrx et de Angular qui a introduit les schematics


Bibliothèque d'échafaudages pour applications angulaires utilisant des bibliothèques NgRx.

**[@ngrx/schematics](https://github.com/ngrx/platform/blob/master/docs/schematics/README.md)**  fournit des templates pour générer des fichiers type reducer, effect, etc ...
Extension du devkit de [*angular/schematics*](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2) , il s'intègre au CLI Angular pour faciliter la mise en place et l'extension de NgRx au sein d'une application.

Avec ça vous pouvez directement créer des éléments Ngrx en ligne de commande

```javascript
ng generate effect App --root --module app.module.ts --collection @ngrx/schematics

```
