import type { EpisodeKind } from '$lib/episodeKindMeta';

/** A titled block of prose: themes, sources, research and production notes. */
export type Note = { title: string; body: string[] };

export type Episode = {
	title: string;
	ko: string;
	year: string;
	/** Opening line, in the house voice. */
	hook: string;
	beats: string[];
	/** Bold next-episode card. */
	next: string;
	/** Named death: the episode gets a † and Kangrim's question. */
	death?: string;
	/** Told as memory from inside the surrounding episode, not in running order. */
	flashback?: boolean;
	/** Icons after the title (King for All’s episode kinds). Derived from the beats when unset. */
	kinds?: EpisodeKind[];
};

export type Part = { id: string; title: string; ko: string; years: string; summary: string; episodes: Episode[] };

export type Person = {
	name: string;
	ko: string;
	hanja?: string;
	/** What enemies and rumour call them, never what they call themselves. */
	epithet: string;
	life: string;
	side: string;
	hex: string;
	portrait?: string;
	/** A main character: drawn as a large card at the top of the cast. */
	lead?: boolean;
	/** Physical canon for stills: build, face, hair, dress, the one thing you'd recognise. */
	look?: string;
	want: string;
	voice: string;
	/** One signature line, recorded or invented. */
	line: string;
	arc: string;
	/** Lived-in nicknames beyond the main epithet (enemies’, soldiers’, posterity’s). */
	sobriquets?: string[];
	/** Where they stand: the ideology the drama argues with. */
	creed?: Creed;
};

/** How far the sources support a characterisation. */
export type Verdict = 'backed' | 'partly' | 'dramatized';

export type Creed = {
	/** The position in a few words: “Pragmatic sinicizer”. */
	stance: string;
	/** The personal want under the politics. */
	wants: string;
	verdict: Verdict;
	/** Why the verdict: what the sources say, and where the drama bends them. */
	history: string;
};

/** A legend (the era’s own myths and memory) or a concept (its institutions and terms). */
export type Lore = { name: string; ko?: string; hanja?: string; body: string };

/** Per-story lore merged into the outline by `index.ts`. Creeds and sobriquets are keyed by cast name. */
export type StoryLore = {
	legends: Lore[];
	concepts: Lore[];
	creeds: Record<string, Creed>;
	sobriquets?: Record<string, string[]>;
};

/** The two-hander relationships the drama runs on. `a` and `b` are cast names. */
export type Bond = { a: string; b: string; kind: string; body: string };

export type Arc = { who: string; steps: string[]; mirror: string };

export type Quote = { text: string; who: string; source?: string; original?: string };

export type Still = {
	src: string;
	alt: string;
	caption: string;
	year?: string;
	/** `poster` leads the page and the index card; `romance` is a love-story beat. */
	kind?: 'poster' | 'romance';
	/** Hidden unless Intimate (`?nsfw=true`) is on. */
	nsfw?: boolean;
	/** Episode title this still belongs to: it also shows inside that episode. */
	episode?: string;
};

/** `at` is [latitude, longitude]. */
export type MapPoint = {
	id: string;
	name: string;
	ko?: string;
	at: [number, number];
	kind?: 'capital' | 'battle' | 'site';
	/** Which side of the marker the label sits on. Defaults to right. */
	side?: 'left' | 'right' | 'above' | 'below';
};

export type MapRoute = {
	/** Point ids or raw [lat, lon] waypoints, in order. */
	via: (string | [number, number])[];
	label?: string;
	/** `river` and `water` draw as blue lines without arrows. */
	kind?: 'march' | 'flight' | 'naval' | 'journey' | 'river' | 'water';
};

export type StoryMap = {
	id: string;
	title: string;
	years?: string;
	caption: string;
	points: MapPoint[];
	routes?: MapRoute[];
	/** Extra [lat, lon] corners to widen the frame beyond the points. */
	frame?: [number, number][];
};

/** A `StoryMap` projected to SVG on the server (`$lib/server/storyMaps`). */
export type RenderedPoint = Omit<MapPoint, 'at'> & { x: number; y: number };

export type RenderedRoute = {
	kind: NonNullable<MapRoute['kind']>;
	d: string;
	head?: string;
	label?: string;
	lx: number;
	ly: number;
};

export type RenderedMap = Omit<StoryMap, 'points' | 'routes' | 'frame'> & {
	width: number;
	height: number;
	land: string;
	graticule: string;
	points: RenderedPoint[];
	routes: RenderedRoute[];
};

export type AltTitle = { title: string; ko?: string; note: string };

export type Outline = {
	slug: string;
	title: string;
	ko: string;
	hanja?: string;
	/** Shelf on the index page. */
	shelf: string;
	/** Genre line under the title. */
	tagline: string;
	era: string;
	years: string;
	accent: string;
	logline: string;
	opening: string;
	altTitles: AltTitle[];
	images: Still[];
	maps?: StoryMap[];
	synopsis: string[];
	quotes: Quote[];
	cast: Person[];
	/** Recurring presences that are not cast cards (narrator, returning names). */
	returning?: Note[];
	bonds: Bond[];
	parts: Part[];
	themes: Note[];
	/** The era’s cultural lexicon: past kings, gods, prophecies everyone already knows. */
	legends?: Lore[];
	/** The era’s institutions and terms of art. */
	concepts?: Lore[];
	arcs: Arc[];
	plants: { plant: string; payoff: string }[];
	timeline: { year: string; text: string }[];
	sources: Note[];
	research: Note[];
	places: { name: string; ko?: string; now: string; note: string }[];
	contested: string[];
	invented: string[];
	production: Note[];
};
