<h1 id="angular--redux--ngrx">Angular + Redux = NGRX</h1>
<p>Dans cette article on va voir comment utiliser la pattern redux dans une application Angular via Ngrx, proposant un autre manière de développer son application avec une conception autour d’action utilisateur et serveur on retirent les différentes mutations de données des composants, services Angular pour les centraliser dans un objet global mutable uniquement par des actions typées.</p>
<blockquote>
<p>Pour le développent sur Angular utilisé <strong>Visual studio code</strong> et<br>
installer le cli angular avec un <strong>npm i -g @angular/cli</strong></p>
</blockquote>
<p>Le 1er avantage c’est qu’on est sur un modèle <strong>unidirectionnelle</strong> pas comme le standard MVC qui lui est <strong>bidirectionnelle</strong>.</p>
<p>Le 2eme avantage c’est que comme tout les changement transit par le store, chaque update est logé ainsi on peut revenir dans l’historique trouvé quelle mutation a créer un bug comme une <strong>state machine</strong>.</p>
<p>Comme Angular embarque le <strong>typescript</strong> , Ngrx  profite également du typage qui va verrouiller les actions ainsi éviter les erreurs en cours de développement.</p>
<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1600/1*xORdWwOFLR-6D4ghvUa6AA.png">
</p>
<center>Le Modèle MVC</center>
<h2 id="redux-kesako-">Redux kesako ?!</h2>
<p>C’est pattern née de Flux une architecture crée chez Facebook, elle apporte un worflow de données unidirectionnelle distribué par un dispatcher qui recueille des actions données par le serveur ou par l’utilisateur et conserve la nouvelle instance d’une donnée dans un store ou des stores qui mettent à jour la vue.</p>
<p align="center">
  <img src="https://julienrenaux.fr/talks-src/2016/redux-angular2/img/flux-simple-f8-diagram-with-client-action-1300w_stores_views.png">
</p>
<center>Le Worflow de Flux</center>
<p>L’architecture de flux présente peut contenir plusieurs structures de données indépendantes appelé <strong>Store</strong><br>
Chaque action passe par le dispatcher qui la transmet au store ciblé par l’action.</p>
<h2 id="pourquoi-redux-alors-">Pourquoi Redux alors ?!</h2>
<p>Redux est une version plus simple de Flux, il se distingue par le fait qu’il y est qu’un store donc une seule source de donnée, des états immuables et pas de dispatcher. Grâce à la programmation fonctionnelles le dispatcher est complètement retiré du schéma qui rend plus simple le développement.</p>
<center>
	<img width="600" src="https://wecodetheweb.com/2015/09/29/functionally-managing-state-with-redux/redux-cycle.png">
</center>
<h2 id="le-versus-flux--redux">Le versus Flux / Redux</h2>

