/**
 * Leitmotifs — short composed note-patterns for characters and kingdoms,
 * played by a small dependency-free Web Audio ensemble.
 *
 * Design rule: an instantly recognizable hook, then a variation, then a return
 * (~8–16s sounding). Distinct opening interval, distinct rhythm cell, distinct
 * register/instrument. No busy grids.
 *
 * Musical languages:
 *  - 평조 (pyeongjo)     — sol-mode pentatonic: X, X+2, X+5, X+7, X+9
 *                          (e.g. G A C D E). Open, serene, "sunlit".
 *  - 계면조 (gyemyeonjo) — la-mode pentatonic: X, X+3, X+5, X+7, X+10
 *                          (e.g. E G A B D). Shadowed, plaintive, "moonlit".
 *  - 宫/徵 (Chinese)     — gongche-like pentatonic (C D E G A), marching
 *                          cadences, court drums and horns.
 *  - 陰旋 (in-sen)       — Japanese: X, X+1, X+5, X+7, X+8 (e.g. E F A B C).
 *                          The opening half-step is the eastern signature.
 *  - ヨ音階 (yo)         — Japanese folk: X, X+2, X+5, X+7, X+9 (D E G A B).
 *                          The taiko ostinato is the motif; melody sits on top.
 *  - Whistle / gods      — Western harmony, odd meters, pads. Not court-bound.
 *
 * Instruments (all synthesized, no samples):
 *  - gayageum  가야금 — bright silk-string pluck (tighter, with delay send).
 *  - geomungo  거문고 — deeper, darker pluck.
 *  - daegeum   대금  — breathy bamboo flute (also fue/nokan-ish for Yamato).
 *  - haegeum   해금  — bowed two-string fiddle.
 *  - nabal     나발  — long war-horn / cinematic brass.
 *  - bell      편종  — bronze bell; inharmonic partials (accent, not the bed).
 *  - whistle   — thin high human-whistle + sparkle (Gardener).
 *  - pad       — filtered analog-ish harmony bed.
 *  - saw       — detuned analog saw (leads, stabs, pop beds).
 *  - lead      — guitar/synth pluck into delay.
 *  - bass      — sub / synth-bass (808 drop on low notes, round walk above).
 *  - strings   — cinematic ensemble pad.
 * Percussion: kick, clap (snare hybrid), buk 북, janggu 장구, jing 징, taiko 太鼓.
 * Mix: dry + dotted-8th delay + short convolver, compressor, kick-ducked pads.
 *
 * `temp` is one or more tone-references (metadata + links only).
 * Never store or embed copyrighted audio or copyrighted sheet PDFs.
 * Play via a user-started YouTube embed. Notes: [midi | null, beats].
 * Client-only player. No audio during SSR.
 */

/** [MIDI note or null for a rest, duration in beats] */
export type MotifNote = readonly [number | null, number];

export type InstrumentId =
	| 'gayageum'
	| 'geomungo'
	| 'daegeum'
	| 'haegeum'
	| 'nabal'
	| 'bell'
	| 'whistle'
	| 'pad'
	| 'saw'
	| 'lead'
	| 'bass'
	| 'strings';
export type PercId = 'kick' | 'clap' | 'buk' | 'janggu' | 'jing' | 'taiko';
export type PercNote = readonly [PercId | null, number];

export interface MotifVoice {
	instrument: InstrumentId;
	notes: readonly MotifNote[];
	/** Relative loudness 0–1 (default 0.8). */
	gain?: number;
}

/**
 * Tone-reference only — never download or embed the audio or a copyrighted score.
 * `url` / `youtubeId` play via a user-started YouTube embed.
 * `sheetUrl` is an outbound link to a legal public or publisher page (never a ripped PDF).
 */
export interface MotifTemp {
	title: string;
	source: string;
	year?: number;
	url?: string;
	youtubeId?: string;
	sheetUrl?: string;
	note: string;
}

export interface Leitmotif {
	/** One-line description of the musical idea (shown as tooltip). */
	idea: string;
	bpm: number;
	/** Beats per bar — used for notation barlines. Omit for free rhythm. */
	meter?: number;
	/** 0–1: how far off-beat eighths lean toward a triplet swing. */
	swing?: number;
	/** Optional soft low drone (MIDI) held under the whole motif. */
	drone?: number;
	/** Melody instrument (default gayageum). */
	instrument?: InstrumentId;
	/** Primary melody — this line is also what the sheet music renders. */
	notes: readonly MotifNote[];
	/** Accompanying voices (bass lines, counter-lines). */
	voices?: readonly MotifVoice[];
	/** Percussion track. */
	perc?: readonly PercNote[];
	/** One or more tone-references (metadata + links only). */
	temp?: readonly MotifTemp[];
}

export const INSTRUMENT_LABELS: Record<InstrumentId, string> = {
	gayageum: 'Gayageum 가야금',
	geomungo: 'Geomungo 거문고',
	daegeum: 'Daegeum 대금',
	haegeum: 'Haegeum 해금',
	nabal: 'Nabal 나발',
	bell: 'Bronze bell 편종',
	whistle: 'Whistle',
	pad: 'Pad',
	saw: 'Saw',
	lead: 'Lead',
	bass: 'Bass',
	strings: 'Strings'
};

export const PERC_LABELS: Record<PercId, string> = {
	kick: 'Kick',
	clap: 'Clap',
	buk: 'Buk 북',
	janggu: 'Janggu 장구',
	jing: 'Jing 징',
	taiko: 'Taiko 太鼓'
};

/** Shared hymn contour: scale degrees 1–3–4–3–1. Same intervals in both modes. Two bars of 4. */
const HYMN: readonly [number, number, number, number, number] = [2, 1, 2, 1, 2];

/** Japanese yo-scale taiko cell — the drum pattern IS the motif (don don · don-don). */
const TAIKO_CELL: readonly PercNote[] = [
	['taiko', 0.5],
	['taiko', 0.5],
	[null, 0.5],
	['taiko', 0.25],
	['taiko', 0.25]
];
const TAIKO_OST: readonly PercNote[] = [...TAIKO_CELL, ...TAIKO_CELL];

/** Repeat a cell until it covers `beats` (melody, voice, or perc). */
function tile<T extends MotifNote | PercNote>(cell: readonly T[], beats: number): T[] {
	const out: T[] = [];
	if (!cell.length || beats <= 0) return out;
	let t = 0;
	let i = 0;
	while (t < beats - 1e-9) {
		const item = cell[i % cell.length];
		const use = Math.min(item[1], beats - t);
		out.push((use === item[1] ? item : ([item[0], use] as unknown as T)));
		t += use;
		i++;
	}
	return out;
}

/** Statement → variation → return. */
function aba(statement: readonly MotifNote[], variation: readonly MotifNote[]): MotifNote[] {
	return [...statement, ...variation, ...statement];
}

/** Repeat a cell once so a fast ABA still lands in the 8–16s window. */
function twice<T>(cell: readonly T[]): T[] {
	return [...cell, ...cell];
}

const TEMP_KILLMONGER: MotifTemp = {
	title: 'Killmonger',
	source: 'Ludwig Göransson — Black Panther (Original Score)',
	year: 2018,
	url: 'https://www.youtube.com/watch?v=yYCbSl3lGq0',
	youtubeId: 'yYCbSl3lGq0',
	note: 'Low-brass swagger — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_SEONDEOK: MotifTemp = {
	title: 'Main Title',
	source: 'Lee Yoon Jung — 선덕여왕 (Queen Seondeok) OST',
	year: 2009,
	url: 'https://www.youtube.com/watch?v=-1JCohwW0EA',
	youtubeId: '-1JCohwW0EA',
	note: 'Hymn-like dignity of the woman king — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_QINWANG: MotifTemp = {
	title: '秦王破阵乐 / The Prince of Qin Breaks Through the Ranks',
	source: 'Tang-era court-military suite (Gogen-fu / 五絃譜 tradition)',
	year: 620,
	url: 'https://www.youtube.com/watch?v=3LDdjqmgHp4',
	youtubeId: '3LDdjqmgHp4',
	sheetUrl: 'http://earlychinesemusic.blogspot.com/2021/03/tang-era-piece-qin-wang-po-zhen-yue.html',
	note: 'Marching Chinese court-military color — tone only; our notes are original. Sheet link is a public-domain source discussion (Gogen-fu), not a copyrighted edition.'
};

const TEMP_HERCULES: MotifTemp = {
	title: "I Won't Say (I'm in Love)",
	source: 'Alan Menken / David Zippel — Hercules (Walt Disney Records)',
	year: 1997,
	url: 'https://www.youtube.com/watch?v=ljPqUYkEXFQ',
	youtubeId: 'ljPqUYkEXFQ',
	note: 'Denial-leap love song — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_FELLOWSHIP: MotifTemp = {
	title: 'The Ring Goes South',
	source: 'Howard Shore — The Lord of the Rings: The Fellowship of the Ring',
	year: 2001,
	url: 'https://www.youtube.com/watch?v=jpJIdwB0R6g',
	youtubeId: 'jpJIdwB0R6g',
	note: 'Noble fellowship brass — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_ALWAYS: MotifTemp = {
	title: 'Always',
	source: 'Bon Jovi — Cross Road',
	year: 1994,
	url: 'https://www.youtube.com/watch?v=9BMwcO6_hyA',
	youtubeId: '9BMwcO6_hyA',
	note: 'Held-power ballad vow — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_BAEBAE: MotifTemp = {
	title: 'BAE BAE',
	source: 'BIGBANG — MADE (YG Entertainment)',
	year: 2015,
	url: 'https://www.youtube.com/watch?v=TKD03uPVD-Q',
	youtubeId: 'TKD03uPVD-Q',
	note: 'Bright swagger — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_GOODBOY: MotifTemp = {
	title: 'GOOD BOY',
	source: 'GD X TAEYANG — YG Entertainment',
	year: 2014,
	url: 'https://www.youtube.com/watch?v=1ZRb1we80kM',
	youtubeId: '1ZRb1we80kM',
	note: 'Sun-god bounce — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_SUN: MotifTemp = {
	title: 'Here Comes the Sun',
	source: 'The Beatles — Abbey Road (2019 mix)',
	year: 1969,
	url: 'https://www.youtube.com/watch?v=KQetemT1sWc',
	youtubeId: 'KQetemT1sWc',
	note: 'Bright arrival of the sun — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_GOODBYE: MotifTemp = {
	title: 'Goodbye',
	source: 'Wendy — 뷰티 인사이드 OST Part 6',
	year: 2018,
	url: 'https://www.youtube.com/watch?v=A-emJHnVtZ8',
	youtubeId: 'A-emJHnVtZ8',
	note: 'Sensual farewell — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_POMPEII: MotifTemp = {
	title: 'Pompeii',
	source: 'Bastille — Bad Blood',
	year: 2013,
	url: 'https://www.youtube.com/watch?v=F90Cw4l-8NY',
	youtubeId: 'F90Cw4l-8NY',
	note: 'Anthemic chant-rise — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_ARIANA: MotifTemp = {
	title: '7 rings',
	source: 'Ariana Grande — thank u, next',
	year: 2019,
	url: 'https://www.youtube.com/watch?v=QYh6mYIJG2Y',
	youtubeId: 'QYh6mYIJG2Y',
	note: 'Bright stacked pop-soul — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_PETERPAN: MotifTemp = {
	title: 'You Can Fly! You Can Fly! You Can Fly!',
	source: 'Sammy Fain / Sammy Cahn — Peter Pan (Walt Disney Records)',
	year: 1953,
	url: 'https://www.youtube.com/results?search_query=You+Can+Fly+Peter+Pan+official+Disney+Music',
	note: 'Disney whistle flight — tone only; our three-note hook is original. No licensed public sheet. Official upload not pinned; search Disney Music.'
};

const TEMP_TAMLA: MotifTemp = {
	title: '해녀노래 · 이어도사나',
	source: '국립국악원 — 제주민요 / 해녀 노젓는 소리 (국가무형유산)',
	url: 'https://archive.gugak.go.kr/portal/detail/searchVideoDetail?clipid=29853&recording_type_code=V&system_id=AV',
	sheetUrl: 'https://encykorea.aks.ac.kr/Article/E0062487',
	note: 'Traditional Jeju haenyeo rowing song — institutional recording; our notes are original. Sheet link is an encyclopedia article, not copyrighted pop notation.'
};

