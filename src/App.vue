<template>
	<main :style="definirFond()">
		<img :src="logo" alt="Logo" class="logo-mz" :data-html2canvas-ignore="true" v-if="logo" />

		<div id="alerte" v-if="alerte">
			<div class="conteneur">
				<span class="marque">Digiscreen by La Digitale</span>
				<span class="message">{{ $t('alerte') }}</span>
			</div>
		</div>

		<div id="chargement" v-if="chargement">Digiscreen by La Digitale</div>

		<div id="import" :class="{'termine': importTermine}" v-if="importDonnees">
			<div class="chargement"><div /><div /><div /><div /><div /><div /><div /><div /><div /></div>
		</div>

		<geodreieck :visible="geodreieck" @update:geometry="geodreieckGeometry = $event" />

		<annotation :panneaux="panneaux" :annotations="annotations" :largeur="largeur" :hauteur="hauteur" :nav="nav" :geodreieck-geometry="geodreieckGeometry" @fermer="arreterAnnoter" v-if="annotation" />

		<div id="grille" :class="grille.couleur + ' grille-' + grille.colonnes" v-if="Object.keys(grille).length > 0">
			<span v-for="element in (grille.colonnes * grille.lignes)" :key="'element_' + element" />
		</div>

		<!-- Modul Icons -->
		<nav v-if="!alerte" :class="{'masque': !nav}" :data-html2canvas-ignore="true">
			<div @click="creerPanneau('codeqr')" v-if="modules.includes('codeqr')" :title="$t('codeqr')">
				<span class="icone"><i class="material-icons">qr_code</i></span>
				<span class="titre">{{ $t('codeqr') }}</span>
			</div>
			<div @click="creerPanneau('texte')" v-if="modules.includes('texte')" :title="$t('texte')">
				<span class="icone"><i class="material-icons">title</i></span>
				<span class="titre">{{ $t('texte') }}</span>
			</div>
			<div @click="creerPanneau('image')" v-if="modules.includes('image')" :title="$t('image')">
				<span class="icone"><i class="material-icons">insert_photo</i></span>
				<span class="titre">{{ $t('image') }}</span>
			</div>
			<div @click="creerPanneau('galerie')" v-if="modules.includes('galerie')" :title="$t('galerieImages')">
				<span class="icone"><i class="material-icons">collections</i></span>
				<span class="titre">{{ $t('galerie') }}</span>
			</div>
			<div @click="creerPanneau('dessin')" v-if="modules.includes('dessin')" :title="$t('dessin')">
				<span class="icone"><i class="material-icons">gesture</i></span>
				<span class="titre">{{ $t('dessin') }}</span>
			</div>
			<div @click="creerPanneau('document')" v-if="modules.includes('document')" :title="$t('document')">
				<span class="icone"><i class="material-icons">description</i></span>
				<span class="titre">{{ $t('doc') }}</span>
			</div>
			<div @click="creerPanneau('audio')" v-if="modules.includes('audio')" :title="$t('audio')">
				<span class="icone"><i class="material-icons">volume_up</i></span>
				<span class="titre">{{ $t('audio') }}</span>
			</div>
			<div @click="creerPanneau('synthese')" v-if="modules.includes('synthese')" :title="$t('syntheseVocale')">
				<span class="icone"><i class="material-icons">record_voice_over</i></span>
				<span class="titre">{{ $t('synthese') }}</span>
			</div>
			<div @click="creerPanneau('video')" v-if="modules.includes('video')" :title="$t('video')">
				<span class="icone"><i class="material-icons">movie_creation</i></span>
				<span class="titre">{{ $t('video') }}</span>
			</div>
			<div @click="creerPanneau('lien')" v-if="modules.includes('lien')" :title="$t('lien')">
				<span class="icone"><i class="material-icons">link</i></span>
				<span class="titre">{{ $t('lien') }}</span>
			</div>
			<div @click="creerPanneau('iframe')" v-if="modules.includes('iframe')" :title="$t('contenuIntegre')">
				<span class="icone"><i class="material-icons">code</i></span>
				<span class="titre">{{ $t('iframe') }}</span>
			</div>
			<div @click="creerPanneau('nuage')" v-if="modules.includes('nuage')" :title="$t('nuageMots')">
				<span class="icone"><i class="material-icons">cloud</i></span>
				<span class="titre">{{ $t('nuage') }}</span>
			</div>
			<div @click="creerPanneau('ordre')" v-if="modules.includes('ordre')" :title="$t('remiseOrdre')">
				<span class="icone"><i class="material-icons">sort_by_alpha</i></span>
				<span class="titre">{{ $t('ordre') }}</span>
			</div>
			<!-- new modules -->
			<div @click="creerPanneau('poll')" v-if="modules.includes('poll')" :title="$t('poll')">
				<span class="icone"><i class="material-icons">interests</i></span>
				<span class="titre">{{ $t('poll') }}</span>
			</div>
			<div @click="creerPanneau('trous')" v-if="modules.includes('trous')" :title="$t('texteATrous')">
				<span class="icone"><i class="material-icons">wysiwyg</i></span>
				<span class="titre">{{ $t('trous') }}</span>
			</div>
			<div @click="creerPanneau('tirage-texte')" v-if="modules.includes('tirage-texte')" :title="$t('tirageSortTexte')">
				<span class="icone"><i class="material-icons">shuffle</i></span>
				<span class="titre">{{ $t('tirageTexte') }}</span>
			</div>
			<div @click="creerPanneau('tirage-image')" v-if="modules.includes('tirage-image')" :title="$t('tirageSortImage')">
				<span class="icone"><i class="material-icons">style</i></span>
				<span class="titre">{{ $t('tirageImage') }}</span>
			</div>
			<div @click="creerPanneau('plateau')" v-if="modules.includes('plateau')" :title="$t('plateau')">
				<span class="icone"><i class="material-icons">grid_on</i></span>
				<span class="titre">{{ $t('plateau') }}</span>
			</div>
			<div @click="creerPanneau('des')" v-if="modules.includes('des')" :title="$t('des')">
				<span class="icone"><i class="material-icons">casino</i></span>
				<span class="titre">{{ $t('des') }}</span>
			</div>
			<div @click="creerPanneau('groupes')" v-if="modules.includes('groupes')" :title="$t('groupes')">
				<span class="icone"><i class="material-icons">group</i></span>
				<span class="titre">{{ $t('groupes') }}</span>
			</div>
			<div @click="creerPanneau('chrono')" v-if="modules.includes('chrono')" :title="$t('chronometre')">
				<span class="icone"><i class="material-icons">timer</i></span>
				<span class="titre">{{ $t('chrono') }}</span>
			</div>
			<div @click="creerPanneau('rebours')" v-if="modules.includes('rebours')" :title="$t('compteRebours')">
				<span class="icone"><i class="material-icons">hourglass_empty</i></span>
				<span class="titre">{{ $t('rebours') }}</span>
			</div>
			<div @click="creerPanneau('horloge')" v-if="modules.includes('horloge')" :title="$t('horloge')">
				<span class="icone"><i class="material-icons">query_builder</i></span>
				<span class="titre">{{ $t('horloge') }}</span>
			</div>
			<div @click="creerPanneau('calendrier')" v-if="modules.includes('calendrier')" :title="$t('calendrier')">
				<span class="icone"><i class="material-icons">today</i></span>
				<span class="titre">{{ $t('calendrier') }}</span>
			</div>
			<div @click="creerPanneau('sonometre')" v-if="modules.includes('sonometre')" :title="$t('sonometre')">
				<span class="icone"><i class="material-icons">hearing</i></span>
				<span class="titre">{{ $t('volume') }}</span>
			</div>
			<div @click="creerPanneau('ampel')" v-if="modules.includes('ampel')" :title="$t('ampel')">
				<span class="icone"><i class="material-icons">traffic</i></span>
				<span class="titre">{{ $t('ampel') }}</span>
			</div>
			<div @click="creerPanneau('retroaction')" v-if="modules.includes('retroaction') && !retroaction" :title="$t('retroaction')">
				<span class="icone"><i class="material-icons">thumb_up</i></span>
				<span class="titre">{{ $t('retroaction') }}</span>
			</div>
			<div @click="fermerPanneau('panneau-retroaction')" class="actif" v-else-if="modules.includes('retroaction') && retroaction" :title="$t('retroaction')">
				<span class="icone"><i class="material-icons">thumb_up</i></span>
				<span class="titre">{{ $t('retroaction') }}</span>
			</div>			
			<div @click="ouvrirModale('grille')" v-if="modules.includes('grille') && Object.keys(grille).length === 0" :title="$t('grille')">
				<span class="icone"><i class="material-icons">view_module</i></span>
				<span class="titre">{{ $t('grille') }}</span>
			</div>
			<div @click="reinitialiserGrille" class="actif" v-else-if="modules.includes('grille') && Object.keys(grille).length > 0" :title="$t('grille')">
				<span class="icone"><i class="material-icons">view_module</i></span>
				<span class="titre">{{ $t('grille') }}</span>
			</div>
			<div @click="creerPanneau('taschenrechner')" v-if="modules.includes('taschenrechner')" :title="$t('taschenrechner')">
				<span class="icone"><i class="material-icons">calculate</i></span>
				<span class="titre">{{ $t('taschenrechner') }}</span>
			</div>
			<div @click="creerPanneau('mathe-tauziehen')" v-if="modules.includes('mathe-tauziehen')" :title="$t('matheTauziehen')">
				<span class="icone"><i class="material-icons">sports_kabaddi</i></span>
				<span class="titre">{{ $t('matheTauziehen') }}</span>
			</div>
			<div @click="geodreieck = !geodreieck" :class="{'actif': geodreieck}" :title="$t('geodreieck')">
				<span class="icone"><i class="material-icons">architecture</i></span>
				<span class="titre">{{ $t('geodreieck') }}</span>
			</div>
			<div class="separateur">
				<span>|</span>
			</div>
			<div @click="capturer" :title="$t('capture')">
				<span class="icone"><i class="material-icons">camera</i></span>
				<span class="titre">{{ $t('capture') }}</span>
			</div>
			<div @click="annoter" v-if="!annotation" :title="$t('annoter')">
				<span class="icone"><i class="material-icons">rate_review</i></span>
				<span class="titre">{{ $t('annoter') }}</span>
			</div>
			<div @click="arreterAnnoter" class="actif" v-else :title="$t('annoter')">
				<span class="icone"><i class="material-icons">rate_review</i></span>
				<span class="titre">{{ $t('annoter') }}</span>
			</div>
			<div @click="entrerPleinEcran" v-if="!pleinEcran" :title="$t('ecran')">
				<span class="icone"><i class="material-icons">open_in_full</i></span>
				<span class="titre">{{ $t('ecran') }}</span>
			</div>
			<div @click="sortirPleinEcran" v-else :title="$t('ecran')">
				<span class="icone"><i class="material-icons">close_fullscreen</i></span>
				<span class="titre">{{ $t('ecran') }}</span>
			</div>
			<div @click="ouvrirMenu" :title="$t('options')">
				<span class="icone"><i class="material-icons">settings</i></span>
				<span class="titre">{{ $t('options') }}</span>
			</div>
			<div @click="ouvrirModale('info')" :title="$t('aPropos')">
				<span class="icone"><i class="material-icons">info</i></span>
				<span class="titre">{{ $t('aPropos') }}</span>
			</div>
		</nav>

		<span class="nav" v-if="nav" @click="nav = false"><i class="material-icons">expand_more</i></span>
		<span class="nav" v-else @click="nav = true"><i class="material-icons">expand_less</i></span>

		<template v-for="panneau in panneauxPage">
			<PCodeqr :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-if="panneau.type === 'codeqr'" :key="panneau.id" />
			<PTexte :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'texte'" :key="panneau.id" />
			<PImage :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'image'" :key="panneau.id" />
			<PGalerie :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'galerie'" :key="panneau.id" />
			<PDessin :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'dessin'" :key="panneau.id" />
			<PDocument :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'document'" :key="panneau.id" />
			<PAudio :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'audio'" :key="panneau.id" />
			<PSynthese :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" :listeVoix="listeVoix" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'synthese'" :key="panneau.id" />
			<PVideo :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'video'" :key="panneau.id" />
			<PLien :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'lien'" :key="panneau.id" />
			<PIframe :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'iframe'" :key="panneau.id" />
			<PNuage :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'nuage'" :key="panneau.id" />
			<POrdre :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'ordre'" :key="panneau.id" />
			<PTrous :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'trous'" :key="panneau.id" />
			<PTirageTexte :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'tirage' || panneau.type === 'tirage-texte'" :key="panneau.id" />
			<PTirageImage :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'tirage-image'" :key="panneau.id" />
			<PPlateau :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'plateau'" :key="panneau.id" />
			<PDes :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'des'" :key="panneau.id" />
			<PGroupes :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'groupes'" :key="panneau.id" />
			<PChrono :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'chrono'" :key="panneau.id" />
			<PRebours :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'rebours'" :key="panneau.id" />
			<PHorloge :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'horloge'" :key="panneau.id" />
			<PCalendrier :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'calendrier'" :key="panneau.id" />
			<PRetroaction :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'retroaction'" :key="panneau.id" />
			<PSonometre :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'sonometre'" :key="panneau.id" />
			<PPoll :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'poll'" :key="panneau.id" />
			<PAmpel :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'ampel'" :key="panneau.id" />
			<PTaschenrechner :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'taschenrechner'" :key="panneau.id" />
			<PMatheTauziehen :panneau="panneau" :largeurPage="largeur" :hauteurPage="hauteur" :finRedimensionnement="finRedimensionnement" :zIndex="zIndex" :export="exportDonnees" @zIndex="zIndex++" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'mathe-tauziehen'" :key="panneau.id" />

		</template>

		<MGrille v-if="modale === 'grille'" />
		<MInfo v-else-if="modale === 'info'" :nutzungszaehler="nutzungszaehler" />
		<MParametres v-if="menu" />

		<!-- bei mehreren Seiten wird eine Seitennavigation angzeigt. --> 
		<div id="pages" :class="{'noir': Object.keys(pages[page - 1].grille).length > 0 && (pages[page - 1].grille.couleur === 'blanc' || pages[page - 1].grille.couleur === 'gris')}" v-if="pages.length > 1">
			<div class="pageSelectBackground">
				<span :class="{'selectionne': page === index}" @click="afficherPage(index)" v-for="index in pages.length" :key="'page_' + index" />
			</div>
		</div>

		<audio id="audio-de" preload="auto" v-if="modules.includes('des')"><source src="static/audio/des.mp3" type="audio/mpeg" :style="{'display': 'none'}"></audio>
		<audio id="audio-bip" preload="auto" v-if="modules.includes('rebours')"><source src="static/audio/bip.mp3" type="audio/mpeg" :style="{'display': 'none'}"></audio>
		<audio id="audio-fin" preload="auto" v-if="modules.includes('rebours')"><source src="static/audio/fin.mp3" type="audio/mpeg" :style="{'display': 'none'}"></audio>
		<audio id="audio-applaudissements" preload="auto" v-if="modules.includes('retroaction')"><source src="static/audio/applaudissements.mp3" type="audio/mpeg" :style="{'display': 'none'}"></audio>
		<audio id="audio-vrai" preload="auto" v-if="modules.includes('retroaction')"><source src="static/audio/vrai.mp3" type="audio/mpeg" :style="{'display': 'none'}"></audio>
		<audio id="audio-faux" preload="auto" v-if="modules.includes('retroaction')"><source src="static/audio/faux.mp3" type="audio/mpeg" :style="{'display': 'none'}"></audio>
		<audio id="audio-dommage" preload="auto" v-if="modules.includes('retroaction')"><source src="static/audio/dommage.mp3" type="audio/mpeg" :style="{'display': 'none'}"></audio>
		<audio id="audio-victoire" preload="auto" v-if="modules.includes('retroaction')"><source src="static/audio/victoire.mp3" type="audio/mpeg" :style="{'display': 'none'}"></audio>
	</main>