<table>
<thead>
<tr>
<th>Flux</th>
<th>Redux</th>
</tr>
</thead>
<tbody>
<tr>
<td>les Stores contiennent les états et leurs logiques de mutations</td>
<td>le store et leurs logiques de mutation sont séparer</td>
</tr>
<tr>
<td>Plusieurs Stores</td>
<td>Un seule Store</td>
</tr>
<tr>
<td>Stores indépendants</td>
<td>Store unique avec reducers</td>
</tr>
<tr>
<td>Dispatcher</td>
<td>Pas de dispatcher</td>
</tr>
<tr>
<td>Etats mutables</td>
<td>Etats immuables</td>
</tr>
</tbody>
</table><h2 id="le-store-la-base-de-tout">Le Store la base de tout</h2>
<p>C’est quoi un store en au final, le store une juste une fonction qui contient l’états des reducers, un getteur, un dispatcher et des subscribers.</p>
<p>Voilà un exemple de store <em>from scratch simplifié</em> :</p>
<p><em><strong>Ne pas reproduire</strong></em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">class</span> <span class="token class-name">Store</span> <span class="token punctuation">{</span>
	<span class="token keyword">private</span> subscribers<span class="token punctuation">:</span> Function<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
	<span class="token keyword">private</span> reducers<span class="token punctuation">:</span> <span class="token punctuation">{</span> key<span class="token punctuation">:</span> string<span class="token punctuation">:</span> Function <span class="token punctuation">}</span><span class="token punctuation">;</span>
	<span class="token keyword">private</span> state<span class="token punctuation">:</span> <span class="token punctuation">{</span> key<span class="token punctuation">:</span> string<span class="token punctuation">:</span> any <span class="token punctuation">}</span>

	<span class="token function">constructor</span><span class="token punctuation">(</span>reducers <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> initalState <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>subscribers <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span>initalState<span class="token punctuation">,</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>

	<span class="token keyword">get</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token comment">// retourne les données du store</span>
		<span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state
	<span class="token punctuation">}</span>
	<span class="token keyword">public</span> <span class="token function">select</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">[</span>key<span class="token punctuation">]</span>
	<span class="token punctuation">}</span>

	<span class="token function">subscribe</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>subscribers <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span>subscribers<span class="token punctuation">,</span> fn<span class="token punctuation">]</span><span class="token punctuation">;</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
			<span class="token keyword">this</span><span class="token punctuation">.</span>subscribers <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>subscribers<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>sub <span class="token operator">=&gt;</span> sub <span class="token operator">!==</span> fn<span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>

	<span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>

	<span class="token keyword">private</span> <span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>subscribers<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>fn <span class="token operator">=&gt;</span> <span class="token function">fn</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">private</span> <span class="token function">reduce</span><span class="token punctuation">(</span>state<span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token comment">// le 1er param est le state global du store</span>
		<span class="token comment">// le 2eme est l'object d'action passé dans la méthode dispatch</span>

		<span class="token keyword">const</span> newState <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token comment">// objet vide</span>

		<span class="token comment">/*
			Boucle sur toutes les clefs des reducers en leur passant l'action,
			si l'un des switch case d'un reducer match avec celui le type de l'action,
			il fera la mutation du switch.
			Popule newState avec les nouveaux states
		*/</span>
		<span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">const</span> prop <span class="token keyword">in</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reducers<span class="token punctuation">)</span><span class="token punctuation">{</span>
			newState<span class="token punctuation">[</span>prop<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reducers<span class="token punctuation">[</span>prop<span class="token punctuation">]</span><span class="token punctuation">(</span>state<span class="token punctuation">[</span>prop<span class="token punctuation">]</span><span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token comment">/*
				exemple =&gt;
				newState[counter] = this.reducers[counter](state[couter], {
					type: 'INCREMENT'
				});
			*/</span>
		<span class="token punctuation">}</span>
		<span class="token comment">// le retour va devenir la nouvelle référence des données du store</span>
		<span class="token keyword">return</span> newState<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<p>Comment faire une instance du store :</p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> Store <span class="token keyword">from</span> <span class="token string">'./store'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> RootReducer <span class="token keyword">from</span> <span class="token string">'./reducers'</span><span class="token punctuation">;</span>

<span class="token keyword">new</span> <span class="token class-name">Store</span><span class="token punctuation">(</span>RootReducer<span class="token comment">/*,{}*/</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Le store prend en 1er param, un objet qui contiendra l'ensemble des reducers</span>
<span class="token comment">// 2ème param, un objet qui est l'état du store,</span>
<span class="token comment">// en général les reducers ont leurs propre valeur par default donc il est inutile de le rajouter.</span>
</code></pre>
<h2 id="le-root-reducer">Le root reducer</h2>
<p>Le root reducer est un simple objet qui a pour propriété des fonctions. Elle représente l’ensemble des mutations de l’application.</p>
<p><em><strong>Ne pas reproduire</strong></em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> counterReducer <span class="token keyword">from</span> <span class="token string">'./counter-reducer'</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> rootReducer <span class="token operator">=</span> <span class="token punctuation">{</span>
	counter<span class="token punctuation">:</span> counterReducer<span class="token punctuation">,</span>
	<span class="token operator">...</span>etc  	
<span class="token punctuation">}</span>
</code></pre>
<p>Chaque function reducer a pour argument son état et une action,<br>
<em><strong>Ne pas reproduire</strong></em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// on part de 0</span>
<span class="token keyword">const</span> initialState <span class="token operator">=</span> <span class="token punctuation">{</span> counter<span class="token punctuation">:</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">counterReducer</span> <span class="token operator">=</span> <span class="token punctuation">(</span>state <span class="token operator">=</span> initialState<span class="token punctuation">,</span> action<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>action<span class="token punctuation">.</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// selon l'action …</span>
    <span class="token keyword">case</span> <span class="token string">"INCREMENT"</span><span class="token punctuation">:</span>
      <span class="token comment">// … on retourne un nouvel état incrémenté</span>
      <span class="token keyword">return</span> state<span class="token punctuation">.</span>counter <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>

    <span class="token keyword">case</span> <span class="token string">"DECREMENT"</span><span class="token punctuation">:</span>
      <span class="token comment">// … ou décrémenté</span>
      <span class="token keyword">return</span> state<span class="token punctuation">.</span>counter <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>

    <span class="token keyword">case</span> <span class="token string">"SET_NEW_VALUE"</span><span class="token punctuation">:</span>
      <span class="token comment">// … on change complétement de valeur</span>
      <span class="token keyword">return</span> action<span class="token punctuation">.</span>payload<span class="token punctuation">;</span>

    <span class="token keyword">default</span><span class="token punctuation">:</span>
      <span class="token comment">// ou l'état actuel, si l'on n'y touche pas</span>
      <span class="token keyword">return</span> state<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre>
<p>Les reducers ne fonctionnent que avec des fonctions pures, elle ne doit ** jamais** modifié directement l’état mais renvoyé un nouvelle état a partir de celui-ci.</p>
<h2 id="le-schéma">Le schéma</h2>
<p>Voilà on voit bien que les reducers encapsules les différentes logiques de mutation et le store contient le résultat de chaque reducer comme deux objets miroir synchronisés à chaque action.</p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token punctuation">{</span>
	counter<span class="token punctuation">:</span> <span class="token number">0</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> rootReducer <span class="token operator">=</span> <span class="token punctuation">{</span>
	counter<span class="token punctuation">:</span> Function
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre>
<h2 id="les-actions">Les actions</h2>
<p>Les actions sont des objets javascript, elle contienne au minimum une propriété <strong>type</strong> qui contient une string.</p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">const</span> action <span class="token operator">=</span> <span class="token punctuation">{</span>
	type<span class="token punctuation">:</span><span class="token string">'INCREMENT'</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre>
<p>Cette propriété va permettre au reducer de savoir quelle mutation appliqué sur l’état actuel. Le nommage du type doit être explicite pour garder une bonne traçabilité lors d’un changement. Une meilleur pratique consiste à utilisé des constants pour les type d’action, par ailleurs avec les constants ont peu écrire des types plus lisible.</p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">const</span> SET_NEW_VALUE <span class="token operator">=</span> <span class="token string">'[counter] Set new value'</span><span class="token punctuation">;</span>
</code></pre>
<p>Vu que c’est un objet on peut lui rajouter autant de propriété que l’on veut :</p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> SET_NEW_VALUE <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./constants'</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> action <span class="token operator">=</span> <span class="token punctuation">{</span>
	type<span class="token punctuation">:</span> SET_NEW_VALUE<span class="token punctuation">,</span>
	payload<span class="token punctuation">:</span> <span class="token number">6</span><span class="token punctuation">,</span>
	<span class="token operator">...</span>etc
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre>
<h2 id="action-creator">Action creator</h2>
<p>Il existe une manière différente et préférable de réaliser une action, c’est d’utiliser une Class d’action, <strong>Action creator</strong></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> SET_NEW_VALUE <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./constants'</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">SetNewValue</span> <span class="token punctuation">{</span>
	readonly type <span class="token operator">=</span> SET_NEW_VALUE<span class="token punctuation">;</span>
	<span class="token function">constructor</span><span class="token punctuation">(</span><span class="token keyword">public</span> payload<span class="token punctuation">:</span> number<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<p>Et comment l’utilisé à la place de l’objet</p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> CounterActions <span class="token keyword">from</span> <span class="token string">'./actions'</span><span class="token punctuation">;</span>

<span class="token keyword">new</span> <span class="token class-name">CounterActions<span class="token punctuation">.</span>SetNewValue</span><span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span>
<span class="token comment">// resultat =&gt; { type: '[counter] Set new value', payload: 6 }</span>
</code></pre>
<p>L’action creator permet également de mieux utilisé le typage pour les valeurs optionnelles.<br>
Maintenant on la structure de l’action, il faut voir comment injecter l’action dans le store, plus haut on a vu que le store dispose d’une méthode <strong>dispatch()</strong>, c’est elle qui va mettre à jour le store avec l’action passé en paramètre</p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> CounterActions <span class="token keyword">from</span> <span class="token string">'./actions'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> store <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./store'</span>

store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">CounterActions<span class="token punctuation">.</span>SetNewValue</span><span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token comment">// resultat =&gt; { counter : 6 }</span>
</code></pre>
<h1 id="de-redux-à-ngrx">De Redux à Ngrx</h1>
<p>Redux est un pattern déjà bien implémenter sur les principaux frameworks/librairies javascript du moment.<br>
Pour React  =&gt; <strong>react-redux</strong><br>
Pour Vue  =&gt; <strong>vuex</strong><br>
Pour Angular  =&gt; <strong>Ngrx</strong></p>
<p>Donc il est inutile de créer un store from scratch, on va partir sur une app Angular donc prenont <strong>Ngrx</strong>.<br>
Cette librairie est donc une implémentation reduxienne mais pas que elle prend une bonne couche de <strong>RxJS</strong> comme Angular lui-même et utilise les <strong>Observables</strong> pour populer les states dans les composants Angular.</p>
<h2 id="installation">Installation</h2>
<p>Pour commencer on part sur un angular version 5 donc vous devez avoir votre Cli au dessus de la version <strong>1.6.0</strong>, elle doit comprendre la version <strong>5.5.6</strong> de RxJs pour utliser les <strong>pipes</strong> qui seront utilisé plus tard.<br>
Donc on créer un nouveau projet angular</p>
<pre class=" language-shell"><code class="prism  language-shell">$ ng new ngrx-tutoriel-app --style=scss
</code></pre>
<p>puis dans le dossier rajouter <strong>Ngrx en version 5.0 et plus</strong></p>
<pre class=" language-shell"><code class="prism  language-shell">$ npm install @ngrx/store ou yarn add @ngrx/store
</code></pre>
<h2 id="architecture-folder">Architecture Folder</h2>
<p>Pour le schéma des folders partez de <strong>app/</strong></p>
<pre><code>app
│   app.component.ts
│   app.component.scss
│	app.component.html
│   app.module.ts  
└───store
│   │   index.ts
│   └───actions
│   │   │   exemple.action.ts
│   │   │   ...
│   └───reducers
│  	│   │   exemple.reducer.ts
│   │   │   ...
└───modules
</code></pre>
<h2 id="set-up">Set up</h2>
<p>Pour changer de l’exemple du counter, on va partir sur une <strong>todolist</strong>, eh oui encore …<br>
Avec l’implémentation de Redux on va penser en actions utilisateur et serveur et faire une synthèse de celle-ci :<br>
Pour faire une todolist on a :</p>
<p>Une initalisation des todos -&gt; <strong>GET</strong><br>
Création de todo -&gt; <strong>PUT</strong><br>
Suppression de todo-&gt; <strong>DELETE</strong><br>
Modification de todo -&gt; <strong>PATCH / POST</strong></p>
<p>Un bon vieux <strong>CRUD</strong> quoi.</p>
<p>On commence a écrire notre InitializeTodos et l’interface .</p>
<p><em>models/todo.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">Todo</span> <span class="token punctuation">{</span>
	userId<span class="token punctuation">:</span> number<span class="token punctuation">;</span>
	id<span class="token punctuation">:</span> number<span class="token punctuation">;</span>
	title<span class="token punctuation">:</span> string<span class="token punctuation">;</span>
	completed<span class="token punctuation">:</span> boolean<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">TodoListState</span> <span class="token punctuation">{</span>
	data<span class="token punctuation">:</span> Todo<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
	loading<span class="token punctuation">:</span> boolean<span class="token punctuation">;</span>
	loaded<span class="token punctuation">:</span> boolean<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>
<p>On se base sur le model de <strong><a href="https://jsonplaceholder.typicode.com/">JsonPlaceholder</a></strong>.<br>
<em>mocks/todo-list.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">export</span> <span class="token keyword">const</span> todosMock <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>
    <span class="token string">"userId"</span><span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token string">"id"</span><span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token string">"title"</span><span class="token punctuation">:</span> <span class="token string">"delectus aut autem"</span><span class="token punctuation">,</span>
    <span class="token string">"completed"</span><span class="token punctuation">:</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token string">"userId"</span><span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token string">"id"</span><span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
    <span class="token string">"title"</span><span class="token punctuation">:</span> <span class="token string">"quis ut nam facilis et officia qui"</span><span class="token punctuation">,</span>
    <span class="token string">"completed"</span><span class="token punctuation">:</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token string">"userId"</span><span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token string">"id"</span><span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
    <span class="token string">"title"</span><span class="token punctuation">:</span> <span class="token string">"fugiat veniam minus"</span><span class="token punctuation">,</span>
    <span class="token string">"completed"</span><span class="token punctuation">:</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token string">"userId"</span><span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token string">"id"</span><span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
    <span class="token string">"title"</span><span class="token punctuation">:</span> <span class="token string">"et porro tempora"</span><span class="token punctuation">,</span>
    <span class="token string">"completed"</span><span class="token punctuation">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token string">"userId"</span><span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token string">"id"</span><span class="token punctuation">:</span> <span class="token number">5</span><span class="token punctuation">,</span>
    <span class="token string">"title"</span><span class="token punctuation">:</span> <span class="token string">"laboriosam mollitia et enim quasi adipisci quia provident illum"</span><span class="token punctuation">,</span>
    <span class="token string">"completed"</span><span class="token punctuation">:</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token string">"userId"</span><span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token string">"id"</span><span class="token punctuation">:</span> <span class="token number">6</span><span class="token punctuation">,</span>
    <span class="token string">"title"</span><span class="token punctuation">:</span> <span class="token string">"qui ullam ratione quibusdam voluptatem quia omnis"</span><span class="token punctuation">,</span>
    <span class="token string">"completed"</span><span class="token punctuation">:</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token string">"userId"</span><span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token string">"id"</span><span class="token punctuation">:</span> <span class="token number">7</span><span class="token punctuation">,</span>
    <span class="token string">"title"</span><span class="token punctuation">:</span> <span class="token string">"illo expedita consequatur quia in"</span><span class="token punctuation">,</span>
    <span class="token string">"completed"</span><span class="token punctuation">:</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span><span class="token punctuation">]</span>
</code></pre>
<p>Un petit mock pour tester.</p>
<p><em>store/actions/todo-list.action.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">export</span> namespace TodoListModule <span class="token punctuation">{</span>
	<span class="token keyword">export</span> <span class="token keyword">enum</span> ActionTypes <span class="token punctuation">{</span>
		INIT_TODOS <span class="token operator">=</span> <span class="token string">'[todoList] Initialisation'</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">InitTodos</span> <span class="token punctuation">{</span>
		readonly type <span class="token operator">=</span> ActionTypes<span class="token punctuation">.</span>INIT_TODO<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token keyword">export</span> type Actions <span class="token operator">=</span> InitTodos 
<span class="token punctuation">}</span>
</code></pre>
<p>Question pratique je préfère encapsulé le tout dans un <strong>namespace</strong> pour simplifié les import, libre à vous de ne pas le faire.<br>
Le dernier export Actions servira pour le typage du reducer uniquement.</p>
<p><em>/store/reducers/todo-list.reducer.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../actions/todo-list.action'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListState  <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../models/todo'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> todosMock <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../mocks/todo-list'</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> initialState<span class="token punctuation">:</span> TodoListState <span class="token operator">=</span> <span class="token punctuation">{</span>
	data<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
	loading<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
	loaded<span class="token punctuation">:</span> <span class="token boolean">false</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">todosReducer</span><span class="token punctuation">(</span>
	state<span class="token punctuation">:</span> TodoListState <span class="token operator">=</span> initialState<span class="token punctuation">,</span>
	action<span class="token punctuation">:</span> TodoListModule<span class="token punctuation">.</span>Actions
<span class="token punctuation">)</span><span class="token punctuation">:</span> TodoListState <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>action<span class="token punctuation">.</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token keyword">case</span> TodoListModule<span class="token punctuation">.</span>ActionTypes<span class="token punctuation">.</span>INIT_TODOS <span class="token punctuation">:</span>
	    <span class="token keyword">return</span> <span class="token punctuation">{</span>
			<span class="token operator">...</span>state<span class="token punctuation">,</span>
			data<span class="token punctuation">:</span> <span class="token punctuation">[</span>
				<span class="token operator">...</span>todosMock
			<span class="token punctuation">]</span>
		<span class="token punctuation">}</span><span class="token punctuation">;</span>
      
    <span class="token keyword">default</span><span class="token punctuation">:</span>
      <span class="token keyword">return</span> state<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre>
<p><em>exemple : /store/index.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> ActionReducerMap <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ngrx/store'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> InjectionToken <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span> 

<span class="token keyword">import</span> <span class="token punctuation">{</span> todosReducer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./reducers/todo-list.reducer'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../models/todo'</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> reducers <span class="token operator">=</span> <span class="token punctuation">{</span>
	todos<span class="token punctuation">:</span> todosReducer 
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">AppState</span> <span class="token punctuation">{</span>
	todos<span class="token punctuation">:</span> TodoListState
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getReducers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
	<span class="token keyword">return</span> reducers
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> REDUCER_TOKEN <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">InjectionToken</span><span class="token operator">&lt;</span>ActionReducerMap<span class="token operator">&lt;</span>AppState<span class="token operator">&gt;&gt;</span><span class="token punctuation">(</span><span class="token string">'Registered Reducers'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre>
<blockquote>
<p>Le mode Ahead of Time (AoT) Compilation de Angular exige que tous les symboles référencés dans les métadonnées du décorateur soient analysables statiquement. Pour cette raison, nous ne pouvons pas injecter dynamiquement l’état à l’exécution avec AoT sauf si nous fournissons notre <strong>reducers</strong> en tant que fonction.</p>
</blockquote>
<p><em>/app.module.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> NgModule<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> StoreModule<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ngrx/store'</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> getReducers<span class="token punctuation">,</span> REDUCER_TOKEN <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./store'</span><span class="token punctuation">;</span>

@<span class="token function">NgModule</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  imports<span class="token punctuation">:</span> <span class="token punctuation">[</span>
    StoreModule<span class="token punctuation">.</span><span class="token function">forRoot</span><span class="token punctuation">(</span>REDUCER_TOKEN<span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  providers<span class="token punctuation">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      provide<span class="token punctuation">:</span> REDUCER_TOKEN<span class="token punctuation">,</span>
      useFactory<span class="token punctuation">:</span> getReducers
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AppModule</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
</code></pre>
<blockquote>
<p>Maintenant pour créer notre <strong>Store</strong>, il suffit de prendre le <strong>StoreModule</strong> et de lui injecter nos reducers.</p>
</blockquote>
<p><em>exemple : /app.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Store<span class="token punctuation">,</span> select <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ngrx/store'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> OnInit<span class="token punctuation">,</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Observable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/Observable'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./store/actions/todo-list.action'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> AppState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./store'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Todo <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'models/todo'</span><span class="token punctuation">;</span>

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token punctuation">:</span> <span class="token string">'app-root'</span><span class="token punctuation">,</span>
  template<span class="token punctuation">:</span> <span class="token template-string"><span class="token string">`
    &lt;h1&gt;la todolist redux style !&lt;/h1&gt;
    &lt;ul&gt;
		&lt;li *ngFor="let todo of (todos$ | async)?.data"&gt;
			&lt;label&gt;{{ todo.title }}&lt;/label&gt;
			&lt;input type="checkbox" [value]="todo.completed"/&gt;
			&lt;button&gt;Supprimer&lt;/button&gt;
		&lt;/li&gt;
	&lt;/ul&gt;
  `</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">MyAppComponent</span> <span class="token keyword">implements</span> <span class="token class-name">OnInit</span> <span class="token punctuation">{</span>
  todos$<span class="token punctuation">:</span> Observable<span class="token operator">&lt;</span>Todo<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span><span class="token punctuation">;</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span>
	  <span class="token keyword">private</span> store<span class="token punctuation">:</span> Store<span class="token operator">&lt;</span>AppState<span class="token operator">&gt;</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>todos$ <span class="token operator">=</span> store<span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">'todos'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token comment">/* A éviter
	this.todo$.subscribe((todos) =&gt; {
		this.todos = todos;
	});
	
    Dans ce cas de figure on ne fait pas de mutation sur la liste
    de todos dans le composant et cela évite de faire
    un unsubscribe dans le OnDestroy
    ainsi qu'un *ngIf dans le &lt;ul&gt; dans le cas ou la donnée soit vide.
	*/</span>

  <span class="token punctuation">}</span>

  <span class="token function">ngOnInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>InitTodos</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre>
<blockquote>
<p>Le <strong>pipe async</strong> souscrit à un Observable ou une Promise et renvoie la dernière valeur qu’il a émise. Lorsqu’une nouvelle valeur est émise, le canal asynchrone marque un composant afin de vérifier les modifications. Lorsque le composant est détruit, <strong>le pipe async se désinscrit automatiquement pour éviter les fuites de mémoire potentielles</strong>.</p>
</blockquote>
<blockquote>
<p>Voilà nos todos s’affiche bien dans la vue mais faire ce serait mieux de renvoyer directement<br>
la liste plutôt que de faire <strong>(todos$ | async)?.data</strong> mais de faire directement <strong>todos$ | async</strong>, pour cela faut comprendre quelque chose au niveau du <strong>select(‘todos’)</strong>, actuellement il renvoie le contenu entier du reducer todos avec le loaded et le loading et pour ne renvoyer que les todos au lieu de lui passer une string en paramètre on peut lui passer une fonction.</p>
</blockquote>
<pre class=" language-html"><code class="prism  language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">*ngFor</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>let todo of todos$ | async<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>
</code></pre>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">this</span><span class="token punctuation">.</span>todos$ <span class="token operator">=</span> store<span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> state<span class="token punctuation">.</span>todos<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
<p>De cette manière on ne renvoie que ce que l’on souhaite s’afficher dans le composant cela ouvre la voie au concept des <strong>states selectors</strong>.</p>
<h2 id="states-selectors">States Selectors</h2>
<p>Comme son nom le précise on va pouvoir sélectionner une partie d’un state voir même pouvoir renvoyer une itération modifié du state grâce au traitement de RxJs sur les Observables car oui nos states sont des observables et bénéficie de l’énorme api RxJs pour faire du traitement sur nos données.<br>
Pour voir un peu les différentes méthodes : <a href="http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html">http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html</a></p>
<p>On en voit un premier qui est la fonction <strong>Pipe()</strong> que sera très très très utilisé dans nos traitement:<br>
elle permet de composé un chaînage de méthode rxjs de manière plus lisible.</p>
<p><em>exemple de pipe</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">const</span> <span class="token punctuation">{</span> Observable <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'rxjs/Rx'</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> filter<span class="token punctuation">,</span> map<span class="token punctuation">,</span> reduce <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'rxjs/operators'</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> pipe <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'rxjs/Rx'</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> filterOutEvens <span class="token operator">=</span> <span class="token function">filter</span><span class="token punctuation">(</span>x <span class="token operator">=&gt;</span> x <span class="token operator">%</span> <span class="token number">2</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> <span class="token function-variable function">doubleBy</span> <span class="token operator">=</span> x <span class="token operator">=&gt;</span> <span class="token function">map</span><span class="token punctuation">(</span>value <span class="token operator">=&gt;</span> value <span class="token operator">*</span> x<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> sum <span class="token operator">=</span> <span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>acc<span class="token punctuation">,</span> next<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> acc <span class="token operator">+</span> next<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> source$ <span class="token operator">=</span> Observable<span class="token punctuation">.</span><span class="token function">range</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span>

source$
	<span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>
	  filterOutEvens<span class="token punctuation">,</span> 
	  <span class="token function">doubleBy</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span> 
	  sum
	 <span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>console<span class="token punctuation">.</span>log<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 50</span>
	 
</code></pre>
<p>Du coup l’idée est transformé la source de l’observable avant même le subscribe de manière pur c’est à dire la source initiale n’a pas été altéré par ces changements.</p>
<p><em>store/selectors/todo-list.selector.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> createSelector <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ngrx/store'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">selectTodoListState$</span> <span class="token operator">=</span> <span class="token punctuation">(</span>state<span class="token punctuation">:</span> AppState<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> state<span class="token punctuation">.</span>todos<span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> selectTodos$ <span class="token operator">=</span>
	<span class="token function">createSelector</span><span class="token punctuation">(</span>selectTodoListState$<span class="token punctuation">,</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> todos<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
<p><em>/app.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> selectTodos <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'store/selectors/todo-list.selector'</span><span class="token punctuation">;</span>

<span class="token comment">// Other things ...</span>

<span class="token keyword">this</span><span class="token punctuation">.</span>todos$ <span class="token operator">=</span> store<span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span><span class="token function">select</span><span class="token punctuation">(</span>selectTodos$<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
<p>Voilà maintenant le sélecteur pourrait être utilisé dans plein d’autre component.</p>
<h2 id="ajouter-une-todo">Ajouter une todo</h2>
<p>On va créer un formulaire pour créer une todo grâce au formsbuilder d’Angular</p>
<p><em>/app.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span><span class="token operator">...</span><span class="token punctuation">,</span> Inject<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>FormBuilder<span class="token punctuation">,</span> FormGroup<span class="token punctuation">,</span> Validators<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>
<span class="token comment">// Other things ...</span>
 template<span class="token punctuation">:</span> <span class="token template-string"><span class="token string">`
    &lt;h1&gt;la todolist redux style !&lt;/h1&gt;
    &lt;form [formGroup]="todoForm" (ngSubmit)="CreateTodo(todoForm.value)"&gt;
	    &lt;label&gt;Titre :&lt;/label&gt;
	    &lt;input type="text" formControlName="title" placeholder="Title"/&gt;
	    &lt;label&gt;Est-elle terminé ? :&lt;/label&gt;
	    &lt;input type="checkbox" formControlName="completed"/&gt;
	    &lt;button&gt;Créer&lt;/button&gt;
    &lt;/form&gt;
    &lt;ul&gt;
    Other things ...
    `</span></span>
    <span class="token keyword">public</span> todoForm<span class="token punctuation">:</span> FormGroup<span class="token punctuation">;</span>
    <span class="token comment">// Other things ...</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span>
	  <span class="token operator">...</span>
	  @<span class="token function">Inject</span><span class="token punctuation">(</span>FormBuilder<span class="token punctuation">)</span> fb<span class="token punctuation">:</span> FormBuilder
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>todoForm<span class="token operator">=</span> fb<span class="token punctuation">.</span><span class="token function">group</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      title<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">''</span><span class="token punctuation">,</span> Validators<span class="token punctuation">.</span>required<span class="token punctuation">]</span><span class="token punctuation">,</span>
      completed<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token boolean">false</span><span class="token punctuation">,</span> Validators<span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">CreateTodo</span><span class="token punctuation">(</span>todo<span class="token punctuation">:</span> Todo<span class="token punctuation">)</span><span class="token punctuation">{</span>
	  <span class="token keyword">const</span> payload <span class="token operator">=</span> <span class="token punctuation">{</span>
		  <span class="token operator">...</span>todo<span class="token punctuation">,</span>
		  userId<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token comment">// userId au pif</span>
		  id<span class="token punctuation">:</span> <span class="token number">8</span> <span class="token comment">// id au pif</span>
	  <span class="token punctuation">}</span><span class="token punctuation">;</span>
	  <span class="token keyword">this</span><span class="token punctuation">.</span>store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>CreateTodo</span><span class="token punctuation">(</span>todo<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	  <span class="token keyword">this</span><span class="token punctuation">.</span>todoForm<span class="token punctuation">.</span><span class="token function">reset</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<p>Ne pas oublier de charger les modules forms de Angular.</p>
<p><em>/app.module.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ... reste</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ReactiveFormsModule<span class="token punctuation">,</span> FormsModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>
<span class="token comment">// ... reste</span>
  imports<span class="token punctuation">:</span> <span class="token punctuation">[</span>
	  ReactiveFormsModule<span class="token punctuation">,</span>
	  FormsModule<span class="token punctuation">,</span>
	  <span class="token comment">// ...</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token comment">// ... reste</span>
</code></pre>
<p>Maintenant créons l’action côté Store et reducer :</p>
<p><em>store/actions/todo-list.action.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Todo <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../models/todo'</span><span class="token punctuation">;</span>
	<span class="token comment">// ... reste</span>
	<span class="token keyword">export</span> <span class="token keyword">enum</span> ActionTypes <span class="token punctuation">{</span>
		<span class="token comment">// ...reste</span>
		CREATE_TODO <span class="token operator">=</span> <span class="token string">'[todoList] Create Todo'</span><span class="token punctuation">,</span>
	<span class="token punctuation">}</span>
	<span class="token comment">// ...reste</span>
	<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">CreateTodo</span> <span class="token punctuation">{</span>
		readonly type <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>Types<span class="token punctuation">.</span>CREATE_TODO
		<span class="token function">constructor</span><span class="token punctuation">(</span><span class="token keyword">public</span> payload<span class="token punctuation">:</span> Todo<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	
	<span class="token keyword">export</span> type Actions <span class="token operator">=</span> InitTodos <span class="token operator">|</span> CreateTodo 
<span class="token punctuation">}</span>
</code></pre>
<blockquote>
<p>Cette action transmet un <strong>payload</strong> qui sera la nouvelle todo.</p>
</blockquote>
<p><em>/store/reducers/todo-list.reducer.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript">	<span class="token comment">// ... reste</span>
    <span class="token keyword">case</span> TodoListModule<span class="token punctuation">.</span>ActionTypes<span class="token punctuation">.</span>CREATE_TODO<span class="token punctuation">:</span>
	    <span class="token keyword">return</span> <span class="token punctuation">{</span>
			<span class="token operator">...</span>state<span class="token punctuation">,</span>
			data<span class="token punctuation">:</span> <span class="token punctuation">[</span>
				<span class="token operator">...</span>state<span class="token punctuation">.</span>data<span class="token punctuation">,</span>
				action<span class="token punctuation">.</span>payload
			<span class="token punctuation">]</span>
		<span class="token punctuation">}</span><span class="token punctuation">;</span>
	<span class="token comment">// ...reste</span>
</code></pre>
<p>Voilà notre action <strong>createTodo</strong> est terminé pour le moment il reste des chose a revoir comme la gestion des ids mais ce soucis se réglera seule quand on écrira le service Http.</p>
<h2 id="supprimer-une-todo">Supprimer une todo</h2>
<p>Même procédé que pour la création, cette fois on va passer l’id de la todo a supprimer dans le reducer avec un <strong>filter()</strong> le tour est jouer.</p>
<p><em>store/actions/todo-list.action.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Todo <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../models/todo'</span><span class="token punctuation">;</span>
	<span class="token comment">// ... reste</span>
	<span class="token keyword">export</span> <span class="token keyword">enum</span> ActionTypes <span class="token punctuation">{</span>
		<span class="token comment">// ...reste</span>
		DELETE_TODO <span class="token operator">=</span> <span class="token string">'[todoList] Delete Todo'</span><span class="token punctuation">,</span>
	<span class="token punctuation">}</span>
	<span class="token comment">// ...reste</span>
	<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">DeleteTodo</span> <span class="token punctuation">{</span>
		readonly type <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>Types<span class="token punctuation">.</span>DELETE_TODO 
		<span class="token function">constructor</span><span class="token punctuation">(</span><span class="token keyword">public</span> payload<span class="token punctuation">:</span> number<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	
	<span class="token keyword">export</span> type Actions <span class="token operator">=</span> InitTodos
	<span class="token operator">|</span> CreateTodo
	<span class="token operator">|</span> DeleteTodo 
<span class="token punctuation">}</span>
</code></pre>
<p><em>/store/reducers/todo-list.reducer.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript">	<span class="token comment">// ... reste</span>
    <span class="token keyword">case</span> TodoListModule<span class="token punctuation">.</span>ActionTypes<span class="token punctuation">.</span>DELETE_TODO <span class="token punctuation">:</span>
	    <span class="token keyword">return</span> <span class="token punctuation">{</span>
			<span class="token operator">...</span>state<span class="token punctuation">,</span>
			data <span class="token punctuation">:</span> state<span class="token punctuation">.</span>data<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>todo <span class="token operator">=&gt;</span> todo<span class="token punctuation">.</span>id <span class="token operator">!==</span> action<span class="token punctuation">.</span>payload<span class="token punctuation">)</span>
		<span class="token punctuation">}</span><span class="token punctuation">;</span>
	<span class="token comment">// ...reste</span>
</code></pre>
<p><em>/app.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// Other things ...</span>
 template<span class="token punctuation">:</span> <span class="token template-string"><span class="token string">`
    &lt;!-- reste --&gt;
	&lt;li *ngFor="let todo of todos$ | async"&gt;
		&lt;!-- reste --&gt;
		&lt;button (click)="DeleteTodo(todo.id)"&gt;Supprimer&lt;/button&gt;
	&lt;/li&gt;
  `</span></span>
    <span class="token comment">// Other things ...</span>
  <span class="token function">DeleteTodo</span><span class="token punctuation">(</span>id<span class="token punctuation">:</span> number<span class="token punctuation">)</span><span class="token punctuation">{</span>
	  <span class="token keyword">this</span><span class="token punctuation">.</span>store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>DeleteTodo</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<p>Voilà comme cela devrait fonctionner mais il y a un soucis pour le moment a chaque fois que l’on rajoute une todo on lui donne un id 8 ce qui pose un problème, il faut un id unique. Pour le moment on a deux options calculer la longueur du tableau ou créer des id unique via un généreteur comme <a href="https://www.npmjs.com/package/uuid">uuid</a> mais l’exemple la 1er option suffit.</p>
<p><em>/app.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// Other things ...</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> tap <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/operators'</span><span class="token punctuation">;</span>
<span class="token comment">// Other things ...</span>
<span class="token keyword">private</span> todoslength <span class="token punctuation">:</span> number<span class="token punctuation">;</span>
<span class="token comment">// Other things ...</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>todos$ <span class="token operator">=</span> store
	<span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>
		<span class="token function">select</span><span class="token punctuation">(</span>selectTodos$<span class="token punctuation">)</span><span class="token punctuation">,</span>
		<span class="token function">tap</span><span class="token punctuation">(</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
			<span class="token keyword">this</span><span class="token punctuation">.</span>todoslength <span class="token operator">=</span> todos<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
		<span class="token punctuation">}</span><span class="token punctuation">)</span>
	<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Other things ...</span>
<span class="token function">CreateTodo</span><span class="token punctuation">(</span>todo<span class="token punctuation">:</span> Todo<span class="token punctuation">)</span><span class="token punctuation">{</span>
	<span class="token keyword">const</span> payload <span class="token operator">=</span> <span class="token punctuation">{</span>
		  <span class="token operator">...</span>todo<span class="token punctuation">,</span>
		  userId<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token comment">// userId au pif</span>
		  id<span class="token punctuation">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>todoslength <span class="token operator">+</span> <span class="token number">1</span>
	<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre>
<p>Voilà l’id s’incrémentera au fur est mesure que la collection grandit pour cela on a poussé un peu plus le <strong>pipe()</strong>, cela donne un 1er apercu de la cascade de fonctions qui suis cette opérateur, en lui rajoutant un <strong>tap()</strong>.</p>
<blockquote>
<p><strong>tap</strong> invoque une action pour chaque élément de la séquence observable.</p>
</blockquote>
<p>Le truc intéressant aussi c’est que l’on a pu récupérer cette valeur <strong>sans faire un subscribe sur l’observable selectTodos$</strong> propre.<br>
Voilà la suppression completed !</p>
<h2 id="refacto-time-">Refacto Time !</h2>
<p>Avant de se lancer sur l’update de todo on va changer un peu l’architecture du projet et mettre en place un peu de routing.</p>
<pre><code>app
│   app.component.ts
│   app.routing.ts  
│   app.module.ts  
└───store
└───modules
	└───todo-list
		│   todo-list.module.ts
		│   todo-list.component.ts
		|	todo-list.routing.ts
		└───components
			└───all-todos
			│	│   all-todos.component.ts
			└───select-todo
				│   select-todo.component.ts
</code></pre>
<p>Une config de router pour du lazy-loading avec le <strong>loadChildren</strong>.<br>
<em>app.routing.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Routes<span class="token punctuation">,</span> RouterModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/router'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ModuleWithProviders <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> routes<span class="token punctuation">:</span> Routes<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
	<span class="token punctuation">{</span>
		path<span class="token punctuation">:</span><span class="token string">''</span><span class="token punctuation">,</span>
		pathMatch<span class="token punctuation">:</span> <span class="token string">'full'</span><span class="token punctuation">,</span>
		redirectTo<span class="token punctuation">:</span> <span class="token string">'todo-list'</span>
	<span class="token punctuation">}</span><span class="token punctuation">,</span>
	<span class="token punctuation">{</span>
		path<span class="token punctuation">:</span><span class="token string">'todo-list'</span><span class="token punctuation">,</span>
		loadChildren<span class="token punctuation">:</span> <span class="token string">'./modules/todo-list/todo-list.module#TodoListModule'</span>
	<span class="token punctuation">}</span><span class="token punctuation">,</span>
	<span class="token punctuation">{</span>
		path<span class="token punctuation">:</span><span class="token string">'**'</span><span class="token punctuation">,</span>
		redirectTo<span class="token punctuation">:</span> <span class="token string">'todo-list'</span>
	<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> appRouting<span class="token punctuation">:</span> ModuleWithProviders <span class="token operator">=</span> RouterModule<span class="token punctuation">.</span><span class="token function">forRoot</span><span class="token punctuation">(</span>routes<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
<p>Dans le <strong>AppModule</strong> on peut retirer les dépendances pour les formulaires.</p>
<p><em>app.module.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ... reste</span>
<span class="token comment">// import { ReactiveFormsModule, FormsModule } from '@angular/forms';</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> appRouting <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./app.routing'</span><span class="token punctuation">;</span>
<span class="token comment">// ... reste</span>
  imports<span class="token punctuation">:</span> <span class="token punctuation">[</span>
	  <span class="token comment">// ReactiveFormsModule,</span>
	  <span class="token comment">// FormsModule,</span>
	  appRouting 
	  <span class="token comment">// ...</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token comment">// ... reste</span>
</code></pre>
<p>On va déplacer quasiment tout le fichier vers <strong>all-todos.component</strong>,<br>
reste que la mise en place du <strong>router-outlet</strong><br>
<em>/app.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
	<span class="token comment">// ...reste</span>
  template<span class="token punctuation">:</span> <span class="token template-string"><span class="token string">`&lt;router-outlet&gt;&lt;/router-outlet&gt;`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AppComponent</span><span class="token punctuation">{</span> <span class="token punctuation">}</span>
</code></pre>
<p><em>modules/todo-list/todo-list.routing.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Routes<span class="token punctuation">,</span> RouterModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/router'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ModuleWithProviders <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> routes<span class="token punctuation">:</span> Routes<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
	<span class="token punctuation">{</span>
		path<span class="token punctuation">:</span><span class="token string">''</span><span class="token punctuation">,</span>
		component<span class="token punctuation">:</span> todoListComponent<span class="token punctuation">,</span>
		children<span class="token punctuation">:</span> <span class="token punctuation">[</span>
			<span class="token punctuation">{</span>
				path<span class="token punctuation">:</span> <span class="token string">''</span><span class="token punctuation">,</span>
				pathMatch<span class="token punctuation">:</span> <span class="token string">'full'</span><span class="token punctuation">,</span>
				redirectTo<span class="token punctuation">:</span> <span class="token string">'all-todos'</span>
			<span class="token punctuation">}</span><span class="token punctuation">,</span>
			<span class="token punctuation">{</span>
				path<span class="token punctuation">:</span> <span class="token string">'all-todos'</span><span class="token punctuation">,</span>
				component<span class="token punctuation">:</span> AllTodosComponent
			<span class="token punctuation">}</span><span class="token punctuation">,</span>
			<span class="token punctuation">{</span>
				path<span class="token punctuation">:</span> <span class="token string">'select-todo'</span><span class="token punctuation">,</span>
				component<span class="token punctuation">:</span> SelectTodoComponent
			<span class="token punctuation">}</span><span class="token punctuation">,</span>
			<span class="token punctuation">{</span>
				path<span class="token punctuation">:</span> <span class="token string">'**'</span><span class="token punctuation">,</span>
				redirectTo<span class="token punctuation">:</span> <span class="token string">'all-todos'</span>
			<span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token punctuation">]</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> appRouting<span class="token punctuation">:</span> ModuleWithProviders <span class="token operator">=</span> RouterModule<span class="token punctuation">.</span><span class="token function">forChild</span><span class="token punctuation">(</span>routes<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
<p><em>modules/todo-list/todo-list.module.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> NgModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ReactiveFormsModule<span class="token punctuation">,</span> FormsModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> AllTodosComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./components/all-todos/all-todos.component'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> SelectTodoComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./components/select-todo/select-todo.component'</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> routing <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./todo-list.routing'</span><span class="token punctuation">;</span>

@<span class="token function">NgModule</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  imports<span class="token punctuation">:</span> <span class="token punctuation">[</span>
	  ReactiveFormsModule<span class="token punctuation">,</span>
	  FormsModule<span class="token punctuation">,</span>
	  routing
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  declarations<span class="token punctuation">:</span> <span class="token punctuation">[</span>
	  SelectTodoComponent<span class="token punctuation">,</span>
	  AllTodosComponent
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">TodoListModule</span><span class="token punctuation">{</span> <span class="token punctuation">}</span>
</code></pre>
<p>le <strong>TodoListComponent</strong> va servir de parent qui va lier nos deux autres components avec un autre <strong>router-outlet</strong><br>
<em>modules/todo-list/todo-list.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  template<span class="token punctuation">:</span> <span class="token template-string"><span class="token string">`
	  &lt;header&gt;
		  &lt;nav&gt;
			  &lt;a routerLink="all-todos"&gt;all todos&lt;/a&gt;
			  &lt;a routerLink="select-todo"&gt;select todo&lt;/a&gt;
		  &lt;/nav&gt;
	  &lt;/header&gt;
	  &lt;router-outlet&gt;&lt;/router-outlet&gt;
  `</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">TodoListComponent</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre>
<p><em>modules/todo-list/components/all-todos/all-todo.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Store<span class="token punctuation">,</span> OnInit <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ngrx/store'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> tap <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/operators'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Observable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/Observable'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> Inject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> FormBuilder<span class="token punctuation">,</span> FormGroup<span class="token punctuation">,</span> Validators <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> AppState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../../../store'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> selectTodos$ <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../../../store/selectors/todo-list.selector'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../../../store/actions/todo-list.action'</span><span class="token punctuation">;</span>

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
template<span class="token punctuation">:</span> <span class="token template-string"><span class="token string">`
    &lt;h1&gt;la todolist redux style !&lt;/h1&gt;
    &lt;form [formGroup]="todoForm" (ngSubmit)="CreateTodo(todoForm.value)"&gt;
	    &lt;label&gt;Titre :&lt;/label&gt;
	    &lt;input type="text" formControlName="title" placeholder="Title"/&gt;
	    &lt;label&gt;Est-elle terminé ? :&lt;/label&gt;
	    &lt;input type="checkbox" formControlName="completed"/&gt;
	    &lt;button&gt;Créer&lt;/button&gt;
    &lt;/form&gt;
    &lt;ul&gt;
		&lt;li *ngFor="let todo of todos$ | async"&gt;
			&lt;label&gt;{{ todo.title }}&lt;/label&gt;
			&lt;input type="checkbox" [value]="todo.completed"/&gt;
			&lt;button (click)="DeleteTodo(todo.id)"&gt;Supprimer&lt;/button&gt;
		&lt;/li&gt;
	&lt;/ul&gt;
    `</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AllTodosComponent</span> <span class="token keyword">implements</span> <span class="token class-name">OnInit</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> todoForm<span class="token punctuation">:</span> FormGroup<span class="token punctuation">;</span>
    <span class="token keyword">private</span> todoslength <span class="token punctuation">:</span> number<span class="token punctuation">;</span>
    <span class="token keyword">public</span> todos$<span class="token punctuation">:</span> Observable<span class="token operator">&lt;</span>Todo<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span><span class="token punctuation">;</span>
	<span class="token function">constructor</span><span class="token punctuation">(</span>
		<span class="token keyword">private</span> store<span class="token punctuation">:</span> Store<span class="token operator">&lt;</span>AppState<span class="token operator">&gt;</span>
		@<span class="token function">Inject</span><span class="token punctuation">(</span>FormBuilder<span class="token punctuation">)</span> fb<span class="token punctuation">:</span> FormBuilder
	<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>todos$ <span class="token operator">=</span> store
			<span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>
				<span class="token function">select</span><span class="token punctuation">(</span>selectTodos$<span class="token punctuation">)</span><span class="token punctuation">,</span>
				<span class="token function">tap</span><span class="token punctuation">(</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
					<span class="token keyword">this</span><span class="token punctuation">.</span>todoslength <span class="token operator">=</span> todos<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
				<span class="token punctuation">}</span><span class="token punctuation">)</span>
			<span class="token punctuation">)</span><span class="token punctuation">;</span>
			
	    <span class="token keyword">this</span><span class="token punctuation">.</span>todoForm<span class="token operator">=</span> fb<span class="token punctuation">.</span><span class="token function">group</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
	      title<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">''</span><span class="token punctuation">,</span> Validators<span class="token punctuation">.</span>required<span class="token punctuation">]</span><span class="token punctuation">,</span>
	      completed<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token boolean">false</span><span class="token punctuation">,</span> Validators<span class="token punctuation">]</span>
	    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	  <span class="token punctuation">}</span>
	  
	  <span class="token function">ngOnInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
	    <span class="token keyword">this</span><span class="token punctuation">.</span>store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>InitTodos</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>
	  <span class="token punctuation">}</span>

	  <span class="token function">DeleteTodo</span><span class="token punctuation">(</span>id<span class="token punctuation">:</span> number<span class="token punctuation">)</span><span class="token punctuation">{</span>
		  <span class="token keyword">this</span><span class="token punctuation">.</span>store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>DeleteTodo</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	  <span class="token punctuation">}</span>
	  
	  <span class="token function">CreateTodo</span><span class="token punctuation">(</span>todo<span class="token punctuation">:</span> Todo<span class="token punctuation">)</span><span class="token punctuation">{</span>
		  <span class="token keyword">const</span> payload <span class="token operator">=</span> <span class="token punctuation">{</span>
			  <span class="token operator">...</span>todo<span class="token punctuation">,</span>
			  userId<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token comment">// userId au pif</span>
			  id<span class="token punctuation">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>todoslength
		  <span class="token punctuation">}</span><span class="token punctuation">;</span>
		  <span class="token keyword">this</span><span class="token punctuation">.</span>store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>CreateTodo</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		  <span class="token keyword">this</span><span class="token punctuation">.</span>todoForm<span class="token punctuation">.</span><span class="token function">reset</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	  <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre>
<p>Petite pause avec la nouvelle architecture le dossier <strong>store/</strong> commence à être vraiment loin de nos composants , résultat les imports ressemble plus à rien.<br>
Pour palier ce problème on peut créer les <strong>alias</strong> via le <strong>tsconfig.json</strong> :</p>
<p><em>tsconfig.json</em></p>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"compilerOptions"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
    <span class="token string">"baseUrl"</span><span class="token punctuation">:</span> <span class="token string">"./src"</span><span class="token punctuation">,</span>
    <span class="token string">"paths"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
	  <span class="token string">"@Models/*"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"app/models/*"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token string">"@StoreConfig/*"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"app/store/index.ts"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
	      <span class="token string">"@Actions/*"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"app/store/actions/*"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
	      <span class="token string">"@Reducers/*"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"app/store/reducers/*"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
	      <span class="token string">"@Selectors/*"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"app/store/selectors/*"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<p>Avec ces options en plus on va pouvoir écrire :</p>
<p><em>modules/todo-list/components/all-todos/all-todo.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> AppState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@StoreConfig'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> selectTodos$ <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@Selectors/todo-list.selector'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@Actions/todo-list.action'</span><span class="token punctuation">;</span>
</code></pre>
<p>Plutôt cool non si votre IDE indique une erreur redémarrer-le. Voilà le point refacto est terminé passons à l’update de todo !</p>
<h2 id="update-todo">Update Todo</h2>
<p>On va rajouter un propriété dans le <strong>TodoListState</strong> afin de garder l’id d’une todo, on va modifier l’interface, les actions et le reducer pour pouvoir ajouter cette logique.</p>
<p><em>models/todo.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">TodoListState</span> <span class="token punctuation">{</span>
	<span class="token comment">// ... other</span>
	selectTodo<span class="token punctuation">:</span> number
<span class="token punctuation">}</span>
</code></pre>
<p><em>store/actions/todo-list.action.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">export</span> namespace TodoListModule <span class="token punctuation">{</span>
	<span class="token keyword">export</span> <span class="token keyword">enum</span> ActionTypes <span class="token punctuation">{</span>
		<span class="token comment">// ... other</span>
		SELECT_TODO <span class="token operator">=</span> <span class="token string">'[todoList] Select Todo'</span><span class="token punctuation">,</span>
		UPDATE_TODO<span class="token operator">=</span> <span class="token string">'[todoList] UpdateTodo'</span>
	<span class="token punctuation">}</span>
	<span class="token comment">// ... other</span>
	<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">SelectTodo</span> <span class="token punctuation">{</span>
		readonly type <span class="token operator">=</span> ActionTypes<span class="token punctuation">.</span>SELECT_TODO<span class="token punctuation">;</span>
		<span class="token function">constructor</span><span class="token punctuation">(</span>paylaod<span class="token punctuation">:</span> number<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	
	<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">UpdateTodo</span> <span class="token punctuation">{</span>
		readonly type <span class="token operator">=</span> ActionTypes<span class="token punctuation">.</span>UPDATE_TODO<span class="token punctuation">;</span>
		<span class="token function">constructor</span><span class="token punctuation">(</span>paylaod<span class="token punctuation">:</span> Todo<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	<span class="token comment">// ... other</span>
	<span class="token keyword">export</span> type Actions <span class="token operator">=</span> InitTodos
	<span class="token operator">|</span> SelectTodo
	<span class="token operator">|</span> DeleteTodo<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>
<p><em>/store/reducers/todo-list.reducer.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../actions/todo-list.action'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListState  <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../models/todo'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> todosMock <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../mocks/todo-list'</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> initialState<span class="token punctuation">:</span> TodoListState <span class="token operator">=</span> <span class="token punctuation">{</span>
	<span class="token comment">// ... other</span>
	selectTodo<span class="token punctuation">:</span> undefined
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">todosReducer</span><span class="token punctuation">(</span>
<span class="token comment">// ... other</span>

    <span class="token keyword">case</span> TodoListModule<span class="token punctuation">.</span>ActionTypes<span class="token punctuation">.</span>SELECT_TODO<span class="token punctuation">:</span>
	    <span class="token keyword">return</span> <span class="token punctuation">{</span>
			<span class="token operator">...</span>state<span class="token punctuation">,</span>
			selectTodo<span class="token punctuation">:</span> action<span class="token punctuation">.</span>payload
		<span class="token punctuation">}</span><span class="token punctuation">;</span>
		
	<span class="token keyword">case</span> TodoListModule<span class="token punctuation">.</span>ActionTypes<span class="token punctuation">.</span>UPDATE_TODO<span class="token punctuation">:</span>
	    <span class="token keyword">return</span> <span class="token punctuation">{</span>
			<span class="token operator">...</span>state<span class="token punctuation">,</span>
			data<span class="token punctuation">:</span> state<span class="token punctuation">.</span>data<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
				<span class="token keyword">if</span> <span class="token punctuation">(</span>todos<span class="token punctuation">.</span>id <span class="token operator">===</span> action<span class="token punctuation">.</span>payload<span class="token punctuation">.</span>id<span class="token punctuation">)</span> <span class="token punctuation">{</span>
					<span class="token keyword">return</span> action<span class="token punctuation">.</span>payload
				<span class="token punctuation">}</span>
				<span class="token keyword">return</span> todos 
			<span class="token punctuation">}</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span><span class="token punctuation">;</span>
	
		
<span class="token comment">// ... other      </span>
</code></pre>
<p>Cette fonctionnalité va être mis dans le <strong>SelectTodoComponent</strong> avec un formulaire assez semblable à celui de la création de todo.</p>
<p><em>modules/todo-list/components/select-todo/select-todo.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Store <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ngrx/store'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Observable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/Observable'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> map<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/operators'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> Inject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> FormBuilder<span class="token punctuation">,</span> FormGroup<span class="token punctuation">,</span> Validators <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> AppState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@StoreConfig'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> selectTodoListState$ <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@Selectors/todo-list.selector'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@Actions/todo-list.action'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@Models/todo-list'</span><span class="token punctuation">;</span>

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
template<span class="token punctuation">:</span> <span class="token template-string"><span class="token string">`
    &lt;h1&gt;Mettre à jour la todo&lt;/h1&gt;
    &lt;form [formGroup]="updateTodoForm" (ngSubmit)="CreateTodo(updateTodoForm.value)"&gt;
	    &lt;label&gt;Titre :&lt;/label&gt;
	    &lt;input type="text" formControlName="title" placeholder="Title"/&gt;
	    &lt;label&gt;Est-elle terminé ? :&lt;/label&gt;
	    &lt;input type="checkbox" formControlName="completed"/&gt;
	    &lt;button&gt;Modifier&lt;/button&gt;
    &lt;/form&gt;
    `</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">SelectTodoComponent</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> updateTodoForm<span class="token punctuation">:</span> FormGroup<span class="token punctuation">;</span>
    <span class="token keyword">public</span> todos$<span class="token punctuation">:</span> Observable<span class="token operator">&lt;</span>TodoListState<span class="token operator">&gt;</span>
    <span class="token keyword">public</span> selectTodos<span class="token punctuation">:</span> Todo<span class="token punctuation">;</span>
	<span class="token function">constructor</span><span class="token punctuation">(</span>
		<span class="token keyword">private</span> store<span class="token punctuation">:</span> Store<span class="token operator">&lt;</span>AppState<span class="token operator">&gt;</span>
		@<span class="token function">Inject</span><span class="token punctuation">(</span>FormBuilder<span class="token punctuation">)</span> fb<span class="token punctuation">:</span> FormBuilder
	<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>todos$ <span class="token operator">=</span> store
			<span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>
				<span class="token function">select</span><span class="token punctuation">(</span>selectTodoListState$<span class="token punctuation">)</span><span class="token punctuation">,</span>
				<span class="token function">map</span><span class="token punctuation">(</span>todoListState <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
					<span class="token keyword">return</span> todoListState<span class="token punctuation">.</span>data<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>todos <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
						<span class="token keyword">if</span> <span class="token punctuation">(</span>todos<span class="token punctuation">.</span>id <span class="token operator">===</span> todoListState<span class="token punctuation">.</span>selectTodo<span class="token punctuation">)</span><span class="token punctuation">{</span>
							<span class="token keyword">this</span><span class="token punctuation">.</span>selectTodos <span class="token operator">=</span> todos
						<span class="token punctuation">}</span>
					<span class="token punctuation">}</span><span class="token punctuation">)</span>
				<span class="token punctuation">}</span><span class="token punctuation">)</span>
			<span class="token punctuation">)</span><span class="token punctuation">;</span>
			
	    <span class="token keyword">this</span><span class="token punctuation">.</span>updateTodoForm<span class="token operator">=</span> fb<span class="token punctuation">.</span><span class="token function">group</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
	      title<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">''</span><span class="token punctuation">,</span> Validators<span class="token punctuation">.</span>required<span class="token punctuation">]</span><span class="token punctuation">,</span>
	      completed<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token boolean">false</span><span class="token punctuation">,</span> Validators<span class="token punctuation">]</span>
	    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	  <span class="token punctuation">}</span>
	  <span class="token function">ngOnInit</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		  <span class="token keyword">this</span><span class="token punctuation">.</span>updateTodoForm<span class="token punctuation">.</span><span class="token function">patchValue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
			  title<span class="token punctuation">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>selectTodos<span class="token punctuation">.</span>title<span class="token punctuation">,</span>
		      completed<span class="token punctuation">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>selectTodos<span class="token punctuation">.</span>completed
		  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	  <span class="token punctuation">}</span>
	  
	  <span class="token function">UpdateTodo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
	  <span class="token keyword">const</span> payload <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>selectTodos<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>updateTodoForm<span class="token punctuation">)</span><span class="token punctuation">;</span>
		  <span class="token keyword">this</span><span class="token punctuation">.</span>store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>UpdateTodo</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	  <span class="token punctuation">}</span>
	  
<span class="token punctuation">}</span>
</code></pre>
<p>Voilà on a maintenant toutes nos fonctionnalités : <strong>Create, Update, Delete</strong> on va pouvoir commencer a inclure les requêtes <strong>http</strong>, pour cela on va prendre le module npm de  <strong><a href="https://jsonplaceholder.typicode.com/">JsonPlaceholder</a></strong> avec <strong>npm install -g json-server</strong>.<br>
Le fichier va ajouter un nouveaux dossier <strong>/server</strong> au même niveau que <strong>/app</strong> et mettre un json :</p>
<pre><code>src
|
└───app
|
└───server
	└───db.json
</code></pre>
<p>ensuite on ajoute :</p>
<p><em>db.json</em></p>
<pre class=" language-json"><code class="prism  language-json">	<span class="token punctuation">{</span>
		<span class="token string">"todos"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
	<span class="token punctuation">}</span>
</code></pre>
<p>Et pour finir sur un terminal, il suffit de rentrer</p>
<pre class=" language-bash"><code class="prism  language-bash">json-server path-of-json
</code></pre>
<p>le port 3000 va s’ouvrir, allez sur <strong>localhost:3000/todos</strong> et hop une Api rest prête à l’emploi easy.</p>
<h2 id="routes-get">Routes GET</h2>
<p>Voilà maintenant plus qu’a créer notre service avant tout il vous faudra importé le module http de Angular :</p>
<p><em>/modules/todo-list/todo-list.module.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ..other</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HttpClientModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/common/http'</span><span class="token punctuation">;</span>

@<span class="token function">NgModule</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  imports<span class="token punctuation">:</span> <span class="token punctuation">[</span>
	  <span class="token comment">// ..other</span>
	  HttpClientModule 
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">TodoListModule</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
</code></pre>
<p>Et générer un service vous pouvez le faire depuis la console :</p>
<pre class=" language-bash"><code class="prism  language-bash">ng g <span class="token function">service</span> modules/todo-list/services/todo-list
</code></pre>
<p>Normalement il sera automatiquement déclarer dans le module TodoListModule.</p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ... other</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HttpClient <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/common/http'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Observable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/Observable'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Todo <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@Models/todo'</span><span class="token punctuation">;</span>
 
@<span class="token function">Injectable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">TodoListService</span> <span class="token punctuation">{</span>
 
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token keyword">private</span> http<span class="token punctuation">:</span>HttpClient<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
 
    <span class="token function">getTodos</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Observable<span class="token operator">&lt;</span>Todo<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>http<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token operator">&lt;</span>Todo<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token string">'/todos'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<p>On ajoute le service dans le component et au <strong>resolve</strong> de la requête on lui passe le dispatch <strong>InitTodos</strong></p>
<p><em>modules/todo-list/components/all-todos/all-todo.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ...other</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListService <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../services/todo-list'</span><span class="token punctuation">;</span>

<span class="token comment">// ...other</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AllTodosComponent</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...other</span>
	<span class="token function">constructor</span><span class="token punctuation">(</span>
		<span class="token comment">// ...other</span>
		<span class="token keyword">private</span> todoListService<span class="token punctuation">:</span> TodoListService 
	<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// ...other }</span>
	  
	  <span class="token function">ngOnInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
	  <span class="token keyword">this</span><span class="token punctuation">.</span>todoListService<span class="token punctuation">.</span><span class="token function">getTodos</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		  <span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
			  <span class="token keyword">this</span><span class="token punctuation">.</span>store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>InitTodos</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>   
	  <span class="token punctuation">}</span>
	  
<span class="token comment">// ...other</span>
</code></pre>
<p>On change le <strong>InitTodos</strong> en lui ajoutant un payload</p>
<p><em>store/actions/todo-list.action.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">export</span> namespace TodoListModule <span class="token punctuation">{</span>
	<span class="token comment">// ...other</span>
	<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">InitTodos</span> <span class="token punctuation">{</span>
		readonly type <span class="token operator">=</span> ActionTypes<span class="token punctuation">.</span>INIT_TODO<span class="token punctuation">;</span>
		<span class="token function">constructor</span><span class="token punctuation">(</span><span class="token keyword">public</span> payload<span class="token punctuation">:</span> Todo<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	<span class="token comment">// ...other</span>
<span class="token punctuation">}</span>
</code></pre>
<p>Et le reducer retourne le payload à la place du mock que l’on peut supprimé maintenant <s>/mocks</s></p>
<p><em>/store/reducers/todo-list.reducer.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ...Other</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">todosReducer</span><span class="token punctuation">(</span>
<span class="token comment">// ...Other</span>
    <span class="token keyword">case</span> TodoListModule<span class="token punctuation">.</span>ActionTypes<span class="token punctuation">.</span>INIT_TODOS <span class="token punctuation">:</span>
	    <span class="token keyword">return</span> <span class="token punctuation">{</span>
			<span class="token operator">...</span>state<span class="token punctuation">,</span>
			data<span class="token punctuation">:</span> <span class="token punctuation">[</span>
				<span class="token operator">...</span>action<span class="token punctuation">.</span>payload
			<span class="token punctuation">]</span>
		<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token comment">// ...Other</span>
</code></pre>
<p>La logique fonctionne bien mais avec Ngrx il est possible d’aller beaucoup plus loin en gérant également la partie <strong>asynchrone</strong> pour le moment impossible dans le reducer <strong>(synchrone only)</strong> .<br>
<strong>Effects</strong> est une second module créer par la team de ngrx qui a pour but de gérer ce genre de cas, en quelque mot les Effects sont des <strong>listenners d’actions</strong> qui peuvent effectués des fonctions et qui retourne une <strong>nouvelle action</strong> ( ou pas ).</p>
<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1600/1*vSadxKWVoAirhVCa8fxiNw.png">
</p>
<center>Les effects</center>
<p>Avec un effect au lieu d’avoir une seule action <strong>InitTodos</strong>, on aura une action <strong>LoadInitTodos</strong> qui chargera les données de l’api et renvoie une action <strong>SuccessInitTodos</strong> dans le cas d’une réponse 200 du server et un <strong>ErrorInitTodos</strong> en cas d’erreur serveur.</p>
<center>LoadInitTodos =&gt; SuccessInitTodos || ErrorInitTodos</center>
<p>Pour installez tous ça go terminal :</p>
<pre class=" language-bash"><code class="prism  language-bash"><span class="token function">npm</span> i @ngrx/effects --save ou yarn add @ngrx/effects --dev 
</code></pre>
<p>Et créer un nouveaux fichier d’effect :</p>
<pre><code>app
└───modules
└───store
	└───actions  
	└───reducers
	└───selectors
	└───effects
		└───todo-list.effect.ts

</code></pre>
<p>Un petit alias :<br>
<em>tsconfig.json</em></p>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"compilerOptions"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
    <span class="token string">"baseUrl"</span><span class="token punctuation">:</span> <span class="token string">"./src"</span><span class="token punctuation">,</span>
    <span class="token string">"paths"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
		<span class="token comment">// ... reste</span>
		<span class="token string">"@Effects/*"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"app/store/effects/*"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<p>On va ajouter les 3 actions pour le effect : <strong>LOAD_INIT_TODOS, SUCCESS_INIT_TODOS, ERROR_INIT_TODOS</strong>.<br>
Au passage on retire l’action <strong>InitTodos</strong></p>
<p><em>store/actions/todo-list.action.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">export</span> namespace TodoListModule <span class="token punctuation">{</span>
	<span class="token keyword">export</span> <span class="token keyword">enum</span> ActionTypes <span class="token punctuation">{</span>
		<span class="token comment">// ... other</span>
		LOAD_INIT_TODOS <span class="token operator">=</span> <span class="token string">'[todoList] Load Init Todos'</span><span class="token punctuation">,</span>
		SUCCESS_INIT_TODOS <span class="token operator">=</span> <span class="token string">'[todoList] Success Init Todos'</span><span class="token punctuation">,</span>
		ERROR_INIT_TODOS <span class="token operator">=</span> <span class="token string">'[todoList] Error Init Todos'</span><span class="token punctuation">,</span>
		<span class="token comment">// a supprimer INIT_TODOS = '[todoList] Init Todos',</span>
	<span class="token punctuation">}</span>
	<span class="token comment">// ... other</span>
	<span class="token comment">/*
	** A supprimer
	export class InitTodos {
		readonly type = ActionTypes.INIT_TODO;
		constructor(public payload: Todo[]){ }
	}
	*/</span>
	<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">LoadInitTodos</span> <span class="token punctuation">{</span>
		readonly type <span class="token operator">=</span> ActionTypes<span class="token punctuation">.</span>LOAD_INIT_TODOS<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">SuccessInitTodos</span> <span class="token punctuation">{</span>
		readonly type <span class="token operator">=</span> ActionTypes<span class="token punctuation">.</span>SUCCESS_INIT_TODOS<span class="token punctuation">;</span>
		<span class="token function">constructor</span><span class="token punctuation">(</span>payload<span class="token punctuation">:</span> todo<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	
	<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">ErrorInitTodos</span> <span class="token punctuation">{</span>
		readonly type <span class="token operator">=</span> ActionTypes<span class="token punctuation">.</span>ERROR_INIT_TODOS<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	<span class="token comment">// ... other</span>
	
	<span class="token keyword">export</span> type Actions <span class="token operator">=</span> DeleteTodo
	<span class="token comment">// | InitTodos</span>
	<span class="token operator">|</span> LoadInitTodos
	<span class="token operator">|</span> SuccessInitTodos
	<span class="token operator">|</span> ErrorInitTodos<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>
<p>Maintenant dans le reducer, vu que cette fois on fait de l’asynchrone on va commencer a jouer avec les booleans <strong>loaded</strong> &amp; <strong>loading</strong> cela permettra de changer l’UI si les données sont en cours de fetch.</p>
<p><em>/store/reducers/todo-list.reducer.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ... other</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">todosReducer</span><span class="token punctuation">(</span>
<span class="token comment">// ... other</span>

    <span class="token keyword">case</span> TodoListModule<span class="token punctuation">.</span>ActionTypes<span class="token punctuation">.</span>LOAD_INIT_TODOS<span class="token punctuation">:</span>
    <span class="token comment">// Passe le loading a true</span>
	    <span class="token keyword">return</span> <span class="token punctuation">{</span>
			<span class="token operator">...</span>state<span class="token punctuation">,</span>
			loading<span class="token punctuation">:</span> <span class="token boolean">true</span>
		<span class="token punctuation">}</span><span class="token punctuation">;</span>
		
	<span class="token keyword">case</span> TodoListModule<span class="token punctuation">.</span>ActionTypes<span class="token punctuation">.</span>SUCCESS_INIT_TODOS<span class="token punctuation">:</span>
	<span class="token comment">// Bind state.data avec les todos du server</span>
	<span class="token comment">// Passe le loaded a true et le loading a false</span>
	    <span class="token keyword">return</span> <span class="token punctuation">{</span>
			<span class="token operator">...</span>state<span class="token punctuation">,</span>
			loading<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
			loaded<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
			data<span class="token punctuation">:</span> action<span class="token punctuation">.</span>payload
		<span class="token punctuation">}</span><span class="token punctuation">;</span>
		
	<span class="token keyword">case</span> TodoListModule<span class="token punctuation">.</span>ActionTypes<span class="token punctuation">.</span>ERROR_INIT_TODOS<span class="token punctuation">:</span>
	<span class="token comment">// Error rend le loading a false</span>
	    <span class="token keyword">return</span> <span class="token punctuation">{</span>
			<span class="token operator">...</span>state<span class="token punctuation">,</span>
			loading<span class="token punctuation">:</span> <span class="token boolean">false</span>
		<span class="token punctuation">}</span><span class="token punctuation">;</span>
	<span class="token comment">/*		
	** A supprimer
	case TodoListModule.ActionTypes.INIT_TODOS :
	    return {
			...state,
			data: [
				...action.payload
			]
		};
	*/</span>
<span class="token comment">// ... other      </span>
</code></pre>
<p>Maintenant que l’on a toutes les actions nécéssaire on écrie l’effect.</p>
<p><em>store/effects/todo-list.effect.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Injectable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Actions<span class="token punctuation">,</span> Effect<span class="token punctuation">,</span> ofType <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ngrx/effects'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Observable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/Observable'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> catchError<span class="token punctuation">,</span> map<span class="token punctuation">,</span> switchMap <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/operators'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@Actions/todo-list.action'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListService <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../services/todo-list'</span><span class="token punctuation">;</span>

@<span class="token function">Injectable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">TodoListEffects</span> <span class="token punctuation">{</span>
  <span class="token comment">// Listen les actions passées dans le Store</span>
  @<span class="token function">Effect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> LoadTodos$<span class="token punctuation">:</span> Observable<span class="token operator">&lt;</span>TodoListModule<span class="token punctuation">.</span>Actions<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>actions$
	  <span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>
		<span class="token comment">// Si l'action est de type 'LOAD_INIT_TODOS' applique la suite sinon ne fait rien</span>
	    <span class="token function">ofType</span><span class="token punctuation">(</span>TodoListModule<span class="token punctuation">.</span>ActionTypes<span class="token punctuation">.</span>LOAD_INIT_TODOS<span class="token punctuation">)</span><span class="token punctuation">,</span>
	    <span class="token comment">// l'action du switchMap est l'objet d'action qui est récupérer dans le ofType</span>
	    <span class="token comment">// action = { type: '[todoList] Load Init Todos' }</span>
	    <span class="token function">switchMap</span><span class="token punctuation">(</span>action <span class="token operator">=&gt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>todoListService<span class="token punctuation">.</span><span class="token function">getTodos</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
	    <span class="token comment">// Dans le switchMap on éxécute le service et retournera le body dans le map suivant</span>
	    <span class="token comment">// todos = Todo[]</span>
	    <span class="token comment">// On a plus cas renvoyer une action SuccessInitTodos avec les todos en params</span>
	    <span class="token function">map</span><span class="token punctuation">(</span>todos <span class="token operator">=&gt;</span> <span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>SuccessInitTodos</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span><span class="token punctuation">)</span>
	    <span class="token comment">// Si le resolve n'a pas abouti il passe dans cette fonction</span>
	    <span class="token comment">// Qui renvoie l'action ErrorInitTodos</span>
	    <span class="token function">catchError</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>ErrorInitTodos</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
	  <span class="token punctuation">)</span><span class="token punctuation">;</span>
 
  <span class="token function">constructor</span><span class="token punctuation">(</span>
    <span class="token keyword">private</span> todoListService<span class="token punctuation">:</span> TodoListService<span class="token punctuation">,</span>
    <span class="token keyword">private</span> actions$<span class="token punctuation">:</span> Actions
  <span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<p>On ajoute 2 autre selectors pour le loading et le loaded state.</p>
<p><em>store/selectors/todo-list.selector.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ... reste	</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> selectTodosLoading$ <span class="token operator">=</span>
	<span class="token function">createSelector</span><span class="token punctuation">(</span>selectTodoListState$<span class="token punctuation">,</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> todos<span class="token punctuation">.</span>loading<span class="token punctuation">)</span><span class="token punctuation">;</span>
	
<span class="token keyword">export</span> <span class="token keyword">const</span> selectTodosLoaded$ <span class="token operator">=</span>
	<span class="token function">createSelector</span><span class="token punctuation">(</span>selectTodoListState$<span class="token punctuation">,</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> todos<span class="token punctuation">.</span>loaded<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
<p><em>modules/todo-list/components/all-todos/all-todo.component.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ...other</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListService <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../services/todo-list'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> selectTodoListState$<span class="token punctuation">,</span> selectTodos$ <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@Selectors/todo-list.selector'</span><span class="token punctuation">;</span> 

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
template<span class="token punctuation">:</span> <span class="token template-string"><span class="token string">`
    &lt;h1&gt;la todolist redux style !&lt;/h1&gt;
    &lt;form [formGroup]="todoForm" (ngSubmit)="CreateTodo(todoForm.value)"&gt;
	    &lt;label&gt;Titre :&lt;/label&gt;
	    &lt;input type="text" formControlName="title" placeholder="Title"/&gt;
	    &lt;label&gt;Est-elle terminé ? :&lt;/label&gt;
	    &lt;input type="checkbox" formControlName="completed"/&gt;
	    &lt;button&gt;Créer&lt;/button&gt;
    &lt;/form&gt;
    &lt;ul *ngIf="!(todosLoading) | async; else loading"&gt;
		&lt;li *ngFor="let todo of todos$ | async"&gt;
			&lt;label&gt;{{ todo.title }}&lt;/label&gt;
			&lt;input type="checkbox" [value]="todo.completed"/&gt;
			&lt;button (click)="DeleteTodo(todo.id)"&gt;Supprimer&lt;/button&gt;
		&lt;/li&gt;
	&lt;/ul&gt;
	&lt;ng-template #loading&gt;En cours de chargement&lt;/ng-template&gt;
    `</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment">// ...other</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AllTodosComponent</span> <span class="token punctuation">{</span>
<span class="token keyword">public</span> todosLoading<span class="token punctuation">:</span> Observable<span class="token operator">&lt;</span>boolean<span class="token operator">&gt;</span><span class="token punctuation">;</span>
    <span class="token comment">// ...other</span>
	<span class="token function">constructor</span><span class="token punctuation">(</span>
		<span class="token comment">// ...other</span>
		<span class="token comment">// a supprimer private todoListService: TodoListService </span>
	<span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token comment">// ...other</span>
	<span class="token keyword">this</span><span class="token punctuation">.</span>todosLoading <span class="token operator">=</span> store<span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span><span class="token function">select</span><span class="token punctuation">(</span>selectTodoListState$<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	  
	  <span class="token function">ngOnInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
	  <span class="token comment">/*
	  * A supprimer
	  this.todoListService.getTodos()
		  .subscribe((todos) =&gt; {
			  this.store.dispatch(new TodoListModule.InitTodos(todos));
		  });
		  */</span>
		  <span class="token keyword">this</span><span class="token punctuation">.</span>store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>LoadInitTodos</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
	  <span class="token punctuation">}</span>
<span class="token comment">// ...other</span>
</code></pre>
<p>Voilà le côté service est déplacer vers le Effect qui via le <strong>LoadInitTodos()</strong> va utiliser le service <strong>todoListService.getTodos()</strong> qui dispatchera la nouvelle valeur de todos dans le Store.<br>
On a rajouter en plus un template de chargement qui s’affichera entre le <strong>LoadInitTodos()</strong> et le <strong>SuccessInitTodos()</strong></p>
<h3 id="bonus-time-">BONUS TIME !!</h3>
<p>Pour le moment c’est toujours <strong>AllTodosComponent</strong> qui a la main sur le <strong>LoadInitTodos</strong> mais on peut l’extraire également et l’intégrée a un <strong>Guard Angular</strong> qui vérifiera si la donnée est déjà chargée ( vérifiable par la propriété loaded ) dans le cas ou il n’y a pas de donnée, il enverra l’action <strong>LoadInitTodos</strong>.</p>
<p><em>Générer un guard</em></p>
<pre class=" language-bash"><code class="prism  language-bash">ng g guard modules/todo-list/guards/is-todos-loaded/is-todos-loaded
</code></pre>
<p><em>modules/todo-list/guards/is-todos-loaded/is-todos-loaded.guard</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Observable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/Observable'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Injectable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ActivatedRouteSnapshot<span class="token punctuation">,</span> CanActivate<span class="token punctuation">,</span> RouterStateSnapshot<span class="token punctuation">,</span> Router <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/router'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> select<span class="token punctuation">,</span> Store <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ngrx/store'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> AppState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@StoreConfig'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> map <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs/operators'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> selectTodosLoaded$ <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@Selectors/todo-list.selector'</span><span class="token punctuation">;</span> 
<span class="token keyword">import</span> <span class="token punctuation">{</span> TodoListModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@Actions/todo-list.action'</span><span class="token punctuation">;</span>

@<span class="token function">Injectable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">IsTodosLoadedGuard</span> <span class="token keyword">implements</span> <span class="token class-name">CanActivate</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span>
    <span class="token keyword">private</span> store<span class="token punctuation">:</span> Store<span class="token operator">&lt;</span>AppState<span class="token operator">&gt;</span><span class="token punctuation">,</span>
    <span class="token keyword">private</span> router<span class="token punctuation">:</span> Router
  <span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token function">canActivate</span><span class="token punctuation">(</span>
    next<span class="token punctuation">:</span> ActivatedRouteSnapshot<span class="token punctuation">,</span>
    state<span class="token punctuation">:</span> RouterStateSnapshot<span class="token punctuation">)</span><span class="token punctuation">:</span> Observable<span class="token operator">&lt;</span>boolean<span class="token operator">&gt;</span> <span class="token operator">|</span> Promise<span class="token operator">&lt;</span>boolean<span class="token operator">&gt;</span> <span class="token operator">|</span> boolean <span class="token punctuation">{</span>

    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>store
      <span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>
        <span class="token function">select</span><span class="token punctuation">(</span>selectTodosLoaded$<span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token function">map</span><span class="token punctuation">(</span>isLoaded <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isLoaded<span class="token punctuation">)</span> <span class="token punctuation">{</span>
	          <span class="token keyword">this</span><span class="token punctuation">.</span>store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span> <span class="token keyword">new</span> <span class="token class-name">TodoListModule<span class="token punctuation">.</span>LoadInitTodos</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
          <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<p>Ajouter le guard au niveau des routes :</p>
<p><em>modules/todo-list/todo-list.routing.ts</em></p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ...Other</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> IsTodosLoadedGuard <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./guards/is-todos-loaded/is-todos-loaded.guard'</span><span class="token punctuation">;</span>
<span class="token comment">// ...Other</span>
			<span class="token punctuation">{</span>
				path<span class="token punctuation">:</span> <span class="token string">'all-todos'</span><span class="token punctuation">,</span>
				component<span class="token punctuation">:</span> AllTodosComponent<span class="token punctuation">,</span>
				canActivate<span class="token punctuation">:</span><span class="token punctuation">[</span>IsTodosLoadedGuard<span class="token punctuation">]</span>
			<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token comment">// ...Other</span>
</code></pre>
<p>Avec le guard plus besoin de charger l’action depuis le component :</p>
<pre class=" language-javascript"><code class="prism  language-javascript"><span class="token comment">// ...other</span>

	<span class="token comment">// ...other</span>
	  <span class="token comment">/*
	  A supprimer
	  ngOnInit(){
		  this.store.dispatch(new TodoListModule.LoadInitTodos());
	  }
	  */</span>
<span class="token comment">// ...other</span>
</code></pre>
<p>Voilà une manière de charger la donnée avant même de charger un composant une idée de sortir encore plus le component de la logique.</p>
<h2 id="routes-post">Routes POST</h2>
<p>Maintenant on modifier notre action de création de todo pour inclure un appel serveur de la même façon de l’initialisation</p>