const TEMP_CHARIOTS: MotifTemp = {
	title: 'Chariots of Fire',
	source: 'Vangelis — Chariots of Fire (Polydor / Universal)',
	year: 1981,
	url: 'https://www.youtube.com/watch?v=8a-HfNE3EIo',
	youtubeId: '8a-HfNE3EIo',
	note: 'Stadium-heroic pulse — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_EARNED: MotifTemp = {
	title: 'Earned It',
	source: 'The Weeknd — Fifty Shades of Grey (Original Motion Picture Soundtrack)',
	year: 2014,
	url: 'https://www.youtube.com/watch?v=waU75jdUnYw',
	youtubeId: 'waU75jdUnYw',
	note: 'Slow sensual hush — tone only; our notes are original. No licensed public sheet.'
};

const TEMP_WISH: MotifTemp = {
	title: 'When You Wish Upon a Star',
	source: 'Leigh Harline / Ned Washington — Pinocchio (Walt Disney Records)',
	year: 1940,
	url: 'https://www.youtube.com/watch?v=QhwT2jn9qHQ',
	youtubeId: 'QhwT2jn9qHQ',
	note: 'Storybook chime — tone only; our notes are original. No licensed public sheet. Official Disney 100 performance pinned as the click-through.'
};

const TEMP_MELOMANCE: MotifTemp = {
	title: '사랑인가 봐 / Love, Maybe',
	source: 'MeloMance — 사내맞선 OST Special Track (FLEX M / Kakao)',
	year: 2022,
	url: 'https://www.youtube.com/watch?v=UoBsiQW23IY',
	youtubeId: 'UoBsiQW23IY',
	note: 'K-drama ballad warmth — tone only; our notes are original. No licensed public sheet.'
};

