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
	/** In-story singer / performer when the cue is a vocal scene. */
	artist?: string;
	credit: string;
	/** Vocal cues play through once. The orchestral beds loop. */
	loop?: boolean;
	/** When set, the bed is a YouTube video (official player), not `file`. */
	youtubeId?: string;
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
	'Deer Rock': cue('Deer Rock', F.tempting),
	'The Rock of Politics': cue('Deer Rock', F.tempting),
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
	/** Les Misérables (2012 film) — Samantha Barks & Eddie Redmayne. */
	'A Little Fall of Rain': {
		id: 'little-fall-of-rain',
		file: '/music/little-fall-of-rain.m4a',
		title: 'A Little Fall of Rain',
		credit: 'Claude-Michel Schönberg · Les Misérables (2012 film)',
		loop: false
	},
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
	armed: false,
	/** User gain 0–1 (separate from mute). */
	volume: 0.4,
	/** Explicit pause — mute keeps the transport “playing”. */
	paused: false,
	currentTime: 0,
	duration: 0
});

const FADE_MS = 1800;
const DEFAULT_VOLUME = 0.4;

let a: HTMLAudioElement | undefined;
let b: HTMLAudioElement | undefined;
let live: HTMLAudioElement | undefined;
let fadeTimer: ReturnType<typeof setInterval> | undefined;
let progressRaf = 0;

interface YtPlayer {
	playVideo: () => void;
	pauseVideo: () => void;
	stopVideo: () => void;
	seekTo: (seconds: number, allowSeekAhead: boolean) => void;
	setVolume: (volume: number) => void;
	getCurrentTime: () => number;
	getDuration: () => number;
	loadVideoById: (videoId: string) => void;
	destroy: () => void;
}

let yt: YtPlayer | undefined;
let ytVideoId = '';
let ytLoop = false;
/** Bumped every time the iframe is torn down so a late onReady cannot restart it. */
let ytGen = 0;
/** Bumped on every play/stop so an in-flight load cannot start a scene we already left. */
let playGen = 0;
let ytHost: HTMLElement | undefined;
let ytApi: Promise<void> | undefined;
/** Lyric / scrub seek requested before the YouTube player finished creating. */
let pendingSeekSec: number | null = null;

function loadYoutubeApi(): Promise<void> {
	if (ytApi) return ytApi;
	ytApi = new Promise((resolve) => {
		const w = window as Window & {
			YT?: { Player: new (el: HTMLElement, opts: object) => YtPlayer };
			onYouTubeIframeAPIReady?: () => void;
		};
		if (w.YT?.Player) {
			resolve();
			return;
		}
		const prev = w.onYouTubeIframeAPIReady;
		w.onYouTubeIframeAPIReady = () => {
			prev?.();
			resolve();
		};
		const script = document.createElement('script');
		script.src = 'https://www.youtube.com/iframe_api';
		document.head.appendChild(script);
	});
	return ytApi;
}

/** Pull the iframe out of the document. destroy() alone leaves the audio running. */
function hardKillYoutube() {
	const dead = yt;
	const deadHost = ytHost;
	yt = undefined;
	ytHost = undefined;
	ytVideoId = '';
	ytLoop = false;
	pendingSeekSec = null;
	ytGen++;
	try {
		dead?.setVolume(0);
	} catch {
		/* not ready */
	}
	try {
		dead?.stopVideo();
	} catch {
		/* not ready */
	}
	const iframe = deadHost?.querySelector('iframe');
	if (iframe) iframe.src = 'about:blank';
	try {
		dead?.destroy();
	} catch {
		/* already gone */
	}
	deadHost?.remove();
	for (const el of document.querySelectorAll('[data-kingdom-yt]')) el.remove();
}

