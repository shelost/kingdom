/** Onsets and the drop, read from the decoded song. Pure: no DOM beyond the AudioBuffer. */

export type Beats = {
	duration: number;
	/** Onset times in seconds, ascending. */
	onsets: number[];
	/** 0..1 loudness of each onset. */
	strength: number[];
	/** Seconds where the build-up gives way to the full beat. */
	drop: number;
};

const HOP = 512;

function envelope(buffer: AudioBuffer): { env: Float32Array; rate: number } {
	const frames = Math.floor(buffer.length / HOP);
	const env = new Float32Array(frames);
	for (let c = 0; c < buffer.numberOfChannels; c++) {
		const data = buffer.getChannelData(c);
		for (let f = 0; f < frames; f++) {
			let sum = 0;
			for (let i = f * HOP, end = i + HOP; i < end; i++) sum += data[i] * data[i];
			env[f] += sum / HOP;
		}
	}
	for (let f = 0; f < frames; f++) env[f] = Math.sqrt(env[f] / buffer.numberOfChannels);
	return { env, rate: buffer.sampleRate / HOP };
}

function mean(a: Float32Array, from: number, to: number): number {
	const lo = Math.max(0, from);
	const hi = Math.min(a.length, to);
	if (hi <= lo) return 0;
	let s = 0;
	for (let i = lo; i < hi; i++) s += a[i];
	return s / (hi - lo);
}

function onsets(env: Float32Array, rate: number): { at: number[]; strength: number[] } {
	const flux = new Float32Array(env.length);
	for (let i = 2; i < env.length; i++) flux[i] = Math.max(0, env[i] - env[i - 2]);
	const win = Math.round(rate * 0.4);
	const gap = Math.round(rate * 0.09);
	const at: number[] = [];
	const raw: number[] = [];
	let last = -gap;
	for (let i = 1; i < flux.length - 1; i++) {
		if (flux[i] < flux[i - 1] || flux[i] < flux[i + 1] || i - last < gap) continue;
		const m = mean(flux, i - win, i + win);
		if (flux[i] < m * 1.6 + 1e-4) continue;
		at.push(i / rate);
		raw.push(flux[i]);
		last = i;
	}
	const top = [...raw].sort((a, b) => a - b)[Math.floor(raw.length * 0.95)] || 1;
	return { at, strength: raw.map((r) => Math.min(1, r / top)) };
}

/** The biggest jump from three seconds of quiet into a second and a half of loud. */
function dropOf(env: Float32Array, rate: number, duration: number): number {
	const overall = mean(env, 0, env.length);
	const from = Math.round(rate * 3);
	const to = Math.round(rate * Math.min(duration * 0.6, 32));
	let best = from;
	let score = 0;
	for (let i = from; i < to; i += 4) {
		const ahead = mean(env, i, i + Math.round(rate * 1.5));
		if (ahead < overall * 0.8) continue;
		const ratio = ahead / (mean(env, i - Math.round(rate * 3), i) + 1e-4);
		if (ratio > score) {
			score = ratio;
			best = i;
		}
	}
	return best / rate;
}

export function analyse(buffer: AudioBuffer): Beats {
	const { env, rate } = envelope(buffer);
	const { at, strength } = onsets(env, rate);
	const drop = dropOf(env, rate, buffer.duration);
	const snapped = at.find((t) => Math.abs(t - drop) < 0.25);
	return { duration: buffer.duration, onsets: at, strength, drop: snapped ?? drop };
}

export async function decode(url: string): Promise<AudioBuffer> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url}: ${res.status}`);
	const ctx = new OfflineAudioContext(1, 1, 44100);
	return ctx.decodeAudioData(await res.arrayBuffer());
}