export const LEITMOTIFS: Record<string, Leitmotif> = {
	// ————————————————————————— character motifs —————————————————————————

	// Sunduk + Yushin share ONE hymn: degrees 1–3–4–3–1, rhythm 2+1+2+1+4.
	sunduk: {
		idea: 'E 계면조 hymn — Yushin’s contour in moonlight; statement, a higher turn, home.',
		bpm: 78,
		meter: 4,
		drone: 40,
		instrument: 'daegeum',
		notes: aba(
			[
				[64, HYMN[0]],
				[69, HYMN[1]],
				[71, HYMN[2]],
				[69, HYMN[3]],
				[64, HYMN[4]]
			],
			[
				[67, 1],
				[71, 1],
				[74, 2],
				[71, 1],
				[69, 1],
				[64, 2]
			]
		),
		voices: [
			{
				instrument: 'strings',
				gain: 0.32,
				notes: aba(
					[
						[64, HYMN[0]],
						[69, HYMN[1]],
						[71, HYMN[2]],
						[69, HYMN[3]],
						[64, HYMN[4]]
					],
					[
						[59, 2],
						[64, 2],
						[67, 2],
						[64, 2]
					]
				)
			},
			{
				instrument: 'bass',
				gain: 0.42,
				notes: tile(
					[
						[40, 2],
						[45, 2],
						[40, 4]
					],
					24
				)
			},
			{
				instrument: 'pad',
				gain: 0.34,
				notes: [[52, 24]]
			}
		],
		perc: tile(
			[
				['kick', 2],
				[null, 1],
				['clap', 1],
				['kick', 4]
			],
			24
		),
		temp: [TEMP_SEONDEOK]
	},

	bidam: {
		idea: 'E 계면조 — a dotted charm-rise that hangs off the tonic; the feint, then the hang, then the feint again.',
		bpm: 108,
		meter: 4,
		drone: 40,
		instrument: 'lead',
		notes: aba(
			twice([
				[64, 0.75],
				[67, 0.25],
				[71, 1],
				[69, 0.5],
				[62, 1.5]
			]),
			twice([
				[67, 0.75],
				[71, 0.25],
				[74, 1],
				[71, 0.5],
				[64, 1.5]
			])
		),
		voices: [
			{
				instrument: 'saw',
				gain: 0.32,
				notes: tile(
					[
						[52, 1],
						[55, 1],
						[59, 2]
					],
					24
				)
			},
			{
				instrument: 'bass',
				gain: 0.48,
				notes: tile(
					[
						[40, 2],
						[40, 2]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 1],
				[null, 0.5],
				['clap', 0.5],
				['clap', 2]
			],
			24
		)
	},

	yushin: {
		idea: 'G 평조 hymn — Sunduk’s contour in sunlight; iron strings, a higher turn, home.',
		bpm: 86,
		meter: 4,
		drone: 43,
		instrument: 'strings',
		notes: aba(
			[
				[55, HYMN[0]],
				[60, HYMN[1]],
				[62, HYMN[2]],
				[60, HYMN[3]],
				[55, HYMN[4]]
			],
			[
				[59, 1],
				[62, 1],
				[67, 2],
				[62, 1],
				[60, 1],
				[55, 2]
			]
		),
		voices: [
			{
				instrument: 'nabal',
				gain: 0.3,
				notes: tile(
					[
						[43, 4],
						[47, 4]
					],
					24
				)
			},
			{
				instrument: 'pad',
				gain: 0.36,
				notes: [[55, 24]]
			},
			{
				instrument: 'bass',
				gain: 0.4,
				notes: tile(
					[
						[43, 4],
						[43, 4]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 2],
				['clap', 2],
				['kick', 4]
			],
			24
		),
		temp: [TEMP_SEONDEOK]
	},

	// Keep the unanswered rising hook — only tempo and a whisper of backing.
	chunchu: {
		idea: 'A 계면조, swung — a rest, a feint, then a rising hook that never answers; the feint again, still no answer.',
		bpm: 128,
		meter: 4,
		swing: 0.4,
		drone: 45,
		notes: aba(
			twice([
				[null, 0.5],
				[69, 0.5],
				[72, 0.25],
				[69, 0.25],
				[76, 2.5]
			]),
			twice([
				[null, 0.5],
				[72, 0.5],
				[76, 0.25],
				[72, 0.25],
				[81, 1.5],
				[76, 1]
			])
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.4,
				notes: tile(
					[
						[45, 1],
						[null, 1],
						[45, 2]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 0.5],
				['clap', 0.5],
				['kick', 0.5],
				['clap', 0.5],
				['kick', 2]
			],
			24
		)
	},

	munhee: {
		idea: 'C 평조 — a homely step and one needle-stitch; the house that holds, then a higher stitch, home.',
		bpm: 104,
		meter: 3,
		drone: 36,
		notes: aba(
			[
				[60, 1],
				[62, 0.5],
				[65, 0.5],
				[67, 0.25],
				[69, 0.25],
				[60, 3.5]
			],
			[
				[65, 1],
				[67, 0.5],
				[69, 0.5],
				[72, 0.5],
				[69, 0.5],
				[65, 3]
			]
		),
		voices: [
			{
				instrument: 'pad',
				gain: 0.32,
				notes: [[48, 18]]
			},
			{
				instrument: 'bass',
				gain: 0.38,
				notes: tile(
					[
						[36, 2],
						[40, 1],
						[36, 3]
					],
					18
				)
			}
		],
		perc: tile(
			[
				['kick', 1],
				['clap', 1],
				['kick', 1],
				[null, 3]
			],
			18
		)
	},

	gyebek: {
		idea: 'D 계면조 — stoic counts stepping down to a plain held tonic; the count again, darker, home.',
		bpm: 76,
		meter: 4,
		drone: 38,
		instrument: 'strings',
		notes: aba(
			[
				[57, 1.5],
				[57, 0.5],
				[55, 1],
				[53, 1],
				[50, 4]
			],
			[
				[53, 1.5],
				[53, 0.5],
				[50, 1],
				[48, 1],
				[46, 4]
			]
		),
		voices: [
			{
				instrument: 'nabal',
				gain: 0.48,
				notes: [
					[null, 4],
					[50, 4],
					[null, 4],
					[46, 4],
					[null, 4],
					[50, 4]
				]
			},
			{
				instrument: 'pad',
				gain: 0.38,
				notes: [[50, 24]]
			},
			{
				instrument: 'bass',
				gain: 0.46,
				notes: tile(
					[
						[38, 4],
						[38, 4]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 2],
				['kick', 1],
				['clap', 1],
				['kick', 4]
			],
			24
		),
		temp: [TEMP_ALWAYS]
	},

	euija: {
		idea: 'C 평조 fanfare that darkens to B♭ and sinks — grandeur curdling; the rise, the stain, the fall.',
		bpm: 96,
		meter: 4,
		drone: 48,
		instrument: 'nabal',
		notes: aba(
			[
				[60, 0.5],
				[65, 0.5],
				[67, 1],
				[72, 1.5],
				[70, 0.5],
				[55, 4]
			],
			[
				[67, 0.5],
				[70, 0.5],
				[72, 1],
				[75, 1],
				[70, 1],
				[58, 4]
			]
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.52,
				notes: tile(
					[
						[36, 2],
						[36, 2],
						[31, 4]
					],
					24
				)
			},
			{
				instrument: 'pad',
				gain: 0.3,
				notes: [[48, 24]]
			}
		],
		perc: tile(
			[
				['kick', 1],
				['clap', 1],
				['kick', 2],
				['jing', 4]
			],
			24
		)
	},

	gesomun: {
		idea: 'E 계면조 — three hammer-strokes, a fourth, a battle-cry; the hammers again, the cry higher, home.',
		bpm: 148,
		meter: 4,
		drone: 40,
		instrument: 'nabal',
		notes: aba(
			twice([
				[52, 0.5],
				[52, 0.5],
				[52, 0.5],
				[57, 0.5],
				[64, 2]
			]),
			twice([
				[57, 0.5],
				[57, 0.5],
				[57, 0.5],
				[64, 0.5],
				[71, 2]
			])
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.52,
				notes: tile(
					[
						[40, 0.5],
						[40, 0.5],
						[40, 0.5],
						[45, 0.5],
						[40, 2]
					],
					24
				)
			},
			{
				instrument: 'strings',
				gain: 0.28,
				notes: [[52, 24]]
			}
		],
		perc: tile(
			[
				['kick', 0.5],
				['kick', 0.5],
				['kick', 0.5],
				['clap', 0.5],
				['kick', 2]
			],
			24
		),
		temp: [TEMP_FELLOWSHIP]
	},

	gotaso: {
		idea: 'D 평조, high — a skipping leap cut off mid-air; the leap again, a little further, silence.',
		bpm: 136,
		meter: 3,
		drone: 50,
		instrument: 'lead',
		notes: aba(
			twice([
				[74, 0.75],
				[76, 0.25],
				[81, 1],
				[null, 1]
			]),
			twice([
				[76, 0.75],
				[81, 0.25],
				[86, 1],
				[null, 1]
			])
		),
		voices: [
			{
				instrument: 'bell',
				gain: 0.32,
				notes: aba(
					twice([
						[69, 0.75],
						[71, 0.25],
						[74, 1],
						[null, 1]
					]),
					twice([
						[71, 0.75],
						[74, 0.25],
						[81, 1],
						[null, 1]
					])
				)
			},
			{
				instrument: 'pad',
				gain: 0.28,
				notes: [[62, 18]]
			}
		],
		perc: tile(
			[
				['clap', 1],
				['clap', 1],
				[null, 1]
			],
			18
		),
		temp: [TEMP_HERCULES]
	},

	kangrim: {
		idea: 'Low brass swagger — E–G–B♭ ostinato that lifts, personable, to B; the walk, a higher lift, the walk home.',
		bpm: 104,
		meter: 4,
		drone: 28,
		instrument: 'nabal',
		notes: aba(
			[
				[40, 1],
				[40, 0.5],
				[43, 0.5],
				[46, 2],
				[47, 4]
			],
			[
				[43, 1],
				[43, 0.5],
				[46, 0.5],
				[47, 2],
				[50, 4]
			]
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.58,
				notes: tile(
					[
						[28, 2],
						[28, 2],
						[31, 4]
					],
					24
				)
			},
			{
				instrument: 'saw',
				gain: 0.22,
				notes: tile(
					[
						[40, 2],
						[43, 2],
						[47, 4]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 1],
				[null, 0.5],
				['clap', 0.5],
				['kick', 2],
				['clap', 4]
			],
			24
		),
		temp: [TEMP_KILLMONGER]
	},

	haewonmek: {
		idea: 'Kangrim’s swagger, colder — the same ostinato drops to a low C; the walk, a colder drop, the walk home.',
		bpm: 100,
		meter: 4,
		drone: 28,
		instrument: 'nabal',
		notes: aba(
			[
				[40, 1],
				[40, 0.5],
				[43, 0.5],
				[46, 2],
				[36, 4]
			],
			[
				[43, 1],
				[43, 0.5],
				[46, 0.5],
				[40, 2],
				[31, 4]
			]
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.58,
				notes: tile(
					[
						[28, 2],
						[28, 2],
						[24, 4]
					],
					24
				)
			},
			{
				instrument: 'saw',
				gain: 0.2,
				notes: tile(
					[
						[40, 2],
						[43, 2],
						[36, 4]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 1],
				[null, 0.5],
				['clap', 0.5],
				['kick', 2],
				['clap', 4]
			],
			24
		),
		temp: [TEMP_KILLMONGER]
	},

	sara: {
		idea: 'Three-note whistle — F♯–D–B, a rest after the first; the flight, a higher echo, home.',
		bpm: 118,
		meter: 5,
		drone: 47,
		instrument: 'whistle',
		notes: aba(
			twice([
				[90, 0.5],
				[null, 0.5],
				[86, 0.75],
				[83, 3.25]
			]),
			twice([
				[93, 0.5],
				[null, 0.5],
				[90, 0.75],
				[86, 3.25]
			])
		),
		voices: [
			{
				instrument: 'pad',
				gain: 0.38,
				notes: [[59, 30]]
			},
			{
				instrument: 'bell',
				gain: 0.34,
				notes: tile(
					[
						[null, 1],
						[83, 4]
					],
					30
				)
			},
			{
				instrument: 'saw',
				gain: 0.18,
				notes: [[71, 30]]
			}
		],
		temp: [TEMP_PETERPAN]
	},

	samsin: {
		idea: 'Stacked pop-soul threes — F–A–C bubbling, a laughing high F; the bubble, a higher laugh, home.',
		bpm: 120,
		meter: 4,
		drone: 41,
		instrument: 'lead',
		notes: aba(
			twice([
				[65, 1 / 3],
				[69, 1 / 3],
				[72, 1 / 3],
				[77, 3]
			]),
			twice([
				[69, 1 / 3],
				[72, 1 / 3],
				[77, 1 / 3],
				[81, 3]
			])
		),
		voices: [
			{
				instrument: 'saw',
				gain: 0.36,
				notes: tile(
					[
						[53, 1],
						[57, 3]
					],
					24
				)
			},
			{
				instrument: 'bell',
				gain: 0.32,
				notes: aba(
					twice([
						[72, 1 / 3],
						[77, 1 / 3],
						[81, 1 / 3],
						[84, 3]
					]),
					twice([
						[77, 1 / 3],
						[81, 1 / 3],
						[84, 1 / 3],
						[89, 3]
					])
				)
			},
			{
				instrument: 'bass',
				gain: 0.44,
				notes: tile(
					[
						[41, 1],
						[45, 3]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['clap', 1 / 3],
				['clap', 1 / 3],
				['clap', 1 / 3],
				['kick', 3]
			],
			24
		),
		temp: [TEMP_ARIANA]
	},

	// Tang / Taizong — keep the Qin-Wang march contour; develop the ranks.
	taizong: {
		idea: 'C 宫 march — Tang’s battle-tune on solo horn; the ranks, a higher break, the cadence home.',
		bpm: 108,
		meter: 4,
		drone: 36,
		instrument: 'nabal',
		notes: aba(
			[
				[60, 0.5],
				[60, 0.5],
				[67, 1],
				[69, 0.5],
				[67, 0.5],
				[64, 1],
				[60, 4]
			],
			[
				[67, 0.5],
				[67, 0.5],
				[72, 1],
				[76, 0.5],
				[72, 0.5],
				[69, 1],
				[67, 4]
			]
		),
		voices: [
			{
				instrument: 'bell',
				gain: 0.22,
				notes: tile(
					[
						[72, 2],
						[null, 2],
						[76, 4]
					],
					24
				)
			},
			{
				instrument: 'bass',
				gain: 0.46,
				notes: tile(
					[
						[36, 2],
						[36, 2],
						[36, 4]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 1],
				['kick', 1],
				['clap', 2],
				['jing', 4]
			],
			24
		),
		temp: [TEMP_QINWANG]
	},

	gaozong: {
		idea: 'C 宫 — 商–角–徵 court fall with a 16th scoop; the heir’s fall, a higher scoop, home.',
		bpm: 96,
		meter: 4,
		drone: 48,
		instrument: 'lead',
		notes: aba(
			[
				[62, 0.25],
				[64, 0.75],
				[67, 1],
				[64, 0.5],
				[62, 0.5],
				[60, 3]
			],
			[
				[64, 0.25],
				[67, 0.75],
				[69, 1],
				[67, 0.5],
				[64, 0.5],
				[62, 3]
			]
		),
		voices: [
			{
				instrument: 'pad',
				gain: 0.34,
				notes: [[48, 18]]
			},
			{
				instrument: 'bass',
				gain: 0.4,
				notes: tile(
					[
						[48, 2],
						[52, 1],
						[48, 3]
					],
					18
				)
			}
		],
		perc: tile(
			[
				['kick', 1],
				['clap', 1],
				['jing', 1],
				['kick', 3]
			],
			18
		)
	},

	wuzetian: {
		idea: 'C 宫, high bells — a held 羽, a rest, then a still 徵; silence, a higher still, home.',
		bpm: 84,
		meter: 4,
		drone: 45,
		instrument: 'bell',
		notes: aba(
			[
				[69, 2],
				[null, 1],
				[76, 1],
				[72, 4]
			],
			[
				[72, 2],
				[null, 1],
				[81, 1],
				[76, 4]
			]
		),
		voices: [
			{
				instrument: 'pad',
				gain: 0.36,
				notes: [[45, 24]]
			},
			{
				instrument: 'nabal',
				gain: 0.18,
				notes: tile(
					[
						[null, 3],
						[60, 1],
						[57, 4]
					],
					24
				)
			}
		],
		perc: tile(
			[
				[null, 2],
				['jing', 2],
				['kick', 4]
			],
			24
		)
	},

	xuerengui: {
		idea: 'C 宫 — dotted 宫–徵 climb with a suona scoop; Stallion Mountain, a higher climb, home.',
		bpm: 120,
		meter: 4,
		drone: 43,
		instrument: 'nabal',
		notes: aba(
			[
				[55, 0.25],
				[60, 0.5],
				[62, 0.25],
				[67, 1],
				[72, 1],
				[64, 3]
			],
			[
				[60, 0.25],
				[67, 0.5],
				[69, 0.25],
				[72, 1],
				[79, 1],
				[67, 3]
			]
		),
		voices: [
			{
				instrument: 'bell',
				gain: 0.22,
				notes: tile(
					[
						[null, 1],
						[79, 1],
						[76, 4]
					],
					18
				)
			},
			{
				instrument: 'bass',
				gain: 0.44,
				notes: tile(
					[
						[43, 2],
						[43, 4]
					],
					18
				)
			}
		],
		perc: tile(
			[
				['kick', 0.75],
				['clap', 0.25],
				['kick', 1],
				['jing', 4]
			],
			18
		)
	},

	// Japan — yo scale + taiko cell. The drum IS the motif. No Chinese gongs.
	saimei: {
		idea: 'D ヨ音階 — fue over the taiko cell; a courtly arch, a higher arch, home. Not Tang.',
		bpm: 80,
		meter: 4,
		drone: 38,
		instrument: 'daegeum',
		notes: aba(
			[
				[62, 1],
				[64, 1],
				[67, 1],
				[69, 1],
				[64, 4]
			],
			[
				[67, 1],
				[69, 1],
				[71, 1],
				[74, 1],
				[69, 4]
			]
		),
		voices: [
			{
				instrument: 'pad',
				gain: 0.3,
				notes: [[50, 24]]
			},
			{
				instrument: 'bass',
				gain: 0.36,
				notes: tile(
					[
						[38, 4],
						[38, 4]
					],
					24
				)
			}
		],
		perc: tile(TAIKO_CELL, 24)
	},

	takutsu: {
		idea: 'D ヨ音階 — the same taiko cell, a warrior’s fue snap on A–B–D; the snap higher, home.',
		bpm: 112,
		meter: 4,
		drone: 38,
		instrument: 'daegeum',
		notes: aba(
			twice([
				[69, 0.5],
				[71, 0.5],
				[74, 1],
				[67, 2]
			]),
			twice([
				[71, 0.5],
				[74, 0.5],
				[79, 1],
				[69, 2]
			])
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.42,
				notes: tile(
					[
						[50, 1],
						[50, 1],
						[45, 2]
					],
					24
				)
			}
		],
		perc: tile(TAIKO_CELL, 24)
	},


	// ————————————————————————— kingdom themes —————————————————————————

	'nation-goguryeo': {
		idea: 'E 계면조 — a horn fifth, then the octave; iron sun in three notes.',
		bpm: 108,
		meter: 4,
		drone: 28,
		instrument: 'nabal',
		notes: aba(
			[[52, 2],
			[59, 2],
			[64, 4]
			],
			[[55, 2],
			[62, 2],
			[67, 4]
			]
		),
		voices: [
			{
				instrument: 'strings',
				gain: 0.38,
				notes: [
					[40, 2],
					[47, 2],
					[52, 4]
				]
			},
			{
				instrument: 'bass',
				gain: 0.5,
				notes: [
					[28, 2],
					[35, 2],
					[40, 4]
				]
			}
		],
		perc: [
			['kick', 2],
			['clap', 2],
			['kick', 4]
		]
	},

	'nation-baekje': {
		idea: 'C 평조, swung — a port-side skip that colors itself with B♭.',
		bpm: 126,
		meter: 4,
		swing: 0.55,
		drone: 36,
		instrument: 'lead',
		notes: aba(
			twice([
				[67, 0.5],
				[69, 0.5],
				[72, 1],
				[null, 0.5],
				[64, 0.5],
				[70, 1]
			]),
			twice([
				[70, 0.5],
				[72, 0.5],
				[75, 1],
				[null, 0.5],
				[67, 0.5],
				[73, 1]
			])
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.5,
				notes: tile(
					[
						[48, 1],
						[48, 1],
						[43, 2]
					],
					24
				)
			},
			{
				instrument: 'pad',
				gain: 0.26,
				notes: [[60, 24]]
			}
		],
		perc: tile(
			[
				['kick', 0.5],
				['clap', 0.5],
				['clap', 1],
				[null, 0.5],
				['clap', 0.5],
				['kick', 1]
			],
			24
		)
	},

	'nation-silla': {
		idea: 'E 계면조 — four aching notes, one breath, home. Still the slow hymn; no longer dragging.',
		bpm: 64,
		meter: 3,
		drone: 40,
		instrument: 'daegeum',
		notes: aba(
			[[64, 3],
			[67, 1],
			[69, 2],
			[64, 3]
			],
			[[67, 3],
			[70, 1],
			[72, 2],
			[67, 3]
			]
		),
		voices: [
			{
				instrument: 'strings',
				gain: 0.36,
				notes: [
					[40, 3],
					[43, 3],
					[40, 3]
				]
			},
			{
				instrument: 'pad',
				gain: 0.34,
				notes: [[52, 9]]
			}
		],
		perc: [
			['kick', 3],
			[null, 1],
			['clap', 2],
			['kick', 3]
		]
	},

	'nation-joseon': {
		idea: 'G 평조 mountain — open fifth, a step of 商, then the high G; sandalwood mandate.',
		bpm: 76,
		meter: 4,
		drone: 31,
		instrument: 'nabal',
		notes: aba(
			[[55, 2],
			[62, 1],
			[64, 1],
			[67, 4]
			],
			[[58, 2],
			[65, 1],
			[67, 1],
			[70, 4]
			]
		),
		voices: [
			{
				instrument: 'bell',
				gain: 0.28,
				notes: [
					[null, 2],
					[74, 2],
					[79, 4]
				]
			},
			{
				instrument: 'strings',
				gain: 0.4,
				notes: [
					[43, 4],
					[47, 4]
				]
			},
			{
				instrument: 'bass',
				gain: 0.42,
				notes: [
					[31, 4],
					[31, 4]
				]
			}
		],
		perc: [
			['kick', 2],
			['clap', 2],
			['kick', 4]
		]
	},

	'nation-tang': {
		idea: 'C 宫 march — C–C–G, then a Chinese 羽–徵–角–宫 cadence; gongs on the ranks.',
		bpm: 104,
		meter: 4,
		drone: 36,
		instrument: 'nabal',
		notes: aba(
			[[60, 0.5],
			[60, 0.5],
			[67, 1],
			[69, 0.5],
			[67, 0.5],
			[64, 1],
			[60, 4]
			],
			[[63, 0.5],
			[63, 0.5],
			[70, 1],
			[72, 0.5],
			[70, 0.5],
			[67, 1],
			[63, 4]
			]
		),
		voices: [
			{
				instrument: 'bell',
				gain: 0.28,
				notes: [
					[72, 2],
					[null, 2],
					[76, 1],
					[72, 3]
				]
			},
			{
				instrument: 'bass',
				gain: 0.48,
				notes: [
					[36, 2],
					[36, 2],
					[36, 4]
				]
			}
		],
		perc: [
			['kick', 2],
			['kick', 1],
			['clap', 1],
			['jing', 4]
		],
		temp: [TEMP_QINWANG]
	},

	'nation-yamato': {
		idea: 'D ヨ音階 — the taiko cell is the hook; fue sits on D–E–G–A–B. Not Tang.',
		bpm: 96,
		meter: 4,
		drone: 38,
		instrument: 'daegeum',
		notes: aba(
			twice([
				[62, 0.5],
				[64, 0.5],
				[67, 1],
				[69, 1],
				[71, 1]
			]),
			twice([
				[65, 0.5],
				[67, 0.5],
				[70, 1],
				[72, 1],
				[74, 1]
			])
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.4,
				notes: tile(
					[
						[50, 2],
						[50, 2]
					],
					24
				)
			},
			{
				instrument: 'pad',
				gain: 0.26,
				notes: [[50, 24]]
			}
		],
		perc: tile(TAIKO_CELL, 24)
	},

	'nation-gaya': {
		idea: 'D 평조 folk — a river step and a dotted forge-landing.',
		bpm: 110,
		meter: 3,
		drone: 38,
		instrument: 'lead',
		notes: aba(
			twice([
				[62, 1],
				[64, 0.5],
				[67, 0.5],
				[69, 1]
			]),
			twice([
				[65, 1],
				[67, 0.5],
				[70, 0.5],
				[72, 1]
			])
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.44,
				notes: tile(
					[
						[38, 1],
						[38, 1],
						[43, 1]
					],
					18
				)
			}
		],
		perc: tile(
			[
				['kick', 1],
				[null, 0.5],
				['clap', 0.5],
				['kick', 1]
			],
			18
		)
	},

	'nation-tamla': {
		idea: 'G 평조 chime-wave — up the fifth, crest, settle like tide.',
		bpm: 116,
		meter: 3,
		drone: 43,
		instrument: 'lead',
		notes: aba(
			twice([
				[67, 0.5],
				[72, 0.5],
				[76, 1],
				[74, 0.5],
				[72, 0.5]
			]),
			twice([
				[70, 0.5],
				[75, 0.5],
				[79, 1],
				[77, 0.5],
				[75, 0.5]
			])
		),
		voices: [
			{
				instrument: 'bell',
				gain: 0.24,
				notes: tile(
					[
						[null, 1],
						[79, 1],
						[76, 1]
					],
					18
				)
			},
			{
				instrument: 'pad',
				gain: 0.32,
				notes: [[55, 18]]
			},
			{
				instrument: 'bass',
				gain: 0.4,
				notes: tile(
					[
						[43, 1],
						[47, 1],
						[50, 1]
					],
					18
				)
			}
		],
		perc: tile(
			[
				['kick', 0.5],
				['clap', 0.5],
				['clap', 1],
				['kick', 1]
			],
			18
		),
		temp: [TEMP_TAMLA]
	},

	// ————————————————————————— founders (older, simpler kingdom hooks) —————————————————————————

	hyukgose: {
		idea: 'Silla family, older — E 계면조 1–3–1; the egg before the hymn.',
		bpm: 70,
		meter: 3,
		drone: 40,
		instrument: 'daegeum',
		notes: aba(
			[[64, 2],
			[67, 1],
			[64, 3]
			],
			[[67, 2],
			[70, 1],
			[67, 3]
			]
		),
		voices: [
			{
				instrument: 'strings',
				gain: 0.34,
				notes: [
					[40, 3],
					[40, 3]
				]
			},
			{
				instrument: 'pad',
				gain: 0.3,
				notes: [[52, 6]]
			}
		],
		perc: [
			['kick', 3],
			['kick', 3]
		]
	},

	alyoung: {
		idea: 'Hyukgosé’s contour, one step further — E–G–A–G; the dragon-born echo.',
		bpm: 74,
		meter: 3,
		drone: 40,
		instrument: 'daegeum',
		notes: aba(
			[[64, 1],
			[67, 1],
			[69, 1],
			[67, 3]
			],
			[[67, 1],
			[70, 1],
			[72, 1],
			[70, 3]
			]
		),
		voices: [
			{
				instrument: 'lead',
				gain: 0.32,
				notes: [
					[52, 2],
					[55, 4]
				]
			},
			{
				instrument: 'pad',
				gain: 0.28,
				notes: [[52, 6]]
			}
		],
		perc: [
			['clap', 1],
			['clap', 2],
			['kick', 3]
		]
	},

	jumong: {
		idea: 'Goguryeo family, older — the iron fifth, then home; the octave comes later.',
		bpm: 100,
		meter: 4,
		drone: 28,
		instrument: 'nabal',
		notes: aba(
			[[52, 2],
			[59, 2],
			[52, 4]
			],
			[[55, 2],
			[62, 2],
			[55, 4]
			]
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.5,
				notes: [
					[28, 4],
					[28, 4]
				]
			},
			{
				instrument: 'strings',
				gain: 0.3,
				notes: [[40, 8]]
			}
		],
		perc: [
			['kick', 2],
			['kick', 2],
			['clap', 4]
		]
	},

	onjo: {
		idea: 'Baekje family, archaic — C–D–F–G, no swing, no borrowed B♭.',
		bpm: 100,
		meter: 4,
		drone: 36,
		instrument: 'lead',
		notes: aba(
			twice([
				[60, 1],
				[62, 1],
				[65, 1],
				[67, 1]
			]),
			twice([
				[63, 1],
				[65, 1],
				[68, 1],
				[70, 1]
			])
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.44,
				notes: tile(
					[
						[36, 2],
						[43, 2]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 1],
				['clap', 1],
				['clap', 1],
				['kick', 1]
			],
			24
		)
	},

	suro: {
		idea: 'Gaya family, older — a folk fourth and the river-step; the forge comes later.',
		bpm: 104,
		meter: 3,
		drone: 38,
		instrument: 'lead',
		notes: aba(
			twice([
				[62, 1],
				[67, 1],
				[69, 1]
			]),
			twice([
				[65, 1],
				[70, 1],
				[72, 1]
			])
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.44,
				notes: tile(
					[
						[38, 2],
						[43, 1]
					],
					18
				)
			}
		],
		perc: tile(
			[
				['kick', 1],
				[null, 0.5],
				['clap', 0.5],
				['kick', 1]
			],
			18
		)
	},

	dangun: {
		idea: 'Joseon family, mythic — G–D–G, mountain slower than the mandate.',
		bpm: 68,
		meter: 4,
		drone: 31,
		instrument: 'nabal',
		notes: aba(
			[[55, 2],
			[62, 2],
			[55, 4]
			],
			[[58, 2],
			[65, 2],
			[58, 4]
			]
		),
		voices: [
			{
				instrument: 'bell',
				gain: 0.32,
				notes: [
					[null, 2],
					[67, 2],
					[74, 4]
				]
			},
			{
				instrument: 'strings',
				gain: 0.38,
				notes: [[43, 8]]
			}
		],
		perc: [
			['kick', 4],
			['kick', 4]
		]
	},

	// ————————————————————————— gods (unearthly; Western harmony allowed) —————————————————————————

	hwanin: {
		idea: 'Creator’s seventh — a high C, a rest in 7, then the octave. Not of any court.',
		bpm: 80,
		meter: 7,
		drone: 36,
		instrument: 'bell',
		notes: aba(
			[[72, 3],
			[null, 1],
			[84, 3]
			],
			[[75, 3],
			[null, 1],
			[87, 3]
			]
		),
		voices: [
			{
				instrument: 'saw',
				gain: 0.42,
				notes: [[48, 7]]
			},
			{
				instrument: 'pad',
				gain: 0.32,
				notes: [[36, 7]]
			}
		]
	},

	daebyeol: {
		idea: 'Big Star — a low major-minor stain; B–D–F, then the floor.',
		bpm: 90,
		meter: 5,
		drone: 23,
		instrument: 'nabal',
		notes: aba(
			[[47, 1],
			[50, 1],
			[53, 1],
			[35, 2]
			],
			[[50, 1],
			[53, 1],
			[56, 1],
			[38, 2]
			]
		),
		voices: [
			{
				instrument: 'saw',
				gain: 0.4,
				notes: [[35, 5]]
			},
			{
				instrument: 'bass',
				gain: 0.5,
				notes: [[23, 5]]
			},
			{
				instrument: 'bell',
				gain: 0.22,
				notes: [
					[null, 3],
					[59, 2]
				]
			}
		],
		perc: [
			['kick', 1],
			[null, 1],
			['kick', 1],
			['clap', 2]
		]
	},

	sobyeol: {
		idea: 'Little Star — Big Star inverted high; B–D–F♯, then a bright leap.',
		bpm: 110,
		meter: 5,
		drone: 47,
		instrument: 'bell',
		notes: aba(
			[[71, 1],
			[74, 1],
			[78, 1],
			[83, 2]
			],
			[[74, 1],
			[77, 1],
			[81, 1],
			[86, 2]
			]
		),
		voices: [
			{
				instrument: 'saw',
				gain: 0.34,
				notes: [[47, 5]]
			},
			{
				instrument: 'whistle',
				gain: 0.3,
				notes: [
					[null, 3],
					[83, 2]
				]
			}
		],
		perc: [
			['clap', 1],
			['clap', 1],
			['clap', 1],
			[null, 2]
		]
	},

	haemosu: {
		idea: 'Sun-god swagger — E–G♯–B, a rest, then the high E. Bright, not Korean-court.',
		bpm: 128,
		meter: 4,
		drone: 40,
		instrument: 'saw',
		notes: aba(
			twice([
				[64, 0.5],
				[68, 0.5],
				[71, 1],
				[null, 0.5],
				[76, 1.5]
			]),
			twice([
				[67, 0.5],
				[71, 0.5],
				[74, 1],
				[null, 0.5],
				[79, 1.5]
			])
		),
		voices: [
			{
				instrument: 'bass',
				gain: 0.52,
				notes: tile(
					[
						[40, 2],
						[44, 2]
					],
					24
				)
			},
			{
				instrument: 'whistle',
				gain: 0.26,
				notes: tile(
					[
						[null, 2],
						[76, 2]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 0.5],
				['clap', 0.5],
				['kick', 1],
				[null, 0.5],
				['clap', 1.5]
			],
			24
		),
		temp: [TEMP_BAEBAE, TEMP_GOODBOY, TEMP_SUN]
	},

	ibiga: {
		idea: 'Sky anthem — A–C–E, then a sensual leap to A; 6/8 sway.',
		bpm: 118,
		meter: 6,
		drone: 45,
		instrument: 'saw',
		notes: aba(
			[[69, 1],
			[72, 1],
			[76, 2],
			[81, 2]
			],
			[[72, 1],
			[75, 1],
			[79, 2],
			[84, 2]
			]
		),
		voices: [
			{
				instrument: 'pad',
				gain: 0.4,
				notes: [[45, 6]]
			},
			{
				instrument: 'bass',
				gain: 0.44,
				notes: [
					[45, 2],
					[48, 2],
					[52, 2]
				]
			},
			{
				instrument: 'lead',
				gain: 0.28,
				notes: [
					[null, 2],
					[64, 2],
					[69, 2]
				]
			}
		],
		perc: [
			['kick', 1],
			['clap', 1],
			['kick', 2],
			['clap', 2]
		],
		temp: [TEMP_GOODBYE, TEMP_POMPEII]
	},

	yumla: {
		idea: 'Judgment pun — D–E–A–D, then the door closes darker. Severe, not a march.',
		bpm: 72,
		meter: 4,
		drone: 26,
		instrument: 'bell',
		notes: [
			[62, 1.5],
			[64, 1.5],
			[69, 1.5],
			[50, 1.5],
			[50, 1],
			[52, 1],
			[57, 1],
			[38, 3],
			[62, 1],
			[64, 1],
			[69, 1],
			[50, 5]
		],
		voices: [
			{
				instrument: 'saw',
				gain: 0.36,
				notes: [[26, 20]]
			},
			{
				instrument: 'nabal',
				gain: 0.28,
				notes: [
					[null, 6],
					[38, 6],
					[null, 4],
					[26, 4]
				]
			}
		],
		perc: [
			['kick', 1.5],
			['jing', 1.5],
			['kick', 1.5],
			['jing', 1.5],
			['kick', 4],
			['jing', 2],
			['kick', 8]
		]
	},
	habek: {
		idea: 'River god — D–E–G–A–G, a 5-beat current that never quite cadences.',
		bpm: 88,
		meter: 5,
		drone: 38,
		instrument: 'lead',
		notes: aba(
			[[62, 1],
			[64, 1],
			[67, 1],
			[69, 1],
			[67, 1]
			],
			[[65, 1],
			[67, 1],
			[70, 1],
			[72, 1],
			[70, 1]
			]
		),
		voices: [
			{
				instrument: 'pad',
				gain: 0.36,
				notes: [[38, 5]]
			},
			{
				instrument: 'bass',
				gain: 0.38,
				notes: [[38, 5]]
			}
		],
		perc: [
			['kick', 1],
			[null, 1],
			['clap', 1],
			['clap', 1],
			['kick', 1]
		]
	},

	yuhwa: {
		idea: 'Moon — A 계면조 high bells; A–C–E, then home. River-daughter, not the sun.',
		bpm: 84,
		meter: 4,
		drone: 45,
		instrument: 'bell',
		notes: aba(
			[[69, 1],
			[72, 1],
			[76, 2],
			[69, 4]
			],
			[[72, 1],
			[75, 1],
			[79, 2],
			[72, 4]
			]
		),
		voices: [
			{
				instrument: 'saw',
				gain: 0.32,
				notes: [[45, 8]]
			},
			{
				instrument: 'lead',
				gain: 0.28,
				notes: [
					[null, 2],
					[64, 2],
					[69, 4]
				]
			}
		],
		perc: [
			[null, 2],
			['clap', 2],
			['kick', 4]
		]
	},

	// ————————————————————————— concepts (abstract registers) —————————————————————————

	hwarang: {
		idea: 'Heroic sports anthem — a dotted G–D climb, a stadium lift, the climb home. Jangsi and steel.',
		bpm: 118,
		meter: 4,
		drone: 43,
		instrument: 'nabal',
		notes: aba(
			[
				[55, 0.5],
				[62, 0.5],
				[67, 1],
				[69, 0.5],
				[71, 0.5],
				[74, 1],
				[55, 0.5],
				[62, 0.5],
				[67, 1],
				[69, 0.5],
				[71, 0.5],
				[74, 1]
			],
			[
				[62, 0.5],
				[67, 0.5],
				[71, 1],
				[74, 0.5],
				[76, 0.5],
				[79, 1],
				[62, 0.5],
				[67, 0.5],
				[71, 1],
				[74, 0.5],
				[76, 0.5],
				[79, 1]
			]
		),
		voices: [
			{
				instrument: 'strings',
				gain: 0.36,
				notes: tile(
					[
						[43, 2],
						[47, 2]
					],
					24
				)
			},
			{
				instrument: 'bass',
				gain: 0.48,
				notes: tile(
					[
						[31, 2],
						[31, 2]
					],
					24
				)
			},
			{
				instrument: 'pad',
				gain: 0.28,
				notes: [[55, 24]]
			}
		],
		perc: tile(
			[
				['kick', 0.5],
				[null, 0.5],
				['clap', 0.5],
				['clap', 0.5],
				['kick', 2]
			],
			24
		),
		temp: [TEMP_CHARIOTS]
	},

	steam_cavern: {
		idea: 'Mysterious sensual steam — a chromatic hush, a closer breath, the hush again. Not a court mode.',
		bpm: 72,
		meter: 4,
		drone: 45,
		instrument: 'haegeum',
		notes: aba(
			[
				[57, 2],
				[60, 1],
				[58, 1],
				[64, 2],
				[62, 2]
			],
			[
				[60, 2],
				[64, 1],
				[62, 1],
				[69, 2],
				[65, 2]
			]
		),
		voices: [
			{
				instrument: 'pad',
				gain: 0.42,
				notes: [[45, 24]]
			},
			{
				instrument: 'whistle',
				gain: 0.18,
				notes: [
					[null, 6],
					[81, 2],
					[null, 8],
					[76, 8]
				]
			},
			{
				instrument: 'bass',
				gain: 0.4,
				notes: tile(
					[
						[33, 4],
						[36, 4]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 2],
				[null, 1],
				['clap', 1],
				['kick', 4]
			],
			24
		),
		temp: [TEMP_EARNED]
	},

	four_divisions: {
		idea: 'Epic lofty brass — a fellowship fifth, a higher call, the fifth home. Heaven above the Three Realms.',
		bpm: 92,
		meter: 4,
		drone: 38,
		instrument: 'nabal',
		notes: aba(
			[
				[50, 2],
				[57, 2],
				[62, 2],
				[64, 2]
			],
			[
				[57, 2],
				[62, 1],
				[64, 1],
				[69, 2],
				[67, 2]
			]
		),
		voices: [
			{
				instrument: 'strings',
				gain: 0.4,
				notes: tile(
					[
						[38, 4],
						[45, 4]
					],
					24
				)
			},
			{
				instrument: 'pad',
				gain: 0.32,
				notes: [[50, 24]]
			},
			{
				instrument: 'bell',
				gain: 0.2,
				notes: [
					[null, 6],
					[74, 2],
					[null, 8],
					[81, 8]
				]
			},
			{
				instrument: 'bass',
				gain: 0.46,
				notes: tile(
					[
						[26, 4],
						[33, 4]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 2],
				['clap', 2],
				['kick', 4]
			],
			24
		),
		temp: [TEMP_FELLOWSHIP]
	},

	fairytales: {
		idea: 'Whimsical Disney chime — C–E–G skips, a magic sparkle, the skip home. Picture-book cruel.',
		bpm: 126,
		meter: 3,
		drone: 48,
		instrument: 'bell',
		notes: aba(
			[
				[72, 0.5],
				[76, 0.5],
				[79, 1],
				[81, 0.5],
				[79, 0.5],
				[72, 0.5],
				[76, 0.5],
				[79, 1],
				[81, 0.5],
				[79, 0.5]
			],
			[
				[76, 0.5],
				[79, 0.5],
				[84, 1],
				[86, 0.5],
				[84, 0.5],
				[76, 0.5],
				[79, 0.5],
				[84, 1],
				[86, 0.5],
				[84, 0.5]
			]
		),
		voices: [
			{
				instrument: 'lead',
				gain: 0.34,
				notes: aba(
					[
						[60, 1],
						[64, 1],
						[67, 1],
						[60, 1],
						[64, 1],
						[67, 1]
					],
					[
						[64, 1],
						[67, 1],
						[72, 1],
						[64, 1],
						[67, 1],
						[72, 1]
					]
				)
			},
			{
				instrument: 'whistle',
				gain: 0.22,
				notes: [
					[null, 2],
					[84, 1],
					[null, 3],
					[88, 3],
					[null, 4],
					[91, 2],
					[null, 3]
				]
			},
			{
				instrument: 'pad',
				gain: 0.28,
				notes: [[48, 18]]
			}
		],
		perc: tile(
			[
				['clap', 1],
				['clap', 0.5],
				['clap', 0.5],
				['kick', 1]
			],
			18
		),
		temp: [TEMP_PETERPAN, TEMP_WISH]
	},

	romance: {
		idea: 'K-drama ballad — a tender rise to the sixth, a higher almost-kiss, the sixth held home.',
		bpm: 76,
		meter: 4,
		drone: 45,
		instrument: 'lead',
		notes: aba(
			[
				[64, 2],
				[67, 1],
				[69, 1],
				[71, 2],
				[69, 2]
			],
			[
				[67, 2],
				[69, 1],
				[71, 1],
				[76, 2],
				[72, 2]
			]
		),
		voices: [
			{
				instrument: 'pad',
				gain: 0.4,
				notes: [[45, 24]]
			},
			{
				instrument: 'strings',
				gain: 0.28,
				notes: [
					[52, 8],
					[55, 8],
					[52, 8]
				]
			},
			{
				instrument: 'bass',
				gain: 0.38,
				notes: tile(
					[
						[33, 4],
						[36, 4]
					],
					24
				)
			}
		],
		perc: tile(
			[
				['kick', 2],
				[null, 1],
				['clap', 1],
				['kick', 4]
			],
			24
		),
		temp: [TEMP_MELOMANCE]
	},

};

export function leitmotifOf(id: string): Leitmotif | undefined {
	return LEITMOTIFS[id];
}

/** True when this entry has a composed leitmotif. */
export function hasLeitmotif(id: string): boolean {
	return id in LEITMOTIFS;
}

/** Tone-references on a motif (empty when none). */
export function tempsOf(motif: Leitmotif | undefined): readonly MotifTemp[] {
	return motif?.temp ?? [];
}

/** True when this entry has one or more tone-references (metadata only). */
export function hasTempTrack(id: string): boolean {
	return tempsOf(LEITMOTIFS[id]).length > 0;
}

function parseYoutubeId(url: string | undefined): string | undefined {
	if (!url) return undefined;
	try {
		const parsed = new URL(url);
		if (parsed.hostname === 'youtu.be') {
			const id = parsed.pathname.replace(/^\//, '').split('/')[0];
			return id || undefined;
		}
		if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtube-nocookie.com')) {
			if (parsed.pathname.startsWith('/embed/')) {
				return parsed.pathname.split('/')[2] || undefined;
			}
			return parsed.searchParams.get('v') ?? undefined;
		}
	} catch {
		/* ignore malformed URLs */
	}
	return undefined;
}

/** Extract a YouTube id from a temp ref or a watch / youtu.be / embed URL. */
export function youtubeIdOf(ref: MotifTemp | string | undefined): string | undefined {
	if (!ref) return undefined;
	if (typeof ref === 'object') return ref.youtubeId ?? parseYoutubeId(ref.url);
	return parseYoutubeId(ref);
}

/** Drone, extra voices, and percussion labels for the music page. */
export function backingLabels(motif: Leitmotif): string[] {
	const out: string[] = [];
	if (motif.drone != null) out.push('Drone');
	for (const voice of motif.voices ?? []) out.push(INSTRUMENT_LABELS[voice.instrument]);
	if (motif.perc) {
		const seen = new Set<PercId>();
		for (const [hit] of motif.perc) {
			if (hit && !seen.has(hit)) {
				seen.add(hit);
				out.push(PERC_LABELS[hit]);
			}
		}
	}
	return out;
}

function totalBeats(notes: readonly (readonly [unknown, number])[]): number {
	return notes.reduce((sum, [, d]) => sum + d, 0);
}

/** Total playback length in ms (including delay/reverb tail). */
export function motifDurationMs(motif: Leitmotif): number {
	let beats = totalBeats(motif.notes);
	for (const v of motif.voices ?? []) beats = Math.max(beats, totalBeats(v.notes));
	if (motif.perc) beats = Math.max(beats, totalBeats(motif.perc));
	const tail = (motif.instrument ?? 'gayageum') === 'bell' ? 2800 : 1900;
	return (beats * 60000) / motif.bpm + tail;
}

// ————————————————————————— Web Audio ensemble —————————————————————————

let ctx: AudioContext | null = null;
let currentBus: GainNode | null = null;
let currentGraph: AudioNode[] = [];
let noiseBuf: AudioBuffer | null = null;
let impulseBuf: AudioBuffer | null = null;

interface MixBus {
	master: GainNode;
	lead: GainNode;
	pad: GainNode;
	drums: GainNode;
	duck: GainNode;
}

function midiHz(midi: number): number {
	return 440 * 2 ** ((midi - 69) / 12);
}

function ensureContext(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (!ctx) {
		const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!Ctor) return null;
		ctx = new Ctor();
	}
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

/** Shared 1s white-noise buffer (breath, drum bodies). */
function noise(ac: AudioContext): AudioBuffer {
	if (!noiseBuf || noiseBuf.sampleRate !== ac.sampleRate) {
		noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
		const data = noiseBuf.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
	}
	return noiseBuf;
}

function noiseSource(ac: AudioContext, at: number, stopAt: number): AudioBufferSourceNode {
	const src = new AudioBufferSourceNode(ac, { buffer: noise(ac), loop: true });
	src.start(at);
	src.stop(stopAt);
	return src;
}

/** Short stereo noise burst — cheap room without a sampled IR. */
function impulse(ac: AudioContext): AudioBuffer {
	if (impulseBuf && impulseBuf.sampleRate === ac.sampleRate) return impulseBuf;
	const seconds = 1.35;
	const len = Math.floor(ac.sampleRate * seconds);
	impulseBuf = ac.createBuffer(2, len, ac.sampleRate);
	for (let c = 0; c < 2; c++) {
		const data = impulseBuf.getChannelData(c);
		for (let i = 0; i < len; i++) {
			data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.4;
		}
	}
	return impulseBuf;
}

function duckAt(param: AudioParam, at: number): void {
	try {
		param.cancelAndHoldAtTime(at);
	} catch {
		param.setValueAtTime(param.value, at);
	}
	param.linearRampToValueAtTime(0.55, at + 0.016);
	param.linearRampToValueAtTime(1, at + 0.26);
}

function createMix(ac: AudioContext, bpm: number): MixBus {
	const master = new GainNode(ac, { gain: 0.86 });
	const comp = new DynamicsCompressorNode(ac, {
		threshold: -14,
		knee: 12,
		ratio: 2.6,
		attack: 0.004,
		release: 0.14
	});
	comp.connect(master);
	master.connect(ac.destination);

	const dry = new GainNode(ac, { gain: 0.84 });
	const wet = new GainNode(ac, { gain: 0.3 });
	dry.connect(comp);
	wet.connect(comp);

	const delayTime = Math.min(0.82, (60 / bpm) * 0.75);
	const delay = ac.createDelay(1.2);
	delay.delayTime.value = delayTime;
	const delayHp = new BiquadFilterNode(ac, { type: 'highpass', frequency: 200 });
	const delayLp = new BiquadFilterNode(ac, { type: 'lowpass', frequency: 3800 });
	const delayFb = new GainNode(ac, { gain: 0.32 });
	const delaySend = new GainNode(ac, { gain: 0.3 });
	delaySend.connect(delay);
	delay.connect(delayHp).connect(delayLp).connect(delayFb).connect(delay);
	delayLp.connect(wet);

	const conv = ac.createConvolver();
	conv.buffer = impulse(ac);
	const revHp = new BiquadFilterNode(ac, { type: 'highpass', frequency: 240 });
	const revSend = new GainNode(ac, { gain: 0.24 });
	revSend.connect(revHp).connect(conv).connect(wet);

	const lead = new GainNode(ac, { gain: 1 });
	lead.connect(dry);
	lead.connect(delaySend);
	lead.connect(revSend);

	const duck = new GainNode(ac, { gain: 1 });
	const pad = new GainNode(ac, { gain: 1 });
	pad.connect(duck);
	duck.connect(dry);
	duck.connect(delaySend);
	duck.connect(revSend);

	const drums = new GainNode(ac, { gain: 1 });
	const drumRev = new GainNode(ac, { gain: 0.1 });
	drums.connect(dry);
	drums.connect(drumRev).connect(revHp);

	currentGraph = [
		master,
		comp,
		dry,
		wet,
		delay,
		delayHp,
		delayLp,
		delayFb,
		delaySend,
		conv,
		revHp,
		revSend,
		lead,
		duck,
		pad,
		drums,
		drumRev
	];

	return { master, lead, pad, drums, duck };
}

function destFor(mix: MixBus, instrument: InstrumentId, isLead: boolean): AudioNode {
	if (isLead) return mix.lead;
	if (instrument === 'pad' || instrument === 'saw' || instrument === 'strings' || instrument === 'bass') {
		return mix.pad;
	}
	return mix.lead;
}

/** Late-arriving vibrato (nonghyeon) applied to oscillator detune. */
function vibrato(
	ac: AudioContext,
	targets: OscillatorNode[],
	at: number,
	stopAt: number,
	rate: number,
	depthCents: number,
	arriveAfter: number
): void {
	const lfo = new OscillatorNode(ac, { type: 'sine', frequency: rate });
	const depth = new GainNode(ac, { gain: 0.0001 });
	depth.gain.setValueAtTime(0.0001, at);
	depth.gain.linearRampToValueAtTime(depthCents, at + arriveAfter);
	lfo.connect(depth);
	for (const t of targets) depth.connect(t.detune);
	lfo.start(at);
	lfo.stop(stopAt);
}

/**
 * Plucked strings — gayageum (bright silk) and geomungo (deep, dark).
 * Triangle fundamental + quiet sine octave through a lowpass that closes
 * quickly (the pluck), exponential decay, late vibrato on long notes.
 */
function pluck(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number,
	dark: boolean
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const decay = dark ? Math.min(dur + 0.5, 1.55) : Math.min(dur + 0.32, 1.15);
	const stopAt = at + decay + 0.04;

	const fundamental = new OscillatorNode(ac, { type: 'triangle', frequency: freq });
	const octave = new OscillatorNode(ac, { type: 'sine', frequency: freq * 2, detune: 4 });

	const filter = new BiquadFilterNode(ac, { type: 'lowpass', frequency: dark ? 1800 : 3400, Q: 0.9 });
	filter.frequency.setValueAtTime(dark ? 1800 : 3400, at);
	filter.frequency.exponentialRampToValueAtTime(dark ? 420 : 900, at + (dark ? 0.22 : 0.14));

	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.exponentialRampToValueAtTime(0.32 * vel, at + 0.004);
	amp.gain.exponentialRampToValueAtTime(0.0001, at + decay);

	const octaveGain = new GainNode(ac, { gain: dark ? 0.07 : 0.12 });
	fundamental.connect(filter);
	octave.connect(octaveGain).connect(filter);
	filter.connect(amp).connect(dest);

	if (dur > 0.55) {
		vibrato(ac, [fundamental, octave], at, stopAt, dark ? 4.6 : 5.2, dark ? 9 : 7, Math.min(0.45, dur * 0.5));
	}

	fundamental.start(at);
	octave.start(at);
	fundamental.stop(stopAt);
	octave.stop(stopAt);
}

/**
 * Daegeum — breathy bamboo flute. Sine fundamental (with a whisper of the
 * second partial), band-passed breath noise riding the same envelope, a
 * slow attack with an onset pitch-scoop, and vibrato that deepens as the
 * note sings.
 */
function flute(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const attack = 0.05;
	const release = 0.14;
	const hold = Math.max(dur - 0.04, attack + 0.05);
	const stopAt = at + hold + release + 0.05;

	const fundamental = new OscillatorNode(ac, { type: 'sine', frequency: freq * 0.988 });
	fundamental.frequency.setValueAtTime(freq * 0.988, at);
	fundamental.frequency.linearRampToValueAtTime(freq, at + 0.045);
	const partial = new OscillatorNode(ac, { type: 'sine', frequency: freq * 2, detune: 3 });
	const partialGain = new GainNode(ac, { gain: 0.1 });

	const breath = noiseSource(ac, at, stopAt);
	const breathFilter = new BiquadFilterNode(ac, {
		type: 'bandpass',
		frequency: Math.min(freq * 2, 4200),
		Q: 9
	});
	const breathGain = new GainNode(ac, { gain: 0.032 });

	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.linearRampToValueAtTime(0.22 * vel, at + attack);
	amp.gain.linearRampToValueAtTime(0.25 * vel, at + attack + hold * 0.55);
	amp.gain.setValueAtTime(0.25 * vel, at + hold);
	amp.gain.linearRampToValueAtTime(0.0001, at + hold + release);

	fundamental.connect(amp);
	partial.connect(partialGain).connect(amp);
	breath.connect(breathFilter).connect(breathGain).connect(amp);
	amp.connect(dest);

	if (dur > 0.4) {
		vibrato(ac, [fundamental, partial], at, stopAt, 4.8, 14, Math.max(0.3, dur * 0.4));
	}

	fundamental.start(at);
	partial.start(at);
	fundamental.stop(stopAt);
	partial.stop(stopAt);
}

/**
 * Haegeum — bowed two-string fiddle. Sawtooth through a lowpass keyed to
 * the note, slow bow-speed attack, sustained tone, and a wide singing
 * vibrato — the "crying" string.
 */
function bowed(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const attack = 0.13;
	const release = 0.22;
	const hold = Math.max(dur - 0.04, attack + 0.05);
	const stopAt = at + hold + release + 0.05;

	const string = new OscillatorNode(ac, { type: 'sawtooth', frequency: freq });
	const body = new BiquadFilterNode(ac, {
		type: 'lowpass',
		frequency: Math.min(freq * 3.5, 2600),
		Q: 1.4
	});

	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.linearRampToValueAtTime(0.13 * vel, at + attack);
	amp.gain.setValueAtTime(0.13 * vel, at + hold);
	amp.gain.linearRampToValueAtTime(0.0001, at + hold + release);

	string.connect(body).connect(amp).connect(dest);

	if (dur > 0.35) {
		vibrato(ac, [string], at, stopAt, 5.5, 18, Math.max(0.25, dur * 0.35));
	}

	string.start(at);
	string.stop(stopAt);
}

/**
 * Nabal — long straight war-horn. A detuned sawtooth pair through a lowpass
 * that blossoms open on the attack (the brass "bloom"), firm sustain,
 * quick release.
 */
function horn(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const attack = 0.028;
	const release = 0.12;
	const hold = Math.max(dur - 0.03, attack + 0.04);
	const stopAt = at + hold + release + 0.05;

	const a = new OscillatorNode(ac, { type: 'sawtooth', frequency: freq, detune: -6 });
	const b = new OscillatorNode(ac, { type: 'sawtooth', frequency: freq, detune: 6 });

	const bloom = new BiquadFilterNode(ac, { type: 'lowpass', frequency: 520, Q: 1.1 });
	bloom.frequency.setValueAtTime(520, at);
	bloom.frequency.exponentialRampToValueAtTime(Math.min(freq * 6, 3200), at + 0.07);

	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.linearRampToValueAtTime(0.17 * vel, at + attack);
	amp.gain.linearRampToValueAtTime(0.13 * vel, at + attack + 0.12);
	amp.gain.setValueAtTime(0.13 * vel, at + hold);
	amp.gain.linearRampToValueAtTime(0.0001, at + hold + release);

	a.connect(bloom);
	b.connect(bloom);
	bloom.connect(amp).connect(dest);

	if (dur > 0.8) {
		vibrato(ac, [a, b], at, stopAt, 4.4, 8, Math.min(0.6, dur * 0.5));
	}

	a.start(at);
	b.start(at);
	a.stop(stopAt);
	b.stop(stopAt);
}

/**
 * Whistle — thin high human-whistle. Fast attack, almost no vibrato,
 * a whisper of breath. Used only for the Gardener.
 */
function whistle(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const attack = 0.018;
	const release = 0.1;
	const hold = Math.max(dur - 0.02, attack + 0.04);
	const stopAt = at + hold + release + 0.04;

	const tone = new OscillatorNode(ac, { type: 'sine', frequency: freq });
	const air = new OscillatorNode(ac, { type: 'sine', frequency: freq * 2.01, detune: 7 });
	const airGain = new GainNode(ac, { gain: 0.16 });

	const breath = noiseSource(ac, at, stopAt);
	const breathFilter = new BiquadFilterNode(ac, {
		type: 'bandpass',
		frequency: Math.min(freq * 1.5, 5200),
		Q: 14
	});
	const breathGain = new GainNode(ac, { gain: 0.028 });

	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.linearRampToValueAtTime(0.17 * vel, at + attack);
	amp.gain.setValueAtTime(0.17 * vel, at + hold);
	amp.gain.linearRampToValueAtTime(0.0001, at + hold + release);

	tone.connect(amp);
	air.connect(airGain).connect(amp);
	breath.connect(breathFilter).connect(breathGain).connect(amp);
	amp.connect(dest);

	const sparkle = new OscillatorNode(ac, { type: 'sine', frequency: freq * 3.01 });
	const sparkleAmp = new GainNode(ac, { gain: 0.0001 });
	sparkleAmp.gain.setValueAtTime(0.0001, at);
	sparkleAmp.gain.exponentialRampToValueAtTime(0.045 * vel, at + 0.006);
	sparkleAmp.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
	sparkle.connect(sparkleAmp).connect(dest);

	tone.start(at);
	air.start(at);
	sparkle.start(at);
	tone.stop(stopAt);
	air.stop(stopAt);
	sparkle.stop(at + 0.12);
}

/** Bronze bell / chime — inharmonic partials with a long free decay. */
const BELL_PARTIALS: readonly (readonly [ratio: number, gain: number, decayScale: number])[] = [
	[1, 1, 1],
	[2.0, 0.34, 0.82],
	[2.76, 0.5, 0.7],
	[4.07, 0.2, 0.55],
	[5.4, 0.11, 0.42]
];

function bell(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const decay = Math.min(dur + 2.2, 4);
	const stopAt = at + decay + 0.05;

	for (const [ratio, gain, decayScale] of BELL_PARTIALS) {
		const osc = new OscillatorNode(ac, {
			type: 'sine',
			frequency: freq * ratio,
			detune: (Math.random() - 0.5) * 6
		});
		const amp = new GainNode(ac, { gain: 0.0001 });
		amp.gain.setValueAtTime(0.0001, at);
		amp.gain.exponentialRampToValueAtTime(0.14 * vel * gain, at + 0.004);
		amp.gain.exponentialRampToValueAtTime(0.0001, at + decay * decayScale);
		osc.connect(amp).connect(dest);
		osc.start(at);
		osc.stop(stopAt);
	}
}

type MelodicPlayer = (
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
) => void;

const INSTRUMENTS: Record<InstrumentId, MelodicPlayer> = {
	gayageum: (ac, dest, midi, at, beats, bpm, vel) => pluck(ac, dest, midi, at, beats, bpm, vel, false),
	geomungo: (ac, dest, midi, at, beats, bpm, vel) => pluck(ac, dest, midi, at, beats, bpm, vel, true),
	daegeum: flute,
	haegeum: bowed,
	nabal: horn,
	bell,
	whistle,
	pad,
	saw: analogSaw,
	lead: delayPluck,
	bass: subBass,
	strings: cinematicStrings
};

// ————— percussion —————

/** Kick — click + sine drop. */
function hitKick(ac: AudioContext, dest: AudioNode, at: number, vel: number): void {
	const thump = new OscillatorNode(ac, { type: 'sine', frequency: 150 });
	thump.frequency.setValueAtTime(150, at);
	thump.frequency.exponentialRampToValueAtTime(42, at + 0.05);
	const thumpAmp = new GainNode(ac, { gain: 0.0001 });
	thumpAmp.gain.setValueAtTime(0.0001, at);
	thumpAmp.gain.exponentialRampToValueAtTime(0.62 * vel, at + 0.003);
	thumpAmp.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
	thump.connect(thumpAmp).connect(dest);
	thump.start(at);
	thump.stop(at + 0.32);

	const click = noiseSource(ac, at, at + 0.03);
	const clickHp = new BiquadFilterNode(ac, { type: 'highpass', frequency: 1800 });
	const clickAmp = new GainNode(ac, { gain: 0.0001 });
	clickAmp.gain.setValueAtTime(0.0001, at);
	clickAmp.gain.exponentialRampToValueAtTime(0.18 * vel, at + 0.001);
	clickAmp.gain.exponentialRampToValueAtTime(0.0001, at + 0.02);
	click.connect(clickHp).connect(clickAmp).connect(dest);
}

/** Clap / snare hybrid — stacked noise bursts. */
function hitClap(ac: AudioContext, dest: AudioNode, at: number, vel: number): void {
	const bursts = [0, 0.012, 0.024];
	for (const offset of bursts) {
		const t = at + offset;
		const crack = noiseSource(ac, t, t + 0.12);
		const bp = new BiquadFilterNode(ac, { type: 'bandpass', frequency: 1800, Q: 1.1 });
		const hp = new BiquadFilterNode(ac, { type: 'highpass', frequency: 700 });
		const amp = new GainNode(ac, { gain: 0.0001 });
		amp.gain.setValueAtTime(0.0001, t);
		amp.gain.exponentialRampToValueAtTime(0.22 * vel, t + 0.002);
		amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
		crack.connect(hp).connect(bp).connect(amp).connect(dest);
	}

	const body = new OscillatorNode(ac, { type: 'triangle', frequency: 210 });
	body.frequency.setValueAtTime(210, at);
	body.frequency.exponentialRampToValueAtTime(140, at + 0.06);
	const bodyAmp = new GainNode(ac, { gain: 0.0001 });
	bodyAmp.gain.setValueAtTime(0.0001, at);
	bodyAmp.gain.exponentialRampToValueAtTime(0.08 * vel, at + 0.003);
	bodyAmp.gain.exponentialRampToValueAtTime(0.0001, at + 0.08);
	body.connect(bodyAmp).connect(dest);
	body.start(at);
	body.stop(at + 0.12);
}

/** Buk — deep barrel drum: pitched thump (fast downward sweep) + low noise body. */
function hitBuk(ac: AudioContext, dest: AudioNode, at: number, vel: number): void {
	const thump = new OscillatorNode(ac, { type: 'sine', frequency: 120 });
	thump.frequency.setValueAtTime(120, at);
	thump.frequency.exponentialRampToValueAtTime(46, at + 0.045);
	const thumpAmp = new GainNode(ac, { gain: 0.0001 });
	thumpAmp.gain.setValueAtTime(0.0001, at);
	thumpAmp.gain.exponentialRampToValueAtTime(0.52 * vel, at + 0.004);
	thumpAmp.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
	thump.connect(thumpAmp).connect(dest);
	thump.start(at);
	thump.stop(at + 0.45);

	const body = noiseSource(ac, at, at + 0.12);
	const bodyFilter = new BiquadFilterNode(ac, { type: 'lowpass', frequency: 380, Q: 0.7 });
	const bodyAmp = new GainNode(ac, { gain: 0.0001 });
	bodyAmp.gain.setValueAtTime(0.0001, at);
	bodyAmp.gain.exponentialRampToValueAtTime(0.22 * vel, at + 0.004);
	bodyAmp.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
	body.connect(bodyFilter).connect(bodyAmp).connect(dest);
}

/** Janggu — hourglass drum slap: band-passed crack + a small skin tone. */
function hitJanggu(ac: AudioContext, dest: AudioNode, at: number, vel: number): void {
	const crack = noiseSource(ac, at, at + 0.15);
	const crackFilter = new BiquadFilterNode(ac, { type: 'bandpass', frequency: 950, Q: 1.4 });
	const crackAmp = new GainNode(ac, { gain: 0.0001 });
	crackAmp.gain.setValueAtTime(0.0001, at);
	crackAmp.gain.exponentialRampToValueAtTime(0.24 * vel, at + 0.003);
	crackAmp.gain.exponentialRampToValueAtTime(0.0001, at + 0.11);
	crack.connect(crackFilter).connect(crackAmp).connect(dest);

	const skin = new OscillatorNode(ac, { type: 'sine', frequency: 185 });
	skin.frequency.setValueAtTime(185, at);
	skin.frequency.exponentialRampToValueAtTime(140, at + 0.07);
	const skinAmp = new GainNode(ac, { gain: 0.0001 });
	skinAmp.gain.setValueAtTime(0.0001, at);
	skinAmp.gain.exponentialRampToValueAtTime(0.1 * vel, at + 0.004);
	skinAmp.gain.exponentialRampToValueAtTime(0.0001, at + 0.1);
	skin.connect(skinAmp).connect(dest);
	skin.start(at);
	skin.stop(at + 0.15);
}

/** Filtered analog-ish pad — detuned sines + a quiet saw, faster than a court bed. */
function pad(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const attack = Math.min(0.22, dur * 0.28);
	const release = 0.42;
	const hold = Math.max(dur - 0.04, attack + 0.08);
	const stopAt = at + hold + release + 0.05;

	const a = new OscillatorNode(ac, { type: 'sine', frequency: freq, detune: -9 });
	const b = new OscillatorNode(ac, { type: 'sine', frequency: freq, detune: 9 });
	const saw = new OscillatorNode(ac, { type: 'sawtooth', frequency: freq, detune: 3 });
	const sawGain = new GainNode(ac, { gain: 0.22 });
	const fifth = new OscillatorNode(ac, { type: 'sine', frequency: freq * 1.5, detune: 3 });
	const fifthGain = new GainNode(ac, { gain: 0.14 });

	const filter = new BiquadFilterNode(ac, { type: 'lowpass', frequency: 880, Q: 0.7 });
	filter.frequency.setValueAtTime(380, at);
	filter.frequency.linearRampToValueAtTime(Math.min(freq * 4.5, 1800), at + attack);

	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.linearRampToValueAtTime(0.12 * vel, at + attack);
	amp.gain.setValueAtTime(0.12 * vel, at + hold);
	amp.gain.linearRampToValueAtTime(0.0001, at + hold + release);

	a.connect(filter);
	b.connect(filter);
	saw.connect(sawGain).connect(filter);
	fifth.connect(fifthGain).connect(filter);
	filter.connect(amp).connect(dest);

	a.start(at);
	b.start(at);
	saw.start(at);
	fifth.start(at);
	a.stop(stopAt);
	b.stop(stopAt);
	saw.stop(stopAt);
	fifth.stop(stopAt);
}

/** Detuned analog saw — pop leads and stabs. */
function analogSaw(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const attack = 0.035;
	const release = 0.16;
	const hold = Math.max(dur - 0.03, attack + 0.05);
	const stopAt = at + hold + release + 0.05;

	const a = new OscillatorNode(ac, { type: 'sawtooth', frequency: freq, detune: -10 });
	const b = new OscillatorNode(ac, { type: 'sawtooth', frequency: freq, detune: 10 });
	const sub = new OscillatorNode(ac, { type: 'sine', frequency: freq * 0.5 });
	const subGain = new GainNode(ac, { gain: 0.18 });

	const filter = new BiquadFilterNode(ac, { type: 'lowpass', frequency: 420, Q: 0.9 });
	filter.frequency.setValueAtTime(420, at);
	filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 7, 2800), at + 0.08);

	const lfo = new OscillatorNode(ac, { type: 'sine', frequency: 0.35 });
	const lfoGain = new GainNode(ac, { gain: 280 });
	lfo.connect(lfoGain).connect(filter.frequency);
	lfo.start(at);
	lfo.stop(stopAt);

	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.linearRampToValueAtTime(0.14 * vel, at + attack);
	amp.gain.setValueAtTime(0.14 * vel, at + hold);
	amp.gain.linearRampToValueAtTime(0.0001, at + hold + release);

	a.connect(filter);
	b.connect(filter);
	sub.connect(subGain).connect(filter);
	filter.connect(amp).connect(dest);

	a.start(at);
	b.start(at);
	sub.start(at);
	a.stop(stopAt);
	b.stop(stopAt);
	sub.stop(stopAt);
}