function ensureYoutube(videoId: string, loop: boolean) {
	const w = window as Window & {
		YT?: { Player: new (el: HTMLElement, opts: object) => YtPlayer };
	};
	if (!w.YT?.Player) return;
	if (yt && ytVideoId === videoId) {
		ytLoop = loop;
		return;
	}
	hardKillYoutube();
	const gen = ytGen;
	ytLoop = loop;
	const holder = document.createElement('div');
	holder.dataset.kingdomYt = '1';
	holder.setAttribute('aria-hidden', 'true');
	holder.style.cssText =
		'position:fixed;width:1px;height:1px;left:-9999px;top:0;opacity:0;pointer-events:none;overflow:hidden';
	const slot = document.createElement('div');
	holder.appendChild(slot);
	document.body.appendChild(holder);
	ytHost = holder;
	ytVideoId = videoId;
	yt = new w.YT.Player(slot, {
		videoId,
		width: 1,
		height: 1,
		playerVars: {
			autoplay: 0,
			controls: 0,
			disablekb: 1,
			fs: 0,
			modestbranding: 1,
			rel: 0,
			playsinline: 1,
			loop: 0
		},
		events: {
			onReady: () => {
				if (gen !== ytGen || music.current?.youtubeId !== videoId) return;
				if (pendingSeekSec != null) {
					const t = pendingSeekSec;
					pendingSeekSec = null;
					seek(t);
				} else {
					applyYoutubePlayback();
				}
			},
			onStateChange: (e: { data: number }) => {
				if (gen !== ytGen || !yt) return;
				if (music.current?.youtubeId !== videoId) {
					try {
						yt.setVolume(0);
						yt.pauseVideo();
					} catch {
						/* tearing down */
					}
					return;
				}
				/* 0 = ended. Loop in the player callback so a detached iframe cannot keep itself alive. */
				if (e.data === 0 && ytLoop && music.current?.loop !== false && shouldAudiblyPlay()) {
					yt.seekTo(0, true);
					yt.playVideo();
				}
			}
		}
	});
}

function silenceHtml() {
	clearInterval(fadeTimer);
	fadeTimer = undefined;
	live = undefined;
	for (const el of [a, b]) {
		if (!el) continue;
		try {
			el.pause();
			el.volume = 0;
		} catch {
			/* torn down */
		}
	}
}

function stopYoutube() {
	hardKillYoutube();
}

function applyYoutubePlayback() {
	if (!yt || !ytVideoId || music.current?.youtubeId !== ytVideoId) {
		if (yt) {
			try {
				yt.setVolume(0);
				yt.pauseVideo();
			} catch {
				/* player not ready yet */
			}
		}
		return;
	}
	try {
		if (shouldAudiblyPlay()) {
			yt.setVolume(Math.round(targetVolume() * 100));
			yt.playVideo();
			startProgress();
		} else {
			yt.setVolume(0);
			yt.pauseVideo();
		}
	} catch {
		/* player not ready yet */
	}
}

function clamp01(n: number) {
	return Math.max(0, Math.min(1, n));
}

function make() {
	const el = new Audio();
	el.loop = true;
	el.preload = 'none';
	el.volume = 0;
	const onMeta = () => {
		if (el === live) syncProgress();
	};
	el.addEventListener('loadedmetadata', onMeta);
	el.addEventListener('durationchange', onMeta);
	el.addEventListener('timeupdate', onMeta);
	return el;
}

function syncProgress() {
	if (music.current?.youtubeId && yt) {
		try {
			const t = yt.getCurrentTime();
			const d = yt.getDuration();
			music.currentTime = Number.isFinite(t) ? t : 0;
			music.duration = Number.isFinite(d) ? d : 0;
			return;
		} catch {
			/* not ready */
		}
	}
	if (!live) {
		music.currentTime = 0;
		music.duration = 0;
		return;
	}
	music.currentTime = Number.isFinite(live.currentTime) ? live.currentTime : 0;
	music.duration = Number.isFinite(live.duration) ? live.duration : 0;
}

function tickProgress() {
	syncProgress();
	progressRaf = requestAnimationFrame(tickProgress);
}

function startProgress() {
	if (progressRaf) return;
	progressRaf = requestAnimationFrame(tickProgress);
}

