// Types for the story data. The content itself lives in ./data/story.json
// and is edited visually at /edit (dev only) or by hand in the JSON file.


export interface ImageSlot {
	id: string; // slot name, e.g. "sunduk-crown"
	ratio: number; // width / height of the strip
	tone?: string; // placeholder background hint, used until art exists
	src?: string; // final artwork, e.g. "/img_04.png" — kept as alternate / hover stack layer
	/**
	 * Machine-generated stand-in art, e.g. "/temp/steam_01.jpg".
	 * Gallery (/images) prefers this when present; chronicle reading prefers
	 * final `src` and only falls back to temp. Namespaced under /temp so every
	 * provisional image is trivial to find and swap later.
	 */
	tempImage?: string;
	alt?: string;
	/** Midjourney-style generation prompt — shown on empty slots for art direction. */
	prompt?: string;
	/**
	 * Optional input reference image paths/URLs used when generating temp art
	 * (people / place avatars, etc.). The /images cues view surfaces these;
	 * when omitted, nearby speakers and the entry place are inferred.
	 */
	refs?: string[];
	/** Explicit placeholder flag — treated as temp cue art when set. */
	isPlaceholder?: boolean;
	/**
	 * Intimate / adult cue art. Hidden unless the reader leaves
	 * “Intimate scenes” on. `true` or `"erotic"` both count as NSFW.
	 */
	nsfw?: boolean | 'erotic';
	/** Kept in story.json and on disk, but left out of the chronicle until reinstated (edit mode → Hide). */
	hidden?: boolean;
	/**
	 * Optional people.ts ids of everyone visible in the still.
	 * Gallery membership prefers the sidecar `image-people.json`
	 * (`peopleOfSlot`); this field is for hand edits on a slot.
	 */
	people?: string[];
	/**
	 * Which beat this image belongs to: a fragment of the block it should
	 * appear alongside. Images sharing an anchor stack together; images with
	 * no anchor open the entry.
	 */
	at?: string;
	/**
	 * Comic mode's balloon over this still. Omitted: guessed from the dialogue
	 * the still is anchored to (`$lib/comicSay`). `false`: never letter it.
	 */
	say?: { en?: string; ko?: string; person?: string } | false;
	/** Camera move and overlay the still plays each time it scrolls into view (`$lib/stillMotion`). */
	motion?: StillMotion;
	/** Shown only inside an emotion card's gallery (`EmotionGallery`), never in the reading flow. */
	gallery?: boolean;
	/** Script mode: stands alone at the column's full width instead of pairing in the masonry. */
	wide?: boolean;
	/** Display shape (width / height) set by dragging the frame's edge; the picture fills it, cropped. */
	crop?: number;
	/**
	 * Script mode: fraction of the column this still takes (WIDTH_MIN–1).
	 * Omitted: full width alone, or half a pair. A side drag writes only this
	 * still. The gutter between two side-by-side stills writes both.
	 */
	width?: number;
	/** Where the crop window sits, in percent (0–100). Omitted: centred. */
	focus?: { x: number; y: number };
	/** The same beat from the other telling (song vs. truth), drawn small in the frame's corner. */
	inset?: string;
	/** Which telling a still belongs to, where both are shown side by side: a round corner tag. */
	version?: 'myth' | 'reality';
	/**
	 * On a myth still: id of its reality twin, drawn on the exact same layout and placed right
	 * after it. Script mode shows the two full width, or (Animated on) as one before/after slider.
	 */
	pair?: string;
	/** Parallel set across episodes (same layout and poses, a different life): e.g. `hwarang-gate`, `coronation`. */
	parallel?: string;
}

/** Narrowest and widest `crop` a dragged frame edge can reach (width / height). */
export const CROP_MIN = 0.4;
export const CROP_MAX = 5;

/** Narrowest and widest `width` a dragged side can reach, as a fraction of the column. */
export const WIDTH_MIN = 0.22;
export const WIDTH_MAX = 1;

