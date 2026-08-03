/**
 * Score for the chronicle.
 *
 * Film-soundtrack palette — orchestral / cinematic only. Tracks are Kevin
 * MacLeod (incompetech.com) under CC BY 4.0; attribution rides in the player
 * tag's tooltip.
 *
 * A cue is a named moment in the story mapped onto a file, so several moments
 * can share a piece while still announcing themselves by name. Two <audio>
 * elements alternate so one fades out while the next fades in.
 *
 * Browsers refuse to start audio before a user gesture, so playback stays
 * armed-but-silent until the reader interacts with the page even once.
 */

export interface Track {
	id: string;
	file: string;
	title: string;
	credit: string;
}

const CREDIT = 'Kevin MacLeod · incompetech.com · CC BY 4.0';

/** file stem → the mood it carries (MacLeod original in comment) */
const F = {
	procession: 'procession', // Procession of the King — court opens, a queen is named
	kings: 'kings', // Death of Kings — crowning after a bloodline ends
	morgana: 'morgana', // Morgana Rides — resolve, the ride to war
	sovereign: 'sovereign', // Sovereign — cold final crown, unification's quiet
	tempting: 'tempting', // Tempting Secrets — court intrigue, clan politics
	interloper: 'interloper', // Interloper — tense diplomacy between kings
	avalon: 'avalon', // Shores of Avalon — founding myths, sacred origin
	dreams: 'dreams', // Dreams Become Real — deep antiquity, Old Joseon
	moorland: 'moorland', // Moorland — open country, conquest rides south
	crusade: 'crusade', // Crusade — invasion marches, the great campaigns
	armies: 'armies', // Five Armies — set-piece battles, last stands in the field
	vortex: 'vortex', // Black Vortex — the White River, all sides colliding
	lightless: 'lightless', // Lightless Dawn — sieges, walls that will not fall
	impact: 'impact', // Impact Lento — grinding years of the long war
	thunder: 'thunder', // Thunderbird — imperial power, the West in force
	evening: 'evening', // Evening of Chaos — omens, rebellion, snowbound dread
	darkest: 'darkest', // Darkest Child — massacre at the banquet
	darktimes: 'darktimes', // Dark Times — betrayal, paranoia, a throne rotting
	herodown: 'herodown', // Hero Down — grief for the fallen
	aftermath: 'aftermath', // Aftermath — kings die; the room empties
	firesong: 'firesong', // Firesong — a wedding under the Flower Knights
	clean: 'clean', // Clean Soul — counsel, quiet rooms, the sword gifted
	skye: 'skye', // Skye Cuillin — exile, the island of oranges
	intrepid: 'intrepid' // Intrepid — crossing the sea eastward
} as const;

function cue(title: string, stem: string): Track {
	return { id: stem, file: `/music/${stem}.m4a`, title, credit: CREDIT };
}

export const TRACKS: Record<string, Track> = {
	// ————— ceremony & court —————
	'Long Live the Queen': cue('Long Live the Queen', F.procession),
	'The Crowning': cue('The Crowning', F.kings),
	'Unification': cue('Unification', F.morgana),
	'Samhan': cue('Samhan', F.sovereign),
	'The Harmony Council': cue('The Harmony Council', F.tempting),
	'Eight Great Clans': cue('The Eight Great Clans', F.tempting),
	'The Rock of Politics': cue('The Rock of Politics', F.tempting),
	// ————— myth & founding —————
	'Founding': cue('Founding', F.avalon),
	'Six Eggs': cue('Six Eggs', F.avalon),
	'The River Gives Way': cue('The River Gives Way', F.moorland),
	'Old Joseon': cue('Old Joseon', F.dreams),
	// ————— intrigue —————
	'The Summit': cue('The High Summit', F.evening),
	'Two Kings Talking': cue('Two Kings Talking', F.interloper),
	'The Alliance': cue('The Alliance', F.interloper),
	// ————— war —————
	'The Great River': cue('The Great River', F.crusade),
	'Seven Invasions': cue('The Seventh Invasion', F.thunder),
	'Ansi': cue('Ansi Holds', F.lightless),
	'Five Thousand': cue('Five Thousand', F.armies),
	'The White River': cue('The White River', F.vortex),
	'Pyongyang, 668': cue('Pyongyang, 668', F.lightless),
	'The Long War': cue('The Long War', F.impact),
	// ————— dread —————
	'The Five Blades': cue('The Five Blades', F.darkest),
	'Rebellion': cue('Rebellion', F.evening),
	'Nine Omens': cue('Nine Omens', F.evening),
	'The Descent': cue('The Descent', F.darktimes),
	'Betrayal': cue('Betrayal', F.darktimes),
	// ————— grief —————
	'Gotaso': cue('Gotaso', F.herodown),
	'A Man of Baekje': cue('A Man of Baekje', F.herodown),
	'The Last of the Gaya': cue('The Last of the Gaya', F.herodown),
	'An Ending': cue('An Ending', F.aftermath),
	// ————— quiet —————
	'Gotaso’s Wedding': cue('Gotaso’s Wedding', F.firesong),
	'Counsel': cue('Counsel', F.clean),
	'The Island': cue('The Island of Oranges', F.skye),
	'Across the Sea': cue('Across the Sea', F.intrepid)
};

