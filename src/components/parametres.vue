<template>
	<div class="conteneur-menu">
		<div class="menu" :class="{'ouvert': ouvert}">
			<header>
				<span class="titre">{{ $t('options') }}</span>
				<span class="fermer" role="button" tabindex="0" @click="$parent.fermerMenu"><i class="material-icons">close</i></span>
			</header>
			<div class="conteneur">
				<div class="contenu">					

					<label>{{ $t('arrierePlanPage') }}</label>
					<div class="fond">
						<span @click="modifierFond('./static/img/digitale.jpg')">
							<img src="@/assets/img/miniatures/digitale.jpg" alt="Digitale">
						</span>
						<span @click="modifierFond('./static/img/lavande.jpg')">
							<img src="@/assets/img/miniatures/lavande.jpg" alt="Lavande">
						</span>
						<span @click="modifierFond('./static/img/plage.jpg')">
							<img src="@/assets/img/miniatures/plage.jpg" alt="Plage">
						</span>
						<span @click="modifierFond('./static/img/lac.jpg')">
							<img src="@/assets/img/miniatures/lac.jpg" alt="Lac">
						</span>
						<span @click="modifierFond('./static/img/feuilles.jpg')">
							<img src="@/assets/img/miniatures/feuilles.jpg" alt="Feuilles">
						</span>
						<span @click="modifierFond('./static/img/arbre.jpg')">
							<img src="@/assets/img/miniatures/arbre.jpg" alt="Arbre">
						</span>
						<span @click="modifierFond('./static/img/aurore.jpg')">
							<img src="@/assets/img/miniatures/aurore.jpg" alt="Aurore">
						</span>
						<span class="couleur-fond" @click="modifierFond('#ffffff')" style="background-color: #ffffff; border: 1px solid #ddd;" />
						<span @click="modifierFond('./static/img/points.png')">
							<img src="@/assets/img/miniatures/points.png" alt="Points" style="border: 1px solid #ddd;">
						</span>
						<span @click="modifierFond('./static/img/lignes-horizontales.png')">
							<img src="@/assets/img/miniatures/lignes-horizontales.png" alt="Lignes" style="border: 1px solid #ddd;">
						</span>
						<span @click="modifierFond('./static/img/quadrillage.png')">
							<img src="@/assets/img/miniatures/quadrillage.png" alt="Quadrillage" style="border: 1px solid #ddd;">
						</span>
						<span @click="modifierFond('./static/img/quadrillage-grand.png')">
							<img src="@/assets/img/miniatures/quadrillage-grand.png" alt="Quadrillage grand" style="border: 1px solid #ddd;">
						</span>
						<span @click="modifierFond('./static/img/quadrillage-gris.png')">
							<img src="@/assets/img/miniatures/quadrillage-gris.png" alt="Quadrillage gris" style="border: 1px solid #ddd;">
						</span>
						<span @click="modifierFond('./static/img/quadrillage-gris-grand.png')">
							<img src="@/assets/img/miniatures/quadrillage-gris-grand.png" alt="Quadrillage gris grand" style="border: 1px solid #ddd;">
						</span>
						<span @click="modifierFond('./static/img/lineatur-klasse1.png')">
							<img src="@/assets/img/miniatures/lineatur-klasse1.png" alt="Lineatur 1. Klasse" style="border: 1px solid #ddd;">
						</span>
						<span @click="modifierFond('./static/img/millimeterpapier.png')">
							<img src="@/assets/img/miniatures/millimeterpapier.png" alt="Millimeterpapier" style="border: 1px solid #ddd;">
						</span>
						<span @click="modifierFond('./static/img/tafel-lineatur-klasse1.png')">
							<img src="@/assets/img/miniatures/tafel-lineatur-klasse1.png" alt="Tafel Lineatur 1. Klasse">
						</span>
						<span @click="modifierFond('./static/img/tafel-lineatur-klasse2.png')">
							<img src="@/assets/img/miniatures/tafel-lineatur-klasse2.png" alt="Tafel Lineatur 2. Klasse">
						</span>
						<span @click="modifierFond('./static/img/tafel-liniert.png')">
							<img src="@/assets/img/miniatures/tafel-liniert.png" alt="Tafel liniert">
						</span>
						<span @click="modifierFond('./static/img/tafel-karo.png')">
							<img src="@/assets/img/miniatures/tafel-karo.png" alt="Tafel kariert">
						</span>
						<span class="couleur-fond" @click="modifierFond('#46B1E7')" style="background-color: #46B1E7;" />
						<span class="couleur-fond" @click="modifierFond('#ff2d55')" style="background-color: #ff2d55;" />
						<span class="couleur-fond" @click="modifierFond('#f7d000')" style="background-color: #f7d000;" />
						<span class="couleur-fond" @click="modifierFond('#dddddd')" style="background-color: #dddddd;" />
						<span class="couleur-fond" @click="modifierFond('#777777')" style="background-color: #777777;" />
						<span class="couleur-fond icone">
							<label for="couleur-fond-page"><i class="material-icons">colorize</i></label>
							<input type="color" id="couleur-fond-page" value="#001d1d" :title="$t('selectionnerCouleur')">
						</span>
					</div>

					<div class="recherche" v-if="pixabayAPIKey !== ''">
						<div class="rechercher">
							<input type="text" :value="requete" @input="requete = $event.target.value" @keyup="verifierRequete" @keydown.enter="valider" :placeholder="$t('lienImageRecherche')">
							<span role="button" tabindex="0" :title="$t('rechercher')" class="bouton-secondaire" @click="valider"><i class="material-icons">search</i></span>
						</div>
						<div class="resultats" v-if="Object.keys(resultats).length > 0">
							<div class="item" :data-w="image.previewWidth" :data-h="image.previewHeight" v-for="(image, index) in resultats.hits" @click="modifierFond(image.largeImageURL)" :key="'image_' + index">
								<img :src="image.previewURL">
							</div>
						</div>
						<div class="navigation" v-if="Object.keys(resultats).length > 0 && (pageResultats > 1 || pageResultats < (resultats.total / 15))">
							<span :class="{'invisible': pageResultats < 2}" @click="modifierPageResultats('precedente')">{{ $t('pagePrecedente') }}</span>
							<span :class="{'invisible': pageResultats >= (resultats.total / 15)}" @click="modifierPageResultats('suivante')">{{ $t('pageSuivante') }}</span>
						</div>
					</div>

					<label>{{ $t('pages') }}</label>
					<div class="pages">
						<draggable v-model="$parent.pages" @sort="verifierPages">
							<span class="page" :class="{'selectionne': $parent.page === indexPage + 1}" @click="afficherPage(indexPage + 1)" v-for="(page, indexPage) in $parent.pages" :key="'page_' + indexPage">{{ indexPage + 1 }}</span>
						</draggable>
						<span role="button" tabindex="0" :title="$t('supprimerPage')" class="bouton-secondaire visible" v-if="$parent.pages.length > 1" @click="afficherSupprimerPage"><i class="material-icons">remove_circle_outline</i></span>
						<span role="button" tabindex="0" :title="$t('ajouterPage')" class="bouton-secondaire" :class="{'visible': $parent.pages.length < 12, 'invisible': $parent.pages.length > 11}" @click="ajouterPage"><i class="material-icons">add_circle_outline</i></span>
					</div>

					<label>{{ $t('exporter') }}</label>
					<span role="button" tabindex="0" class="bouton" @click="exporter">{{ $t('exporterEcran') }}</span>
					<span role="button" tabindex="0" class="bouton" @click="exporterPDF">{{ $t('exporterPDF') }}</span>
					<label>{{ $t('importer') }}</label>
					<label for="televerser" class="bouton">{{ $t('importerEcran') }}</label>
					<input id="televerser" type="file" style="display: none;" accept=".dgb, .dgs" @change="importer">

					<label>{{ $t('logoPersonnalise') }}</label>
					<div class="logo-upload">
						<div class="logo-apercu" v-if="$parent.logo">
							<img :src="$parent.logo" alt="Logo">
						</div>
						<div class="logo-actions">
							<label for="televerser-logo" class="bouton">{{ $t('logoTeleverser') }}</label>
							<input id="televerser-logo" type="file" style="display: none;" accept="image/*" @change="televerserLogo">
							<span role="button" tabindex="0" class="bouton bouton-supprimer" @click="supprimerLogo" v-if="$parent.logo">{{ $t('logoSupprimer') }}</span>
						</div>
					</div>

					<label>{{ $t('modules') }}</label>
					<div class="modules">
						<div class="module">
							<span>{{ $t('codeqr') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="codeqr" :checked="$parent.modules.includes('codeqr')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('texte') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="texte" :checked="$parent.modules.includes('texte')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('image') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="image" :checked="$parent.modules.includes('image')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('galerieImages') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="galerie" :checked="$parent.modules.includes('galerie')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('dessin') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="dessin" :checked="$parent.modules.includes('dessin')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('document') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="document" :checked="$parent.modules.includes('document')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('audio') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="audio" :checked="$parent.modules.includes('audio')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('syntheseVocale') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="synthese" :checked="$parent.modules.includes('synthese')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('video') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="video" :checked="$parent.modules.includes('video')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('lien') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="lien" :checked="$parent.modules.includes('lien')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('contenuIntegre') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="iframe" :checked="$parent.modules.includes('iframe')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('nuageMots') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="nuage" :checked="$parent.modules.includes('nuage')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('remiseOrdre') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="ordre" :checked="$parent.modules.includes('ordre')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<!-- new modules -->
						<div class="module">
							<span>{{ $t('poll') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="poll" :checked="$parent.modules.includes('poll')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('texteATrous') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="trous" :checked="$parent.modules.includes('trous')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('tirageSortTexte') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="tirage-texte" :checked="$parent.modules.includes('tirage-texte')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('tirageSortImage') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="tirage-image" :checked="$parent.modules.includes('tirage-image')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('plateauJeu') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="plateau" :checked="$parent.modules.includes('plateau')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('des') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="des" :checked="$parent.modules.includes('des')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('groupes') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="groupes" :checked="$parent.modules.includes('groupes')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('chronometre') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="chrono" :checked="$parent.modules.includes('chrono')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('compteRebours') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="rebours" :checked="$parent.modules.includes('rebours')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('horloge') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="horloge" :checked="$parent.modules.includes('horloge')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('calendrier') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="calendrier" :checked="$parent.modules.includes('calendrier')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('sonometre') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="sonometre" :checked="$parent.modules.includes('sonometre')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('retroaction') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="retroaction" :checked="$parent.modules.includes('retroaction')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('ampel') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="ampel" :checked="$parent.modules.includes('ampel')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('grille') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="grille" :checked="$parent.modules.includes('grille')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('taschenrechner') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="taschenrechner" :checked="$parent.modules.includes('taschenrechner')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
						<div class="module">
							<span>{{ $t('matheTauziehen') }}</span>
							<label class="interrupteur">
								<input type="checkbox" value="mathe-tauziehen" :checked="$parent.modules.includes('mathe-tauziehen')" @change="modifierModule">
								<span class="curseur" />
							</label>
						</div>
					</div>

					<label>{{ $t('langue') }}</label>
					<div class="langue">
						<span :class="{'selectionne': $parent.langue === 'fr'}" @click="modifierLangue('fr')">FR</span>
						<span :class="{'selectionne': $parent.langue === 'es'}" @click="modifierLangue('es')">ES</span>
						<span :class="{'selectionne': $parent.langue === 'it'}" @click="modifierLangue('it')">IT</span>
						<span :class="{'selectionne': $parent.langue === 'de'}" @click="modifierLangue('de')">DE</span>
						<span :class="{'selectionne': $parent.langue === 'nl'}" @click="modifierLangue('nl')">NL</span>
						<span :class="{'selectionne': $parent.langue === 'hr'}" @click="modifierLangue('hr')">HR</span>
						<span :class="{'selectionne': $parent.langue === 'en'}" @click="modifierLangue('en')">EN</span>
					</div>
					
				</div>
			</div>
		</div>

		<div id="confirmation" class="conteneur-modale" v-if="confirmation">
			<div class="modale">
				<div class="conteneur">
					<div class="contenu">
						<p v-html="$t('confirmationSuppressionPage', { page: $parent.page })" />
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="confirmation = false">{{ $t('annuler') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="supprimerPage">{{ $t('valider') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import html2canvas from 'html2canvas'

export default {
	name: 'MParametres',
	components: {
		draggable
	},
	data () {
		return {
			ouvert: false,
			image: '',
			pixabayAPIKey: '',
			requete: '',
			resultats: {},
			pageResultats: 1,
			confirmation: false
		}
	},
	watch: {
		pageResultats: function (page) {
			this.rechercher(page)
		}
	},
	created () {
		if (process.env.VUE_APP_PIXABAY_API_KEY) {
			this.pixabayAPIKey = process.env.VUE_APP_PIXABAY_API_KEY
		}
	},
	mounted () {
		setTimeout(function () {
			this.ouvert = true
		}.bind(this), 10)
		document.querySelector('#couleur-fond-page').addEventListener('change', this.modifierCouleurFond)
	},
	beforeDestroy () {
		if (document.querySelector('#couleur-fond-page')) {
			document.querySelector('#couleur-fond-page').removeEventListener('change', this.modifierCouleurFond)
		}
	},
	methods: {
		modifierLangue (langue) {
			this.$root.$i18n.locale = langue
			this.$parent.langue = langue
			document.getElementsByTagName('html')[0].setAttribute('lang', langue)
			localStorage.setItem('digiscreen_lang', langue)
		},
		modifierFond (fond) {
			const index = this.$parent.page - 1
			this.$parent.pages[index].fond = fond
		},
		modifierCouleurFond (event) {
			this.modifierFond(event.target.value)
		},
		valider () {
			if (this.requete !== '' && this.$verifierURL(this.requete) === true) {
				this.modifierFond(this.requete)
			} else if (this.requete !== '') {
				this.rechercher(1)
			}
		},
		rechercher (page) {
			if (this.requete !== '') {
				const requete = this.requete.replace(/\s+/g, '+')
				const xhr = new XMLHttpRequest()
				xhr.onload = function () {
					if (xhr.readyState === xhr.DONE && xhr.status === 200) {
						const donnees = JSON.parse(xhr.responseText)
						if (donnees && donnees.total > 0) {
							this.resultats = donnees
							this.$nextTick(function () {
								// eslint-disable-next-line
								new flexImages({ selector: '.resultats', rowHeight: this.$convertirRem(6.5) })
							})
						}
					}
				}.bind(this)
				if (page === 1) {
					this.pageResultats = page
				}
				xhr.open('GET', 'https://pixabay.com/api/?key=' + this.pixabayAPIKey + '&q=' + requete + '&image_type=photo&lang=fr&orientation=horizontal&safesearch=true&per_page=15&page=' + page, true)
				xhr.send()
			}
		},
		modifierPageResultats (type) {
			if (type === 'suivante' && this.pageResultats < (this.resultats.total / 15)) {
				this.pageResultats++
			} else if (type === 'precedente' && this.pageResultats > 1) {
				this.pageResultats--
			}
		},
		verifierRequete () {
			if (this.requete === '') {
				this.resultats = {}
				this.pageResultats = 1
			}
		},
		ajouterPage () {
			let index = this.$parent.pages.length
			if (index < 12) {
				index++
				let fond = ''
				switch (index) {
				case 2:
				case 9:
					fond = './static/img/lavande.jpg'
					break
				case 3:
				case 10:
					fond = './static/img/plage.jpg'
					break
				case 4:
				case 11:
					fond = './static/img/lac.jpg'
					break
				case 5:
				case 12:
					fond = './static/img/arbre.jpg'
					break
				case 6:
					fond = './static/img/aurore.jpg'
					break
				case 7:
					fond = './static/img/feuilles.jpg'
					break
				case 8:
					fond = './static/img/digitale.jpg'
					break
				}
				this.$parent.pages.push({ fond: fond, grille: {}, annotations: {}, annotation: false })
			}
		},
		afficherSupprimerPage () {
			if (this.$parent.pages.length > 1) {
				this.confirmation = true
			}
		},
		supprimerPage () {
			this.confirmation = false
			const index = this.$parent.page - 1
			const pages = this.$parent.pages.length
			this.$parent.pages.splice(index, 1)
			const panneaux = this.$parent.panneaux.filter(function (element) {
				return element.page !== this.$parent.page
			}.bind(this))
			panneaux.forEach(function (panneau) {
				if (panneau.page > this.$parent.page) {
					panneau.page = panneau.page - 1
				}
			}.bind(this))
			this.$parent.panneaux = panneaux
			if (index + 1 < pages) {
				this.$parent.page = index + 1
			} else {
				this.$parent.page = index
			}
			if (this.$parent.pages[this.$parent.page - 1].annotation === false) {
				this.$parent.annotation = false
			} else {
				this.$parent.annotation = true
			}
		},
		afficherPage (page) {
			this.$parent.page = page
		},
		verifierPages (event) {
			this.$parent.panneauxPage = []
			if (this.$parent.page === event.oldIndex + 1) {
				this.$parent.page = event.newIndex + 1
			}
			this.$nextTick(function () {
				const panneaux = this.$parent.panneaux
				if (event.newIndex < event.oldIndex) {
					panneaux.forEach(function (panneau, indexPanneau) {
						if (panneau.page === event.oldIndex + 1) {
							panneaux[indexPanneau].page = event.newIndex + 1
						} else if (panneau.page >= event.newIndex + 1 && panneau.page <= event.oldIndex + 1) {
							panneaux[indexPanneau].page = panneau.page + 1
						}
					})
				} else {
					panneaux.forEach(function (panneau, indexPanneau) {
						if (panneau.page === event.oldIndex + 1) {
							panneaux[indexPanneau].page = event.newIndex + 1
						} else if (panneau.page >= event.oldIndex + 1 && panneau.page <= event.newIndex + 1) {
							panneaux[indexPanneau].page = panneau.page - 1
						}
					})
				}
				this.$parent.panneaux = panneaux
				const panneauxPages = panneaux.filter(function (element) {
					return element.page === this.$parent.page
				}.bind(this))
				this.$parent.panneauxPage = panneauxPages
			}.bind(this))
		},
		importer (event) {
			this.$parent.importer(event)
			this.$parent.fermerMenu()
		},
		exporter () {
			const date = new Date()
			const annee = date.getFullYear()
			let mois = date.getMonth() + 1
			if (mois < 10) {
				mois = '0' + mois
			}
			let jour = date.getDate()
			if (jour < 10) {
				jour = '0' + jour
			}
			let heures = date.getHours()
			if (heures < 10) {
				heures = '0' + heures
			}
			let minutes = date.getMinutes()
			if (minutes < 10) {
				minutes = '0' + minutes
			}
			let secondes = date.getSeconds()
			if (secondes < 10) {
				secondes = '0' + secondes
			}
			const fichier = 'digiscreen_' + jour + '-' + mois + '-' + annee + '_' + heures + '-' + minutes + '-' + secondes
			this.$parent.exporter(fichier)
			this.$parent.fermerMenu()
		},
		televerserLogo (event) {
			const fichier = event.target.files[0]
			if (!fichier) return
			const reader = new FileReader()
			reader.onload = function (e) {
				const img = new Image()
				img.src = e.target.result
				img.onload = function () {
					let dataURL = e.target.result
					if (img.width > 400) {
						const canvas = document.createElement('canvas')
						const ratio = img.width / img.height
						canvas.width = 400
						canvas.height = 400 / ratio
						canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
						dataURL = canvas.toDataURL('image/png')
					}
					this.$parent.logo = dataURL
					localStorage.setItem('digiscreen_logo', dataURL)
				}.bind(this)
			}.bind(this)
			reader.readAsDataURL(fichier)
			event.target.value = ''
		},
		supprimerLogo () {
			this.$parent.logo = ''
			localStorage.removeItem('digiscreen_logo')
		},
		exporterPDF () {
			this.$parent.fermerMenu()
			this.$nextTick(function () {
				html2canvas(document.body, { useCORS: true }).then(function (canvas) {
					const imgData = canvas.toDataURL('image/png')
					const fenetre = window.open('', '_blank')
					fenetre.document.write('<html><head><title>Digiscreen PDF</title><style>@media print { @page { size: landscape; margin: 0; } body { margin: 0; } img { width: 100vw; height: 100vh; object-fit: contain; } }</style></head><body>')
					fenetre.document.write('<img src="' + imgData + '">')
					fenetre.document.write('</body></html>')
					fenetre.document.close()
					fenetre.onload = function () {
						fenetre.print()
					}
				})
			})
		},
		modifierModule (event) {
			this.$parent.modifierModule(event)
		}
	}
}
</script>

<style>
.menu .langue,
.menu .recherche {
	margin-bottom: 2rem;
}

.menu .pages {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 1rem;
}

.menu .pages span:not(.bouton-secondaire),
.menu .langue span {
	display: inline-flex;
	width: 4.5rem;
	height: 4.5rem;
	justify-content: center;
	align-items: center;
	line-height: 1;
	font-size: 2rem;
	border-radius: 50%;
	margin-right: 1rem;
	border: 1px solid #ddd;
	cursor: pointer;
	user-select: none;
}

.menu .pages span:not(.bouton-secondaire) {
	margin-bottom: 1rem;
}

.menu .pages span.selectionne,
.menu .langue span.selectionne {
	background: #444;
	color: #fff;
	border: 1px solid #222;
}

.menu .pages .bouton-secondaire {
	height: 4.5rem!important;
	margin-bottom: 1rem;
}

.menu .pages .bouton-secondaire:first-of-type {
	margin-right: 0.5rem;
}

.menu .pages .bouton-secondaire i {
	line-height: 4.5rem!important;
}

.menu .pages .bouton-secondaire.visible {
	visibility: visible;
}

.menu .pages .bouton-secondaire.invisible {
	visibility: hidden;
}

.menu .fond {
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	margin-bottom: 1rem;
}

.menu .fond span {
	margin-right: 1rem;
	margin-bottom: 1rem;
	cursor: pointer;
}

.menu .fond span.couleur-fond {
	width: 4.5rem;
	height: 4.5rem;
	border-radius: 50%;
}

.menu .fond span img {
	width: 4.5rem;
	height: 4.5rem;
	font-size: 0;
	line-height: 1;
	border-radius: 50%;
	user-select: none;
}

.menu .fond span.couleur-fond.icone {
	display: flex;
	align-items: center;
	width: 10rem;
	height: 4.5rem;
}

.menu .fond span label {
	font-size: 3.6rem;
	width: 4.5rem;
	text-align: center;
	margin-bottom: 0;
	font-weight: 400;
}

.menu .fond input[type="color"] {
	width: 4.5rem;
	height: 4.5rem;
	border: none;
	margin-left: 1rem;
	cursor: pointer;
}

.menu .fond input[type="color"]::-moz-color-swatch {
	border: 1px solid #ddd;
	border-radius: 50%;
}

.menu .fond input[type="color"]::-webkit-color-swatch {
	border: 1px solid #ddd;
	border-radius: 50%;
}

.menu .fond input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}

.menu .fond span:last-child,
.menu .langue span:last-child {
	margin-right: 0;
}

.menu .conteneur .bouton {
	margin-top: 0;
	margin-bottom: 2rem;
	width: auto;
	display: inline-block;
}

.menu .logo-upload {
	margin-bottom: 2rem;
}

.menu .logo-upload .logo-apercu {
	margin-bottom: 1rem;
	padding: 1rem;
	background: #f5f5f5;
	border-radius: 0.5rem;
	text-align: center;
}

.menu .logo-upload .logo-apercu img {
	max-height: 6rem;
	max-width: 100%;
}

.menu .logo-upload .logo-actions {
	display: flex;
	gap: 1rem;
}

.menu .logo-upload .bouton-supprimer {
	background: #e74c3c;
	color: #fff;
}

.menu .modules {
	width: 100%;
}

.menu .modules .module {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.menu .modules .module .interrupteur {
	position: relative;
	display: inline-block;
	width: 6rem;
	height: 3rem;
}

.menu .modules .module .interrupteur input {
	display: none;
}

.menu .modules .module .interrupteur .curseur {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ddd;
	transition: 0.3s;
}

.menu .modules .module .interrupteur .curseur::before {
	position: absolute;
	content: '';
	height: 2.2rem;
	width: 2.6rem;
	left: 0.4rem;
	bottom: 0.4rem;
	background-color: #fff;
	transition: 0.3s;
}

.menu .modules .module .interrupteur input:checked + .curseur {
	background-color: #46B1E7;
}

.menu .modules .module .interrupteur input:focus + .curseur {
	box-shadow: 0 0 1px #46B1E7;
}

.menu .modules .module .interrupteur input:checked + .curseur::before {
	transform: translateX(2.6rem);
}
</style>