/** The prologue's emotion beats: each one-word card and its still share a motion. */
export type Emotion = 'love' | 'revenge' | 'betrayal' | 'greed' | 'loyalty' | 'pride' | 'rage';

/** Emotions, the prologue's opening myth beats and its three founding stills, and the scene moods. */
export type StillMotion =
	| Emotion
	| 'tigers'
	| 'heaven'
	| 'birch'
	| 'wanggum'
	| 'invasion'
	| 'refugees'
	| 'samhan'
	| 'generation'
	| 'goguryeo'
	| 'silla'
	| 'baekje'
	| SceneMotion;

/**
 * The full-screen layer over the script while a scene is under the reading line
 * (`SceneWeather`): set on an entry or a plate, or read off the scene's words.
 * `love` is flirting (petals), `heat` is sex (pink haze), `beyond` is the
 * reapers' world (pale mist and motes), `cavern` the goddesses' dark-blue steam.
 */
export type Weather =
	| 'embers'
	| 'rain'
	| 'storm'
	| 'snow'
	| 'blood'
	| 'love'
	| 'heat'
	| 'ash'
	| 'mist'
	| 'cavern'
	| 'beyond';

/** A weather tag in the data: a weather, or `clear` for none (no inferring either). */
export type Sky = Weather | 'clear';

/** A one-time full-screen beat when its line reaches the middle of the screen (`SceneWeather`). */
export type Moment = 'first-sight' | 'death';

/** Timing tags on a line of script: the sky changes here until the scene ends, or a moment fires. */
type Cue = {
	/** From this line to the end of its scene, the weather is this. */
	weather?: Sky;
	/** Fires once as this line reaches the middle of the screen. */
	moment?: Moment;
};

/** Motions read off a still's words when it has no `motion` of its own (`$lib/sceneMood`). */
export type SceneMotion = 'battle' | 'duel' | 'romance' | 'grief' | 'fire' | 'storm' | 'snow' | 'night' | 'drift';

/** ImageSlot plus the beat index it was flattened against for sticky stacks. */
export type StackImage = ImageSlot & { beatIndex?: number };

/**
 * Panel note for the artist / letterer ("Wordless.", "Thought balloon.",
 * "Full-page end card.", camera and posture directions). Never rendered in
 * the reader; the script export prints it beside the beat.
 */
export type PanelNote = { art?: string };

/** A footnote on a record's translation. */
export type RecordNote = { mark: string; html: string; ko?: string };

/** The material a record card is drawn on — see `RecordKind` in `recordBooks`. */
export type QuoteStyle = 'annal' | 'myth' | 'stele' | 'tomb' | 'sutra' | 'shaman' | 'letter';