</template>

<script>
import PCodeqr from '@/components/codeqr.vue'
import PTexte from '@/components/texte.vue'
import PImage from '@/components/image.vue'
import PGalerie from '@/components/galerie.vue'
import PDessin from '@/components/dessin.vue'
import PDocument from '@/components/document.vue'
import PAudio from '@/components/audio.vue'
import PSynthese from '@/components/synthese.vue'
import PVideo from '@/components/video.vue'
import PLien from '@/components/lien.vue'
import PIframe from '@/components/iframe.vue'
import PNuage from '@/components/nuage.vue'
import POrdre from '@/components/ordre.vue'
import PTrous from '@/components/trous.vue'
import PTirageTexte from '@/components/tirage-texte.vue'
import PTirageImage from '@/components/tirage-image.vue'
import PPlateau from '@/components/plateau.vue'
import PDes from '@/components/des.vue'
import PGroupes from '@/components/groupes.vue'
import PChrono from '@/components/chrono.vue'
import PRebours from '@/components/rebours.vue'
import PHorloge from '@/components/horloge.vue'
import PCalendrier from '@/components/calendrier.vue'
import PRetroaction from '@/components/retroaction.vue'
import PSonometre from '@/components/sonometre.vue'
//new modules
import PPoll from '@/components/poll.vue'
import PAmpel from '@/components/ampel.vue'
import PTaschenrechner from '@/components/taschenrechner.vue'
import PMatheTauziehen from '@/components/mathe-tauziehen.vue'
import Geodreieck from '@/components/geodreieck.vue'