function stopProgress() {
	if (!progressRaf) return;
	cancelAnimationFrame(progressRaf);
	progressRaf = 0;
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
				if (el === next && target < 0.01 && music.paused && !el.paused) el.pause();
			}
		}
	}, step);
}

/** Immediate silence — both beds, no fade. Clears src so nothing can keep decoding. */
export function stopTrack(opts?: { keepPauseState?: boolean }) {
	playGen++;
	clearInterval(fadeTimer);
	fadeTimer = undefined;
	stopProgress();
	music.current = null;
	if (!opts?.keepPauseState) music.paused = true;
	music.currentTime = 0;
	music.duration = 0;
	live = undefined;
	stopYoutube();
	for (const el of [a, b]) {
		if (!el) continue;
		try {
			el.pause();
			el.volume = 0;
			el.removeAttribute('src');
			el.load();
			delete el.dataset.trackId;
		} catch {
			/* already torn down */
		}
	}
}

function targetVolume() {
	return music.muted || !music.armed || music.paused ? 0 : music.volume;
}

function shouldAudiblyPlay() {
	return music.armed && !music.muted && !music.paused;
}

function applyLivePlayback() {
	if (!live) return;
	if (shouldAudiblyPlay()) {
		live.play().catch(() => {
			/* still blocked — the next gesture will arm us */
		});
		fadeTo(live, targetVolume());
		startProgress();
	} else {
		fadeTo(live, 0);
		if (music.paused) {
			/* let the fade finish, then hard-pause in fadeTo */
		}
	}
}

export function playTrack(track: Track | null) {
	if (!a || !b) return;
	const gen = ++playGen;
	const prevYoutubeId = music.current?.youtubeId;
	music.current = track;

	if (track?.youtubeId) {
		silenceHtml();
		music.paused = false;
		const sameYt =
			!!prevYoutubeId &&
			prevYoutubeId === track.youtubeId &&
			!!yt &&
			ytVideoId === track.youtubeId;
		if (!sameYt) {
			music.currentTime = 0;
			music.duration = 0;
		}
		const id = track.youtubeId;
		const loop = track.loop !== false;
		void loadYoutubeApi().then(() => {
			if (gen !== playGen) return;
			if (music.current?.youtubeId !== id) return;
			ensureYoutube(id, loop);
			applyYoutubePlayback();
		});
		return;
	}

	stopYoutube();

	if (!track) {
		/* Soft stop for chronicle crossfades. Scenes use stopTrack() for a hard cut. */
		fadeTo(undefined, 0);
		live = undefined;
		music.currentTime = 0;
		music.duration = 0;
		stopProgress();
		return;
	}

	// same piece already sounding — a new cue name shouldn't restart it
	if (live && live.dataset.trackId === track.id) {
		music.paused = false;
		applyLivePlayback();
		return;
	}

	const next = live === a ? b : a;
	/* Kill the outgoing bed immediately so a long cue (Qin Wang) cannot keep sounding. */
	const outgoing = live;
	if (outgoing && outgoing !== next) {
		outgoing.pause();
		outgoing.volume = 0;
	}
	if (next.dataset.trackId !== track.id) {
		next.src = track.file;
		next.dataset.trackId = track.id;
	}
	next.loop = track.loop !== false;
	next.volume = 0;
	live = next;
	music.paused = false;
	music.currentTime = 0;
	music.duration = 0;
	syncProgress();

	applyLivePlayback();
}

export function toggleMute() {
	music.muted = !music.muted;
	try {
		localStorage.setItem('kingdom:muted', music.muted ? '1' : '0');
	} catch {
		/* private mode */
	}
	if (!music.muted) {
		arm();
		music.paused = false;
	}
	if (music.current?.youtubeId) applyYoutubePlayback();
	else applyLivePlayback();
}