/** Guitar/synth pluck — tight transient; the mix delay is the tail. */
function delayPluck(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const decay = Math.min(dur + 0.28, 0.85);
	const stopAt = at + decay + 0.04;

	const tone = new OscillatorNode(ac, { type: 'triangle', frequency: freq });
	const edge = new OscillatorNode(ac, { type: 'sawtooth', frequency: freq, detune: 6 });
	const edgeGain = new GainNode(ac, { gain: 0.22 });
	const hp = new BiquadFilterNode(ac, { type: 'highpass', frequency: 160 });
	const lp = new BiquadFilterNode(ac, { type: 'lowpass', frequency: 4200, Q: 0.8 });
	lp.frequency.setValueAtTime(4200, at);
	lp.frequency.exponentialRampToValueAtTime(900, at + 0.12);

	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.exponentialRampToValueAtTime(0.28 * vel, at + 0.003);
	amp.gain.exponentialRampToValueAtTime(0.0001, at + decay);

	tone.connect(hp);
	edge.connect(edgeGain).connect(hp);
	hp.connect(lp).connect(amp).connect(dest);

	tone.start(at);
	edge.start(at);
	tone.stop(stopAt);
	edge.stop(stopAt);
}

/** Sub / synth-bass — 808 drop on low notes, round walk above. */
function subBass(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const trap = midi < 40;
	const decay = trap ? Math.min(dur + 0.45, 1.4) : Math.min(dur + 0.12, 0.7);
	const stopAt = at + decay + 0.04;

	const osc = new OscillatorNode(ac, { type: 'sine', frequency: trap ? freq * 1.85 : freq });
	if (trap) {
		osc.frequency.setValueAtTime(freq * 1.85, at);
		osc.frequency.exponentialRampToValueAtTime(freq, at + 0.055);
	}

	const body = new OscillatorNode(ac, { type: 'triangle', frequency: freq });
	const bodyGain = new GainNode(ac, { gain: trap ? 0.12 : 0.22 });
	const lp = new BiquadFilterNode(ac, { type: 'lowpass', frequency: trap ? 280 : 520, Q: 0.7 });

	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.exponentialRampToValueAtTime(0.42 * vel, at + 0.006);
	amp.gain.exponentialRampToValueAtTime(0.0001, at + decay);

	osc.connect(lp);
	body.connect(bodyGain).connect(lp);
	lp.connect(amp).connect(dest);

	osc.start(at);
	body.start(at);
	osc.stop(stopAt);
	body.stop(stopAt);
}

