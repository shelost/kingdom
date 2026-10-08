/**
 * How a line of dialogue is lettered, and who is saying it this year.
 *
 * - Forms: `script` (the screenplay), `message` (bubbles, for talk) and `post`
 *   (tweets, for the business of state). Hybrid picks per exchange: lines broken
 *   by a scene header or a stretch of narration start a new one.
 * - One throne per kingdom: in the year a crown changes hands, the heir speaks
 *   in their earlier stage for as long as the incumbent is still talking.
 * - Speakers go by their given name; the surname is for the wiki.
 */
import { isSceneHeader, type Block } from './story';
import { byId, nameOf, reignAt, stageOf, type Person } from './people';
import { relationOf } from './relations';
import type { DialogueStyle } from './dialogueUi.svelte';

export type ChatForm = 'script' | 'message' | 'post' | 'mail';

type Dialogue = Extract<Block, { kind: 'dialogue' }>;

const CLOSE_BONDS = new Set(['love', 'affair', 'kin', 'sworn', 'mentor']);

/** Lovers, kin, sworn friends and teachers. */
export function areClose(a: string, b: string): boolean {
	if (a === b) return true;
	const bond = relationOf(a, b)?.bond;
	if (bond && CLOSE_BONDS.has(bond)) return true;
	return !!(byId.get(a)?.family?.some((f) => f.id === b) || byId.get(b)?.family?.some((f) => f.id === a));
}

/** The business of state, as the narration and the speakers name it. */
const OFFICIAL =
	/\b(council|councillors?|court|throne room|throne hall|audience|envoys?|embassy|ambassador|edicts?|decrees?|petitions?|vote|votes|voting|tribute|treaty|alliance|ministers?|ministry|secretariat|assembly|summit|war council|campaign|garrison|levy|taxes|succession|negotiat\w*|surrender|annex\w*|reforms?|protocol|policy|memorials?|summons|terms)\b|조정|회의|화백|사신|조서|칙서|상소|표결|동맹|조공|외교|국정|정사/giu;

/** Distinct words of state business needed before an exchange counts as official. */
const OFFICIAL_HITS = 2;

const textOf = (b: Block): string =>
	b.kind === 'dialogue'
		? [...b.lines, ...(b.en ?? [])].join(' ')
		: 'html' in b && typeof b.html === 'string'
			? b.html
			: 'label' in b && typeof b.label === 'string'
				? b.label
				: '';

/** The people talking in an exchange; a chorus (the Hwarang, a crowd) is not a person. */
function peopleIn(room: Dialogue[]): Person[] {
	const ids = new Set(room.map((b) => b.person).filter((id): id is string => !!id));
	return [...ids].map((id) => byId.get(id)).filter((p): p is Person => !!p && !p.entity);
}

/** How official an exchange reads: words of state, plus a point each for a crowd and for a border. */
export function officialScore(room: Dialogue[], context: string): number {
	const people = peopleIn(room);
	const kingdoms = new Set(people.map((p) => p.kingdom).filter(Boolean));
	const words = new Set([...context.matchAll(OFFICIAL)].map((m) => m[0].toLowerCase()));
	return words.size + (people.length >= 3 ? 1 : 0) + (kingdoms.size > 1 ? 1 : 0);
}

/**
 * Hybrid: posts are for the business of state, messages for everything else.
 * An exchange is official when the page forces it, or when its words, its
 * crowd and its borders add up. People close to each other stay in messages.
 */
function roomForm(room: Dialogue[], context: string): ChatForm {
	const forced = room.find((b) => b.chat && b.chat !== 'mail')?.chat;
	if (forced) return forced;
	const ids = peopleIn(room).map((p) => p.id);
	if (ids.length > 1 && ids.every((a, i) => ids.slice(i + 1).every((b) => areClose(a, b)))) return 'message';
	return officialScore(room, context) >= OFFICIAL_HITS ? 'post' : 'message';
}

