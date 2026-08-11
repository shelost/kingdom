/**
 * Cinema's punctuation: the sting that opens an episode and the whoosh that
 * carries a cut from one speaker to the next.
 *
 * Synthesised rather than loaded, because these are two half-second sounds and
 * a scene change should never wait on the network. They ride the music
 * preference: muted means muted, and nothing sounds before the reader's first
 * gesture has armed audio (`music.armed`), which is the same rule the score
 * already plays by.
 */

import { music } from '$lib/music.svelte';

let ctx: AudioContext | null = null;
let lastWhoosh = 0;
let lastStinger = 0;

/** Rapid speaker changes must not stack into a wall of noise. */
const WHOOSH_GAP_MS = 220;
const STINGER_GAP_MS = 900;

type WithWebkit = typeof globalThis & { webkitAudioContext?: typeof AudioContext };

function audible(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (music.muted || !music.armed) return null;

	if (!ctx) {
		const Ctor = window.AudioContext ?? (window as WithWebkit).webkitAudioContext;
		if (!Ctor) return null;
		try {
			ctx = new Ctor();
		} catch {
			return null;
		}
	}
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

/** One decaying partial — the bones of both sounds. */
function partial(
	c: AudioContext,
	opts: { freq: number; at: number; hold: number; gain: number; type?: OscillatorType }
) {
	const osc = c.createOscillator();
	const amp = c.createGain();
	osc.type = opts.type ?? 'sine';
	osc.frequency.setValueAtTime(opts.freq, opts.at);

	amp.gain.setValueAtTime(0, opts.at);
	amp.gain.linearRampToValueAtTime(opts.gain, opts.at + 0.02);
	amp.gain.exponentialRampToValueAtTime(0.0001, opts.at + opts.hold);

	osc.connect(amp).connect(c.destination);
	osc.start(opts.at);
	osc.stop(opts.at + opts.hold + 0.05);
}

/**
 * Episode sting — an open fifth over a low root, struck and left to ring.
 * Quiet on purpose: it marks a cut, it does not announce itself.
 */
export function stinger() {
	const c = audible();
	if (!c) return;
	const now = performance.now();
	if (now - lastStinger < STINGER_GAP_MS) return;
	lastStinger = now;

	const t = c.currentTime + 0.01;
	partial(c, { freq: 98, at: t, hold: 1.5, gain: 0.05, type: 'triangle' });
	partial(c, { freq: 293.66, at: t + 0.02, hold: 1.2, gain: 0.035 });
	partial(c, { freq: 440, at: t + 0.09, hold: 0.9, gain: 0.024 });
}

/** Soft whoosh — filtered noise sweeping down as the stage changes speaker. */
export function whoosh() {
	const c = audible();
	if (!c) return;
	const now = performance.now();
	if (now - lastWhoosh < WHOOSH_GAP_MS) return;
	lastWhoosh = now;

	const seconds = 0.3;
	const frames = Math.floor(c.sampleRate * seconds);
	const buffer = c.createBuffer(1, frames, c.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < frames; i++) {
		/* fade the noise in and out so the edges never click */
		const shape = Math.sin((Math.PI * i) / frames);
		data[i] = (Math.random() * 2 - 1) * shape;
	}

	const source = c.createBufferSource();
	source.buffer = buffer;

	const band = c.createBiquadFilter();
	band.type = 'bandpass';
	band.Q.value = 0.9;
	const t = c.currentTime + 0.01;
	band.frequency.setValueAtTime(1100, t);
	band.frequency.exponentialRampToValueAtTime(220, t + seconds);

	const amp = c.createGain();
	amp.gain.setValueAtTime(0.03, t);
	amp.gain.exponentialRampToValueAtTime(0.0005, t + seconds);

	source.connect(band).connect(amp).connect(c.destination);
	source.start(t);
	source.stop(t + seconds + 0.02);
}

/** Release the audio context — cinema is over. */
export function closeStingers() {
	if (!ctx) return;
	void ctx.close().catch(() => {
		/* already closed */
	});
	ctx = null;
}