/** Cinematic strings — slow bow, chorus detune, filtered ensemble. */
function cinematicStrings(
	ac: AudioContext,
	dest: AudioNode,
	midi: number,
	at: number,
	beats: number,
	bpm: number,
	vel: number
): void {
	const dur = (beats * 60) / bpm;
	const freq = midiHz(midi);
	const attack = 0.1;
	const release = 0.28;
	const hold = Math.max(dur - 0.04, attack + 0.06);
	const stopAt = at + hold + release + 0.05;

	const a = new OscillatorNode(ac, { type: 'sawtooth', frequency: freq, detune: -12 });
	const b = new OscillatorNode(ac, { type: 'sawtooth', frequency: freq, detune: 12 });
	const core = new OscillatorNode(ac, { type: 'triangle', frequency: freq });
	const coreGain = new GainNode(ac, { gain: 0.35 });
	const lp = new BiquadFilterNode(ac, {
		type: 'lowpass',
		frequency: Math.min(freq * 4.2, 2200),
		Q: 0.8
	});

	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.linearRampToValueAtTime(0.12 * vel, at + attack);
	amp.gain.setValueAtTime(0.12 * vel, at + hold);
	amp.gain.linearRampToValueAtTime(0.0001, at + hold + release);

	a.connect(lp);
	b.connect(lp);
	core.connect(coreGain).connect(lp);
	lp.connect(amp).connect(dest);

	if (dur > 0.4) vibrato(ac, [a, b, core], at, stopAt, 5.1, 11, 0.28);

	a.start(at);
	b.start(at);
	core.start(at);
	a.stop(stopAt);
	b.stop(stopAt);
	core.stop(stopAt);
}

