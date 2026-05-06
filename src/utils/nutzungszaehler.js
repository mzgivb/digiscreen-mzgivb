const SPEICHER_KEY = 'digiscreen_nutzungszaehler'
const SITZUNG_KEY = 'digiscreen_nutzung_gezaehlt'

function standardWerte () {
	return {
		gesamt: 0,
		ersteNutzung: '',
		letzteNutzung: ''
	}
}

function lesen () {
	try {
		const gespeicherteDaten = localStorage.getItem(SPEICHER_KEY)
		return gespeicherteDaten ? Object.assign(standardWerte(), JSON.parse(gespeicherteDaten)) : standardWerte()
	} catch (erreur) {
		return standardWerte()
	}
}

function speichern (daten) {
	try {
		localStorage.setItem(SPEICHER_KEY, JSON.stringify(daten))
	} catch (erreur) {
		return false
	}
	return true
}

function endpoint () {
	if (window.DIGISCREEN_USAGE_ENDPOINT && typeof window.DIGISCREEN_USAGE_ENDPOINT === 'string') {
		return window.DIGISCREEN_USAGE_ENDPOINT
	}
	return ''
}

function senden (daten) {
	const ziel = endpoint()
	if (!ziel) {
		return
	}
	const payload = JSON.stringify({
		gesamt: daten.gesamt,
		zeitpunkt: daten.letzteNutzung,
		app: 'digiscreen'
	})
	if (navigator.sendBeacon) {
		navigator.sendBeacon(ziel, new Blob([payload], { type: 'application/json' }))
		return
	}
	fetch(ziel, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: payload,
		keepalive: true
	}).catch(function () {})
}

export function zaehleNutzung () {
	const daten = lesen()
	if (sessionStorage.getItem(SITZUNG_KEY)) {
		return daten
	}
	const zeitpunkt = new Date().toISOString()
	daten.gesamt++
	daten.letzteNutzung = zeitpunkt
	if (!daten.ersteNutzung) {
		daten.ersteNutzung = zeitpunkt
	}
	speichern(daten)
	sessionStorage.setItem(SITZUNG_KEY, '1')
	senden(daten)
	return daten
}

export function nutzungsstandLesen () {
	return lesen()
}