/** Narration blocks between two lines that end one exchange and begin the next. */
const EXCHANGE_GAP = 2;

/** One exchange: its lines, and the text around them (lead-in narration, asides, the lines). */
export type Exchange = { room: Dialogue[]; context: string };

/** Split `blocks` into exchanges at scene headers and stretches of narration. */
export function exchangesOf(blocks: Block[]): Exchange[] {
	const out: Exchange[] = [];
	let room: Dialogue[] = [];
	let context: string[] = [];
	let quiet = 0;
	const close = () => {
		if (room.length) out.push({ room, context: [...context, ...room.map(textOf)].join(' ') });
		room = [];
		context = [];
	};
	for (const b of blocks) {
		if (isSceneHeader(b)) close();
		if (b.kind === 'dialogue') {
			if (quiet >= EXCHANGE_GAP) {
				const lead = context.slice(-EXCHANGE_GAP);
				close();
				context = lead;
			}
			room.push(b);
			quiet = 0;
		} else {
			quiet++;
			context.push(textOf(b));
		}
	}
	close();
	return out;
}

/** The form of every dialogue block in `blocks` under the reader's chosen style. */
export function chatForms(blocks: Block[], style: DialogueStyle): Map<Block, ChatForm> {
	const forms = new Map<Block, ChatForm>();
	const fixed: ChatForm | undefined =
		style === 'script' ? 'script' : style === 'comic' ? 'message' : style === 'tweet' ? 'post' : undefined;
	for (const { room, context } of exchangesOf(blocks)) {
		const talk = room.filter((b) => b.chat !== 'mail');
		const form = fixed ?? (talk.length ? roomForm(talk, context) : 'message');
		for (const b of room) forms.set(b, !fixed && b.chat === 'mail' ? 'mail' : form);
	}
	return forms;
}

/** One letter in a thread of them: a record (`quote` letter) or a line marked `chat: 'mail'`. */
export type Mail = {
	from?: string;
	to?: string;
	/** Opens a new email: the sender changed, or a scene began. */
	head: boolean;
	/** The email goes on in a later block, so this card carries no Reply bar. */
	more: boolean;
	subject: { en: string; ko?: string };
	/** A record of the same letter: forwarded from the book that keeps it. */
	forward: boolean;
};

const re = (s: Mail['subject']): Mail['subject'] => {
	const strip = (t: string) => `Re: ${t.replace(/^Re: /, '')}`;
	return { en: strip(s.en), ko: s.ko && strip(s.ko) };
};

const cut = (s: string, n = 48) => {
	const t = s.replace(/<[^>]+>/g, '').trim();
	return t.length > n ? `${t.slice(0, n).replace(/\s+\S*$/, '')}…` : t;
};

/**
 * Hybrid letters as an inbox: who writes to whom, where each email opens and
 * runs on, and the subject (the scene's name; an answer is "Re:" the letter it
 * answers). A recipient left unsaid is whoever wrote or spoke last.
 */
export function mailOf(blocks: Block[], forms: Map<Block, ChatForm>): Map<Block, Mail> {
	const out = new Map<Block, Mail>();
	let scene: { en: string; ko?: string } | undefined;
	let fresh = true;
	let last: Mail | undefined;
	let lastVoice: string | undefined;
	for (const b of blocks) {
		if (isSceneHeader(b)) {
			if (b.kind === 'scene' || b.kind === 'day') scene = { en: b.label, ko: b.ko };
			fresh = true;
		}
		const letter = b.kind === 'quote' && b.style === 'letter';
		if (!letter && !(b.kind === 'dialogue' && forms.get(b) === 'mail')) {
			if (b.kind === 'dialogue' && b.person) lastVoice = b.person;
			continue;
		}
		const from = b.kind === 'quote' || b.kind === 'dialogue' ? b.person : undefined;
		const head = fresh || !last || last.from !== from;
		let to = b.kind === 'quote' ? b.to : undefined;
		if (!to && last) to = head ? (last.from !== from ? last.from : undefined) : last.to;
		if (!to && lastVoice !== from) to = lastVoice;
		let subject: Mail['subject'];
		if (!head && last) subject = last.subject;
		else if (last && last.from === to && (!last.to || last.to === from)) subject = re(last.subject);
		else subject = scene ?? { en: cut(b.kind === 'dialogue' ? (b.en?.[0] ?? b.lines[0] ?? '') : b.html) };
		const mail: Mail = { from, to, head, more: false, subject, forward: letter };
		if (!head && last) last.more = true;
		out.set(b, mail);
		last = mail;
		fresh = false;
	}
	return out;
}

