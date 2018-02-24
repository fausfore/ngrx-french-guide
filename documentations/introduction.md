
# Introduction

Dans cette article, nous allons voir comment utiliser le pattern redux dans une application Angular via Ngrx.
Ce dernier proposant une conception du développement  d'application autour d'actions utilisateurs et serveurs. Le but étant de supprimer les différentes mutations de données des composants et services Angular pour les centraliser dans un objet global, qui serait mutable uniquement par des actions typées.

> Pour le développement sur Angular **Visual studio code** est fortement recommandé. 
> Vous devrez aussi installer Angular sur votre machine avec un **npm i -g @angular/cli**.

**Intéret de NGRX**

- Le 1er avantage est le modèle **unidirectionnelle** avec lequel nous travaillerons, ce qui n'est pas le cas du standard MVC qui de son coté est **bidirectionnelle**.
- Le 2eme avantage est **"l'historisation"** :  comme tout les changement transitent par le store, chaque update/modification est loggé. De ce fait nous pouvons revenir dans l'historique, trouvé quelle mutation a créé un bug:  c'est en quelque sorte une **state machine**.

Comme Angular peut être utilisé avec **typescript** , Ngrx profite également du typage qui va verrouiller nos actions et ainsi lever plus tôt les erreurs en cours de développement.




<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1600/1*xORdWwOFLR-6D4ghvUa6AA.png">
</p>
<center>Le Modèle MVC (ce que nous souhaitons éviter)</center>

## Redux, kesako ?!

C’est un pattern née de **Flux**, une architecture crée chez Facebook, il apporte un worflow de données unidirectionnelle distribué par un dispatcher qui recueille des actions données par le serveur ou par l’utilisateur et conserve la nouvelle instance d’une donnée dans un store ou des stores qui mettent à jour la vue.
<p align="center">
  <img src="https://julienrenaux.fr/talks-src/2016/redux-angular2/img/flux-simple-f8-diagram-with-client-action-1300w_stores_views.png">
</p>
<center>Le Worflow de Flux</center>

L'architecture de flux présente peut contenir plusieurs structures de données indépendantes appelé **Store**
Chaque action passe par le dispatcher qui la transmet au store ciblé par l'action.   

## Pourquoi Redux alors ?!
Redux est une version moins compliqué de Flux, il s'en distingue par le fait
- qu’il y ait qu’un store donc une seule source de donnée, 
- des états immuables / immutables
- et pas de dispatcher. 

Grâce à la programmation fonctionnelles, le dispatcher est complètement retiré du schéma qui rend plus simple le développement.  
<center>
	<img width="600" src="https://wecodetheweb.com/2015/09/29/functionally-managing-state-with-redux/redux-cycle.png"/>
</center>

## Flux vs Redux
| Flux| Redux|
|--|--|
| les Stores contiennent les états et leurs logiques de mutations|  le store et leurs logiques de mutation sont séparer|
|Plusieurs Stores|Un seule Store|
|Stores indépendants|Store unique avec reducers|
|Dispatcher|Pas de dispatcher|
|Etats mutables|Etats immuables|

## Le Store la base de tout
C'est quoi un store en au final, le store est juste une fonction qui contient l'état des reducers, un getter, un dispatcher et des subscribers.

Voilà un exemple de store *from scratch simplifié* :

***Ne pas reproduire***

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
// Le store prend en 1er param, un objet qui contiendra l'ensemble des reducers
// 2ème param, un objet qui est l'état du store,
// en général les reducers ont leurs propre valeur par default donc il est inutile de le rajouter.
```

## Le root reducer
Le root reducer est un simple objet qui a pour propriété des fonctions. Elle représente l'ensemble des mutations de l'application.

***Ne pas reproduire***
```javascript
import counterReducer from './counter-reducer';

const rootReducer = {
	counter: counterReducer,
	...etc  	
}
```
Chaque function reducer a pour argument son état et une action,
***Ne pas reproduire***
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
Les reducers ne fonctionnent que avec des fonctions pures, elle ne doit ** jamais** modifié directement l'état mais renvoyé un nouvelle état a partir de celui-ci.
## Le schéma
Voilà, on voit bien que les reducers encapsules les différentes logiques de mutation et le store contient le résultat de chaque reducer comme deux objets miroir synchronisés à chaque action.
```javascript
const store = {
	counter: 0
};

const rootReducer = {
	counter: Function
};
```

## Les actions
Les actions sont des objets javascript, elle contienne au minimum une propriété **type** qui contient une string.

```javascript
const action = {
	type:'INCREMENT'
};
```
Cette propriété va permettre au reducer de savoir quelle mutation appliqué sur l'état actuel. Le nommage du type doit être explicite pour garder une bonne traçabilité lors d'un changement. Une meilleur pratique consiste à utilisé des constants pour les type d'action, par ailleurs avec les constants ont peu écrire des types plus lisible.

```javascript
const SET_NEW_VALUE = '[counter] Set new value';
```
Vu que c'est un objet on peut lui rajouter autant de propriété que l'on veut :

```javascript
import { SET_NEW_VALUE } from './constants';

const action = {
	type: SET_NEW_VALUE,
	payload: 6,
	...etc
};
```
## Action creator
Il existe une manière différente et préférable de réaliser une action, c'est d'utiliser une Class d'action, **Action creator**

```javascript
import { SET_NEW_VALUE } from './constants';

class SetNewValue {
	readonly type = SET_NEW_VALUE;
	constructor(public payload: number) {}
}
```
Et comment l'utilisé à la place de l'objet
```javascript
import * as CounterActions from './actions';

new CounterActions.SetNewValue(6)
// resultat => { type: '[counter] Set new value', payload: 6 }
```
L'action creator permet également de mieux utilisé le typage pour les valeurs optionnelles.
Maintenant on la structure de l'action, il faut voir comment injecter l'action dans le store, plus haut on a vu que le store dispose d'une méthode **dispatch()**, c'est elle qui va mettre à jour le store avec l'action passé en paramètre
```javascript
import * as CounterActions from './actions';
import { store } from './store'

store.dispatch(new CounterActions.SetNewValue(6))
// resultat => { counter : 6 }
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTM5Njc3MzA4NCwzNDc3OTA3MTZdfQ==
-->