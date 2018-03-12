# Sommaire
*10/03/2018*

Ceci est un tutoriel pour débuter sur **NGRX**.
Vous verrez les différents concepts de cette librairie par le biais d'un exercice de création d'une **todo-list**, ainsi que l'optimisation de notre application par l'utilisation du pattern **Redux**.

>Actuellement **Ngrx** est en *version 5* ainsi que **Angular**.

### [0 - Introduction](https://github.com/fausfore/ngrx-guide/blob/master/documentations/introduction.md)
1.  #### Redux, kesako ?
2.  #### Pourquoi Redux alors ?
3.  #### Flux vs Redux
4.  #### Le Store, la base de tout
5.  ####  Le root reducer
6.  #### Le schéma
7.  #### Les actions
8.  ####  Action creator

### [1 - De Redux à NGRX](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-1.md)
1.  #### Installation
2.  #### Architecture Folder
3.  #### Commençons ! [ début du tutoriel ]

### [2 - Getters & create todo](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-2.md)
1.  #### Le Pipe et les opérateurs RXJS
2.  #### Les States Selectors
3.  #### Créer une todo

### [3 - Delete todo](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-3.md)
1.  #### Gérer les ids

### [4 - Un peu de refacto !](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-4.md)
1.  #### @Alias

### [5 - Select & Update Todo](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-5.md)

### [6 - Créer une API](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-6.md)
1.  #### Service Angular Get Todo
2.  #### Introduction de Effects

### [7 - Load Guard & DevTools](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-7.md)
1.  #### Redux Devtools

### [8 - Create Todo v2](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-8.md)

### [9 - Delete Todo v2](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-9.md)

### [10 - Update Todo v2](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-10.md)

### [11 - Les actions de type ERROR](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-11.md)
1.  #### Système de logs

### [12 - @Ngrx/Entity](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-12.md)

### [13 - Bonus Stage](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-13.md)
1.  #### Schematics
2.  #### Basics testing 
3.  #### Change Detection OnPush

### [14 - Advanced testing ](https://github.com/fausfore/ngrx-guide/blob/master/documentations/step-14.md)
1.  #### Mocks
2.  #### Actions
3.  #### Reducers
4.  #### Selectors
5.  #### Effects

## Conclusion 

J’espère que ce tutoriel vous aura permis de comprendre NGRX et son implémentation.
Il reste des points comme les **Meta-reducers** ou le **router-store** que vous pouvez retrouver sur le [gitHub officelle de NGRX](https://github.com/ngrx/platform).

Un autre utilitaire intéressant, le module [ngrx-actions](https://github.com/amcdnl/ngrx-actions).
Il vous permettra de réduire votre code *reduxien* avec des décorateurs.


*Auteur : **@Fausfore / Matias Ljubica***

<!--stackedit_data:
eyJoaXN0b3J5IjpbNTkxODU0NTMwLDE4MjA3MzExMTAsMTU2Nz
MzMTY0Ml19
-->