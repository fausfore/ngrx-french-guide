
# Introduction

Dans cette article, nous allons voir comment utiliser le pattern Redux dans une application Angular via NGRX.
Ce dernier proposant une conception du développement d'application autour d'actions utilisateur et serveur.

 Le but étant de supprimer les différentes mutations de données des composants et services Angular pour les centraliser dans un objet global, qui serait mutable uniquement par des actions typées.

> Pour le développement sur Angular, **Visual studio code** est fortement recommandé. 
> Vous devrez aussi installer Angular sur votre machine avec la commande **npm i -g @angular/cli**.

**Intérêt de NGRX**

- Le 1er avantage est le modèle **unidirectionnel** avec lequel nous travaillerons, ce qui n'est pas le cas du standard MVC qui est **bidirectionnel**.
- Le 2ème avantage est **"l'historisation"**. Comme tous les changements transitent par le store, chaque update/modification est loggé. Grâce à cela, nous pouvons remonter dans l'historique et trouver quelle mutation a créée un bug : c'est une sorte de **state machine**.

Comme Angular peut être utilisé avec **typescript** , NRGX profite également du typage qui va verrouiller nos actions et ainsi lever plus tôt les erreurs en cours de développement.




<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1600/1*xORdWwOFLR-6D4ghvUa6AA.png">
</p>

## Redux, kesako ?

C’est un pattern né de **Flux**, une architecture créée chez Facebook. 
Il apporte un workflow de données unidirectionnelles grâce a un dispatcher, qui recueille des actions distribuées par le serveur ou par l’utilisateur. 
Il conserve la nouvelle instance d’une donnée dans un ou plusieurs stores qui mettent à jour la vue.
<p align="center">
  <img src="https://julienrenaux.fr/talks-src/2016/redux-angular2/img/flux-simple-f8-diagram-with-client-action-1300w_stores_views.png">
</p>

L'architecture de Flux ci-dessus peut contenir plusieurs structures de données indépendantes appelées **Store**.
Chaque action passe par le dispatcher, qui la transmet au store ciblé par l'action.   

## Pourquoi Redux alors ?
Redux est une version moins complexe de Flux. Il se distingue en plusieurs points :

- Un store donc une source de données ;
- Des états immuables / immutables
- Pas de dispatcher. 

Grâce à la programmation fonctionnelle, le dispatcher est complètement retiré du schéma qui rend le développement plus simple.  
<center>
	<img src="https://wecodetheweb.com/2015/09/29/functionally-managing-state-with-redux/redux-cycle.png"/>
</center>

## Flux vs Redux
| Flux| Redux|
|--|--|
| Les stores contiennent les états et leurs logiques de mutations|  Le store et leurs logiques de mutation sont séparés|
|Plusieurs stores|Un seule Store|
|Stores indépendants|Store unique avec reducers|
|Dispatcher|Pas de dispatcher|
|Etats mutables|Etats immuables|

## Le Store, la base de tout
Qu'est-ce qu'est le store au final ?
Le store est une fonction qui contient l'état des reducers, un getter, une fonction de dispatch et des subscribers.

Voici un exemple de store *from scratch simplifié* :

***Exemple***

```javascript
class Store {
	private subscribers: Function[];
	private reducers: { key: string: Function };
	private state: { key: string: any }

	constructor(reducers = {}, initalState = {}){
		this.subscribers = [];
		this.state = this.reduce(initalState,{});
	}

	get value(){
		// retourne les données du store
		return this.state
	}
	public select(key){
		return this.state[key]
	}

	subscribe(fn){
		this.subscribers = [...this.subscribers, fn];
		this.notify();
		return () => {
			this.subscribers = this.subscribers.filter(sub => sub !== fn)
		}
	}

	dispatch(){
		this.state = this.reduce(this.state, action);
		this.notify();
	}

	private notify(){
		this.subscribers.forEach(fn => fn(this.value))
	}
	private reduce(state, action){
		// le 1er param est le state global du store
		// le 2eme est l'object d'action passé dans la méthode dispatch

		const newState = {}; // objet vide

		/*
			Boucle sur toutes les clefs des reducers en leur passant l'action,
			si l'un des switch case d'un reducer match avec celui le type de l'action,
			il fera la mutation du switch.
			Popule newState avec les nouveaux states
		*/
		for(const prop in this.reducers){
			newState[prop] = this.reducers[prop](state[prop], action);
			/*
				exemple =>
				newState[counter] = this.reducers[counter](state[couter], {
					type: 'INCREMENT'
				});
			*/
		}
		// le retour va devenir la nouvelle référence des données du store
		return newState;
	}
}
```
Comment faire une instance du store :
```javascript
import * as Store from './store';
import * as RootReducer from './reducers';

new Store(RootReducer/*,{}*/);
// Le store prend en 1er param un objet qui contiendra l'ensemble des reducers
// 2ème param, un objet qui est l'état du store,
// en général les reducers ont leurs propre valeur par default donc il est inutile de le rajouter.
```

