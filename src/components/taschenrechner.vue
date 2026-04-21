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
			<div class="conteneur actif panneau-taschenrechner">
				<div class="contenu inactif">
					<div class="calc-display">
						<div class="calc-history">{{ history }}</div>
						<div class="calc-input">{{ display || '0' }}</div>
					</div>
					<div class="calc-buttons">
						<button class="calc-btn func" @click="pressAC">AC</button>
						<button class="calc-btn func" @click="press('(')">(</button>
						<button class="calc-btn func" @click="press(')')">)</button>
						<button class="calc-btn func" @click="pressDel">DEL</button>
						<button class="calc-btn op" @click="press('÷')">÷</button>

						<button class="calc-btn" @click="press('7')">7</button>
						<button class="calc-btn" @click="press('8')">8</button>
						<button class="calc-btn" @click="press('9')">9</button>
						<button class="calc-btn op" @click="press('×')">×</button>
						<button class="calc-btn func" @click="press('²')">x²</button>

						<button class="calc-btn" @click="press('4')">4</button>
						<button class="calc-btn" @click="press('5')">5</button>
						<button class="calc-btn" @click="press('6')">6</button>
						<button class="calc-btn op" @click="press('-')">-</button>
						<button class="calc-btn func" @click="press('√')">√</button>

						<button class="calc-btn" @click="press('1')">1</button>
						<button class="calc-btn" @click="press('2')">2</button>
						<button class="calc-btn" @click="press('3')">3</button>
						<button class="calc-btn op" @click="press('+')">+</button>
						<button class="calc-btn func" @click="press('π')">π</button>

						<button class="calc-btn span2" @click="press('0')">0</button>
						<button class="calc-btn" @click="press('.')">.</button>
						<button class="calc-btn op span2" @click="calculate">=</button>

						<button class="calc-btn sci" @click="press('sin(')">sin</button>
						<button class="calc-btn sci" @click="press('cos(')">cos</button>
						<button class="calc-btn sci" @click="press('tan(')">tan</button>
						<button class="calc-btn sci span2" disabled>&nbsp;</button>
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
	name: 'PTaschenrechner',
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
			minw: 24,
			minh: 38,
			statut: '',
			dimensions: {},
			donnees: { x: 0, y: 0 },
			display: '',
			history: '',
			lastResult: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, contenu: { display: this.display, history: this.history }, w: this.w, h: this.h, x: this.x, y: this.y, z: this.z })
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
		this.titre = this.$t('taschenrechner')
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
		if (this.panneau.contenu !== '' && this.panneau.contenu) {
			this.display = this.panneau.contenu.display || ''
			this.history = this.panneau.contenu.history || ''
		}
		this.positionner()
	},
	mounted () {
		this.chargement = false
		document.addEventListener('keydown', this.handleKeyboard)
	},
	beforeDestroy () {
		document.removeEventListener('keydown', this.handleKeyboard)
	},
	methods: {
		press (val) {
			this.display += val
		},
		pressAC () {
			this.display = ''
			this.history = ''
		},
		pressDel () {
			this.display = this.display.slice(0, -1)
		},
		calculate () {
			if (!this.display) return
			try {
				const expr = this.sanitize(this.display)
				const result = new Function('return ' + expr)()
				if (result === undefined || result === null || isNaN(result)) {
					this.history = this.display + ' ='
					this.display = 'Fehler'
				} else {
					this.history = this.display + ' ='
					this.display = String(Math.round(result * 1e10) / 1e10)
				}
			} catch (e) {
				this.history = this.display + ' ='
				this.display = 'Fehler'
			}
		},
		sanitize (expr) {
			let s = expr
			s = s.replace(/×/g, '*')
			s = s.replace(/÷/g, '/')
			s = s.replace(/π/g, 'Math.PI')
			s = s.replace(/√\(/g, 'Math.sqrt(')
			s = s.replace(/√([0-9.]+)/g, 'Math.sqrt($1)')
			s = s.replace(/sin\(/g, 'Math.sin(')
			s = s.replace(/cos\(/g, 'Math.cos(')
			s = s.replace(/tan\(/g, 'Math.tan(')
			s = s.replace(/²/g, '**2')
			// Only allow safe characters
			if (/[^0-9+\-*/().eE\s]/.test(s.replace(/Math\.(sin|cos|tan|sqrt|PI|pow)/g, ''))) {
				throw new Error('Invalid expression')
			}
			return s
		},
		handleKeyboard (event) {
			// Only handle if this panel is focused (has highest z-index among calculators)
			const el = document.getElementById(this.id)
			if (!el) return
			// Skip if user is typing in another input
			if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return

			const key = event.key
			if (key >= '0' && key <= '9') {
				this.press(key)
			} else if (key === '+') {
				this.press('+')
			} else if (key === '-') {
				this.press('-')
			} else if (key === '*') {
				this.press('×')
			} else if (key === '/') {
				event.preventDefault()
				this.press('÷')
			} else if (key === '.') {
				this.press('.')
			} else if (key === '(' || key === ')') {
				this.press(key)
			} else if (key === 'Enter') {
				event.preventDefault()
				this.calculate()
			} else if (key === 'Backspace') {
				this.pressDel()
			} else if (key === 'Escape') {
				this.pressAC()
			}
		}
	}
}
</script>

<style>
.panneau-taschenrechner {
	padding: 0 !important;
}

.panneau-taschenrechner .contenu {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.calc-display {
	background: #1a1a2e;
	color: #fff;
	padding: 1rem 1.5rem;
	text-align: right;
	border-radius: 0.5rem;
	margin: 1rem 1rem 0.5rem 1rem;
	min-height: 6rem;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.calc-history {
	font-size: 1.4rem;
	color: #888;
	min-height: 1.8rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.calc-input {
	font-size: 2.4rem;
	font-weight: bold;
	min-height: 3rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	word-break: break-all;
}

.calc-buttons {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 0.4rem;
	padding: 0.5rem 1rem 1rem 1rem;
	flex: 1;
}

.calc-btn {
	border: none;
	border-radius: 0.5rem;
	font-size: 1.6rem;
	font-weight: 600;
	cursor: pointer;
	background: #f0f0f0;
	color: #333;
	padding: 0.8rem 0;
	transition: background 0.15s;
	user-select: none;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 3.2rem;
}

.calc-btn:hover {
	background: #e0e0e0;
}

.calc-btn:active {
	background: #ccc;
}

.calc-btn.op {
	background: #46B1E7;
	color: #fff;
}

.calc-btn.op:hover {
	background: #3a9fd4;
}

.calc-btn.func {
	background: #ddd;
	color: #444;
}

.calc-btn.func:hover {
	background: #ccc;
}

.calc-btn.sci {
	background: #e8e0f0;
	color: #555;
	font-size: 1.3rem;
}

.calc-btn.sci:hover {
	background: #d8d0e0;
}

.calc-btn.span2 {
	grid-column: span 2;
}

.calc-btn:disabled {
	background: transparent;
	cursor: default;
}
</style>