export type Block = PanelNote &
	(
	// `ko` is the Korean rendering of English narration
	| ({ kind: 'p'; html: string; ko?: string; nsfw?: boolean; /** Soundtrack cue while this paragraph is the latest one reached. */ music?: string; /** Drawn as the prologue's animated one-word card (`EmotionWord`). */ emotion?: Emotion; /** The emotion card's character (person id). */ focus?: string; /** Slot ids (any episode) in the emotion card's scrolling gallery. */ gallery?: string[] } & Cue)
	// `en` is the English rendering of `lines`, index-for-index.
	// Tang / Chinese speech may add `zh` + `zhLatn` (pinyin); Yamato / Japanese
	// speech may add `ja` + `jaLatn` (Hepburn romaji); Mohe speech may add `mnc`
	// (Manchu in Möllendorff romanization) — subtitle layers shown regardless of
	// the reader's ko/en preference.
	| ({
			kind: 'dialogue';
			chip: string;
			lines: string[];
			en?: string[];
			zh?: string[];
			zhLatn?: string[];
			ja?: string[];
			jaLatn?: string[];
			mnc?: string[];
			speaker?: string;
			person?: string;
			/** Which silhouette an unprofiled `speaker` wears, when their label does not say. */
			gender?: 'm' | 'f';
			/** Pin a life-stage portrait (`PersonStage.id`) regardless of entry year. */
			look?: string;
			/** Hidden when Intimate scenes are off — same gate as cue art. */
			nsfw?: boolean;
			/**
			 * Hybrid style: force this line's whole exchange to messages or posts. `mail`
			 * marks this one line as a letter (an email), whatever the room around it is.
			 */
			chat?: 'message' | 'post' | 'mail';
	  } & Cue)
	| { kind: 'cite'; html: string; ko?: string } // "• 👑 King Mu (51) of Baekje"
	// `en` is the English rendering of `lines`, index-for-index.
	// A sung verse. With `person` it is a dirge: the spirits' bier song (상엿소리) over that death,
	// a lead singer's couplets answered by the chorus on the `refrain` lines.
	| { kind: 'verse'; color: string; lines: string[]; en?: string[]; person?: string; refrain?: number[]; title?: string; titleKo?: string }
	| { kind: 'table'; head: string[]; rows: string[][]; colors?: string[] }
	// A name written out character by character, stroke order animated (HanjaName).
	// `gloss` is the 훈음 ("섬돌 계"); `meaning` the English sense; `name`/`ko` caption the whole name.
	// `tab: 'words'` brushes native Hangul words instead: each `char` is a whole word ("대가"),
	// `gloss` its reading ("Deka"), `meaning`/`meaningKo` its sense.
	| {
			kind: 'hanja';
			tab?: 'name' | 'words';
			chars: { char: string; gloss: string; meaning?: string; meaningKo?: string }[];
			name?: string;
			ko?: string;
			note?: string;
			noteKo?: string;
			after?: string;
	  }
	// A character card (PersonCard): portrait beside their name in black brush calligraphy.
	// `from` makes it a coronation: the `from` stage portrait evolves into `look`.
	// `write` overrides what the brush writes (default: hanja, else Korean name); `sub` is a second brushed line.
	| {
			kind: 'card';
			person: string;
			look?: string;
			from?: string;
			write?: string;
			sub?: string;
			role?: string;
			/** `epitaph`: the card that closes a death, with the years of the life beneath the name. */
			tab?: 'intro' | 'profile' | 'coronation' | 'epitaph';
			caption?: string;
			ko?: string;
			/** 2:1 intro still across the head of the card: the moment they walk in (`/intro/*.jpg`). */
			still?: string;
	  }
	// A term the narrator stops to explain, manga-style (TermCard): brushed hanja, reading, gloss,
	// and optionally a reference image or a registry diagram.
	| {
			kind: 'term';
			hanja: string;
			reading: string;
			term: string;
			html: string;
			ko?: string;
			image?: string;
			diagram?: string;
			step?: string;
			realm?: string;
			/** `clan` relabels the tab and draws the small card used for a run of houses. */
			tab?: 'term' | 'clan';
	  }
	// A genuine line from the record (RecordQuote): the original, its translations, and the book's seal.
	| {
			kind: 'quote';
			html: string;
			ko?: string;
			hanja?: string;
			source: string;
			/** Whose words these are — their face hangs off the card's corner. A letter's sender. */
			person?: string;
			/** Material of the card; defaults to the source's kind in `recordBooks`. */
			style?: QuoteStyle;
			/** Consecutive quotes sharing an event read as one incident told by several records. */
			event?: string;
			/** On a run's first quote: do the records back each other up or contradict each other? */
			stance?: 'agree' | 'differ';
			/** On a run's first quote: the fact in question, one short line ("Chunchu was handsome."). */
			claim?: string;
			claimKo?: string;
			/** A non-Chinese original: Sanskrit for a sutra, Jeju Korean for a bonpuri. */
			native?: string;
			nativeLang?: string;
			nativeLatn?: string;
			/** Letter recipient (people id or a plain label). */
			to?: string;
			/**
			 * Footnotes on the translation (the original is never touched): a `mark` ("*", "†")
			 * placed in `html`/`ko`, explained underneath — e.g. a record's 大對盧 where the story says High Commander.
			 */
			notes?: RecordNote[];
	  }
	// A poem in a verse exchange (PoemCard): two poets answer each other across the page.
	| {
			kind: 'poem';
			person?: string;
			/** The poem being answered sits on the other side. */
			title?: string;
			hanja: string;
			ko?: string;
			html: string;
			/** Present when the poem is on record; omitted for the chronicle's own verse. */
			source?: string;
			notes?: RecordNote[];
	  }
	// A four-character idiom or a line from the classics, dropped into talk (ChengyuCard).
	| {
			kind: 'chengyu';
			hanja: string;
			/** Mandarin pinyin. */
			pinyin?: string;
			/** Korean reading — 와신상담. */
			reading?: string;
			/** Literal gloss, then the sense: "lie on brushwood, taste gall — endure to avenge". */
			html: string;
			ko?: string;
			/** The classic it comes from — "Shiji (史記) bk. 41". */
			origin?: string;
			/** The story behind it, two or three sentences. */
			story?: string;
			storyKo?: string;
			/** Who quotes it in the scene. */
			person?: string;
	  }
	// An imperial edict on yellow paper that unrolls (EdictScroll).
	| {
			kind: 'edict';
			person?: string;
			title?: string;
			hanja?: string;
			ko?: string;
			html: string;
			source: string;
			notes?: RecordNote[];
	  }
	// An oath sealed in blood between parties (CovenantCard).
	| {
			kind: 'covenant';
			parties: string[];
			title?: string;
			hanja?: string;
			ko?: string;
			html: string;
			source: string;
			notes?: RecordNote[];
	  }
	// Portents, stamped one by one as they happen (OmenTicker).
	| {
			kind: 'omens';
			title?: string;
			ko?: string;
			omens: { hanja?: string; html: string; ko?: string; source?: string }[];
	  }
	// An inscribed stone the reader can turn over (OathStone): face, then back.
	| {
			kind: 'oath';
			hanja: string;
			ko?: string;
			html: string;
			source: string;
			back?: { html: string; ko?: string };
			notes?: RecordNote[];
	  }
	// First appearance of a place: a calligraphy intro card (PlaceCard), drawn from places.ts.
	| { kind: 'place'; place: string; html?: string; ko?: string }
	// A crop of the border map in a given year, framed on `places` (MapExcerpt).
	// `from` adds a play button that sweeps the borders from that year to `year`.
	| {
			kind: 'map';
			year: number;
			from?: number;
			places: string[];
			/** Journeys and troop movements drawn as animated dotted arrows — ids in `mapRoutes`. */
			routes?: string[];
			/** Name the rivers in the crop (off by default). */
			riverNames?: boolean;
			title?: string;
			caption?: string;
			ko?: string;
	  }
	// A battle formation: two sides of labelled units, drawn as a diagram.
	| {
			kind: 'formation';
			title?: string;
			note?: string;
			sides: { name: string; color: string; units: { label: string; sub?: string }[] }[];
	  }
	// A battle map from `data/battles/<battle>.json` (one dot = 1,000 men). In the script it
	// plays one `phase` as a scene; `full` is the whole battle, with controls, at the episode's end.
	| { kind: 'battle'; battle: string; phase?: string; full?: boolean }
	// The lesson a told story leaves behind — set apart, the way the islanders say it.
	| { kind: 'moral'; label?: string; html: string; ko?: string }
	// A character’s internal voice spoken from later — retrospective tense.
	| { kind: 'monologue'; html: string; ko?: string; person?: string; look?: string; nsfw?: boolean }
	// An animated explainer for an institution or concept — resolved through the
	// registry in components/diagrams. `diagram` names the component; `step`
	// picks the moment it depicts (each component documents its own steps).
	| {
			kind: 'diagram';
			diagram: string;
			step?: string;
			realm?: string; // pantheon column filter when diagram is `pantheon`
			title?: string; // small-caps heading above the drawing
			caption?: string; // English caption under the drawing
			ko?: string; // Korean caption
			/**
			 * Who sits where, when the chart shows a scene (never on its first introduction):
			 * seat id → `people` id, drawn as a portrait over the seat. Seat ids:
			 * harmony-council `s0`–`s5`; ministers-assembly `king`, `premier`, `senior0`–`senior7`,
			 * `junior0`–`junior7`; restoration-army `king`, `g0`–`g3`.
			 */
			cast?: Record<string, string>;
	  }
	// A large chapter-within-an-entry header — "DAY 1" over a siege chronicle.
	| { kind: 'day'; label: string; ko?: string; /** Full-screen weather for this day (`SceneWeather`); a section's carries into its stories. */ weather?: Sky; jump?: TimeJump; /** Calendar year when no jump plate prints one (`plateYear`). */ year?: number; /** Hide from the Notion outline. */ outline?: boolean }
	// A location-and-time cut (the pines, the yard, a dated house).
	| { kind: 'scene'; label: string; ko?: string; /** Full-screen weather for this scene (`SceneWeather`); a story's carries into its scenes. */ weather?: Sky; jump?: TimeJump; /** Calendar year when no jump plate prints one (`plateYear`). */ year?: number; /** Hide from the Notion outline. */ outline?: boolean }
	// A named story inside a section: Childhood, the battle, Surrender.
	| { kind: 'story'; label: string; ko?: string; /** Full-screen weather for this story (`SceneWeather`); a story's carries into its scenes. */ weather?: Sky }
	// A life-chapter inside a long episode: Prince, General, Father.
	| { kind: 'section'; label: string; ko?: string; /** Full-screen weather for this section (`SceneWeather`); carries into its stories. */ weather?: Sky }
	// A mini-flashback that interrupts an entry mid-scroll.
	| { kind: 'flashback'; year?: string; title?: string; blocks: Block[] }
	// A wedding, as the couple's relationship status (FacebookLifeEvent). Hybrid
	// dialogue only; the narration around it already tells the beat.
	| { kind: 'wed'; couple: [string, string] }
	);