export function setVolume(level: number) {
	music.volume = clamp01(level);
	try {
		localStorage.setItem('kingdom:volume', String(music.volume));
	} catch {
		/* private mode */
	}
	if (music.volume > 0.001 && music.muted) {
		music.muted = false;
		try {
			localStorage.setItem('kingdom:muted', '0');
		} catch {
			/* private mode */
		}
		arm();
		music.paused = false;
	}
	if (music.current?.youtubeId) applyYoutubePlayback();
	else applyLivePlayback();
}

export function togglePause() {
	if (!music.current) return;
	music.paused = !music.paused;
	if (!music.paused) {
		arm();
		if (music.muted) {
			music.muted = false;
			try {
				localStorage.setItem('kingdom:muted', '0');
			} catch {
				/* private mode */
			}
		}
	}
	if (music.current?.youtubeId) applyYoutubePlayback();
	else applyLivePlayback();
}

export function seek(seconds: number) {
	const want = Math.max(0, Number(seconds) || 0);

	if (music.current?.youtubeId) {
		const player = yt;
		if (!player) {
			music.currentTime = want;
			return;
		}
		let dur = 0;
		try {
			dur = player.getDuration();
		} catch {
			dur = 0;
		}
		const t =
			Number.isFinite(dur) && dur > 0 ? Math.min(dur, want) : want;
		try {
			player.seekTo(t, true);
		} catch {
			music.currentTime = t;
			return;
		}
		music.currentTime = t;
		/* Seek is async on YouTube — keep transport + progress in lockstep. */
		if (music.armed && !music.paused) {
			try {
				if (!music.muted) {
					player.setVolume(Math.round(targetVolume() * 100));
				}
				player.playVideo();
			} catch {
				/* not ready */
			}
			startProgress();
		}
		const resync = () => {
			try {
				const now = player.getCurrentTime();
				if (Number.isFinite(now)) music.currentTime = now;
				const d = player.getDuration();
				if (Number.isFinite(d)) music.duration = d;
			} catch {
				/* ignore */
			}
		};
		requestAnimationFrame(resync);
		setTimeout(resync, 120);
		setTimeout(resync, 350);
		return;
	}

	if (!live) {
		music.currentTime = want;
		return;
	}
	const dur = Number.isFinite(live.duration) ? live.duration : 0;
	const t = Number.isFinite(dur) && dur > 0 ? Math.min(dur, want) : want;
	live.currentTime = t;
	music.currentTime = t;
	if (music.armed && !music.paused && !music.muted) {
		live.play().catch(() => {});
		startProgress();
	}
}

function arm() {
	if (music.armed) return;
	music.armed = true;
	if (music.current?.youtubeId) {
		applyYoutubePlayback();
		return;
	}
	if (live && shouldAudiblyPlay()) live.play().catch(() => {});
}

export function initMusic() {
	a = make();
	b = make();

	try {
		music.muted = localStorage.getItem('kingdom:muted') !== '0';
		const storedVol = localStorage.getItem('kingdom:volume');
		if (storedVol != null) {
			const n = Number(storedVol);
			if (Number.isFinite(n)) music.volume = clamp01(n);
		} else {
			music.volume = DEFAULT_VOLUME;
		}
	} catch {
		/* default stays muted */
	}

	const onGesture = () => {
		arm();
		if (music.current?.youtubeId) {
			applyYoutubePlayback();
		} else if (live && shouldAudiblyPlay()) {
			live.play().catch(() => {});
			fadeTo(live, targetVolume());
			startProgress();
		}
	};

	/** Tab close / bfcache — Svelte cleanup may not run; kill both beds hard. */
	const onPageHide = () => stopTrack();

	window.addEventListener('pointerdown', onGesture, { passive: true });
	window.addEventListener('keydown', onGesture, { passive: true });
	window.addEventListener('pagehide', onPageHide);
	window.addEventListener('beforeunload', onPageHide);

	startProgress();

	return () => {
		window.removeEventListener('pointerdown', onGesture);
		window.removeEventListener('keydown', onGesture);
		window.removeEventListener('pagehide', onPageHide);
		window.removeEventListener('beforeunload', onPageHide);
		stopTrack();
		a = b = live = undefined;
	};
}