/** Jing — large gong: low inharmonic partials, slow swell, long ring. */
function hitJing(ac: AudioContext, dest: AudioNode, at: number, vel: number): void {
	const base = 98;
	const partials: readonly (readonly [number, number])[] = [
		[1, 1],
		[1.48, 0.5],
		[2.31, 0.3],
		[3.17, 0.18]
	];
	for (const [ratio, gain] of partials) {
		const osc = new OscillatorNode(ac, {
			type: 'sine',
			frequency: base * ratio,
			detune: (Math.random() - 0.5) * 8
		});
		const amp = new GainNode(ac, { gain: 0.0001 });
		amp.gain.setValueAtTime(0.0001, at);
		amp.gain.linearRampToValueAtTime(0.16 * vel * gain, at + 0.025);
		amp.gain.exponentialRampToValueAtTime(0.0001, at + 3.2);
		osc.connect(amp).connect(dest);
		osc.start(at);
		osc.stop(at + 3.3);
	}
}

/** Taiko — deeper don than buk, longer skin, no Chinese gong bloom. */
function hitTaiko(ac: AudioContext, dest: AudioNode, at: number, vel: number): void {
	const don = new OscillatorNode(ac, { type: 'sine', frequency: 88 });
	don.frequency.setValueAtTime(88, at);
	don.frequency.exponentialRampToValueAtTime(34, at + 0.09);
	const donAmp = new GainNode(ac, { gain: 0.0001 });
	donAmp.gain.setValueAtTime(0.0001, at);
	donAmp.gain.exponentialRampToValueAtTime(0.62 * vel, at + 0.005);
	donAmp.gain.exponentialRampToValueAtTime(0.0001, at + 0.55);
	don.connect(donAmp).connect(dest);
	don.start(at);
	don.stop(at + 0.6);

	const skin = noiseSource(ac, at, at + 0.16);
	const skinFilter = new BiquadFilterNode(ac, { type: 'lowpass', frequency: 280, Q: 0.8 });
	const skinAmp = new GainNode(ac, { gain: 0.0001 });
	skinAmp.gain.setValueAtTime(0.0001, at);
	skinAmp.gain.exponentialRampToValueAtTime(0.28 * vel, at + 0.003);
	skinAmp.gain.exponentialRampToValueAtTime(0.0001, at + 0.13);
	skin.connect(skinFilter).connect(skinAmp).connect(dest);
}