export interface Entry {
	year: string;
	sub?: string; // "February", "???"
	flash?: boolean; // renders on a tinted band — a flashback to an earlier era
	/** Alias of `flash` — whole-episode memory. Inline beats use `kind: 'flashback'`. */
	flashback?: boolean;
	flashTone?: string; // band color; defaults to grey (founding myths use kingdom colors)
	accent?: string; // episode title color — battle entries use red
	title: string; // "Queen Sunduk"
	subtitle?: string; // "선덕여왕"
	/** English title-card line under the wordmark (MCU subtitle). Korean title stays `subtitle`. */
	tagline?: string;
	taglineKo?: string;
	/** The episode's hook line on /episodes: one provocation, verdict, list or question. No outcomes. */
	logline?: { en: string; ko: string };
	/** `images[].id` of the representative still under the title. Omit to use the first landscape still. */
	thumbnail?: string;
	/** `'temp'`: show that cue's temp stand-in, not its final `src`. */
	thumbnailLayer?: 'temp';
	badges?: string[]; // emoji / flag chips under the title (`flag:silla`, `flag:baekje`, …)
	music?: string; // track name — shows in the player tag while this entry is read
	/** Full-screen weather for the whole episode, unless a plate sets its own (`SceneWeather`). */
	weather?: Sky;
	/** Genre voice of this episode — e.g. "political thriller", "island folklore". */
	tone?: string;
	/** One-line director's brief expanding on `tone`. */
	toneNote?: string;
	/** `PLACES` id — the map pin and place banner beside this episode. */
	place?: string;
	/** TOC category icons, in display order; most episodes have none. */
	kinds?: EpisodeKind[];
	/** 등장인물 tags under the title, in order. Omit to derive from dialogue and stills (`entryCast`). */
	cast?: string[];
	/**
	 * Kept in `story.json`, left out of the book: reading order, table of contents,
	 * episode numbers. Lift the flag to put it back.
	 */
	hidden?: boolean;
	images: ImageSlot[];
	blocks: Block[];
}

