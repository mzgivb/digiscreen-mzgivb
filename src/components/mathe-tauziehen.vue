<template>
	<transition name="fondu">
		<vue-drag-resize :id="id" contentClass="panneau" :class="{'deplacement': deplacement, 'min': statut === 'min'}" :isDraggable="true" :isResizable="true" dragHandle=".actif" dragCancel=".inactif" :w="$convertirRem(w)" :h="$convertirRem(h)" :minw="$convertirRem(minw)" :minh="$convertirRem(minh)" :parentW="largeurPage" :parentH="hauteurPage" :x="x" :y="y" :z="z" :sticks="['br']" :parentLimitation="true" @dragging="deplacer" @dragstop="redimensionner" @resizestop="redimensionner" @clicked="afficher" v-show="!chargement">
			<header class="actif">
				<div class="titre sans-zoom actif" :class="{'visible': statut === 'min'}" @dblclick="renommer(titre)">{{ titre }}</div>
				<div class="actions-panneau inactif">
					<span class="envoyer" role="button" tabindex="0" @click="envoyer(id)" v-if="$parent.pages.length > 1"><i class="material-icons">send</i></span>
					<span class="afficher" role="button" tabindex="0" @click="minimiser" v-if="statut === ''"><i class="material-icons">expand_less</i></span>
					<span class="afficher" role="button" tabindex="0" @click="normaliser" v-else-if="statut === 'min'"><i class="material-icons">expand_more</i></span>
					<span class="fermer" role="button" tabindex="0" @click="$emit('fermer', id)"><i class="material-icons">close</i></span>
				</div>
			</header>
			<div class="conteneur actif panneau-mathe-tauziehen">
				<div class="contenu inactif">
					<div class="mt-edition" v-if="mode === 'edition'">
						<div class="mt-config">
							<div class="mt-config-titel">{{ $t('mtRechenarten') }}</div>
							<label class="mt-checkbox"><input type="checkbox" v-model="opAddition"> {{ $t('mtAddition') }}</label>
							<label class="mt-checkbox"><input type="checkbox" v-model="opSubtraktion"> {{ $t('mtSubtraktion') }}</label>
							<label class="mt-checkbox"><input type="checkbox" v-model="opMultiplikation"> {{ $t('mtMultiplikation') }}</label>
							<label class="mt-checkbox"><input type="checkbox" v-model="opDivision"> {{ $t('mtDivision') }}</label>

							<div class="mt-config-titel">{{ $t('mtZahlenraum') }}</div>
							<div class="mt-row">
								<label>{{ $t('mtAddSubBis') }}: <input type="number" min="5" max="1000" v-model.number="bereichAddSub"></label>
							</div>
							<div class="mt-row">
								<label>{{ $t('mtMulDivBis') }}: <input type="number" min="2" max="20" v-model.number="bereichMulDiv"></label>
							</div>

							<div v-if="opMultiplikation || opDivision">
								<div class="mt-config-titel">{{ $t('mtReihen') }}</div>
								<div class="mt-reihen">
									<button v-for="r in 10" :key="'reihe'+r" type="button" class="mt-reihe-chip" :class="{'mt-reihe-aktiv': reihen.includes(r)}" @click="reiheUmschalten(r)">{{ r }}</button>
								</div>
								<div class="mt-reihen-aktionen">
									<button type="button" class="mt-reihe-link" @click="reihenAlle">{{ $t('mtReihenAlle') }}</button>
									<button type="button" class="mt-reihe-link" @click="reihenKeine" v-if="reihen.length > 0">{{ $t('mtReihenKeine') }}</button>
								</div>
								<div class="mt-reihen-hinweis">{{ $t('mtReihenHinweis') }}</div>
							</div>

							<div class="mt-config-titel">{{ $t('mtSchritteBisSieg') }}</div>
							<div class="mt-row">
								<input type="number" min="1" max="20" v-model.number="schritteBisSieg">
							</div>

							<label class="mt-checkbox"><input type="checkbox" v-model="rueckzug"> {{ $t('mtRueckzug') }}</label>

							<div class="mt-row mt-row-actions">
								<button class="mt-btn-spielen" @click="starten" :disabled="!mindestensEineOperation">{{ $t('mtSpielen') }}</button>
							</div>
							<div class="mt-hinweis" v-if="!mindestensEineOperation">{{ $t('mtHinweisOperation') }}</div>
						</div>
					</div>

					<div class="mt-spiel" v-else>
						<div class="mt-seite mt-seite-links" :class="{'mt-sieger-seite': sieger === 'left'}">
							<div class="mt-aufgabe">{{ aufgabe.left ? aufgabe.left.frage : '' }} = ?</div>
							<div class="mt-display">{{ antwort.left }}</div>
							<div class="mt-keypad">
								<button class="mt-key" v-for="z in [1,2,3,4,5,6,7,8,9]" :key="'l'+z" @click="press('left', z)">{{ z }}</button>
								<button class="mt-key mt-key-clear" @click="loeschen('left')">C</button>
								<button class="mt-key" @click="press('left', 0)">0</button>
								<button class="mt-key mt-key-go" @click="pruefen('left')">Go</button>
							</div>
						</div>

						<div class="mt-mitte">
							<div class="mt-titel">{{ $t('matheTauziehen') }}</div>
							<div class="mt-seil-bahn">
								<div class="mt-seil-linie"></div>
								<div class="mt-seil" :style="{ transform: 'translate(calc(-50% + ' + seilProzent + '%), -50%)' }">
									<span class="mt-figur mt-figur-links">🧒</span>
									<span class="mt-strich"></span>
									<span class="mt-knoten"></span>
									<span class="mt-strich"></span>
									<span class="mt-figur mt-figur-rechts">🧒</span>
								</div>
							</div>
							<div class="mt-stand">
								<span class="mt-stand-links">{{ Math.max(0, -seilPosition) }}</span>
								<span class="mt-stand-trenner">|</span>
								<span class="mt-stand-rechts">{{ Math.max(0, seilPosition) }}</span>
							</div>
							<button class="mt-btn-neu" @click="zurueckEdit">{{ $t('mtNeuKonfigurieren') }}</button>
						</div>

						<div class="mt-seite mt-seite-rechts" :class="{'mt-sieger-seite': sieger === 'right'}">
							<div class="mt-aufgabe">{{ aufgabe.right ? aufgabe.right.frage : '' }} = ?</div>
							<div class="mt-display">{{ antwort.right }}</div>
							<div class="mt-keypad">
								<button class="mt-key" v-for="z in [1,2,3,4,5,6,7,8,9]" :key="'r'+z" @click="press('right', z)">{{ z }}</button>
								<button class="mt-key mt-key-clear" @click="loeschen('right')">C</button>
								<button class="mt-key" @click="press('right', 0)">0</button>
								<button class="mt-key mt-key-go" @click="pruefen('right')">Go</button>
							</div>
						</div>

						<div class="mt-overlay" v-if="sieger">
							<div class="mt-overlay-inhalt">
								<div class="mt-overlay-titel">🏆 {{ sieger === 'left' ? $t('mtSpielerLinks') : $t('mtSpielerRechts') }}</div>
								<div class="mt-overlay-text">{{ $t('mtSiegerText') }}</div>
								<button class="mt-btn-neu" @click="neuesSpiel">{{ $t('mtNeuesSpiel') }}</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</vue-drag-resize>
	</transition>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import Panneau from '@/panneau'

