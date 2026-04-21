<template>
	<vue-drag-resize :id="id" contentClass="panneau" :class="{'deplacement': deplacement, 'min': statut === 'min'}" :isDraggable="true" :isResizable="true" dragHandle=".actif" dragCancel=".inactif" :w="$convertirRem(w)" :h="$convertirRem(h)" :minw="$convertirRem(minw)" :minh="$convertirRem(minh)" :parentW="largeurPage" :parentH="hauteurPage" :x="x" :y="y" :z="z" :sticks="['br']" :parentLimitation="true" @dragging="deplacer" @dragstop="redimensionner" @resizestop="redimensionner" @clicked="afficher" v-show="!chargement" key="panneau">
		<header class="actif">
			<div class="titre sans-zoom actif" :class="{'visible': statut === 'min'}" @dblclick="renommer(titre)">{{ titre }}</div>
			<div class="actions-panneau inactif">
				<span class="envoyer" role="button" tabindex="0" @click="envoyer(id)" v-if="$parent.pages.length > 1"><i class="material-icons">send</i></span>
				<span class="afficher" role="button" tabindex="0" @click="minimiser" v-if="statut === ''"><i class="material-icons">expand_less</i></span>
				<span class="afficher" role="button" tabindex="0" @click="normaliser" v-else-if="statut === 'min'"><i class="material-icons">expand_more</i></span>
				<span class="fermer" role="button" tabindex="0" @click="$emit('fermer', id)"><i class="material-icons">close</i></span>
			</div>
		</header>
		<div class="conteneur actif panneau-ampel">
			<div class="contenu inactif">
				<div class="ampel-gehaeuse">
					<div class="ampel-licht ampel-rot" :class="{'aktiv': aktiv === 'rot'}" @click="umschalten('rot')">
						<div class="ampel-glanz"></div>
					</div>
					<div class="ampel-licht ampel-gelb" :class="{'aktiv': aktiv === 'gelb'}" @click="umschalten('gelb')">
						<div class="ampel-glanz"></div>
					</div>
					<div class="ampel-licht ampel-gruen" :class="{'aktiv': aktiv === 'gruen'}" @click="umschalten('gruen')">
						<div class="ampel-glanz"></div>
					</div>
				</div>
			</div>
		</div>
	</vue-drag-resize>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import Panneau from '@/panneau'

export default {
	name: 'PAmpel',
	components: {
		VueDragResize
	},
	props: {
		panneau: Object,
		largeurPage: Number,
		hauteurPage: Number,
		finRedimensionnement: Boolean,
		zIndex: Number,
		export: Boolean
	},
	extends: Panneau,
	data () {
		return {
			chargement: true,
			mode: 'lecture',
			deplacement: false,
			titre: '',
			id: '',
			w: 0,
			h: 0,
			x: 0,
			y: 0,
			z: 0,
			minw: 14,
			minh: 30,
			statut: '',
			dimensions: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			aktiv: 'gruen'
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, contenu: { aktiv: this.aktiv }, w: this.w, h: this.h, x: this.x, y: this.y, z: this.z })
			}
		},
		finRedimensionnement: function () {
			this.positionner()
		},
		hauteurPage: function () {
			this.positionner()
		}
	},
	created () {
		this.titre = this.$t('ampel')
		this.id = this.panneau.id
		this.w = this.panneau.w
		this.h = this.panneau.h
		this.x = this.panneau.x
		this.y = this.panneau.y
		this.z = this.panneau.z
		this.statut = this.panneau.statut
		this.dimensions = this.panneau.dimensions
		if (this.panneau.titre) {
			this.titre = this.panneau.titre
		}
		if (this.panneau.mode !== '') {
			this.mode = this.panneau.mode
		}
		if (this.panneau.statut === 'min') {
			this.minimiser()
		}
		if (this.panneau.contenu !== '') {
			this.aktiv = this.panneau.contenu.aktiv || 'gruen'
		}
		this.positionner()
	},
	mounted () {
		this.chargement = false
	},
	methods: {
		umschalten (farbe) {
			this.aktiv = farbe
		}
	}
}
</script>

<style>
.panneau .panneau-ampel {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.5rem;
}

.panneau .panneau-ampel .ampel-gehaeuse {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.8rem;
	background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
	border-radius: 1.5rem;
	padding: 1.2rem 1rem;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
	width: 100%;
	max-width: 8rem;
	margin: 0 auto;
}

.panneau .panneau-ampel .ampel-licht {
	position: relative;
	width: 5rem;
	height: 5rem;
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.3s ease;
	border: 3px solid rgba(0, 0, 0, 0.3);
}

.panneau .panneau-ampel .ampel-glanz {
	position: absolute;
	top: 12%;
	left: 18%;
	width: 35%;
	height: 30%;
	border-radius: 50%;
	background: radial-gradient(ellipse, rgba(255, 255, 255, 0.5), transparent);
	pointer-events: none;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.panneau .panneau-ampel .ampel-licht.aktiv .ampel-glanz {
	opacity: 1;
}

/* Rot */
.panneau .panneau-ampel .ampel-rot {
	background: radial-gradient(circle at 40% 35%, #4a1515, #2a0a0a);
}

.panneau .panneau-ampel .ampel-rot.aktiv {
	background: radial-gradient(circle at 40% 35%, #ff4444, #cc0000);
	box-shadow: 0 0 20px rgba(255, 0, 0, 0.6), 0 0 40px rgba(255, 0, 0, 0.3);
}

/* Gelb */
.panneau .panneau-ampel .ampel-gelb {
	background: radial-gradient(circle at 40% 35%, #4a4015, #2a250a);
}

.panneau .panneau-ampel .ampel-gelb.aktiv {
	background: radial-gradient(circle at 40% 35%, #ffcc00, #e6a800);
	box-shadow: 0 0 20px rgba(255, 200, 0, 0.6), 0 0 40px rgba(255, 200, 0, 0.3);
}

/* Gruen */
.panneau .panneau-ampel .ampel-gruen {
	background: radial-gradient(circle at 40% 35%, #153a15, #0a1a0a);
}

.panneau .panneau-ampel .ampel-gruen.aktiv {
	background: radial-gradient(circle at 40% 35%, #44cc44, #00aa00);
	box-shadow: 0 0 20px rgba(0, 200, 0, 0.6), 0 0 40px rgba(0, 200, 0, 0.3);
}
</style>