/** Episode categories that earn a TOC icon. `flashback` is derived from `flash`, never stored. */
export type EpisodeKind =
	| 'flashback'
	| 'love'
	| 'myth'
	| 'founding'
	| 'battle'
	| 'siege'
	| 'naval'
	| 'coup'
	| 'coronation';

/** One top-level record of `story.json` — an Arc to the reader (Part → Arc → Chapter → Episode). */
export interface Chapter {
	id: string;
	part?: string; // "Part I" — renders a full title page before this chapter
	partTitle?: string; // "The Three Kingdoms"
	partKorean?: string; // "삼국시대"
	partHanja?: string; // "三國時代"
	title: string; // "The King of Samhan"
	hanja?: string; // "三韓王儉"
	korean?: string; // "삼한왕검"
	range: string; // "632–642"
	/** Dominant genre voice of the chapter — entries may override with their own `tone`. */
	tone?: string;
	/** One-line director's brief for the chapter's genre voice. */
	toneNote?: string;
	entries: Entry[];
}

import raw from './data/story.json';

/** Hidden entries stay in the file and drop out of the book until the flag is lifted. */
export const chapters = (raw as unknown as Chapter[]).map((chapter) => ({
	...chapter,
	entries: chapter.entries.filter((entry) => !entry.hidden)
}));