## Le root reducer
Le root reducer est un simple objet qui a pour propriété des fonctions. Celles-ci représentent l'ensemble des mutations de l'application.

***Exemple***
```javascript
import counterReducer from './counter-reducer';

const rootReducer = {
	counter: counterReducer,
	...etc  	
}
```

Chaque fonctions reducer a pour argument son état et une action.

***Exemple***
```javascript
// on part de 0
const initialState = { counter: 0 };

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    // selon l'action …
    case "INCREMENT":
      // … on retourne un nouvel état incrémenté
      return state.counter + 1;

    case "DECREMENT":
      // … ou décrémenté
      return state.counter - 1;

    case "SET_NEW_VALUE":
      // … on change complétement de valeur
      return action.payload;

    default:
      // ou l'état actuel, si l'on n'y touche pas
      return state;
  }
};
```
Les reducers ne fonctionnent qu'avec des fonctions pures, ils ne doivent **jamais** modifier directement l'état mais en renvoyer un nouveau à partir de celui-ci.
## Le schéma
Les reducers encapsulent les différentes logiques de mutation et le store contient le résultat de chaque reducer comme deux objets miroir synchronisés à chaque action.
```javascript
const store = {
	counter: 0
};

const rootReducer = {
	counter: Function
};
```

## Les actions
Les actions sont des objets, elles contiennent au minimum une propriété **type**.

```javascript
const action = {
	type:'INCREMENT'
};
```
Cette propriété donne la possibilité au reducer de savoir quelle mutation appliquer sur l'état actuel.
Le nommage du type doit être explicite afin de garder une bonne traçabilité lors d'un changement.
Une meilleure pratique consiste à utiliser des constantes qui permettent d'écrire des types d'action plus lisibles.

```javascript
const SET_NEW_VALUE = '[counter] Set new value';
```
Comme il s'agit d'un objet on peut lui rajouter autant de propriétés que l'on souhaite :

```javascript
import { SET_NEW_VALUE } from './constants';

const action = {
	type: SET_NEW_VALUE,
	payload: 6,
	...etc
};
```
## Action creator
Il existe une manière différente et préférable de réaliser une action, c'est d'utiliser une classe qui permettra de générer notre objet d'action.

```javascript
import { SET_NEW_VALUE } from './constants';

class SetNewValue {
	readonly type = SET_NEW_VALUE;
	constructor(public payload: number) {}
}
```
Elle s'utilise à la place de l'objet.
```javascript
import * as CounterActions from './actions';

new CounterActions.SetNewValue(6)
// resultat => { type: '[counter] Set new value', payload: 6 }
```
L'action creator permet également de mieux utiliser le typage pour les valeurs optionnelles.
Maintenant que nous avons la structure de l'action, nous allons voir comment l'injecter dans le store. Grâce à la méthode **dispatch()** du Store, on va pouvoir mettre à jour l'état du *Counter* avec l'action passée en paramètre.
```javascript
import * as CounterActions from './actions';
import { store } from './store'

store.dispatch(new CounterActions.SetNewValue(6))
// resultat => { counter : 6 }
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTA1ODk0MTM4MCwzNDc3OTA3MTZdfQ==
-->