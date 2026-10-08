import { YEAR_MAX, YEAR_MIN } from '$lib/borders';

type YearPlayerOptions = {
	/** Years per second. */
	speed?: number;
	/** Wrap back to the start (after a short hold on the last year) instead of stopping. */
	loop?: boolean;
	from?: number;
	to?: number;
};

/** How long a looping player rests on its last year before wrapping (ms). */
const LOOP_HOLD = 2200;

/**
 * Drives a border-timeline year forward in real time. The year itself lives
 * with the caller (a bound prop, a local $state), read and written through the
 * two callbacks, so the slider and the player never disagree.
 */
export class YearPlayer {
	playing = $state(false);
	#read: () => number;
	#write: (year: number) => void;
	#speed: number;
	#loop: boolean;
	#from: number;
	#to: number;
	#frame = 0;
	#hold: ReturnType<typeof setTimeout> | undefined;
	#last = 0;
	#exact = 0;

	constructor(read: () => number, write: (year: number) => void, opts: YearPlayerOptions = {}) {
		this.#read = read;
		this.#write = write;
		this.#speed = opts.speed ?? 32;
		this.#loop = opts.loop ?? false;
		this.#from = opts.from ?? YEAR_MIN;
		this.#to = opts.to ?? YEAR_MAX;
	}

	#tick = (now: number) => {
		if (!this.playing) return;
		this.#exact = Math.min(this.#to, this.#exact + ((now - this.#last) / 1000) * this.#speed);
		this.#last = now;
		this.#write(Math.round(this.#exact));
		if (this.#exact < this.#to) {
			this.#frame = requestAnimationFrame(this.#tick);
		} else if (this.#loop) {
			this.#hold = setTimeout(() => {
				this.#write(this.#from);
				this.#start();
			}, LOOP_HOLD);
		} else {
			this.playing = false;
		}
	};

	#start() {
		this.#exact = this.#read();
		this.#last = performance.now();
		this.#frame = requestAnimationFrame(this.#tick);
	}

	play() {
		if (this.playing) return;
		if (this.#read() >= this.#to) this.#write(this.#from);
		this.playing = true;
		this.#start();
	}

	stop() {
		this.playing = false;
		if (this.#frame) cancelAnimationFrame(this.#frame);
		clearTimeout(this.#hold);
		this.#frame = 0;
		this.#hold = undefined;
	}

	toggle() {
		if (this.playing) this.stop();
		else this.play();
	}
}
