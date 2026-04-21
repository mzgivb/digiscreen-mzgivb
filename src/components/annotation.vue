<template>
	<transition-group name="fondu">
		<div id="annotation" :class="{'curseur': this.outilDeplacer, 'gomme': this.outilGomme, 'avec-nav': nav}" key="canva">
			<v-stage ref="stage" :config="{width: dimensionsCanva.w, height: dimensionsCanva.h}" @mousedown="selectionnerDebut" @touchstart="selectionnerDebut" @mousemove="selectionnerMouvement" @touchmove="selectionnerMouvement" @mouseup="selectionnerFin" @touchend="selectionnerFin">
				<v-layer ref="objets">
					<template v-for="(item, indexItem) in items">
						<v-rect :config="item" v-if="item.objet === 'rectangle' || item.objet === 'rectangle-plein' || item.objet === 'surlignage'" @dragstart="selectionnerObjet" @dragend="deplacerFin" @transformend="redimensionnerFin" :key="'rectangle_' + indexItem" />
						<v-ellipse :config="item" v-else-if="item.objet === 'cercle' || item.objet === 'cercle-plein'" @dragend="deplacerFin" @transformend="redimensionnerFin" :key="'cercle_' + indexItem" @dragstart="selectionnerObjet" />
						<v-star :config="item" v-else-if="item.objet === 'etoile'" @dragstart="selectionnerObjet" @dragend="deplacerFin" @transformend="redimensionnerFin" :key="'etoile_' + indexItem" />
						<v-line :config="item" v-else-if="item.objet === 'ligne'" @dragstart="selectionnerObjet" @dragmove="deplacerForme" @dragend="enregistrer" :key="'ligne_' + indexItem" />
						<v-arrow :config="item" v-else-if="item.objet === 'fleche'" @dragstart="selectionnerObjet" @dragmove="deplacerForme" @dragend="enregistrer" :key="'fleche_' + indexItem" />
						<v-circle :config="item" v-else-if="item.objet === 'ancre'" @dragstart="selectionnerObjet" @dragmove="deplacerAncre" @dragend="enregistrer" :key="'ancre_' + indexItem" />
						<v-text :config="item" v-else-if="item.objet === 'texte'" @dragstart="selectionnerObjet" @dragend="deplacerFin" @dblclick="modifierTexte" @dbltap="modifierTexte" @transform="redimensionnerTexte" @transformend="redimensionnerFin" :key="'texte_' + indexItem" />
						<v-label :config="item" v-else-if="item.objet === 'label'" @dragstart="selectionnerObjet" @dragend="deplacerFin" @dblclick="modifierTexte" @dbltap="modifierTexte" @transformend="redimensionnerFin" :key="'label_' + indexItem">
							<v-tag :config="item.tag" />
							<v-text :config="item.text" />
						</v-label>
						<v-line :config="item" v-else-if="item.objet === 'dessin' || item.objet === 'surligneur-dessin'" @dragstart="selectionnerObjet" @dragend="deplacerFin" :key="'dessin_' + indexItem" />
					</template>
					<v-rect :config="{name: 'selection', fill: 'rgba(1, 206, 209, 0.2)', visible: selection, x: positionSelectionX, y: positionSelectionY, width: largeurSelection, height: hauteurSelection}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-rect :config="{name: 'objet-rectangle', fill: 'transparent', visible: creation && outil === 'rectangle', x: positionObjetX, y: positionObjetY, width: largeurObjet, height: hauteurObjet, stroke: '#ff0000', strokeWidth: 3, dash: [7, 5]}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-rect :config="{name: 'objet-rectangle', fill: '#cccccc', visible: creation && outil === 'rectangle-plein', x: positionObjetX, y: positionObjetY, width: largeurObjet, height: hauteurObjet}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-ellipse :config="{name: 'objet-cercle', fill: 'transparent', visible: creation && outil === 'cercle', x: positionObjetX + (largeurObjet / 2), y: positionObjetY + (hauteurObjet / 2), width: largeurObjet, height: hauteurObjet, stroke: '#ff0000', strokeWidth: 3, dash: [7, 5]}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-ellipse :config="{name: 'objet-cercle', fill: '#cccccc', visible: creation && outil === 'cercle-plein', x: positionObjetX + (largeurObjet / 2), y: positionObjetY + (hauteurObjet / 2), width: largeurObjet, height: hauteurObjet}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-rect :config="{name: 'objet-surlignage', fill: '#ffff00', opacity: 0.5, visible: creation && outil === 'surlignage', x: positionObjetX, y: positionObjetY, width: largeurObjet, height: hauteurObjet}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-line :config="{name: 'objet-ligne', fill: '#ff0000', visible: creation && outil === 'ligne', x: 0, y: 0, points: [positionX1, positionY1, positionX2, positionY2], fill: '#ff0000', stroke: '#ff0000', strokeWidth: 3}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-arrow :config="{name: 'objet-fleche', fill: '#ff0000', visible: creation && outil === 'fleche', x: 0, y: 0, points: [positionX1, positionY1, positionX2, positionY2], pointerLength: 15, pointerWidth: 12, fill: '#ff0000', stroke: '#ff0000', strokeWidth: 3}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-transformer ref="transformer" :config="{anchorStroke: '#ff0000', anchorFill: '#ffff00', anchorSize: 10, anchorCornerRadius: 10, borderStroke: definirCouleurBordure(), borderDash: [3, 3], borderStrokeWidth: 1, enabledAnchors: definirAncres(), padding: 7.5, rotateEnabled: false, keepRatio: true, boundBoxFunc: definirLimites}" />
				</v-layer>
			</v-stage>
		</div>

		<div id="outils-annotation" :style="toolbarStyle" key="outils">
			<span class="outil drag-handle" @mousedown.prevent="startToolbarDrag" @touchstart.prevent="startToolbarDrag">
				<i class="material-icons" style="font-size: 16px;">drag_indicator</i>
			</span>
			<span class="outil historique" :title="$t('defaire')" @click="defaire">
				<img src="~@/assets/img/defaire.png" :alt="$t('defaire')">
			</span>
			<span class="outil historique" :title="$t('refaire')" @click="refaire">
				<img src="~@/assets/img/refaire.png" :alt="$t('refaire')">
			</span>
			<span class="separateur" />
			<span class="outil" :title="$t('selectionner')" :class="{'actif': outilSelectionner}" @click="definirOutilPrincipal('selectionner')">
				<img src="~@/assets/img/curseur.png" :alt="$t('selectionner')">
			</span>
			<span class="outil" :title="$t('dessiner')" :class="{'actif': outilDessiner}" @click="definirOutilPrincipal('dessiner')">
				<img src="~@/assets/img/stylo.png" :alt="$t('dessiner')">
			</span>
			<span class="outil" :title="$t('surligneur')" :class="{'actif': outilSurligneur}" @click="definirOutilPrincipal('surligneur')">
				<img src="~@/assets/img/surligneur.png" :alt="$t('surligneur')">
			</span>
			<span class="outil" :title="$t('snap')" :class="{'actif': snapActif}" @click="snapActif = !snapActif" v-if="geodreieckGeometry">
				<i class="material-icons" style="font-size: 16px;">straighten</i>
			</span>
			<span class="outil" :title="$t('gomme')" :class="{'actif': outilGomme}" @click="definirOutilPrincipal('gomme')">
				<i class="material-icons" style="font-size: 16px;">auto_fix_off</i>
			</span>
			<span class="outil" :title="$t('deplacer')" :class="{'actif': outilDeplacer}" @click="definirOutilPrincipal('deplacer')">
				<img src="~@/assets/img/pan.png" :alt="$t('deplacer')">
			</span>
			<span class="separateur" />
			<span id="outil-rectangle" class="outil" :title="$t('rectangle')" :class="{'actif': outilSelectionner && outil === 'rectangle'}" @click="selectionnerOutil('rectangle')">
				<img src="~@/assets/img/rectangle.png" :alt="$t('rectangle')">
			</span>
			<span id="outil-rectangle-plein" class="outil" :title="$t('rectanglePlein')" :class="{'actif': outilSelectionner && outil === 'rectangle-plein'}" @click="selectionnerOutil('rectangle-plein')">
				<img src="~@/assets/img/rectangle-plein.png" :alt="$t('rectanglePlein')">
			</span>
			<span id="outil-cercle" class="outil" :title="$t('cercle')" :class="{'actif': outilSelectionner && outil === 'cercle'}" @click="selectionnerOutil('cercle')">
				<img src="~@/assets/img/cercle.png" :alt="$t('cercle')">
			</span>
			<span id="outil-cercle-plein" class="outil" :title="$t('cerclePlein')" :class="{'actif': outilSelectionner && outil === 'cercle-plein'}" @click="selectionnerOutil('cercle-plein')">
				<img src="~@/assets/img/cercle-plein.png" :alt="$t('cerclePlein')">
			</span>
			<span id="outil-etoile" class="outil" :title="$t('etoile')" :class="{'actif': outilSelectionner && outil === 'etoile'}" @click="selectionnerOutil('etoile')">
				<img src="~@/assets/img/etoile.png" :alt="$t('etoile')">
			</span>
			<span id="outil-surlignage" class="outil" :title="$t('surlignage')" :class="{'actif': outilSelectionner && outil === 'surlignage'}" @click="selectionnerOutil('surlignage')">
				<img src="~@/assets/img/surligneur.png" :alt="$t('surlignage')">
			</span>
			<span id="outil-ligne" class="outil" :title="$t('ligne')" :class="{'actif': outilSelectionner && outil === 'ligne'}" @click="selectionnerOutil('ligne')">
				<img src="~@/assets/img/ligne.png" :alt="$t('ligne')">
			</span>
			<span id="outil-fleche" class="outil" :title="$t('fleche')" :class="{'actif': outilSelectionner && outil === 'fleche'}" @click="selectionnerOutil('fleche')">
				<img src="~@/assets/img/fleche.png" :alt="$t('fleche')">
			</span>
			<span id="outil-texte" class="outil" :title="$t('texte')" :class="{'actif': outilSelectionner && outil === 'texte'}" @click="selectionnerOutil('texte')">
				<img src="~@/assets/img/texte.png" :alt="$t('texte')">
			</span>
			<span id="outil-label" class="outil" :title="$t('label')" :class="{'actif': outilSelectionner && outil === 'label'}" @click="selectionnerOutil('label')">
				<img src="~@/assets/img/label.png" :alt="$t('label')">
			</span>
			<span class="separateur" />
			<span class="outil" :title="$t('reinitialiser')" @click="afficherReinitialiser">
				<img src="~@/assets/img/reinitialiser.png" :alt="$t('reinitialiser')">
			</span>
			<span class="outil" :title="$t('exporterSVG')" @click="exporterSVG">
				<i class="material-icons" style="font-size: 16px;">file_download</i>
			</span>
			<span class="outil" :title="$t('fermer')" @click="$emit('fermer')">
				<img src="~@/assets/img/fermer.png" :alt="$t('fermer')">
			</span>
		</div>

		<div id="options" v-if="nom !== '' || (!outilSelectionner && !outilDeplacer && !outilGomme)" :style="optionsStyle" key="options">
			<span class="option icone" :title="$t('verrouiller')" @click="verrouiller" v-if="outilSelectionner && !objetVerrouille">
				<span><i class="material-icons">lock</i></span>
			</span>
			<span class="option icone orange" :title="$t('deverrouiller')" @click="deverrouiller" v-else-if="outilSelectionner && objetVerrouille">
				<span><i class="material-icons">lock_open</i></span>
			</span>
			<span class="option icone" :title="$t('mettreDevant')" @click="mettreDevant" v-if="outilSelectionner && objet !== 'selection'">
				<span><i class="material-icons">flip_to_front</i></span>
			</span>
			<span class="option icone" :title="$t('mettreDerriere')" @click="mettreDerriere" v-if="outilSelectionner && objet !== 'selection'">
				<span><i class="material-icons">flip_to_back</i></span>
			</span>
			<span class="separateur" v-if="outilSelectionner" />
			<template v-for="c in couleursVisibles">
				<span class="option" :key="c.nom"
					:class="{'actif': (outilDessiner || outilSurligneur) && couleurStylo === c.hex}"
					:title="$t(c.nom)"
					@click="modifierCouleur(c.hex)">
					<span class="couleur" :style="{ background: c.hex, border: c.hex === '#ffffff' ? '1px solid #ddd' : 'none' }" />
				</span>
			</template>
			<span class="option icone" v-if="nom !== 'selection'" @click="definirCouleur">
				<label for="couleur-annotation"><i class="material-icons">colorize</i></label>
				<input type="color" id="couleur-annotation" :value="couleurSelecteur" :title="$t('selectionnerCouleur')">
			</span>
			<span class="separateur" v-if="outilDessiner || outilSurligneur" />
			<span class="option label-epaisseur" v-if="outilDessiner || outilSurligneur">
				<span><i class="material-icons">line_weight</i></span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 2}" @click="modifierEpaisseur(2)" v-if="outilDessiner || outilSurligneur">
				<span>2</span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 5}" @click="modifierEpaisseur(5)" v-if="outilDessiner || outilSurligneur">
				<span>5</span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 10}" @click="modifierEpaisseur(10)" v-if="outilDessiner || outilSurligneur">
				<span>10</span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 20}" @click="modifierEpaisseur(20)" v-if="outilDessiner || outilSurligneur">
				<span>20</span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 40}" @click="modifierEpaisseur(40)" v-if="outilDessiner || outilSurligneur">
				<span>40</span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 80}" @click="modifierEpaisseur(80)" v-if="outilDessiner || outilSurligneur">
				<span>80</span>
			</span>
			<span class="separateur" v-if="outilSelectionner && nom !== 'selection'" />
			<span class="option label-taille" v-if="outilSelectionner && nom !== 'selection' && objet === 'texte'">
				<span><i class="material-icons">format_size</i></span>
			</span>
			<span class="option icone" :title="$t('reduireTaille')" v-if="outilSelectionner && nom !== 'selection' && objet === 'texte'" @click="reduireTailleTexte">
				<span><i class="material-icons">remove</i></span>
			</span>
			<span class="option icone" :title="$t('augmenterTaille')" v-if="outilSelectionner && nom !== 'selection' && objet === 'texte'" @click="augmenterTailleTexte">
				<span><i class="material-icons">add</i></span>
			</span>
			<span class="separateur" v-if="outilSelectionner && nom !== 'selection' && objet === 'texte'" />
			<span class="option icone" :title="$t('dupliquer')" v-if="outilSelectionner && nom !== 'selection'" @click="dupliquer">
				<span><i class="material-icons">content_copy</i></span>
			</span>
			<span class="option icone rouge" :title="$t('supprimer')" @click="supprimer" v-if="outilSelectionner && nom !== 'selection'">
				<span><i class="material-icons">delete</i></span>
			</span>
			<span class="option icone rouge" :title="$t('supprimer')" @click="supprimerSelection" v-else-if="outilSelectionner && nom === 'selection'">
				<span><i class="material-icons">delete</i></span>
			</span>
		</div>

		<div id="annotation-texte" class="conteneur-modale" v-if="modale" key="modale">
			<div class="modale">
				<div class="conteneur">
					<div class="contenu">
						<textarea :value="texte" @input="texte = $event.target.value" :placeholder="$t('monTexte')" />
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="fermerModale">{{ $t('annuler') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="ajouterTexte" v-if="outil === 'texte' || outil === 'label'">{{ $t('valider') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="enregistrerTexte" v-else>{{ $t('valider') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="confirmation" class="conteneur-modale" v-if="confirmation" key="confirmation">
			<div class="modale">
				<div class="conteneur">
					<div class="contenu">
						<p v-html="$t('reinitialiserAnnotations')" />
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="confirmation = false">{{ $t('annuler') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="reinitialiser">{{ $t('valider') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition-group>
</template>

<script>
import Konva from 'konva'
import { saveAs } from 'file-saver'

export default {
	name: 'Annotation',
	props: {
		panneaux: Array,
		annotations: Object,
		largeur: Number,
		hauteur: Number,
		nav: Boolean,
		geodreieckGeometry: {
			type: Object,
			default: null
		}
	},
	data () {
		return {
			modale: false,
			confirmation: false,
			dimensionsCanva: { w: 0, h: 0 },
			texte: '',
			id: 0,
			nom: '',
			objet: '',
			objetVerrouille: false,
			outilSelectionner: true,
			outilDeplacer: false,
			outilDessiner: false,
			outilSurligneur: false,
			outilGomme: false,
			couleurs: [
				{ nom: 'noir', hex: '#000000' },
				{ nom: 'blanc', hex: '#ffffff' },
				{ nom: 'rouge', hex: '#ff0000' },
				{ nom: 'bleu', hex: '#0000ff' },
				{ nom: 'vert', hex: '#00ff00' },
				{ nom: 'jaune', hex: '#ffff00' },
				{ nom: 'orange', hex: '#ff8800' },
				{ nom: 'violet', hex: '#9900ff' },
				{ nom: 'marron', hex: '#8B4513' },
				{ nom: 'rose', hex: '#ff69b4' }
			],
			toolbarX: null,
			toolbarY: null,
			toolbarDragging: false,
			toolbarDragStart: { x: 0, y: 0 },
			items: [],
			dessin: false,
			historique: [],
			positionHistorique: -1,
			selection: false,
			positionX1: 0,
			positionY1: 0,
			positionX2: 0,
			positionY2: 0,
			positionSelectionX: 0,
			positionSelectionY: 0,
			largeurSelection: 0,
			hauteurSelection: 0,
			positionStylo: [],
			couleurStylo: '#000000',
			couleurSelecteur: '#000000',
			epaisseurStylo: 2,
			outil: '',
			creation: false,
			positionObjetX: 0,
			positionObjetY: 0,
			largeurObjet: 0,
			hauteurObjet: 0,
			snapActif: false
		}
	},
	computed: {
		toolbarStyle () {
			if (this.toolbarX !== null) {
				return { position: 'fixed', left: this.toolbarX + 'px', top: this.toolbarY + 'px' }
			}
			return {}
		},
		couleursVisibles () {
			if (this.nom === 'selection') return []
			if (this.objet === 'label') {
				return this.couleurs.filter(c => c.hex !== '#000000' && c.hex !== '#ffffff')
			}
			return this.couleurs
		},
		optionsStyle () {
			if (this.toolbarX !== null) {
				return { position: 'fixed', left: (this.toolbarX + 40) + 'px', top: this.toolbarY + 'px' }
			}
			return {}
		}
	},
	watch: {
		panneaux: function () {
			this.reinitialiserOutils()
			this.definirOutilPrincipal('deplacer')
		},
		largeur: function () {
			this.$nextTick(function () {
				const rect = document.querySelector('#annotation').getBoundingClientRect()
				this.dimensionsCanva.w = rect.width
			}.bind(this))
		},
		hauteur: function () {
			this.$nextTick(function () {
				const rect = document.querySelector('#annotation').getBoundingClientRect()
				this.dimensionsCanva.h = rect.height
			}.bind(this))
		},
		outilSelectionner: function (valeur) {
			if (valeur === true) {
				this.activerDeplacement()
			}
			this.reinitialiserSelection()
		},
		outilDeplacer: function (valeur) {
			if (valeur === true) {
				this.desactiverDeplacement()
			}
			this.reinitialiserSelection()
		},
		outilDessiner: function (valeur) {
			if (valeur === true) {
				this.desactiverDeplacement()
				this.couleurStylo = '#000000'
				this.couleurSelecteur = '#000000'
			} else {
				this.couleurSelecteur = '#000000'
			}
			this.positionStylo = []
			this.reinitialiserSelection()
		},
		outilSurligneur: function (valeur) {
			if (valeur === true) {
				this.desactiverDeplacement()
				this.couleurStylo = '#ffff00'
				this.epaisseurStylo = 40
				this.couleurSelecteur = '#ffff00'
			} else {
				this.couleurSelecteur = '#000000'
			}
			this.positionStylo = []
			this.reinitialiserSelection()
		},
		outilGomme: function (valeur) {
			if (valeur === true) {
				this.desactiverDeplacement()
			}
			this.reinitialiserSelection()
		},
		outil: function (valeur) {
			if (valeur === '') {
				this.activerDeplacement()
			} else {
				this.desactiverDeplacement()
			}
		}
	},
	mounted () {
		if (Object.keys(this.annotations).length > 0) {
			this.id = this.annotations.id
			if (this.annotations.hasOwnProperty('rectangles')) {
				const items = this.annotations.rectangles.concat(this.annotations.cercles, this.annotations.etoiles, this.annotations.lignes, this.annotations.fleches, this.annotations.ancres, this.annotations.textes, this.annotations.dessins)
				this.items = items
			} else {
				this.items = this.annotations.items
			}
			this.activerDeplacement()
		}
		const rect = document.querySelector('#annotation').getBoundingClientRect()
		this.dimensionsCanva.w = rect.width
		this.dimensionsCanva.h = rect.height
		window.addEventListener('keydown', this.gererClavier, false)
		const savedToolbarPos = localStorage.getItem('annotation-toolbar-pos')
		if (savedToolbarPos) {
			try {
				const pos = JSON.parse(savedToolbarPos)
				this.toolbarX = pos.x
				this.toolbarY = pos.y
			} catch (e) { /* ignore */ }
		}
	},
	beforeDestroy () {
		if (document.querySelector('#couleur-annotation')) {
			document.querySelector('#couleur-annotation').removeEventListener('change', this.modifierCouleurSelecteur)
		}
		window.removeEventListener('keydown', this.gererClavier, false)
	},
	methods: {
		definirOutilPrincipal (type) {
			this.outilSelectionner = false
			this.outilDeplacer = false
			this.outilDessiner = false
			this.outilSurligneur = false
			this.outilGomme = false
			if (type === 'selectionner') {
				this.outilSelectionner = true
				this.desactiverSelecteur()
			} else if (type === 'deplacer') {
				this.outilDeplacer = true
				this.desactiverSelecteur()
			} else if (type === 'dessiner') {
				this.outilDessiner = true
				this.activerSelecteur()
			} else if (type === 'surligneur') {
				this.outilSurligneur = true
				this.activerSelecteur()
			} else if (type === 'gomme') {
				this.outilGomme = true
				this.desactiverSelecteur()
			}
		},
		selectionnerOutil (type) {
			const outils = document.querySelectorAll('#outils-annotation .outil.actif')
			let actif = ''
			outils.forEach(function (outil) {
				if (outil.id) {
					actif = outil.id
				}
			})
			this.definirOutilPrincipal('selectionner')
			this.reinitialiserOutils()
			if ('outil-' + type !== actif) {
				this.outil = type
			}
		},
		ajouter (type) {
			this.definirOutilPrincipal('selectionner')
			this.objetVerrouille = false
			this.id++
			switch (type) {
			case 'rectangle':
				this.items.push({ name: 'rect' + this.id, objet: 'rectangle', x: this.positionObjetX, y: this.positionObjetY, scaleX: 1, scaleY: 1, width: this.largeurObjet, height: this.hauteurObjet, fill: 'transparent', stroke: '#ff0000', strokeWidth: 3, strokeScaleEnabled: false, opacity: 1, draggable: true, verrouille: false })
				this.nom = 'rect' + this.id
				this.objet = 'rectangle'
				break
			case 'rectangle-plein':
				this.items.push({ name: 'rect' + this.id, objet: 'rectangle-plein', x: this.positionObjetX, y: this.positionObjetY, scaleX: 1, scaleY: 1, width: this.largeurObjet, height: this.hauteurObjet, fill: '#cccccc', opacity: 1, draggable: true, verrouille: false })
				this.nom = 'rect' + this.id
				this.objet = 'rectangle-plein'
				break
			case 'cercle':
				this.items.push({ name: 'circ' + this.id, objet: 'cercle', x: this.positionObjetX + (this.largeurObjet / 2), y: this.positionObjetY + (this.hauteurObjet / 2), scaleX: 1, scaleY: 1, width: this.largeurObjet, height: this.hauteurObjet, fill: 'transparent', stroke: '#ff0000', strokeWidth: 3, strokeScaleEnabled: false, opacity: 1, draggable: true, verrouille: false })
				this.nom = 'circ' + this.id
				this.objet = 'cercle'
				break
			case 'cercle-plein':
				this.items.push({ name: 'circ' + this.id, objet: 'cercle-plein', x: this.positionObjetX + (this.largeurObjet / 2), y: this.positionObjetY + (this.hauteurObjet / 2), scaleX: 1, scaleY: 1, width: this.largeurObjet, height: this.hauteurObjet, fill: '#cccccc', opacity: 1, draggable: true, verrouille: false })
				this.nom = 'circ' + this.id
				this.objet = 'cercle-plein'
				break
			case 'etoile':
				this.items.push({ name: 'star' + this.id, objet: 'etoile', x: this.positionX1, y: this.positionY1, scaleX: 1, scaleY: 1, width: this.$convertirRem(12), height: this.$convertirRem(12), fill: '#ffff00', stroke: 'black', strokeWidth: 3, strokeScaleEnabled: false, numPoints: 5, innerRadius: 20, outerRadius: 45, opacity: 1, draggable: true, verrouille: false })
				this.nom = 'star' + this.id
				this.objet = 'etoile'
				break
			case 'surlignage':
				this.items.push({ name: 'rect' + this.id, objet: 'surlignage', x: this.positionObjetX, y: this.positionObjetY, scaleX: 1, scaleY: 1, width: this.largeurObjet, height: this.hauteurObjet, fill: '#ffff00', opacity: 0.5, draggable: true, verrouille: false })
				this.nom = 'rect' + this.id
				this.objet = 'surlignage'
				break
			case 'ligne':
				this.items.push({ name: 'line' + this.id, objet: 'ligne', x: 0, y: 0, scaleX: 1, scaleY: 1, points: [this.positionX1, this.positionY1, this.positionX2, this.positionY2], fill: '#ff0000', stroke: '#ff0000', strokeWidth: 3, hitStrokeWidth: 50, draggable: true, verrouille: false })
				this.items.push({ name: 'ancr_line' + this.id + '_1', objet: 'ancre', x: this.positionX1, y: this.positionY1, radius: 10, width: 10, height: 10, fill: '#ffff00', stroke: '#ff0000', strokeWidth: 2, visible: true, draggable: true })
				this.items.push({ name: 'ancr_line' + this.id + '_2', objet: 'ancre', x: this.positionX2, y: this.positionY2, radius: 10, width: 10, height: 10, fill: '#ffff00', stroke: '#ff0000', strokeWidth: 2, visible: true, draggable: true })
				this.nom = 'line' + this.id
				this.objet = 'ligne'
				break
			case 'fleche':
				this.items.push({ name: 'flec' + this.id, objet: 'fleche', x: 0, y: 0, scaleX: 1, scaleY: 1, points: [this.positionX1, this.positionY1, this.positionX2, this.positionY2], pointerLength: 15, pointerWidth: 12, fill: '#ff0000', stroke: '#ff0000', strokeWidth: 3, hitStrokeWidth: 50, draggable: true, verrouille: false })
				this.items.push({ name: 'ancr_flec' + this.id + '_1', objet: 'ancre', x: this.positionX1, y: this.positionY1, radius: 10, width: 10, height: 10, fill: '#ffff00', stroke: '#ff0000', strokeWidth: 2, visible: true, draggable: true })
				this.items.push({ name: 'ancr_flec' + this.id + '_2', objet: 'ancre', x: this.positionX2, y: this.positionY2, radius: 10, width: 10, height: 10, fill: '#ffff00', stroke: '#ff0000', strokeWidth: 2, visible: true, draggable: true })
				this.nom = 'flec' + this.id
				this.objet = 'fleche'
				break
			case 'texte':
				this.items.push({ name: 'text' + this.id, objet: 'texte', text: this.texte, fontSize: 30, lineHeight: 1.25, verticalAlign: 'middle', padding: 10, x: this.positionX1, y: this.positionY1, scaleX: 1, scaleY: 1, fill: '#ff0000', opacity: 1, wrap: 'word', draggable: true, verrouille: false })
				this.nom = 'text' + this.id
				this.objet = 'texte'
				break
			case 'label':
				this.items.push({ name: 'labl' + this.id, objet: 'label', x: this.positionX1, y: this.positionY1, opacity: 1, draggable: true, verrouille: false, tag: { name: 'labl' + this.id, objet: 'label', shadowColor: '#222222', shadowBlur: 10, shadowOffset: [7, 7], shadowOpacity: 0.2, fill: '#ffff00' }, text: { name: 'labl' + this.id, objet: 'label', text: this.texte, fontSize: 25, lineHeight: 1.25, verticalAlign: 'middle', fill: '#000000', padding: 15, wrap: 'word', align: 'center' } })
				this.nom = 'labl' + this.id
				this.objet = 'label'
				break
			}
			this.enregistrer()
			this.$nextTick(function () {
				this.transformer()
			}.bind(this))
		},
		verrouiller () {
			let item
			if (this.objet !== 'selection') {
				item = this.items.find(r => r.name === this.nom)
				if (item) {
					item.draggable = false
					item.verrouille = true
				}
			} else {
				const objets = this.$refs.transformer.getNode().nodes()
				for (let i = 0; i < objets.length; i++) {
					item = this.items.find(r => r.name === objets[i].getAttrs().name)
					if (item) {
						item.draggable = false
						item.verrouille = true
					}
				}
			}
			this.objetVerrouille = true
			this.items.forEach(function (item, index) {
				if (item.objet === 'ancre') {
					this.items[index].visible = false
				}
			}.bind(this))
			if (this.objet !== 'selection') {
				this.transformer()
			} else {
				const transformer = this.$refs.transformer.getNode()
				transformer.getLayer().batchDraw()
			}
			this.enregistrer()
		},
		deverrouiller () {
			let item
			if (this.objet !== 'selection') {
				item = this.items.find(r => r.name === this.nom)
				if (item) {
					item.draggable = true
					item.verrouille = false
				}
			} else {
				const objets = this.$refs.transformer.getNode().nodes()
				for (let i = 0; i < objets.length; i++) {
					item = this.items.find(r => r.name === objets[i].getAttrs().name)
					if (item) {
						item.draggable = true
						item.verrouille = false
					}
				}
			}
			this.nom = item.name
			this.objet = item.objet
			this.objetVerrouille = false
			const type = this.nom.substring(0, 4)
			if (type === 'flec' || type === 'line') {
				const ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
				const ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
				ancre1.visible = true
				ancre2.visible = true
			}
			if (this.objet !== 'selection') {
				this.transformer()
			} else {
				const transformer = this.$refs.transformer.getNode()
				transformer.getLayer().batchDraw()
			}
			this.enregistrer()
		},
		mettreDevant () {
			this.items.forEach(function (item, index) {
				if (item.name === this.nom && index < this.items.length) {
					this.items.splice(index, 1)
					this.items.splice(index + 1, 0, item)
				}
			}.bind(this))
			this.enregistrer()
			this.$nextTick(function () {
				this.transformer()
			}.bind(this))
		},
		mettreDerriere () {
			this.items.forEach(function (item, index) {
				if (item.name === this.nom && index > 0) {
					this.items.splice(index, 1)
					this.items.splice(index - 1, 0, item)
				}
			}.bind(this))
			this.enregistrer()
			this.$nextTick(function () {
				this.transformer()
			}.bind(this))
		},
		dupliquer () {
			const id = (new Date()).getTime() + Math.random().toString(16).slice(10)
			const items = []
			let nom, objet
			JSON.parse(JSON.stringify(this.items)).forEach(function (item) {
				if (item.name.includes(this.nom)) {
					items.push(item)
				}
			}.bind(this))
			items.forEach(function (item) {
				const type = item.name.substring(0, 4)
				if (type === 'ancr') {
					item.name = item.name.substring(0, 9) + id + item.name.substring(item.name.length - 2)
					item.x = item.x + 20
					item.y = item.y + 20
				} else {
					nom = type + id
					objet = item.objet
					item.name = nom
					item.x = item.x + 20
					item.y = item.y + 20
				}
				if (type === 'labl') {
					item.tag.name = type + id
					item.text.name = type + id
				}
			})
			this.items.forEach(function (item, index) {
				if (item.objet === 'ancre') {
					this.items[index].visible = false
				}
			}.bind(this))
			this.$nextTick(function () {
				this.items.push(...items)
				this.nom = nom
				this.objet = objet
				this.enregistrer()
				this.$nextTick(function () {
					this.transformer()
				}.bind(this))
			}.bind(this))
		},
		supprimer () {
			const type = this.nom.substring(0, 4)
			const nom = this.nom
			if (type === 'ancr') {
				this.items = this.items.filter(r => !r.name.includes(nom.split('_')[1]))
			} else {
				this.items = this.items.filter(r => !r.name.includes(nom))
			}
			this.nom = ''
			this.objet = ''
			this.transformer()
			this.enregistrer()
		},
		supprimerSelection () {
			const objets = this.$refs.transformer.getNode().nodes()
			for (let i = 0; i < objets.length; i++) {
				this.nom = objets[i].getAttrs().name
				this.supprimer()
			}
		},
		gererClavier (event) {
			if (event.ctrlKey && event.key === 'd' && this.modale !== 'texte') {
				event.preventDefault()
				this.dupliquer()
			} else if ((event.key === 'Backspace' || event.key === 'Delete') && this.modale !== 'texte') {
				if (this.nom !== '' && this.objet !== 'selection') {
					this.supprimer()
				} else if (this.nom !== '' && this.objet === 'selection') {
					this.supprimerSelection()
				}
			} else if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
				let item, type, ancre1, ancre2
				if (this.objet !== 'selection') {
					item = this.items.find(r => r.name === this.nom)
					type = this.nom.substring(0, 4)
					if (item && event.key === 'ArrowDown') {
						item.y = item.y + 2
						if (type === 'flec' || type === 'line') {
							ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
							ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
							ancre1.y = ancre1.y + 2
							ancre2.y = ancre2.y + 2
						}
					} else if (item && event.key === 'ArrowUp') {
						item.y = item.y - 2
						if (type === 'flec' || type === 'line') {
							ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
							ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
							ancre1.y = ancre1.y - 2
							ancre2.y = ancre2.y - 2
						}
					} else if (item && event.key === 'ArrowLeft') {
						item.x = item.x - 2
						if (type === 'flec' || type === 'line') {
							ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
							ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
							ancre1.x = ancre1.x - 2
							ancre2.x = ancre2.x - 2
						}
					} else if (item && event.key === 'ArrowRight') {
						item.x = item.x + 2
						if (type === 'flec' || type === 'line') {
							ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
							ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
							ancre1.x = ancre1.x + 2
							ancre2.x = ancre2.x + 2
						}
					}
				} else {
					const objets = this.$refs.transformer.getNode().nodes()
					for (let i = 0; i < objets.length; i++) {
						item = this.items.find(r => r.name === objets[i].getAttrs().name)
						type = objets[i].getAttrs().name.substring(0, 4)
						if (item && event.key === 'ArrowDown') {
							item.y = item.y + 2
							if (type === 'flec' || type === 'line') {
								ancre1 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_1')
								ancre2 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_2')
								ancre1.y = ancre1.y + 2
								ancre2.y = ancre2.y + 2
							}
						} else if (item && event.key === 'ArrowUp') {
							item.y = item.y - 2
							if (type === 'flec' || type === 'line') {
								ancre1 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_1')
								ancre2 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_2')
								ancre1.y = ancre1.y - 2
								ancre2.y = ancre2.y - 2
							}
						} else if (item && event.key === 'ArrowLeft') {
							item.x = item.x - 2
							if (type === 'flec' || type === 'line') {
								ancre1 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_1')
								ancre2 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_2')
								ancre1.x = ancre1.x - 2
								ancre2.x = ancre2.x - 2
							}
						} else if (item && event.key === 'ArrowRight') {
							item.x = item.x + 2
							if (type === 'flec' || type === 'line') {
								ancre1 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_1')
								ancre2 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_2')
								ancre1.x = ancre1.x + 2
								ancre2.x = ancre2.x + 2
							}
						}
					}
				}
			}
		},
		afficherReinitialiser () {
			this.confirmation = true
		},
		reinitialiser () {
			this.definirOutilPrincipal('selectionner')
			this.id = 0
			this.nom = ''
			this.objet = ''
			this.objetVerrouille = false
			this.items = []
			this.transformer()
			this.enregistrer()
			this.confirmation = false
		},
		deplacerFin (event) {
			let item
			if (this.objet !== 'selection') {
				item = this.items.find(r => r.name === this.nom)
				if (item) {
					item.x = event.target.x()
					item.y = event.target.y()
				}
			} else {
				const objets = this.$refs.transformer.getNode().nodes()
				for (let i = 0; i < objets.length; i++) {
					item = this.items.find(r => r.name === objets[i].getAttrs().name)
					if (item) {
						item.x = objets[i].getAttrs().x
						item.y = objets[i].getAttrs().y
					}
				}
			}
			this.enregistrer()
		},
		redimensionnerTexte (event) {
			const type = this.nom.substring(0, 4)
			if (type === 'text') {
				event.target.setAttrs({
					width: Math.max(event.target.width() * event.target.scaleX(), 70),
					scaleX: 1,
					scaleY: 1
				})
			}
		},
		redimensionnerFin (event) {
			const item = this.items.find(r => r.name === this.nom)
			if (item) {
				item.x = event.target.x()
				item.y = event.target.y()
				item.width = event.target.width()
				item.height = event.target.height()
				item.scaleX = event.target.scaleX()
				item.scaleY = event.target.scaleY()
			}
			this.enregistrer()
		},
		selectionnerDebut (event) {
			const stage = event.target.getStage()
			if (this.outilSelectionner) {
				if (this.outil !== '' && this.creation === true) {
					this.selectionnerFin()
					return
				}
				this.positionX1 = stage.getPointerPosition().x
				this.positionY1 = stage.getPointerPosition().y
				this.positionX2 = stage.getPointerPosition().x
				this.positionY2 = stage.getPointerPosition().y
				this.largeurSelection = 0
				this.hauteurSelection = 0
				this.largeurObjet = 0
				this.hauteurObjet = 0
				if (this.outil === '') {
					if (event.target.getParent() && event.target.getParent().className === 'Transformer') {
						return
					}
					if (event.target !== event.target.getStage()) {
						this.selectionnerObjet(event)
						return
					}
					this.selection = true
					this.nom = ''
					this.objet = ''
					this.items.forEach(function (item, index) {
						if (item.objet === 'ancre') {
							this.items[index].visible = false
						}
					}.bind(this))
					this.transformer()
				} else {
					this.creation = true
					this.nom = ''
					this.objet = ''
					this.items.forEach(function (item, index) {
						if (item.objet === 'ancre') {
							this.items[index].visible = false
						}
					}.bind(this))
					if (this.outil === 'etoile') {
						this.dessinerForme('etoile')
						this.creation = false
						this.activerSelecteur()
					} else if (this.outil === 'texte' || this.outil === 'label') {
						this.modale = true
						this.creation = false
						setTimeout(function () {
							document.querySelector('#annotation-texte textarea').focus()
						}, 10)
					}
					this.transformer()
				}
			} else if (this.outilDessiner) {
				this.dessin = true
				this.positionStylo = stage.getPointerPosition()
				this.id++
				this.items.push({ name: 'dess' + this.id, objet: 'dessin', points: [this.positionStylo.x, this.positionStylo.y], globalCompositeOperation: 'source-over', stroke: this.couleurStylo, strokeWidth: this.epaisseurStylo, hitStrokeWidth: 25, lineJoin: 'round', draggable: false, verrouille: false })
				this.nom = 'dess' + this.id
				this.objet = 'dessin'
				this.$nextTick(function () {
					this.$refs.objets.getNode().getLayer().batchDraw()
				}.bind(this))
			} else if (this.outilSurligneur) {
				this.dessin = true
				this.positionStylo = stage.getPointerPosition()
				this.id++
				this.items.push({ name: 'surl' + this.id, objet: 'surligneur-dessin', points: [this.positionStylo.x, this.positionStylo.y], stroke: this.couleurStylo, strokeWidth: this.epaisseurStylo, opacity: 0.4, lineJoin: 'round', lineCap: 'round', globalCompositeOperation: 'source-over', hitStrokeWidth: 25, draggable: false, verrouille: false })
				this.nom = 'surl' + this.id
				this.objet = 'surligneur-dessin'
				this.$nextTick(function () {
					this.$refs.objets.getNode().getLayer().batchDraw()
				}.bind(this))
			} else if (this.outilGomme) {
				if (event.target !== event.target.getStage()) {
					const nom = event.target.name()
					if (nom) {
						this.nom = nom
						this.supprimer()
						this.enregistrer()
					}
				}
			}
		},
		selectionnerMouvement (event) {
			const stage = event.target.getStage()
			if (this.outilSelectionner) {
				if (this.outil === '') {
					if (!this.selection) {
						return
					}
					this.positionX2 = stage.getPointerPosition().x
					this.positionY2 = stage.getPointerPosition().y
					this.positionSelectionX = Math.min(this.positionX1, this.positionX2)
					this.positionSelectionY = Math.min(this.positionY1, this.positionY2)
					this.largeurSelection = Math.abs(this.positionX2 - this.positionX1)
					this.hauteurSelection = Math.abs(this.positionY2 - this.positionY1)
				} else {
					if (!this.creation) {
						return
					}
					this.positionX2 = stage.getPointerPosition().x
					this.positionY2 = stage.getPointerPosition().y
					this.positionObjetX = Math.min(this.positionX1, this.positionX2)
					this.positionObjetY = Math.min(this.positionY1, this.positionY2)
					this.largeurObjet = Math.abs(this.positionX2 - this.positionX1)
					this.hauteurObjet = Math.abs(this.positionY2 - this.positionY1)
				}
				this.transformer()
			} else if (this.outilDessiner || this.outilSurligneur) {
				if (!this.dessin) {
					return
				}
				this.positionStylo = stage.getPointerPosition()
				var drawX = this.positionStylo.x
				var drawY = this.positionStylo.y
				if (this.snapActif && this.geodreieckGeometry) {
					var edges = this.getGeodreieckEdges()
					var snapped = this.snapToEdge({ x: drawX, y: drawY }, edges, 15)
					if (snapped) {
						drawX = snapped.x
						drawY = snapped.y
					}
				}
				const item = this.items.find(r => r.name === this.nom)
				const points = item.points.concat([drawX, drawY])
				item.points = points
				this.$refs.objets.getNode().getLayer().batchDraw()
			}
		},
		selectionnerFin () {
			if (this.outilSelectionner) {
				if (this.outil === '') {
					if (!this.selection) {
						return
					}
					if (this.largeurSelection < 10 && this.hauteurSelection < 10) {
						this.selection = false
						return
					}
					this.selection = false
					const transformer = this.$refs.transformer.getNode()
					const stage = transformer.getStage()
					const objets = stage.find((item) => {
						return item.getAttrs().objet && item.getAttrs().name.substring(0, 4) !== 'ancr'
					})
					const rect = stage.findOne('.selection').getClientRect()
					const selection = objets.filter(item => Konva.Util.haveIntersection(rect, item.getClientRect()))
					if (selection.length > 1) {
						this.nom = 'selection'
						this.objet = 'selection'
						const objetsVerrouilles = selection.filter(item => item.getAttrs().verrouille === true)
						if (objetsVerrouilles.length === selection.length) {
							this.objetVerrouille = true
						} else {
							this.objetVerrouille = false
						}
						transformer.nodes(selection)
						transformer.getLayer().batchDraw()
						this.desactiverSelecteur()
					} else if (selection.length === 1) {
						const nom = selection[0].getAttrs().name
						this.selectionner(nom)
						this.transformer()
					} else {
						this.nom = ''
						this.objet = ''
						this.objetVerrouille = false
						this.desactiverSelecteur()
					}
				} else if (this.outil !== '' && this.outil !== 'etoile' && this.outil !== 'texte' && this.outil !== 'label' && this.largeurObjet > 0 && this.hauteurObjet > 0) {
					if (!this.creation) {
						return
					}
					this.dessinerForme(this.outil)
					this.activerSelecteur()
				}
			} else if (this.outilDessiner || this.outilSurligneur) {
				this.dessin = false
			}
		},
		dessinerForme (type) {
			this.ajouter(type)
			this.reinitialiserOutils()
			this.creation = false
		},
		reinitialiserOutils () {
			this.outil = ''
			this.largeurObjet = 0
			this.hauteurObjet = 0
			this.positionX1 = 0
			this.positionY1 = 0
			this.positionX2 = 0
			this.positionY2 = 0
		},
		reinitialiserSelection () {
			this.nom = ''
			this.objet = ''
			this.objetVerrouille = false
			this.items.forEach(function (item, index) {
				if (item.objet === 'ancre') {
					this.items[index].visible = false
				}
			}.bind(this))
			this.transformer()
		},
		selectionnerObjet (event) {
			if (this.outilSelectionner) {
				if (event.target === event.target.getStage()) {
					this.reinitialiserSelection()
					return
				}
				if (this.objet === 'selection' && event.target.getAttrs().objet && event.target.getAttrs().name.substring(0, 4) !== 'ancr') {
					return
				}
				if (event.target.getParent().className === 'Transformer') {
					this.reinitialiserSelection()
					return
				}
				this.selectionner(event.target.name())
				this.transformer()
			}
		},
		selectionner (nom) {
			let ancre1, ancre2
			const type = nom.substring(0, 4)
			const item = this.items.find(r => r.name === nom)
			if (item) {
				this.nom = nom
				this.objet = item.objet
				if (!item.draggable) {
					this.objetVerrouille = true
				} else {
					this.objetVerrouille = false
				}
				if (!this.outilDessiner) {
					this.definirCouleurSelecteur(this.objet, item)
				}
				this.activerSelecteur()
			} else {
				this.nom = ''
				this.objet = ''
				this.objetVerrouille = false
				this.desactiverSelecteur()
			}
			if (type === 'flec' || type === 'line') {
				this.items.forEach(function (item, index) {
					if (item.objet === 'ancre') {
						this.items[index].visible = false
					}
				}.bind(this))
				ancre1 = this.items.find(r => r.name === 'ancr_' + nom + '_1')
				ancre2 = this.items.find(r => r.name === 'ancr_' + nom + '_2')
				if (!item.verrouille) {
					ancre1.visible = true
					ancre2.visible = true
				} else {
					ancre1.visible = false
					ancre2.visible = false
				}
			} else if (type !== 'ancr') {
				this.items.forEach(function (item, index) {
					if (item.objet === 'ancre') {
						this.items[index].visible = false
					}
				}.bind(this))
			}
		},
		transformer () {
			const transformer = this.$refs.transformer.getNode()
			const stage = transformer.getStage()
			const noeud = stage.findOne('.' + this.nom)
			if (noeud && this.nom.substring(0, 4) !== 'ancr') {
				transformer.nodes([noeud])
			} else {
				transformer.nodes([])
			}
			transformer.getLayer().batchDraw()
		},
		ajouterTexte () {
			this.ajouter(this.outil)
			this.reinitialiserOutils()
			this.fermerModale()
			this.selection = false
			this.activerSelecteur()
		},
		modifierTexte (event) {
			this.texte = event.target.text()
			this.modale = true
			setTimeout(function () {
				document.querySelector('#annotation-texte textarea').focus()
			}, 10)
		},
		enregistrerTexte () {
			const type = this.nom.substring(0, 4)
			const item = this.items.find(r => r.name === this.nom)
			const texte = this.texte
			if (type === 'text') {
				item.text = texte
			} else {
				item.text.text = texte
				this.$nextTick(function () {
					this.transformer()
				}.bind(this))
			}
			this.fermerModale()
			this.enregistrer()
		},
		fermerModale () {
			this.texte = ''
			this.modale = false
		},
		reduireTailleTexte () {
			const item = this.items.find(r => r.name === this.nom)
			let taille = item.fontSize
			taille = taille - 2
			item.fontSize = taille
			this.enregistrer()
		},
		augmenterTailleTexte () {
			const item = this.items.find(r => r.name === this.nom)
			let taille = item.fontSize
			taille = taille + 2
			item.fontSize = taille
			this.enregistrer()
		},
		definirCouleurSelecteur (objet, item) {
			const couleursPreset = this.couleurs.map(c => c.hex).concat(['#04fdff', '#cccccc'])
			switch (objet) {
			case 'rectangle':
			case 'cercle':
			case 'ligne':
			case 'fleche':
			case 'dessin':
			case 'surligneur-dessin':
				if (couleursPreset.includes(item.stroke) === false) {
					this.couleurSelecteur = item.stroke
				}
				break
			case 'rectangle-plein':
			case 'cercle-plein':
			case 'etoile':
			case 'surlignage':
			case 'texte':
				if (couleursPreset.includes(item.fill) === false) {
					this.couleurSelecteur = item.fill
				}
				break
			case 'label':
				if (couleursPreset.includes(item.tag.fill) === false) {
					this.couleurSelecteur = item.tag.fill
				}
				break
			}
		},
		definirCouleur () {
			const couleur = document.querySelector('#couleur-annotation').value
			if ((this.outilDessiner || this.outilSurligneur) && this.couleurSelecteur !== '#000000') {
				this.couleurStylo = couleur
			} else if (!this.outilDessiner && !this.outilSurligneur && this.couleurSelecteur !== '#000000') {
				this.modifierCouleur(couleur)
			}
		},
		modifierCouleurSelecteur (event) {
			this.couleurSelecteur = event.target.value
			this.modifierCouleur(event.target.value)
		},
		modifierCouleur (couleur) {
			if (this.outilSelectionner) {
				let item = this.items.find(r => r.name === this.nom)
				if (this.objet === 'ancre') {
					item = this.items.find(r => r.name === this.nom.split('_')[1])
				}
				switch (this.objet) {
				case 'rectangle':
				case 'cercle':
				case 'dessin':
				case 'surligneur-dessin':
					item.stroke = couleur
					break
				case 'rectangle-plein':
				case 'cercle-plein':
				case 'etoile':
				case 'surlignage':
				case 'texte':
					item.fill = couleur
					break
				case 'ligne':
				case 'fleche':
				case 'ancre':
					item.stroke = couleur
					item.fill = couleur
					break
				case 'label':
					item.tag.fill = couleur
					break
				}
			} else if (this.outilDessiner || this.outilSurligneur) {
				this.couleurStylo = couleur
			}
			this.enregistrer()
		},
		modifierEpaisseur (epaisseur) {
			this.epaisseurStylo = epaisseur
		},
		definirAncres () {
			let ancres = []
			if (this.objetVerrouille === false) {
				const type = this.nom.substring(0, 4)
				switch (type) {
				case 'rect':
				case 'circ':
					ancres = ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']
					break
				case 'labl':
				case 'imag':
				case 'star':
					ancres = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
					break
				case 'text':
					ancres = ['middle-right', 'middle-left']
					break
				}
			}
			return ancres
		},
		definirCouleurBordure () {
			if (this.objet === 'selection' && !this.objetVerrouille) {
				return '#46B1E7'
			} else {
				return '#ddd'
			}
		},
		definirLimites (ancien, nouveau) {
			const type = this.nom.substring(0, 4)
			if (type === 'text') {
				if (nouveau.width < 70) {
					return ancien
				}
				return nouveau
			} else {
				return nouveau
			}
		},
		deplacerForme (event) {
			let item, ancre1, ancre2
			if (this.objet !== 'selection') {
				item = this.items.find(r => r.name === this.nom)
				if (item) {
					item.points = event.target.points()
					item.x = event.target.x()
					item.y = event.target.y()
					item.scaleX = event.target.scaleX()
					item.scaleY = event.target.scaleY()
					ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
					ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
					ancre1.x = event.target.points()[0] + event.target.x()
					ancre1.y = event.target.points()[1] + event.target.y()
					ancre1.scaleX = event.target.scaleX()
					ancre1.scaleY = event.target.scaleY()
					ancre2.x = event.target.points()[2] + event.target.x()
					ancre2.y = event.target.points()[3] + event.target.y()
					ancre2.scaleX = event.target.scaleX()
					ancre2.scaleY = event.target.scaleY()
				}
			} else {
				const objets = this.$refs.transformer.getNode().nodes()
				for (let i = 0; i < objets.length; i++) {
					if (objets[i].getAttrs().name.substring(0, 4) === 'flec' || objets[i].getAttrs().name.substring(0, 4) === 'line') {
						item = this.items.find(r => r.name === objets[i].getAttrs().name)
					}
					if (item) {
						item.points = objets[i].getAttrs().points
						item.x = objets[i].getAttrs().x
						item.y = objets[i].getAttrs().y
						item.scaleX = objets[i].getAttrs().scaleX
						item.scaleY = objets[i].getAttrs().scaleY
						ancre1 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_1')
						ancre2 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_2')
						ancre1.x = objets[i].getAttrs().points[0] + objets[i].getAttrs().x
						ancre1.y = objets[i].getAttrs().points[1] + objets[i].getAttrs().y
						ancre1.scaleX = objets[i].getAttrs().scaleX
						ancre1.scaleY = objets[i].getAttrs().scaleY
						ancre2.x = objets[i].getAttrs().points[2] + objets[i].getAttrs().x
						ancre2.y = objets[i].getAttrs().points[3] + objets[i].getAttrs().y
						ancre2.scaleX = objets[i].getAttrs().scaleX
						ancre2.scaleY = objets[i].getAttrs().scaleY
					}
					item = null
				}
			}
		},
		deplacerAncre (event) {
			let nom, index, item, ancre, points, ancreActive
			if (this.objet !== 'selection') {
				nom = this.nom.split('_')
				index = parseInt(nom[2])
				item = this.items.find(r => r.name === nom[1])
				if (item) {
					if (index === 1) {
						ancre = this.items.find(r => r.name === 'ancr_' + nom[1] + '_2')
						points = [
							event.target.x() - item.x,
							event.target.y() - item.y,
							ancre.x - item.x,
							ancre.y - item.y
						]
					} else {
						ancre = this.items.find(r => r.name === 'ancr_' + nom[1] + '_1')
						points = [
							ancre.x - item.x,
							ancre.y - item.y,
							event.target.x() - item.x,
							event.target.y() - item.y
						]
					}
					item.points = points
					ancreActive = this.items.find(r => r.name === 'ancr_' + nom[1] + '_' + index)
					ancreActive.x = event.target.x()
					ancreActive.y = event.target.y()
					ancreActive.scaleX = event.target.scaleX()
					ancreActive.scaleY = event.target.scaleY()
				}
			} else {
				const objets = this.$refs.transformer.getNode().nodes()
				for (let i = 0; i < objets.length; i++) {
					nom = objets[i].getAttrs().name.split('_')
					index = parseInt(nom[2])
					if (nom[1].substring(0, 4) === 'flec' || nom[1].substring(0, 4) === 'line') {
						item = this.items.find(r => r.name === nom[1])
					}
					if (item) {
						if (index === 1) {
							ancre = this.items.find(r => r.name === 'ancr_' + nom[1] + '_2')
							points = [
								objets[i].getAttrs().x - item.x,
								objets[i].getAttrs().y - item.y,
								ancre.x - item.x,
								ancre.y - item.y
							]
						} else {
							ancre = this.items.find(r => r.name === 'ancr_' + nom[1] + '_1')
							points = [
								ancre.x - item.x,
								ancre.y - item.y,
								objets[i].getAttrs().x - item.x,
								objets[i].getAttrs().y - item.y
							]
						}
						item.points = points
						ancreActive = this.items.find(r => r.name === 'ancr_' + nom[1] + '_' + index)
						ancreActive.x = objets[i].getAttrs().x
						ancreActive.y = objets[i].getAttrs().y
						ancreActive.scaleX = objets[i].getAttrs().scaleX
						ancreActive.scaleY = objets[i].getAttrs().scaleY
					}
				}
			}
		},
		enregistrer () {
			this.$parent.pages[this.$parent.page - 1].annotations = { id: this.id, items: this.items }
			const donnees = JSON.parse(JSON.stringify(this.items))
			if (!this.historique.includes(donnees)) {
				this.historique.push(donnees)
				this.positionHistorique += 1
			}
		},
		defaire () {
			if (this.positionHistorique === 0) {
				return
			}
			this.positionHistorique -= 1
			const donnees = this.historique[this.positionHistorique]
			this.items = donnees
			this.$nextTick(function () {
				this.reinitialiserSelection()
			}.bind(this))
		},
		refaire () {
			if (this.positionHistorique === this.historique.length - 1) {
				return
			}
			this.positionHistorique += 1
			const donnees = this.historique[this.positionHistorique]
			this.items = donnees
			this.$nextTick(function () {
				this.reinitialiserSelection()
			}.bind(this))
		},
		activerDeplacement () {
			this.items.forEach(function (item) {
				item.verrouille ? item.draggable = false : item.draggable = true
			})
		},
		desactiverDeplacement () {
			this.items.forEach(function (item) {
				item.draggable = false
			})
		},
		activerSelecteur () {
			this.$nextTick(function () {
				if (document.querySelector('#couleur-annotation')) {
					document.querySelector('#couleur-annotation').addEventListener('change', this.modifierCouleurSelecteur)
				}
			}.bind(this))
		},
		startToolbarDrag (event) {
			const e = event.touches ? event.touches[0] : event
			const toolbar = document.querySelector('#outils-annotation')
			const rect = toolbar.getBoundingClientRect()
			this.toolbarDragging = true
			this.toolbarDragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top }
			document.addEventListener('mousemove', this.onToolbarDrag)
			document.addEventListener('mouseup', this.stopToolbarDrag)
			document.addEventListener('touchmove', this.onToolbarDrag)
			document.addEventListener('touchend', this.stopToolbarDrag)
		},
		onToolbarDrag (event) {
			if (!this.toolbarDragging) return
			const e = event.touches ? event.touches[0] : event
			this.toolbarX = e.clientX - this.toolbarDragStart.x
			this.toolbarY = e.clientY - this.toolbarDragStart.y
		},
		stopToolbarDrag () {
			this.toolbarDragging = false
			document.removeEventListener('mousemove', this.onToolbarDrag)
			document.removeEventListener('mouseup', this.stopToolbarDrag)
			document.removeEventListener('touchmove', this.onToolbarDrag)
			document.removeEventListener('touchend', this.stopToolbarDrag)
			if (this.toolbarX !== null) {
				localStorage.setItem('annotation-toolbar-pos', JSON.stringify({ x: this.toolbarX, y: this.toolbarY }))
			}
		},
		genererPointsEtoile (numPoints, innerRadius, outerRadius) {
			const points = []
			for (let i = 0; i < numPoints * 2; i++) {
				const r = i % 2 === 0 ? outerRadius : innerRadius
				const angle = (Math.PI / numPoints) * i - Math.PI / 2
				points.push(Math.cos(angle) * r, Math.sin(angle) * r)
			}
			return points
		},
		exporterSVG () {
			const w = this.dimensionsCanva.w
			const h = this.dimensionsCanva.h
			let defs = ''
			let elements = ''
			let arrowId = 0
			this.items.forEach(function (item) {
				if (item.objet === 'ancre') return
				const sx = item.scaleX || 1
				const sy = item.scaleY || 1
				switch (item.objet) {
				case 'dessin':
				case 'surligneur-dessin': {
					const pts = []
					for (let i = 0; i < item.points.length; i += 2) {
						pts.push(item.points[i] + ',' + item.points[i + 1])
					}
					const opacity = item.opacity ? ' opacity="' + item.opacity + '"' : ''
					elements += '<polyline points="' + pts.join(' ') + '" stroke="' + (item.stroke || 'none') + '" stroke-width="' + (item.strokeWidth || 2) + '" fill="none" stroke-linejoin="round" stroke-linecap="round"' + opacity + '/>\n'
					break
				}
				case 'rectangle':
					elements += '<rect x="' + item.x + '" y="' + item.y + '" width="' + (item.width * sx) + '" height="' + (item.height * sy) + '" stroke="' + item.stroke + '" stroke-width="' + (item.strokeWidth || 3) + '" fill="none"/>\n'
					break
				case 'rectangle-plein':
				case 'surlignage':
					elements += '<rect x="' + item.x + '" y="' + item.y + '" width="' + (item.width * sx) + '" height="' + (item.height * sy) + '" fill="' + item.fill + '" opacity="' + (item.opacity || 1) + '"/>\n'
					break
				case 'cercle':
					elements += '<ellipse cx="' + item.x + '" cy="' + item.y + '" rx="' + ((item.width / 2) * sx) + '" ry="' + ((item.height / 2) * sy) + '" stroke="' + item.stroke + '" stroke-width="' + (item.strokeWidth || 3) + '" fill="none"/>\n'
					break
				case 'cercle-plein':
					elements += '<ellipse cx="' + item.x + '" cy="' + item.y + '" rx="' + ((item.width / 2) * sx) + '" ry="' + ((item.height / 2) * sy) + '" fill="' + (item.fill || '#cccccc') + '" opacity="' + (item.opacity || 1) + '"/>\n'
					break
				case 'etoile': {
					const starPts = this.genererPointsEtoile(item.numPoints || 5, item.innerRadius || 20, item.outerRadius || 45)
					const polyPts = []
					for (let i = 0; i < starPts.length; i += 2) {
						polyPts.push((starPts[i] * sx + item.x) + ',' + (starPts[i + 1] * sy + item.y))
					}
					elements += '<polygon points="' + polyPts.join(' ') + '" fill="' + (item.fill || '#ffff00') + '" stroke="' + (item.stroke || 'black') + '" stroke-width="' + (item.strokeWidth || 3) + '"/>\n'
					break
				}
				case 'ligne': {
					const pts = item.points
					elements += '<line x1="' + (pts[0] + item.x) + '" y1="' + (pts[1] + item.y) + '" x2="' + (pts[2] + item.x) + '" y2="' + (pts[3] + item.y) + '" stroke="' + item.stroke + '" stroke-width="' + (item.strokeWidth || 3) + '"/>\n'
					break
				}
				case 'fleche': {
					arrowId++
					const pts = item.points
					defs += '<marker id="arrow' + arrowId + '" markerWidth="' + (item.pointerLength || 15) + '" markerHeight="' + (item.pointerWidth || 12) + '" refX="' + (item.pointerLength || 15) + '" refY="' + ((item.pointerWidth || 12) / 2) + '" orient="auto"><polygon points="0 0, ' + (item.pointerLength || 15) + ' ' + ((item.pointerWidth || 12) / 2) + ', 0 ' + (item.pointerWidth || 12) + '" fill="' + item.stroke + '"/></marker>\n'
					elements += '<line x1="' + (pts[0] + item.x) + '" y1="' + (pts[1] + item.y) + '" x2="' + (pts[2] + item.x) + '" y2="' + (pts[3] + item.y) + '" stroke="' + item.stroke + '" stroke-width="' + (item.strokeWidth || 3) + '" marker-end="url(#arrow' + arrowId + ')"/>\n'
					break
				}
				case 'texte':
					elements += '<text x="' + item.x + '" y="' + (item.y + (item.fontSize || 30)) + '" fill="' + (item.fill || '#ff0000') + '" font-size="' + (item.fontSize || 30) + '" opacity="' + (item.opacity || 1) + '">' + this.escapeXml(item.text || '') + '</text>\n'
					break
				case 'label': {
					const tagFill = item.tag ? item.tag.fill : '#ffff00'
					const textContent = item.text ? item.text.text : ''
					const fontSize = item.text ? item.text.fontSize : 25
					const textFill = item.text ? item.text.fill : '#000000'
					const padding = item.text ? item.text.padding : 15
					const textLen = textContent.length * fontSize * 0.6
					elements += '<rect x="' + item.x + '" y="' + item.y + '" width="' + (textLen + padding * 2) + '" height="' + (fontSize * 1.5 + padding * 2) + '" fill="' + tagFill + '" rx="3"/>\n'
					elements += '<text x="' + (item.x + padding) + '" y="' + (item.y + padding + fontSize) + '" fill="' + textFill + '" font-size="' + fontSize + '">' + this.escapeXml(textContent) + '</text>\n'
					break
				}
				}
			}.bind(this))
			let svgString = '<?xml version="1.0" encoding="UTF-8"?>\n'
			svgString += '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">\n'
			if (defs) {
				svgString += '<defs>\n' + defs + '</defs>\n'
			}
			svgString += elements
			svgString += '</svg>'
			const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
			saveAs(blob, 'zeichnung_' + Date.now() + '.svg')
		},
		escapeXml (str) {
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
		},
		geodreieckLocalToScreen (lx, ly, geo) {
			const cw = geo.baseWidth * geo.scale
			const ch = geo.baseHeight * geo.scale
			const cx = cw / 2
			const cy = ch
			const rad = geo.rotation * Math.PI / 180
			const dx = lx * geo.scale - cx
			const dy = ly * geo.scale - cy
			return {
				x: geo.posX + cx + Math.cos(rad) * dx - Math.sin(rad) * dy,
				y: geo.posY + cy + Math.sin(rad) * dx + Math.cos(rad) * dy
			}
		},
		getGeodreieckEdges () {
			const geo = this.geodreieckGeometry
			if (!geo) return []
			// Local coords of the three edges (baseWidth=640, baseHeight=320)
			const edges = [
				{ a: { lx: 0, ly: 320 }, b: { lx: 640, ly: 320 } },   // bottom
				{ a: { lx: 320, ly: 0 }, b: { lx: 0, ly: 320 } },     // left
				{ a: { lx: 320, ly: 0 }, b: { lx: 640, ly: 320 } }    // right
			]
			return edges.map(function (e) {
				return {
					a: this.geodreieckLocalToScreen(e.a.lx, e.a.ly, geo),
					b: this.geodreieckLocalToScreen(e.b.lx, e.b.ly, geo)
				}
			}.bind(this))
		},
		projeterSurSegment (px, py, ax, ay, bx, by) {
			const dx = bx - ax
			const dy = by - ay
			const len2 = dx * dx + dy * dy
			if (len2 === 0) return { x: ax, y: ay, dist: Math.hypot(px - ax, py - ay) }
			var t = ((px - ax) * dx + (py - ay) * dy) / len2
			t = Math.max(0, Math.min(1, t))
			const projX = ax + t * dx
			const projY = ay + t * dy
			return { x: projX, y: projY, dist: Math.hypot(px - projX, py - projY) }
		},
		snapToEdge (point, edges, threshold) {
			var best = null
			var bestDist = threshold + 1
			for (var i = 0; i < edges.length; i++) {
				var proj = this.projeterSurSegment(point.x, point.y, edges[i].a.x, edges[i].a.y, edges[i].b.x, edges[i].b.y)
				if (proj.dist < bestDist) {
					bestDist = proj.dist
					best = { x: proj.x, y: proj.y }
				}
			}
			if (bestDist <= threshold) return best
			return null
		},
		desactiverSelecteur () {
			this.$nextTick(function () {
				if (document.querySelector('#couleur-annotation')) {
					document.querySelector('#couleur-annotation').removeEventListener('change', this.modifierCouleurSelecteur)
				}
			}.bind(this))
		}
	}
}
</script>

<style>
#annotation  {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: transparent;
	z-index: 10000;
}

#annotation.curseur {
	pointer-events: none;
	z-index: 99;
}

#annotation.gomme {
	cursor: crosshair;
}

#annotation.avec-nav {
	bottom: 7.5rem;
}

#outils-annotation {
	position: absolute;
	top: 2rem;
	left: 0;
	display: grid;
    grid-template-rows: repeat(20, auto);
    background: #fff;
    padding: 3px 5px;
    margin: 0;
    border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	z-index: 10001;
	max-height: calc(100% - 7.5rem);
	overflow-y: auto;
	overflow-x: hidden;
	user-select: none;
}

#outils-annotation .outil {
	display: flex;
    align-items: center;
    justify-content: center;
	width: 20px;
    height: 20px;
	margin: 5px 0;
	border-radius: 4px;
    cursor: pointer;
}

#outils-annotation .outil.drag-handle {
	cursor: grab;
	opacity: 0.5;
	margin-bottom: 2px;
}

#outils-annotation .outil.drag-handle:active {
	cursor: grabbing;
}

