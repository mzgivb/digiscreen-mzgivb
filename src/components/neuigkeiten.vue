<template>
	<div class="conteneur-modale">
		<div class="modale modale-neuigkeiten">
			<header>
				<span class="titre">{{ $t('neuigkeitenTitel') }} <span class="version-tag">{{ version }}</span></span>
				<span class="fermer" role="button" tabindex="0" @click="schliessen"><i class="material-icons">close</i></span>
			</header>
			<div class="conteneur">
				<div class="contenu">
					<section class="neuigkeiten-section">
						<h3><i class="material-icons">auto_awesome</i> {{ $t('neuigkeitenNeu') }}</h3>
						<ul>
							<li>
								<b>{{ $t('matheTauziehen') }}</b> — {{ $t('neuigkeitenMatheTauziehen') }}
							</li>
							<li>
								<b>{{ $t('mtReihen') }}</b> — {{ $t('neuigkeitenReihen') }}
							</li>
						</ul>
					</section>

					<section class="neuigkeiten-section">
						<h3><i class="material-icons">bug_report</i> {{ $t('neuigkeitenBehoben') }}</h3>
						<ul>
							<li>{{ $t('neuigkeitenAnnotationUndo') }}</li>
						</ul>
					</section>

					<div class="neuigkeiten-aktionen">
						<button class="neuigkeiten-btn" @click="schliessen">{{ $t('neuigkeitenLosLegen') }}</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MNeuigkeiten',
	props: {
		version: {
			type: String,
			default: ''
		}
	},
	methods: {
		schliessen () {
			localStorage.setItem('digiscreen_neuigkeiten_gesehen', this.version)
			this.$parent.fermerModale()
		}
	}
}
</script>

<style>
.modale-neuigkeiten {
	max-width: 60rem;
}

.modale-neuigkeiten .version-tag {
	display: inline-block;
	background: #46B1E7;
	color: #fff;
	font-size: 1.2rem;
	font-weight: 700;
	padding: 0.2rem 0.8rem;
	border-radius: 1rem;
	margin-left: 0.6rem;
	vertical-align: middle;
}

.modale-neuigkeiten .contenu {
	padding: 1.6rem 2rem 2rem 2rem;
}

.neuigkeiten-section {
	margin-bottom: 1.8rem;
}

.neuigkeiten-section h3 {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	font-size: 1.6rem;
	color: #1a1a2e;
	margin: 0 0 0.8rem 0;
}

.neuigkeiten-section h3 .material-icons {
	color: #46B1E7;
}

.neuigkeiten-section ul {
	margin: 0;
	padding-left: 2.2rem;
}

.neuigkeiten-section li {
	font-size: 1.4rem;
	line-height: 1.5;
	margin-bottom: 0.5rem;
	color: #333;
}

.neuigkeiten-aktionen {
	display: flex;
	justify-content: flex-end;
	margin-top: 1.6rem;
}

.neuigkeiten-btn {
	background: #46B1E7;
	color: #fff;
	border: none;
	padding: 0.9rem 2rem;
	font-size: 1.4rem;
	font-weight: 700;
	border-radius: 0.5rem;
	cursor: pointer;
}

.neuigkeiten-btn:hover {
	filter: brightness(1.05);
}
</style>