export default {
	name: 'PMatheTauziehen',
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
			mode: 'edition',
			deplacement: false,
			titre: '',
			id: '',
			w: 0,
			h: 0,
			x: 0,
			y: 0,
			z: 0,
			minw: 60,
			minh: 40,
			statut: '',
			dimensions: {},
			donnees: { x: 0, y: 0 },
			opAddition: false,
			opSubtraktion: false,
			opMultiplikation: true,
			opDivision: false,
			bereichAddSub: 20,
			bereichMulDiv: 10,
			reihen: [],
			schritteBisSieg: 5,
			rueckzug: false,
			seilPosition: 0,
			aufgabe: { left: null, right: null },
			antwort: { left: '', right: '' },
			sieger: null
		}
	},
	computed: {
		mindestensEineOperation () {
			return this.opAddition || this.opSubtraktion || this.opMultiplikation || this.opDivision
		},
		aktiveOperationen () {
			const ops = []
			if (this.opAddition) ops.push('+')
			if (this.opSubtraktion) ops.push('-')
			if (this.opMultiplikation) ops.push('*')
			if (this.opDivision) ops.push('/')
			return ops
		},
		seilProzent () {
			const max = Math.max(1, this.schritteBisSieg)
			const clamped = Math.max(-max, Math.min(max, this.seilPosition))
			return (clamped / max) * 50
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, contenu: this.serialiseContenu(), w: this.w, h: this.h, x: this.x, y: this.y, z: this.z })
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
		this.titre = this.$t('matheTauziehen')
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
		if (this.panneau.mode) {
			this.mode = this.panneau.mode
		}
		if (this.panneau.statut === 'min') {
			this.minimiser()
		}
		if (this.panneau.contenu && typeof this.panneau.contenu === 'object') {
			const c = this.panneau.contenu
			if (typeof c.opAddition === 'boolean') this.opAddition = c.opAddition
			if (typeof c.opSubtraktion === 'boolean') this.opSubtraktion = c.opSubtraktion
			if (typeof c.opMultiplikation === 'boolean') this.opMultiplikation = c.opMultiplikation
			if (typeof c.opDivision === 'boolean') this.opDivision = c.opDivision
			if (typeof c.bereichAddSub === 'number') this.bereichAddSub = c.bereichAddSub
			if (typeof c.bereichMulDiv === 'number') this.bereichMulDiv = c.bereichMulDiv
			if (Array.isArray(c.reihen)) this.reihen = c.reihen.filter(r => Number.isInteger(r) && r >= 1 && r <= 10)
			if (typeof c.schritteBisSieg === 'number') this.schritteBisSieg = c.schritteBisSieg
			if (typeof c.rueckzug === 'boolean') this.rueckzug = c.rueckzug
		}
		this.positionner()
	},
	mounted () {
		this.chargement = false
	},
	methods: {
		serialiseContenu () {
			return {
				opAddition: this.opAddition,
				opSubtraktion: this.opSubtraktion,
				opMultiplikation: this.opMultiplikation,
				opDivision: this.opDivision,
				bereichAddSub: this.bereichAddSub,
				bereichMulDiv: this.bereichMulDiv,
				reihen: this.reihen.slice(),
				schritteBisSieg: this.schritteBisSieg,
				rueckzug: this.rueckzug
			}
		},
		zufall (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min
		},
		reiheUmschalten (r) {
			const idx = this.reihen.indexOf(r)
			if (idx >= 0) {
				this.reihen.splice(idx, 1)
			} else {
				this.reihen.push(r)
				this.reihen.sort(function (x, y) { return x - y })
			}
		},
		reihenAlle () {
			this.reihen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		},
		reihenKeine () {
			this.reihen = []
		},
		genererAufgabe (seite) {
			const ops = this.aktiveOperationen
			if (ops.length === 0) {
				this.aufgabe[seite] = { frage: '', loesung: 0 }
				this.antwort[seite] = ''
				return
			}
			const op = ops[this.zufall(0, ops.length - 1)]
			let a, b, frage, loesung
			const maxAS = Math.max(2, this.bereichAddSub)
			const maxMD = Math.max(2, this.bereichMulDiv)
			switch (op) {
			case '+':
				a = this.zufall(1, maxAS)
				b = this.zufall(1, maxAS)
				loesung = a + b
				frage = a + ' + ' + b
				break
			case '-':
				a = this.zufall(1, maxAS)
				b = this.zufall(1, a)
				loesung = a - b
				frage = a + ' − ' + b
				break
			case '*':
				if (this.reihen.length > 0) {
					const reihe = this.reihen[this.zufall(0, this.reihen.length - 1)]
					const x = this.zufall(1, 10)
					if (this.zufall(0, 1) === 0) {
						a = reihe
						b = x
					} else {
						a = x
						b = reihe
					}
				} else {
					a = this.zufall(1, maxMD)
					b = this.zufall(1, maxMD)
				}
				loesung = a * b
				frage = a + ' × ' + b
				break
			case '/':
				if (this.reihen.length > 0) {
					const reiheD = this.reihen[this.zufall(0, this.reihen.length - 1)]
					const xD = this.zufall(1, 10)
					if (this.zufall(0, 1) === 0) {
						b = reiheD
						loesung = xD
					} else {
						b = xD
						loesung = reiheD
					}
					a = loesung * b
				} else {
					loesung = this.zufall(1, maxMD)
					b = this.zufall(1, maxMD)
					a = loesung * b
				}
				frage = a + ' ÷ ' + b
				break
			}
			this.$set(this.aufgabe, seite, { frage: frage, loesung: loesung })
			this.$set(this.antwort, seite, '')
		},
		press (seite, ziffer) {
			if (this.sieger) return
			const aktuell = this.antwort[seite] || ''
			if (aktuell.length >= 6) return
			this.$set(this.antwort, seite, aktuell + String(ziffer))
		},
		loeschen (seite) {
			if (this.sieger) return
			this.$set(this.antwort, seite, '')
		},
		pruefen (seite) {
			if (this.sieger) return
			const aufg = this.aufgabe[seite]
			if (!aufg) return
			const eingabe = parseInt(this.antwort[seite], 10)
			if (isNaN(eingabe)) return
			if (eingabe === aufg.loesung) {
				this.seilPosition += (seite === 'left' ? -1 : 1)
				this.pruefenSieg()
				if (!this.sieger) {
					this.genererAufgabe(seite)
				}
			} else {
				if (this.rueckzug) {
					this.seilPosition += (seite === 'left' ? 1 : -1)
					this.pruefenSieg()
				}
				this.$set(this.antwort, seite, '')
			}
		},
		pruefenSieg () {
			if (this.seilPosition <= -this.schritteBisSieg) {
				this.sieger = 'left'
				this.feiern()
			} else if (this.seilPosition >= this.schritteBisSieg) {
				this.sieger = 'right'
				this.feiern()
			}
		},
		feiern () {
			if (typeof this.$lancerConfettis === 'function') {
				this.$lancerConfettis()
			}
			const audio = document.querySelector('#audio-applaudissements')
			if (audio && typeof this.$lireAudio === 'function') {
				this.$lireAudio(audio)
			}
		},
		starten () {
			if (!this.mindestensEineOperation) return
			this.mode = 'lecture'
			this.seilPosition = 0
			this.sieger = null
			this.genererAufgabe('left')
			this.genererAufgabe('right')
		},
		neuesSpiel () {
			this.seilPosition = 0
			this.sieger = null
			this.genererAufgabe('left')
			this.genererAufgabe('right')
		},
		zurueckEdit () {
			this.mode = 'edition'
			this.sieger = null
			this.seilPosition = 0
		}
	}
}
</script>