#outils-annotation .outil.actif {
    background: #46B1E7;
}

#outils-annotation .outil.historique:active {
    opacity: 0.7;
}

#options .option img,
#outils-annotation .outil img {
	width: auto;
	height: auto;
	max-width: 16px;
	max-height: 16px;
}

#outils-annotation .separateur {
    margin: 5px 5px;
    border: 1px solid #ddd;
}

#options {
	position: absolute;
	left: 40px;
	top: 0;
	display: flex;
    justify-content: flex-start;
	align-items: center;
    background: #fff;
    padding: 5px;
    margin: 0;
    border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	z-index: 10001;
	max-width: calc(100% - 100px);
	overflow-x: auto;
	overflow-y: hidden;
	user-select: none;
}

#options .option {
	display: flex;
    align-items: center;
    justify-content: center;
	width: 20px;
    height: 20px;
	margin: 0 5px;
	border-radius: 4px;
    cursor: pointer;
}

#options .option.label-taille,
#options .option.label-epaisseur {
	font-size: 24px;
	width: auto;
	cursor: default;
}

#options .option.epaisseur {
	line-height: 1;
}

#options .option.epaisseur {
	border: 1px solid #ddd;
	font-size: 12px;
}

#options .option.epaisseur.actif {
	border: 1px solid #000;
}