const PERC_HITS: Record<PercId, (ac: AudioContext, dest: AudioNode, at: number, vel: number) => void> = {
	kick: hitKick,
	clap: hitClap,
	buk: hitBuk,
	janggu: hitJanggu,
	jing: hitJing,
	taiko: hitTaiko
};

/** Soft sine drone with a quarter-note pulse under the melody. */
function drone(ac: AudioContext, dest: AudioNode, midi: number, at: number, until: number, bpm: number): void {
	const freq = midiHz(midi);
	const osc = new OscillatorNode(ac, { type: 'sine', frequency: freq });
	const octave = new OscillatorNode(ac, { type: 'sine', frequency: freq * 2 });
	const saw = new OscillatorNode(ac, { type: 'sawtooth', frequency: freq, detune: -6 });
	const sawGain = new GainNode(ac, { gain: 0.12 });
	const lp = new BiquadFilterNode(ac, { type: 'lowpass', frequency: 420, Q: 0.6 });
	const amp = new GainNode(ac, { gain: 0.0001 });
	amp.gain.setValueAtTime(0.0001, at);
	amp.gain.linearRampToValueAtTime(0.05, at + 0.45);
	amp.gain.setValueAtTime(0.05, Math.max(at + 0.45, until - 0.9));
	amp.gain.linearRampToValueAtTime(0.0001, until);
	const octaveGain = new GainNode(ac, { gain: 0.22 });
	const pulse = new GainNode(ac, { gain: 0.88 });
	const lfo = new OscillatorNode(ac, { type: 'sine', frequency: bpm / 60 });
	const lfoGain = new GainNode(ac, { gain: 0.12 });
	lfo.connect(lfoGain).connect(pulse.gain);
	osc.connect(lp);
	octave.connect(octaveGain).connect(lp);
	saw.connect(sawGain).connect(lp);
	lp.connect(amp).connect(pulse).connect(dest);
	osc.start(at);
	octave.start(at);
	saw.start(at);
	lfo.start(at);
	osc.stop(until + 0.1);
	octave.stop(until + 0.1);
	saw.stop(until + 0.1);
	lfo.stop(until + 0.1);
}