import MGrille from '@/components/grille.vue'
import MInfo from '@/components/info.vue'
import MParametres from '@/components/parametres.vue'
import Annotation from '@/components/annotation.vue'
import html2canvas from 'html2canvas'
import fscreen from 'fscreen'
import { saveAs } from 'file-saver'
import { zaehleNutzung } from '@/utils/nutzungszaehler'

export default {
	name: 'App',
	components: {
		PCodeqr,
		PTexte,
		PImage,
		PGalerie,
		PDessin,
		PDocument,
		PAudio,
		PSynthese,
		PVideo,
		PLien,
		PIframe,
		PNuage,
		POrdre,
		//new module
		PPoll,
		PAmpel,
		PTaschenrechner,
		PMatheTauziehen,
		Geodreieck,
		PTrous,
		PTirageTexte,
		PTirageImage,
		PPlateau,
		PDes,
		PGroupes,
		PChrono,
		PRebours,
		PHorloge,
		PCalendrier,
		PRetroaction,
		PSonometre,
		MGrille,
		MInfo,
		MParametres,
		Annotation
	},
	data () {
		return {
			chargement: true,
			alerte: false,
			largeur: 0,
			hauteur: 0,
			pages: [{ fond: './static/img/quadrillage.png', grille: {}, annotations: {}, annotation: false }],
			page: 1,
			modules: ['codeqr', 'texte', 'image', 'galerie', 'dessin', 'document', 'audio', 'video', 'lien', 'iframe', 'ordre', 'poll', 'trous', 'tirage-texte', 'tirage-image', 'plateau', 'des', 'groupes', 'chrono', 'rebours', 'horloge', 'calendrier', 'sonometre', 'retroaction', 'ampel', 'grille', 'taschenrechner', 'mathe-tauziehen'],
			geodreieck: false,
			geodreieckGeometry: null,
			panneaux: [],
			panneauxPage: [],
			langue: 'de',
			pleinEcran: false,
			listeVoix: [],
			zIndex: 100,
			modale: '',
			menu: false,
			nav: true,
			exportDonnees: false,
			importDonnees: false,
			importTermine: false,
			retroaction: false,
			annotation: false,
			logo: 'static/img/MZ_GIVB_Logo.svg',
			horloge: '',
			finRedimensionnement: false,
			defilement: false,
			depart: 0,
			distance: 0,
			nutzungszaehler: {
				gesamt: 0,
				ersteNutzung: '',
				letzteNutzung: ''
			}
		}
	},
	computed: {
		fond () {
			return this.pages[this.page - 1].fond
		},
		grille () {
			return this.pages[this.page - 1].grille
		},
		annotations () {
			return this.pages[this.page - 1].annotations
		}
	},
	watch: {
		//Page
		page: function (page) {			
			this.annotation = false
			this.exportDonnees = true
			this.$nextTick(function () {
				const panneaux = this.panneaux.filter(function (element) {
					return element.page === page
				})
				this.panneauxPage = panneaux
				this.exportDonnees = false
				if (this.pages[page - 1].hasOwnProperty('annotation')) {
					this.annotation = this.pages[page - 1].annotation
				} else {
					this.annotation = false
				}
			}.bind(this))
		},
		//Karten
		panneaux: function () {
			const panneaux = this.panneaux.filter(function (element) {
				return element.page === this.page
			}.bind(this))
			this.panneauxPage = panneaux
		},
		//Nav
		nav: function (nav) {
			if (nav) {
				this.hauteur = document.body.clientHeight - this.$convertirRem(7.5)
			} else {
				this.hauteur = document.body.clientHeight
			}
		}
	},
	mounted () {
		this.verifierDimensions()
		this.activerDefilementHorizontal()

		document.querySelector('#chargement').addEventListener('animationend', function () {
			this.chargement = false
		}.bind(this), false)

		//locals
		const langues = ['fr', 'en', 'it', 'es', 'nl', 'de', 'hr']
		const params = new URLSearchParams(document.location.search)
		let langue = params.get('lang')
		if (langues.includes(langue) === true) {
			this.langue = langue
			localStorage.setItem('digiscreen_lang', langue)
		}
		const langueNavigateur = navigator.language.substring(0, 2)
		if (langues.includes(langue) === false && langues.includes(langueNavigateur) === true) {
			this.langue = langueNavigateur
		}
		if (localStorage.getItem('digiscreen_lang')) {
			this.langue = localStorage.getItem('digiscreen_lang')
		}
		this.$root.$i18n.locale = this.langue
		document.getElementsByTagName('html')[0].setAttribute('lang', this.langue)
		this.nutzungszaehler = zaehleNutzung()

		//load modules from localStorage
		if(localStorage.getItem('modules')){
			this.modules = JSON.parse(localStorage.getItem('modules'));
		}

		//load custom logo from localStorage
		if (localStorage.getItem('digiscreen_logo')) {
			this.logo = localStorage.getItem('digiscreen_logo')
		}

		this.recupererVoix()
		if (window.speechSynthesis.onvoiceschanged !== undefined) {
			window.speechSynthesis.onvoiceschanged = this.recupererVoix
		}

		document.addEventListener('keydown', function (event) {
			if (event.ctrlKey && event.key === 'k') {
				event.preventDefault()
				this.capturer()
			} else if (event.ctrlKey && event.key === 'm' && !this.menu) {
				event.preventDefault()
				this.ouvrirMenu()
			} else if (event.ctrlKey && event.key === 'm' && this.menu) {
				event.preventDefault()
				this.fermerMenu()
			} else if (event.ctrlKey && event.key === 'i') {
				event.preventDefault()
				if (this.modale === 'info') {
					this.fermerModale()
				} else {
					this.ouvrirModale('info')
				}
			} else if (event.ctrlKey && event.key === 'e' && !this.pleinEcran) {
				this.entrerPleinEcran()
			} else if (event.ctrlKey && event.key === 'e' && this.pleinEcran) {
				this.sortirPleinEcran()
			} else if (event.ctrlKey && (event.key === '*' || event.key === 'l')) {
				event.preventDefault()
				this.nav = !this.nav
			} else if (event.ctrlKey && event.key === 'ArrowLeft') {
				event.preventDefault()
				if (this.page === 1) {
					this.page = this.pages.length
				} else {
					this.page--
				}
			} else if (event.ctrlKey && event.key === 'ArrowRight') {
				event.preventDefault()
				if (this.page === this.pages.length) {
					this.page = 1
				} else {
					this.page++
				}
			}
		}.bind(this), false)

		document.querySelector('main').addEventListener('dragover', function (event) {
			event.preventDefault()
			event.stopPropagation()
		}, false)

		document.querySelector('main').addEventListener('dragcenter', function (event) {
			event.preventDefault()
			event.stopPropagation()
		}, false)

		document.querySelector('main').addEventListener('drop', function (event) {
			event.preventDefault()
			event.stopPropagation()

			if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
				for (let i = 0; i < event.dataTransfer.files.length; i++) {
					if (event.dataTransfer.files[i].type.substring(0, 5) === 'image' || event.dataTransfer.files[i].type.substring(0, 5) === 'audio' || event.dataTransfer.files[i].type.substring(0, 5) === 'video') {
						const id = 'panneau_' + (new Date()).getTime() + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
						const largeur = document.body.clientWidth / 2
						const hauteur = (document.body.clientHeight - this.$convertirRem(7.5)) / 2
						this.zIndex++
						const z = this.zIndex
						const type = event.dataTransfer.files[i].type.substring(0, 5)
						let fichier, reader
						if (type === 'image') {
							reader = new FileReader()
							reader.readAsDataURL(event.dataTransfer.files[i])
							reader.onloadend = function (e) {
								const img = new Image()
								img.src = e.target.result
								img.onload = function () {
									if (img.width > 1200) {
										const canvas = document.createElement('canvas')
										const ratio = img.width / img.height
										const largeur = 1200
										const hauteur = 1200 / ratio
										canvas.width = largeur
										canvas.height = hauteur
										canvas.getContext('2d').drawImage(img, 0, 0, largeur, hauteur)
										fichier = canvas.toDataURL('image/jpeg', 0.85)
									} else {
										fichier = e.target.result
									}
									this.panneaux.push({ page: this.page, id: id, type: type, mode: 'lecture', statut: '', dimensions: {}, contenu: { image: fichier, requete: '', page: 1, zoom: 1 }, w: 40, h: 30, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(15), z: z })
								}.bind(this)
							}.bind(this)
						} else if (type === 'audio') {
							reader = new FileReader()
							reader.readAsDataURL(event.dataTransfer.files[i])
							reader.onloadend = function (e) {
								const dataURL = e.target.result
								fichier = window.URL.createObjectURL(event.dataTransfer.files[i])
								this.panneaux.push({ page: this.page, id: id, type: type, mode: 'lecture', statut: '', dimensions: {}, contenu: { audio: fichier, dataURL: dataURL, vitesse: 1 }, w: 40, h: 14, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(7), z: z })
							}.bind(this)
						} else if (type === 'video') {
							reader = new FileReader()
							reader.readAsDataURL(event.dataTransfer.files[i])
							reader.onloadend = function (e) {
								const dataURL = e.target.result
								fichier = window.URL.createObjectURL(event.dataTransfer.files[i])
								this.panneaux.push({ page: this.page, id: id, type: type, mode: 'lecture', statut: '', dimensions: {}, contenu: { video: fichier, videoId: '', type: event.dataTransfer.files[i].type, dataURL: dataURL, debutMinutes: '', debutSecondes: '', finMinutes: '', finSecondes: '' }, w: 38, h: 31.5, x: largeur - this.$convertirRem(19), y: hauteur - this.$convertirRem(15.75), z: z })
							}.bind(this)
						}
					}
				}
			}
		}.bind(this), false)

		fscreen.addEventListener('fullscreenchange', function () {
			if (fscreen.fullscreenElement === null) {
				this.pleinEcran = false
			} else {
				this.pleinEcran = true
			}
		}.bind(this))

		window.addEventListener('resize', this.verifierDimensions, false)

		window.addEventListener('beforeunload', function (event) {
			event.preventDefault()
			event.returnValue = ''
		}, false)
	},
	methods: {
		definirFond () {
			if (this.fond.substring(0, 1) === '#') {
				return { 'background-color': this.fond }
			} else if (this.fond.indexOf('lineatur') !== -1 || this.fond.indexOf('tafel-') !== -1 || this.fond.indexOf('millimeterpapier') !== -1) {
				return { 'background-image': 'url(' + this.fond + ')', 'background-size': 'cover', 'background-repeat': 'no-repeat', 'background-position': 'left center' }
			} else if (this.fond.split('.').pop() === 'png') {
				return { 'background-image': 'url(' + this.fond + ')', 'background-size': 'auto', 'background-repeat': 'repeat' }
			} else {
				return { 'background-image': 'url(' + this.fond + ')' }
			}
		},
		creerPanneau (type) {
			const id = 'panneau_' + (new Date()).getTime()
			const largeur = document.body.clientWidth / 2
			const hauteur = (document.body.clientHeight - this.$convertirRem(7.5)) / 2
			this.zIndex++
			const z = this.zIndex
			switch (type) {
			case 'codeqr':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 36, h: 46, x: largeur - this.$convertirRem(18), y: hauteur - this.$convertirRem(23), z: z })
				break
			case 'texte':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 53, h: 46, x: largeur - this.$convertirRem(26.5), y: hauteur - this.$convertirRem(23), z: z })
				break
			case 'image':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 27, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(13.5), z: z })
				break
			case 'galerie':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 60, h: 34, x: largeur - this.$convertirRem(30), y: hauteur - this.$convertirRem(17), z: z })
				break
			case 'dessin':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 48, h: 35, x: largeur - this.$convertirRem(24), y: hauteur - this.$convertirRem(17.5), z: z })
				break
			case 'document':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 16, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(8), z: z })
				break
			case 'audio':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 27, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(13.5), z: z })
				break
			case 'synthese':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 41, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(20.5), z: z })
				break
			case 'video':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 27, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(13.5), z: z })
				break
			case 'lien':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 28, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(14), z: z })
				break
			case 'iframe':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 30, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(11), z: z })
				break
			case 'nuage':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 80, h: 59.5, x: largeur - this.$convertirRem(40), y: hauteur - this.$convertirRem(29.75), z: z })
				break
			case 'ordre':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 46, h: 50.4, x: largeur - this.$convertirRem(23), y: hauteur - this.$convertirRem(25.2), z: z })
				break
			case 'trous':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 46, h: 48, x: largeur - this.$convertirRem(23), y: hauteur - this.$convertirRem(24), z: z })
				break
			case 'tirage':
			case 'tirage-texte':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 46, h: 40, x: largeur - this.$convertirRem(23), y: hauteur - this.$convertirRem(20), z: z })
				break
			case 'tirage-image':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 60, h: 40, x: largeur - this.$convertirRem(30), y: hauteur - this.$convertirRem(20), z: z })
				break
			case 'plateau':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 50, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(25), z: z })
				break
			case 'des':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 22, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(11), z: z })
				break
			case 'groupes':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 46, h: 42, x: largeur - this.$convertirRem(23), y: hauteur - this.$convertirRem(21), z: z })
				break
			case 'chrono':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 48, h: 22.2, x: largeur - this.$convertirRem(24), y: hauteur - this.$convertirRem(11.1), z: z })
				break
			case 'rebours':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 42, h: 22.2, x: largeur - this.$convertirRem(21), y: hauteur - this.$convertirRem(11.1), z: z })
				break
			case 'horloge':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 42, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(21), z: z })
				break
			case 'calendrier':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 34, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(17), z: z })
				break
			case 'retroaction':
				this.panneaux.push({ page: this.page, id: 'panneau-retroaction', type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 36, h: 31, x: largeur - this.$convertirRem(18), y: hauteur - this.$convertirRem(15.5), z: z })
				this.retroaction = true
				break
			case 'sonometre':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 40, h: 24, x: largeur - this.$convertirRem(20), y: hauteur - this.$convertirRem(12), z: z })
				break
			case 'ampel':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 16, h: 42, x: largeur - this.$convertirRem(8), y: hauteur - this.$convertirRem(21), z: z })
				break
			case 'taschenrechner':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 30, h: 48, x: largeur - this.$convertirRem(15), y: hauteur - this.$convertirRem(24), z: z })
				break
			case 'mathe-tauziehen':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: 'edition', statut: '', dimensions: {}, contenu: '', w: 90, h: 56, x: Math.max(0, largeur / 2 - this.$convertirRem(45)), y: Math.max(0, hauteur / 2 - this.$convertirRem(28)), z: z })
				break
			//new module
			case 'poll':
				this.panneaux.push({ page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, contenu: '', w: 46, h: 50.4, x: largeur - this.$convertirRem(23), y: hauteur - this.$convertirRem(25.2), z: z })
				break
			}
		},
		//editPanel
		modifierPanneau (donnees) {
			this.panneaux.forEach(function (panneau, index) {
				if (panneau.id === donnees.id) {
					this.panneaux[index].titre = donnees.titre
					this.panneaux[index].mode = donnees.mode
					this.panneaux[index].statut = donnees.statut
					this.panneaux[index].dimensions = donnees.dimensions
					this.panneaux[index].contenu = donnees.contenu
					this.panneaux[index].w = donnees.w
					this.panneaux[index].h = donnees.h
					this.panneaux[index].x = donnees.x
					this.panneaux[index].y = donnees.y
					this.panneaux[index].z = donnees.z
				}
			}.bind(this))
		},
		//closePanel
		fermerPanneau (id) {
			this.panneaux.forEach(function (panneau, index) {
				if (panneau.id === id) {
					this.panneaux.splice(index, 1)
				}
			}.bind(this))
			if (id === 'panneau-retroaction') {
				this.retroaction = false
			}
		},
		ouvrirModale (modale) {
			this.modale = modale
		},
		fermerModale () {
			this.modale = ''
		},
		ouvrirMenu () {
			this.menu = true
		},
		fermerMenu () {
			this.menu = false
		},
		reinitialiserGrille () {
			this.pages[this.page - 1].grille = {}
		},
		capturer () {
			html2canvas(document.body, { useCORS: true }).then(function (canvas) {
				saveAs(canvas.toDataURL('image/jpeg', 0.95).replace('image/jpeg', 'image/octet-stream'), 'Digiscreen_' + (new Date()).getTime() + '.jpg')
			})
		},
		annoter () {
			this.annotation = true
			this.pages[this.page - 1].annotation = true
		},
		arreterAnnoter () {
			this.annotation = false
			this.pages[this.page - 1].annotation = false
			// this.pages[this.page - 1].annotations = {}
		},
		entrerPleinEcran () {
			fscreen.requestFullscreen(document.body)
		},
		sortirPleinEcran () {
			fscreen.exitFullscreen()
		},
		afficherPage (page) {
			this.page = page
		},
		//Digiscreen importiert
		importer (event) {
			const fichier = event.target.files[0]
			if (fichier === null || fichier.length === 0) {
				document.querySelector('#televerser').value = ''
				return false
			} else {
				this.importDonnees = true
				const reader = new FileReader()
				reader.onload = function (e) {
					//.dgs Datei ist eine JSON Datei die geparst wird
					const donnees = JSON.parse(e.target.result)
					this.pages = donnees.pages
					this.page = donnees.page
					//modulleiste
					this.modules = donnees.modules
					//Karten die auf der Tafel sind, z.B.: Gruppeneinteilung, Würfel, ...
					this.panneaux = donnees.panneaux
					this.langue = donnees.langue
					this.$root.$i18n.locale = donnees.langue
					if (donnees.hasOwnProperty('nav')) {
						this.nav = donnees.nav
					}
					this.zIndex = donnees.zIndex
					this.importTermine = true
					if (Object.keys(this.pages[0].annotations).length > 0) {
						this.annotation = true
					} else {
						this.annotation = false
					}
				}.bind(this)
				reader.readAsText(fichier)
				document.querySelector('#televerser').value = ''
				this.$nextTick(function () {
					document.querySelector('#import').addEventListener('animationend', function () {
						this.importDonnees = false
						this.importTermine = false
					}.bind(this))
				}.bind(this))
			}
		},
		exporter (fichier) {
			this.exportDonnees = true
			this.$nextTick(function () {
				let donnees = {}
				donnees.pages = this.pages
				donnees.page = this.page
				donnees.modules = this.modules
				donnees.panneaux = this.panneaux
				donnees.langue = this.langue
				donnees.nav = this.nav
				donnees.zIndex = this.zIndex
				donnees = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(donnees))
				saveAs(donnees, fichier + '.dgs')
				this.exportDonnees = false
				this.fermerModale()
			}.bind(this))
		},
		modifierModule (event) {		
			const module = event.target.value
			if (event.target.checked === true) {
				this.modules.push(module)
			} else {
				const index = this.modules.indexOf(module)
				this.modules.splice(index, 1)
			}
			//update localStorage with current selected modules
			localStorage.setItem('modules', JSON.stringify(this.modules));
		},
		recupererVoix () {
			this.listeVoix = window.speechSynthesis.getVoices().sort(function (a, b) {
				const nomA = a.name.toUpperCase()
				const nomB = b.name.toUpperCase()
				if (nomA < nomB) return -1
				else if (nomA == nomB) return 0
				else return +1
			})
		},
		verifierDimensions () {
			this.finRedimensionnement = false
			const largeur = window.innerWidth
			this.$nextTick(function () {
				this.largeur = document.body.clientWidth
				if (this.nav) {
					this.hauteur = document.body.clientHeight - this.$convertirRem(7.5)
				} else {
					this.hauteur = document.body.clientHeight
				}
			}.bind(this))
			if (largeur < 1024) {
				this.alerte = true
			} else if (this.alerte) {
				this.alerte = false
				this.chargement = true
				this.$nextTick(function () {
					document.querySelector('#chargement').addEventListener('animationend', function () {
						this.chargement = false
					}.bind(this))
				}.bind(this))
			}
			clearTimeout(this.horloge)
			this.horloge = setTimeout(function () {
				this.finRedimensionnement = true
			}.bind(this), 250)
		},
		activerDefilementHorizontal () {
			const nav = document.querySelector('nav')
			nav.addEventListener('mousedown', this.defilementHorizontalDebut)
			nav.addEventListener('mouseleave', this.defilementHorizontalFin)
			nav.addEventListener('mouseup', this.defilementHorizontalFin)
			nav.addEventListener('mousemove', this.defilementHorizontalEnCours)
		},
		defilementHorizontalDebut (event) {
			const nav = document.querySelector('nav')
			this.defilement = true
			this.depart = event.pageX - nav.offsetLeft
			this.distance = nav.scrollLeft
		},
		defilementHorizontalFin () {
			this.defilement = false
		},
		defilementHorizontalEnCours (event) {
			if (!this.defilement) { return }
			event.preventDefault()
			const nav = document.querySelector('nav')
			const x = event.pageX - nav.offsetLeft
			const delta = (x - this.depart) * 1.5
			nav.scrollLeft = this.distance - delta
		}
	}
}
</script>

<style src="destyle.css/destyle.css"></style>
<style src="@/assets/css/style.css"></style>
<style src="video.js/dist/video-js.css"></style>