/** Whole-entry memory band — `flash` or the explicit `flashback` alias. */
export function isFlashEntry(entry: Pick<Entry, 'flash' | 'flashback'>) {
	return !!(entry.flash || entry.flashback);
}

const RR_INITIAL = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const RR_MEDIAL = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const RR_FINAL = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];

/** Revised Romanization of Hangul syllables (final consonants simplified), for slugs. */
function romanizeHangul(s: string): string {
	return s.replace(/[\uac00-\ud7a3]/g, (ch) => {
		const n = ch.charCodeAt(0) - 0xac00;
		return RR_INITIAL[Math.floor(n / 588)] + RR_MEDIAL[Math.floor((n % 588) / 28)] + RR_FINAL[n % 28];
	});
}

/**
 * Stable DOM / hash id fragment from an episode title.
 * Apostrophes drop so “Yeon’s Massacre” → `yeons-massacre`; Hangul romanizes so “기 (起)” and “Gi (起)” both → `gi`.
 */
export function entrySlug(title: string): string {
	return romanizeHangul(title)
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’‘]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Canonical episode id: `chapterId-slug`, used for TOC, hashes, and article roots. */
export function entryId(chapterId: string, title: string): string {
	return `${chapterId}-${entrySlug(title)}`;
}

export function isEpilogue(chapter: Pick<Chapter, 'id'>): boolean {
	return chapter.id.startsWith('epilogue');
}

/** The trailer before Arc 1. Its id must not be the bare `prologue`, which is the foreword's episode id. */
export function isPrologue(chapter: Pick<Chapter, 'id'>): boolean {
	return chapter.id.startsWith('prologue-');
}

/** Reader-facing Arc numbers (one per `chapters` record): prologues and epilogues are unnumbered and do not advance the count. */
const ARC_NUMBERS: (number | null)[] = (() => {
	let n = 0;
	return chapters.map((ch) => (isEpilogue(ch) || isPrologue(ch) ? null : ++n));
})();

export function arcNumber(chapterIndex: number): number | null {
	return ARC_NUMBERS[chapterIndex] ?? null;
}

/** Reader-facing episode ordinals: one running count over every entry in reading order, epilogues included; prologue entries are 0 (unnumbered). */
const EPISODE_ORDINALS: number[][] = (() => {
	let n = 0;
	return chapters.map((ch) => ch.entries.map(() => (isPrologue(ch) ? 0 : ++n)));
})();

