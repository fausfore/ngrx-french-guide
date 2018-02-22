

## NGRX - ENTITY

### Début de la branche step-12

Cette partie est consacré a de l'optimisation de performance, dans le cas ou notre todo-list contient des milliers de todos on aurez une baisse des performance car car sur chaque action on réalise une itération et si notre todo-list de sois plus un array de todo mais plutôt une **entité** de todo, lors d'un changement on aurai besoin que d'un **object[key]** pour mettre à jour la liste et c'est là que vient [Ngrx/entity](https://github.com/ngrx/platform/blob/master/docs/entity/README.md) ce 
<!--stackedit_data:
eyJoaXN0b3J5IjpbOTY2MDQ3MDY4XX0=
-->