/**
 * Who a speaker is at one line: the stage they speak in, and whether an older
 * monarch in the room keeps them off the throne.
 */
export type Standing = { look?: string; heir?: boolean };

type Card = Extract<Block, { kind: 'card' }>;

/**
 * The standing of every unpinned line in `blocks`, read in story order.
 *
 * - A card introduces a person as they are: their lines after it speak in its
 *   look, and the lines before the first card in its earlier self (`from`), so
 *   a coronation card is where the crown goes on.
 * - One throne per kingdom: a successor who shares the year with a living
 *   incumbent speaks in their pre-reign stage for as long as the incumbent
 *   still speaks.
 */
export function standings(blocks: Block[], year: number | null | undefined): Map<Block, Standing> {
	const out = new Map<Block, Standing>();
	const lines: { b: Dialogue; at: number }[] = [];
	const cards = new Map<string, { at: number; card: Card }[]>();
	blocks.forEach((b, at) => {
		if (b.kind === 'dialogue' && b.person) lines.push({ b, at });
		if (b.kind === 'card' && (b.look || b.from)) {
			cards.set(b.person, [...(cards.get(b.person) ?? []), { at, card: b }]);
		}
	});
	const lastLine = new Map<string, number>();
	for (const { b, at } of lines) lastLine.set(b.person!, at);
	const reigning =
		year == null
			? []
			: [...lastLine.keys()].map((id) => byId.get(id)).filter((p): p is Person => !!p && !!reignAt(p, year));

	for (const { b, at } of lines) {
		const p = byId.get(b.person!);
		if (b.look || !p) continue;
		const reign = year == null ? undefined : reignAt(p, year);
		const incumbent =
			reign &&
			reigning.some(
				(q) =>
					q.id !== p.id &&
					q.kingdom === p.kingdom &&
					(reignAt(q, year)?.from ?? -Infinity) < (reign.from ?? -Infinity) &&
					(lastLine.get(q.id) ?? -1) >= at
			);
		if (reign && incumbent) {
			out.set(b, { look: (reign.from != null ? stageOf(p, reign.from - 1) : null)?.id, heir: true });
			continue;
		}
		const own = cards.get(p.id);
		if (!own) continue;
		const shown = own.filter((c) => c.at < at).at(-1)?.card;
		const look = shown ? shown.look : (own[0].card.from ?? own[0].card.look);
		if (look) out.set(b, { look });
	}
	return out;
}

const SURNAMES =
	/^(Kim|Yeon|Buyeo|Choi|Satek|Go|Park|Bak|Seok|Heukchi|Gwishil|Jang|Seol|Hae|Baek|Jin|Mok|Guk|Ahn|Yi|Lee|Gim|Wang|Eulji|Yang|Son|Ko)$/;
/** The one speaker whose surname is half his name. */
const FULL_NAME = new Set(['gesomun']);

/** The name a speaker goes by in dialogue: given name only (Yushin, not Kim Yushin). */
export function speakerName(p: Person, year?: number | null, look?: string | null): string {
	const name = nameOf(p, year, look);
	if (FULL_NAME.has(p.id)) return name;
	const [first, ...rest] = name.split(' ');
	if (!rest.length) return name;
	const surname = p.clan?.split('-').at(-1);
	return first.toLowerCase() === surname || SURNAMES.test(first) ? rest.join(' ') : name;
}
