<template>
	<transition name="fondu">
		<vue-drag-resize :id="id" contentClass="panneau" :class="{'deplacement': deplacement, 'min': statut === 'min'}" :isDraggable="true" :isResizable="false" dragHandle=".actif" dragCancel=".inactif" :w="$convertirRem(w)" :h="$convertirRem(h)" :minw="$convertirRem(minw)" :minh="$convertirRem(minh)" :parentW="largeurPage" :parentH="hauteurPage" :x="x" :y="y" :z="z" :sticks="[]" :parentLimitation="true" @dragging="deplacer" @dragstop="redimensionner" @resizestop="redimensionner" @clicked="afficher" v-show="!chargement">
			<header class="actif">
				<div class="titre sans-zoom actif" :class="{'visible': statut === 'min'}" @dblclick="renommer(titre)">{{ titre }}</div>
				<div class="actions-panneau inactif">
					<span class="envoyer" role="button" tabindex="0" @click="envoyer(id)" v-if="$parent.pages.length > 1"><i class="material-icons">send</i></span>
					<span class="afficher" role="button" tabindex="0" @click="minimiser" v-if="statut === ''"><i class="material-icons">expand_less</i></span>
					<span class="afficher" role="button" tabindex="0" @click="normaliser" v-else-if="statut === 'min'"><i class="material-icons">expand_more</i></span>
					<span class="fermer" role="button" tabindex="0" @click="$emit('fermer', id)"><i class="material-icons">close</i></span>
				</div>
			</header>
			<div class="conteneur actif panneau-calendrier">
				<div class="contenu inactif">
					<div class="calendrier">
                        <calendar color="teal" is-expanded show-weeknumbers :locale="$root.$i18n.locale" :attributes="[{key: 'jour', highlight: 'teal', dates: new Date()}]" />
                    </div>
				</div>
			</div>
		</vue-drag-resize>
	</transition>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import Panneau from '@/panneau'
import { Calendar } from 'v-calendar'

export default {
	name: 'PCalendrier',
	components: {
		VueDragResize,
		Calendar
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
			minw: 40,
			minh: 34,
			statut: '',
			dimensions: {}
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.$emit('export', { id: this.id, titre: this.titre, statut: this.statut, dimensions: this.dimensions, contenu: '', w: this.w, h: this.h, x: this.x, y: this.y, z: this.z })
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
		this.titre = this.$t('calendrier')
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
		if (this.panneau.statut === 'min') {
			this.minimiser()
		}
		this.positionner()
	},
	mounted () {
		this.chargement = false
	}
}
</script>

<style>
.panneau .panneau-calendrier {
	overflow: hidden!important;
}

.panneau .panneau-calendrier .vc-container {
	border: none;
	color: #001d1d;
}
</style>