<style>
.panneau-mathe-tauziehen {
	padding: 0 !important;
}

.panneau-mathe-tauziehen .contenu {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.mt-edition {
	padding: 1.6rem 2rem;
	overflow-y: auto;
	height: 100%;
}

.mt-config-titel {
	font-weight: 700;
	font-size: 1.5rem;
	margin: 1.4rem 0 0.6rem 0;
	color: #1a1a2e;
}

.mt-config-titel:first-child {
	margin-top: 0;
}

.mt-checkbox {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	font-size: 1.4rem;
	margin: 0.4rem 0;
	cursor: pointer;
}

.mt-checkbox input {
	width: 1.8rem;
	height: 1.8rem;
	cursor: pointer;
}

.mt-row {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin: 0.4rem 0;
	font-size: 1.4rem;
}

.mt-row input[type="number"] {
	width: 7rem;
	padding: 0.4rem 0.6rem;
	font-size: 1.4rem;
	border: 1px solid #ccc;
	border-radius: 0.4rem;
}

.mt-row-actions {
	margin-top: 1.6rem;
}

.mt-btn-spielen {
	background: #46B1E7;
	color: #fff;
	border: none;
	padding: 1rem 2.4rem;
	font-size: 1.6rem;
	font-weight: 700;
	border-radius: 0.6rem;
	cursor: pointer;
}

.mt-btn-spielen:disabled {
	background: #b8b8b8;
	cursor: not-allowed;
}

.mt-hinweis {
	color: #c0392b;
	font-size: 1.3rem;
	margin-top: 0.8rem;
}

.mt-reihen {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin: 0.4rem 0;
}

.mt-reihe-chip {
	background: #fff;
	border: 2px solid #ccc;
	color: #1a1a2e;
	font-size: 1.4rem;
	font-weight: 700;
	min-width: 4rem;
	padding: 0.5rem 0.8rem;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.1s;
}

.mt-reihe-chip:hover {
	border-color: #46B1E7;
}

.mt-reihe-aktiv {
	background: #46B1E7;
	border-color: #46B1E7;
	color: #fff;
}

.mt-reihen-aktionen {
	display: flex;
	gap: 1rem;
	margin: 0.4rem 0;
}

.mt-reihe-link {
	background: none;
	border: none;
	color: #46B1E7;
	font-size: 1.2rem;
	cursor: pointer;
	padding: 0.2rem 0;
	text-decoration: underline;
}

.mt-reihen-hinweis {
	font-size: 1.2rem;
	color: #777;
	font-style: italic;
	margin-top: 0.2rem;
}

.mt-spiel {
	display: grid;
	grid-template-columns: 1fr 1.2fr 1fr;
	gap: 1rem;
	height: 100%;
	padding: 1rem;
	position: relative;
}

.mt-seite {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
	padding: 1rem;
	border-radius: 0.8rem;
}

.mt-seite-links {
	background: rgba(70, 177, 231, 0.12);
	border: 2px solid #46B1E7;
}

.mt-seite-rechts {
	background: rgba(231, 107, 70, 0.12);
	border: 2px solid #E76B46;
}

.mt-aufgabe {
	font-size: 2.2rem;
	font-weight: 700;
	text-align: center;
	background: #fff;
	border-radius: 0.6rem;
	padding: 0.8rem;
	color: #1a1a2e;
	min-height: 4rem;
}

.mt-display {
	font-size: 2.4rem;
	font-weight: 700;
	text-align: center;
	background: #fff;
	border-radius: 0.6rem;
	padding: 0.6rem;
	min-height: 3.6rem;
	color: #1a1a2e;
}

.mt-keypad {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.5rem;
	flex: 1;
}

.mt-key {
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 0.5rem;
	font-size: 1.8rem;
	font-weight: 700;
	cursor: pointer;
	min-height: 4rem;
	transition: background 0.1s;
}

.mt-key:hover {
	background: #f4f4f4;
}

.mt-key:active {
	background: #e4e4e4;
}

.mt-key-clear {
	background: #fbe4e4;
	color: #c0392b;
}

.mt-key-go {
	background: #46B1E7;
	color: #fff;
}

.mt-seite-rechts .mt-key-go {
	background: #E76B46;
}

.mt-mitte {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.8rem;
	padding: 1rem 0.5rem;
}

.mt-titel {
	font-size: 1.8rem;
	font-weight: 700;
	color: #1a1a2e;
	text-align: center;
}

.mt-seil-bahn {
	position: relative;
	width: 100%;
	height: 8rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.mt-seil-linie {
	position: absolute;
	left: 50%;
	top: 0;
	bottom: 0;
	width: 0;
	border-left: 2px dashed #888;
}

.mt-seil {
	position: absolute;
	left: 50%;
	top: 50%;
	display: flex;
	align-items: center;
	gap: 0.4rem;
	transition: transform 0.4s ease-out;
	white-space: nowrap;
}

.mt-figur {
	font-size: 3.2rem;
}

.mt-figur-links {
	transform: scaleX(-1);
}

.mt-strich {
	display: inline-block;
	width: 4rem;
	height: 0.4rem;
	background: linear-gradient(90deg, #b97a3a, #d99a5a, #b97a3a);
	border-radius: 0.2rem;
}

.mt-knoten {
	display: inline-block;
	width: 1rem;
	height: 1rem;
	background: #c0392b;
	border-radius: 50%;
}

.mt-stand {
	display: flex;
	gap: 0.6rem;
	font-size: 1.6rem;
	font-weight: 700;
}

.mt-stand-links {
	color: #46B1E7;
}

.mt-stand-rechts {
	color: #E76B46;
}

.mt-stand-trenner {
	color: #888;
}

.mt-btn-neu {
	background: #1a1a2e;
	color: #fff;
	border: none;
	padding: 0.7rem 1.4rem;
	font-size: 1.3rem;
	font-weight: 700;
	border-radius: 0.5rem;
	cursor: pointer;
	margin-top: 0.4rem;
}

.mt-overlay {
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
	border-radius: 0.6rem;
}

.mt-overlay-inhalt {
	background: #fff;
	padding: 2.4rem 3rem;
	border-radius: 1rem;
	text-align: center;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.mt-overlay-titel {
	font-size: 2.6rem;
	font-weight: 700;
	color: #1a1a2e;
	margin-bottom: 0.8rem;
}

.mt-overlay-text {
	font-size: 1.4rem;
	color: #444;
	margin-bottom: 1.6rem;
}

.mt-sieger-seite {
	box-shadow: 0 0 0 4px gold;
}
</style>