#options .option.icone span:active {
	opacity: 0.5;
}

#options .option .couleur {
	display: block;
	width: 20px;
	height: 20px;
	border-radius: 50%;
}

#options .option.actif {
	outline: 2px solid #46B1E7;
	outline-offset: 1px;
	border-radius: 50%;
}

#options .separateur {
    margin: 5px 5px;
    border: 1px solid #ddd;
	height: 10px;
}

#annotation-texte .modale .conteneur textarea {
    background: #fff;
    border: 1px solid #ddd;
    max-width: 100%;
    width: 100%;
    resize: none;
    padding: 1.5rem;
	text-align: left;
	line-height: 1.4;
	font-size: 1.6rem;
	height: 12rem;
}

#options .option.icone {
	width: auto;
}

#options .option.icone.orange span {
	color: #ff6600;
}

#options .option.icone.rouge span {
	color: #ff6259;
}

#options .option.icone span,
#options .option.icone label {
	font-size: 24px;
}

#options .option.icone input[type="color"] {
	width: 20px;
	height: 20px;
	border: none;
	margin-left: 5px;
	cursor: pointer;
}

#options .option.icone input[type="color"]::-moz-color-swatch {
	border: 1px solid #ddd;
	border-radius: 50%;
}

#options .option.icone input[type="color"]::-webkit-color-swatch {
	border: 1px solid #ddd;
	border-radius: 50%;
}

#options .option.icone input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}
</style>