export const EPISODE_COUNT = Math.max(0, ...EPISODE_ORDINALS.flat());

/** 1-based position of an entry in the whole run — `37`; 0 when out of range. */
export function episodeOrdinal(chapterIndex: number, entryIndex: number): number {
	return EPISODE_ORDINALS[chapterIndex]?.[entryIndex] ?? 0;
}

/** Reader-facing episode number as a label — `37`; empty when out of range. */
export function episodeNumber(chapterIndex: number, entryIndex: number): string {
	const n = episodeOrdinal(chapterIndex, entryIndex);
	return n ? String(n) : '';
}

/** DOM id for a chapter's part title page — distinct from episode slugs. */
export function partId(chapterId: string): string {
	return `part-${chapterId}`;
}

/** DOM id for an Arc's title page. */
export function arcPageId(chapterId: string): string {
	return `arc-${chapterId}`;
}

/**
 * A large time jump on a scene or day plate: "Ten Years Later…" as a title card,
 * the place in small type beneath it. `place` (a places.ts id) names the place
 * when the plate's label is a scene title; otherwise the label's place line is used.
 * `year` sets the year itself as the large title, with the jump text beneath it
 * (for episodes that walk through decades).
 */
export type TimeJump = { en: string; ko?: string; place?: string; year?: number };

/** A labelled header plate: a section, a story, a scene or a siege day. */
export type Plate = Extract<Block, { kind: 'day' | 'scene' | 'story' | 'section' }>;

export function isPlate(b: Block | undefined): b is Plate {
	return b?.kind === 'day' || b?.kind === 'scene' || b?.kind === 'story' || b?.kind === 'section';
}

const MINOR_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'or', 'the', 'to', 'with']);