export const music = $state({
	current: null as Track | null,
	muted: true,
	/** true once a user gesture has let us start audio */
	armed: false
});

const FADE_MS = 1800;
const VOLUME = 0.4;

let a: HTMLAudioElement | undefined;
let b: HTMLAudioElement | undefined;
let live: HTMLAudioElement | undefined;
let fadeTimer: ReturnType<typeof setInterval> | undefined;

function make() {
	const el = new Audio();
	el.loop = true;
	el.preload = 'none';
	el.volume = 0;
	return el;
}

/** Ramp both elements toward their targets. */
function fadeTo(next: HTMLAudioElement | undefined, target: number) {
	clearInterval(fadeTimer);
	const step = 40;
	const ticks = Math.max(1, Math.round(FADE_MS / step));
	let i = 0;
	fadeTimer = setInterval(() => {
		i++;
		const t = Math.min(1, i / ticks);
		for (const el of [a, b]) {
			if (!el) continue;
			const to = el === next ? target : 0;
			el.volume = Math.max(0, Math.min(1, el.volume + (to - el.volume) * t));
			if (el !== next && el.volume < 0.01 && !el.paused) el.pause();
		}
		if (i >= ticks) {
			clearInterval(fadeTimer);
			for (const el of [a, b]) {
				if (!el) continue;
				el.volume = el === next ? target : 0;
				if (el !== next && !el.paused) el.pause();
			}
		}
	}, step);
}

function targetVolume() {
	return music.muted || !music.armed ? 0 : VOLUME;
}

export function playTrack(track: Track | null) {
	if (!a || !b) return;
	music.current = track;

	if (!track) {
		fadeTo(undefined, 0);
		live = undefined;
		return;
	}

	// same piece already sounding — a new cue name shouldn't restart it
	if (live && live.dataset.trackId === track.id) {
		fadeTo(live, targetVolume());
		return;
	}

	const next = live === a ? b : a;
	if (next.dataset.trackId !== track.id) {
		next.src = track.file;
		next.dataset.trackId = track.id;
	}
	next.volume = 0;
	live = next;

	if (music.armed && !music.muted) {
		next.play().catch(() => {
			/* still blocked — the next gesture will arm us */
		});
	}
	fadeTo(next, targetVolume());
}

export function toggleMute() {
	music.muted = !music.muted;
	try {
		localStorage.setItem('kingdom:muted', music.muted ? '1' : '0');
	} catch {
		/* private mode */
	}
	if (!music.muted) arm();
	if (live) {
		if (!music.muted && music.armed) live.play().catch(() => {});
		fadeTo(live, targetVolume());
	}
}

function arm() {
	if (music.armed) return;
	music.armed = true;
	if (live && !music.muted) live.play().catch(() => {});
}

export function initMusic() {
	a = make();
	b = make();

	try {
		music.muted = localStorage.getItem('kingdom:muted') !== '0';
	} catch {
		/* default stays muted */
	}

	const onGesture = () => {
		arm();
		if (live && !music.muted) {
			live.play().catch(() => {});
			fadeTo(live, targetVolume());
		}
	};
	window.addEventListener('pointerdown', onGesture, { passive: true });
	window.addEventListener('keydown', onGesture, { passive: true });

	return () => {
		clearInterval(fadeTimer);
		window.removeEventListener('pointerdown', onGesture);
		window.removeEventListener('keydown', onGesture);
		for (const el of [a, b]) el?.pause();
		a = b = live = undefined;
	};
}