// ————— humanized scheduling —————

/** Swing: delay onsets that fall on off-beat eighths toward a triplet feel. */
function swungPos(posBeats: number, swing: number): number {
	if (!swing) return posBeats;
	const frac = posBeats % 1;
	if (Math.abs(frac - 0.5) < 1e-6) return posBeats + swing * (1 / 6);
	return posBeats;
}

/** A few ms of onset jitter + velocity variation — human hands, not a grid. */
function humanize(): { dt: number; vel: number } {
	return {
		dt: (Math.random() - 0.5) * 0.008,
		vel: 0.88 + Math.random() * 0.2
	};
}

/**
 * Schedule one melodic line. When `rubato` is allowed (single-voice motifs),
 * the melodic peak is lengthened slightly (agogic accent) and everything
 * after it arrives a touch later — the phrase breathes at its crest.
 */
function scheduleLine(
	ac: AudioContext,
	dest: AudioNode,
	motif: Leitmotif,
	notes: readonly MotifNote[],
	instrument: InstrumentId,
	lineGain: number,
	start: number,
	allowRubato: boolean
): void {
	const spb = 60 / motif.bpm;
	const play = INSTRUMENTS[instrument];
	const swing = motif.swing ?? 0;

	let peak = -1;
	if (allowRubato) {
		for (const [midi] of notes) if (midi != null && midi > peak) peak = midi;
	}

	let pos = 0;
	let rubato = 0;
	for (const [midi, beats] of notes) {
		if (midi != null) {
			const { dt, vel } = humanize();
			const at = start + swungPos(pos, swing) * spb + rubato + Math.max(dt, pos === 0 ? 0 : -0.01);
			const isPeak = allowRubato && midi === peak;
			const soundBeats = isPeak ? beats * 1.06 : beats;
			play(ac, dest, midi, Math.max(at, ac.currentTime), soundBeats, motif.bpm, vel * lineGain);
			if (isPeak) rubato += beats * spb * 0.05;
		}
		pos += beats;
	}
}

function schedulePerc(
	ac: AudioContext,
	dest: AudioNode,
	motif: Leitmotif,
	start: number,
	duck: AudioParam | null
): void {
	if (!motif.perc) return;
	const spb = 60 / motif.bpm;
	const swing = motif.swing ?? 0;
	let pos = 0;
	for (const [hit, beats] of motif.perc) {
		if (hit != null) {
			const { dt, vel } = humanize();
			const at = start + swungPos(pos, swing) * spb + Math.max(dt, pos === 0 ? 0 : -0.01);
			const when = Math.max(at, ac.currentTime);
			PERC_HITS[hit](ac, dest, when, vel);
			if (duck && (hit === 'kick' || hit === 'buk' || hit === 'taiko')) duckAt(duck, when);
		}
		pos += beats;
	}
}

/**
 * Play a motif by id (character or kingdom). Returns its duration in ms, or
 * 0 when there is no motif or no audio available (e.g. SSR). Any motif
 * already playing is stopped first — one piece at a time.
 */
export function playLeitmotif(id: string): number {
	const motif = LEITMOTIFS[id];
	if (!motif) return 0;
	const ac = ensureContext();
	if (!ac) return 0;

	stopLeitmotif();

	const mix = createMix(ac, motif.bpm);
	currentBus = mix.master;

	const start = ac.currentTime + 0.08;
	const spb = 60 / motif.bpm;
	const hasEnsemble = !!(motif.voices?.length || motif.perc?.length);
	const leadId = motif.instrument ?? 'gayageum';

	scheduleLine(ac, mix.lead, motif, motif.notes, leadId, 1, start, !hasEnsemble);
	for (const voice of motif.voices ?? []) {
		scheduleLine(
			ac,
			destFor(mix, voice.instrument, false),
			motif,
			voice.notes,
			voice.instrument,
			voice.gain ?? 0.8,
			start,
			false
		);
	}
	schedulePerc(ac, mix.drums, motif, start, mix.duck.gain);

	if (motif.drone != null) {
		let beats = totalBeats(motif.notes);
		for (const v of motif.voices ?? []) beats = Math.max(beats, totalBeats(v.notes));
		drone(ac, mix.pad, motif.drone, start, start + beats * spb + 0.7, motif.bpm);
	}

	return motifDurationMs(motif);
}

/** Fade out and drop whatever is currently playing. */
export function stopLeitmotif(): void {
	if (!ctx || !currentBus) return;
	const bus = currentBus;
	const graph = currentGraph;
	currentBus = null;
	currentGraph = [];
	const now = ctx.currentTime;
	bus.gain.setValueAtTime(bus.gain.value, now);
	bus.gain.linearRampToValueAtTime(0.0001, now + 0.16);
	setTimeout(() => {
		bus.disconnect();
		for (const node of graph) {
			try {
				node.disconnect();
			} catch {
				/* already torn down */
			}
		}
	}, 220);
}