/** Headline case for an English plate line: every word capitalised except minor words in the middle. */
function headlineCase(line: string): string {
	return line.replace(/[\p{L}\p{N}’']+/gu, (word: string, offset: number) =>
		offset > 0 && offset + word.length < line.length && MINOR_WORDS.has(word.toLowerCase())
			? word
			: word.charAt(0).toUpperCase() + word.slice(1)
	);
}

/** A plate label as stacked lines: place first, then the time (split at the first “·”). */
export function plateLines(label: string | undefined, english = true): string[] {
	if (!label) return [];
	const at = label.indexOf('·');
	const lines = at < 0 ? [label] : [label.slice(0, at), label.slice(at + 1)];
	return lines.map((l) => l.trim()).filter(Boolean).map((l) => (english ? headlineCase(l) : l));
}

/** A named cut inside an entry — story, day plate, scene plate, or titled flashback. */
export type SceneRef = {
	id: string;
	slug: string;
	title: string;
	ko?: string;
	kind: Plate['kind'] | 'flashback';
	/** False = cinema plate only; omitted from the Notion outline. */
	outline?: boolean;
};

/** A story header plus the location-and-time scenes that sit under it. */
export type StoryOutline = SceneRef & { scenes: SceneRef[] };

/** A section (Prince, General) plus its stories, and any loose scenes before the first story. */
export type SectionOutline = SceneRef & { stories: StoryOutline[]; scenes: SceneRef[] };

/** Top-level blocks that title a scene the reader can jump to. */
export function isSceneHeader(b: Block): boolean {
	return isPlate(b) || (b.kind === 'flashback' && !!b.title);
}

/** Section / story slugs are prefixed so they never shift a scene with the same name. */
function slugTitle(b: Block): string {
	if (b.kind === 'section') return `section ${b.label}`;
	if (b.kind === 'story') return `story ${b.label}`;
	if (isPlate(b)) return b.label;
	if (b.kind === 'flashback') return b.title ?? '';
	return '';
}

function uniqueSlug(used: Map<string, number>, title: string): string {
	const base = entrySlug(title) || 'scene';
	const n = (used.get(base) ?? 0) + 1;
	used.set(base, n);
	return n === 1 ? base : `${base}-${n}`;
}

/**
 * Scene list for one entry, in reading order. Ids are `episodeId-scene-slug`
 * so hash jumps share the TOC slug scheme.
 */
export function scenesOf(blocks: Block[] | undefined, episodeId: string): SceneRef[] {
	const used = new Map<string, number>();
	const out: SceneRef[] = [];
	for (const b of blocks ?? []) {
		if (isPlate(b)) {
			const slug = uniqueSlug(used, slugTitle(b));
			out.push({
				id: `${episodeId}-${slug}`,
				slug,
				title: b.label,
				ko: b.ko,
				kind: b.kind,
				outline: b.kind === 'section' || b.kind === 'story' ? true : b.outline
			});
		} else if (b.kind === 'flashback' && b.title) {
			const slug = uniqueSlug(used, slugTitle(b));
			out.push({ id: `${episodeId}-${slug}`, slug, title: b.title, kind: 'flashback' });
		}
	}
	return out;
}

/** 1-based number of each section header in an entry, in reading order. */
export function sectionNumbers(blocks: Block[] | undefined): Map<Block, number> {
	const out = new Map<Block, number>();
	for (const b of blocks ?? []) if (b.kind === 'section') out.set(b, out.size + 1);
	return out;
}

/** 1-based number of each story header, restarting at every section. */
export function storyNumbers(blocks: Block[] | undefined): Map<Block, number> {
	const out = new Map<Block, number>();
	let n = 0;
	for (const b of blocks ?? []) {
		if (b.kind === 'section') n = 0;
		if (b.kind === 'story') out.set(b, ++n);
	}
	return out;
}

/**
 * The year a scene or day plate moves its episode to: the printed jump year, or a silent
 * `year` for a vague leap ("Some Years Later…") or a scene with no plate.
 */
export function plateYear(b: Block): number | undefined {
	if (b.kind !== 'scene' && b.kind !== 'day') return undefined;
	return b.jump?.year ?? b.year;
}

/** The entry's sections (with nested stories and scenes), and the section index every header id falls under. */
export function outlineOf(
	blocks: Block[] | undefined,
	episodeId: string
): { sections: SectionOutline[]; of: Map<string, number> } {
	const sections: SectionOutline[] = [];
	const of = new Map<string, number>();
	let section: SectionOutline | undefined;
	let story: StoryOutline | undefined;
	for (const s of scenesOf(blocks, episodeId)) {
		if (s.kind === 'section') {
			section = { ...s, stories: [], scenes: [] };
			story = undefined;
			sections.push(section);
			of.set(s.id, sections.length - 1);
			continue;
		}
		if (!section) continue;
		of.set(s.id, sections.length - 1);
		if (s.kind === 'story') {
			story = { ...s, scenes: [] };
			section.stories.push(story);
			continue;
		}
		if (s.kind === 'flashback' || s.outline === false) continue;
		if (story) story.scenes.push(s);
		else section.scenes.push(s);
	}
	return { sections, of };
}

/** Sections as the top outline row — year spans on the timeline, ticks on the rail. */
export function storiesOf(
	blocks: Block[] | undefined,
	episodeId: string
): { stories: SectionOutline[]; storyOf: Map<string, number> } {
	const { sections, of } = outlineOf(blocks, episodeId);
	return { stories: sections, storyOf: of };
}

/**
 * DOM id for a scene header block. Walks `source` in reading order so slugs
 * match `scenesOf` / the TOC even when this block is rendered in a beat slice.
 */
export function sceneIdForBlock(
	block: Block,
	source: Block[] | undefined,
	episodeId: string
): string | undefined {
	if (!episodeId || !isSceneHeader(block)) return undefined;
	const list = scenesOf(source, episodeId);
	let n = 0;
	for (const b of source ?? []) {
		if (!isSceneHeader(b)) continue;
		const s = list[n++];
		if (b === block) return s?.id;
	}
	const slug = entrySlug(slugTitle(block)) || 'scene';
	return `${episodeId}-${slug}`;
}
