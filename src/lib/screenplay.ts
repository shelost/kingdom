/**
 * Print script and storyboard sheets, derived from the same blocks the reader scrolls.
 * Screenplay is text only. Storyboard hangs each still's beat under the drawing.
 */
import { buildBeats } from '$lib/beats';
import { displayArtOf } from '$lib/cueArt';
import { filterVisibleCues } from '$lib/editUi.svelte';
import { byId, koreanOf, nameOf } from '$lib/people';
import { unnamedKo } from '$lib/unnamedKo';
import { PLACES } from '$lib/places';
import type { Lang } from '$lib/reading.svelte';
import { plainText } from '$lib/speech';
import type { Block, Entry, ImageSlot } from '$lib/story';

export type ScriptLine =
	| { kind: 'slug'; text: string }
	| { kind: 'action'; text: string }
	| { kind: 'shot'; text: string }
	| { kind: 'character'; text: string }
	| { kind: 'paren'; text: string }
	| { kind: 'speech'; text: string; sub?: string }
	| { kind: 'transition'; text: string };

export type BoardShot = { src?: string; alt: string };

export type BoardPanel = {
	n: number;
	shots: BoardShot[];
	lines: ScriptLine[];
};

type Year = number | null;

function pick(en: string | undefined, ko: string | undefined, lang: Lang): { text: string; sub?: string } {
	const english = (en ?? '').trim();
	const korean = (ko ?? '').trim();
	if (lang === 'ko') return { text: korean || english };
	if (lang === 'en') return { text: english || korean };
	if (english && korean && korean !== english) return { text: english, sub: korean };
	return { text: english || korean };
}

function prose(html: string | undefined, ko: string | undefined, lang: Lang): string {
	return pick(html ? plainText(html) : '', ko ? plainText(ko) : '', lang).text;
}

function cue(name: string, lang: Lang): string {
	const t = name.trim();
	return lang === 'ko' ? t : t.toUpperCase();
}

function who(
	person: string | undefined,
	speaker: string | undefined,
	look: string | undefined,
	lang: Lang,
	year: Year
): string {
	const p = person ? byId.get(person) : undefined;
	if (p) {
		const en = nameOf(p, year, look);
		const ko = koreanOf(p, year, look);
		return cue(lang === 'ko' ? ko || en : en, lang);
	}
	const label = speaker?.trim();
	if (!label) return cue(lang === 'ko' ? '목소리' : 'Voice', lang);
	return cue(lang === 'ko' ? unnamedKo(label) : label, lang);
}

function say(lines: string[] | undefined, en: string[] | undefined, lang: Lang): { text: string; sub?: string } | null {
	const ko = (lines ?? []).map((l) => l.trim()).filter(Boolean).join('\n');
	const english = (en ?? []).map((l) => l.trim()).filter(Boolean).join('\n');
	const spoken = pick(english, ko, lang);
	return spoken.text ? spoken : null;
}

function pushProse(out: ScriptLine[], html: string | undefined, ko: string | undefined, lang: Lang) {
	const text = prose(html, ko, lang);
	if (text) out.push({ kind: 'action', text });
}

function pushSpeech(
	out: ScriptLine[],
	name: string,
	spoken: { text: string; sub?: string } | null,
	paren?: string
) {
	if (!spoken) return;
	out.push({ kind: 'character', text: name });
	if (paren) out.push({ kind: 'paren', text: paren });
	out.push({ kind: 'speech', text: spoken.text, sub: spoken.sub });
}

function placeSlug(id: string, lang: Lang): string {
	const place = PLACES[id];
	const name = (lang === 'ko' ? place?.korean : place?.name) || id;
	const ext = place && (place.kind === 'mountain' || place.kind === 'river' || place.kind === 'harbor');
	const head = ext ? (lang === 'ko' ? '외부' : 'EXT.') : lang === 'ko' ? '내부' : 'INT.';
	return lang === 'ko' ? `${head}. ${name}` : `${head} ${name.toUpperCase()}`;
}

function walk(blocks: Block[], lang: Lang, year: Year, out: ScriptLine[]) {
	for (const b of blocks) {
		switch (b.kind) {
			case 'day':
			case 'scene':
			case 'story': {
				if (b.kind !== 'story' && b.jump) {
					const jump = pick(b.jump.en, b.jump.ko, lang).text;
					if (jump) out.push({ kind: 'transition', text: lang === 'ko' ? jump : jump.toUpperCase() });
				}
				const label = pick(b.label, b.ko, lang).text;
				if (label) out.push({ kind: 'slug', text: lang === 'ko' ? label : label.toUpperCase() });
				break;
			}
			case 'place': {
				out.push({ kind: 'slug', text: placeSlug(b.place, lang) });
				pushProse(out, b.html, b.ko, lang);
				break;
			}
			case 'flashback': {
				const title = b.title?.trim();
				out.push({
					kind: 'transition',
					text: title
						? lang === 'ko'
							? `회상. ${title}`
							: `FLASHBACK. ${title.toUpperCase()}`
						: lang === 'ko'
							? '회상'
							: 'FLASHBACK'
				});
				walk(b.blocks, lang, year, out);
				out.push({ kind: 'transition', text: lang === 'ko' ? '현재로' : 'BACK TO SCENE' });
				break;
			}
			case 'p':
			case 'cite':
			case 'moral':
				pushProse(out, b.html, b.ko, lang);
				break;
			case 'monologue':
				pushSpeech(out, who(b.person, undefined, b.look, lang, year), say([b.ko ?? ''], [plainText(b.html)], lang), lang === 'ko' ? '(독백)' : '(V.O.)');
				break;
			case 'dialogue':
				pushSpeech(out, who(b.person, b.speaker, b.look, lang, year), say(b.lines, b.en, lang));
				break;
			case 'verse': {
				const sung = say(b.lines, b.en, lang);
				if (b.person) pushSpeech(out, who(b.person, undefined, undefined, lang, year), sung, lang === 'ko' ? '(노래)' : '(SUNG)');
				else if (sung) out.push({ kind: 'action', text: sung.text });
				break;
			}
			case 'quote':
			case 'edict':
			case 'oath':
				pushSpeech(
					out,
					cue(b.kind === 'edict' ? (lang === 'ko' ? '칙서' : 'The edict') : lang === 'ko' ? '기록' : 'The record', lang),
					say(b.ko ? [b.ko] : [], [plainText(b.html)], lang),
					b.source ? `(${b.source})` : undefined
				);
				break;
			case 'poem':
				pushSpeech(
					out,
					who(b.person, b.title, undefined, lang, year),
					say(b.ko ? [plainText(b.ko)] : [], [plainText(b.html)], lang),
					lang === 'ko' ? '(시)' : '(A POEM)'
				);
				break;
			case 'chengyu':
				pushProse(out, b.html, b.ko, lang);
				break;
			case 'covenant':
				pushProse(out, b.html, b.ko, lang);
				break;
			case 'omens':
				for (const omen of b.omens) pushProse(out, omen.html, omen.ko, lang);
				break;
			case 'card': {
				const name = who(b.person, b.write, b.look, lang, year);
				const cap = prose(b.caption, b.ko, lang);
				out.push({ kind: 'action', text: cap ? `${name}. ${cap}` : `${name}.` });
				break;
			}
			case 'hanja': {
				const name = b.name || b.chars.map((c) => c.char).join('');
				if (name) out.push({ kind: 'action', text: name });
				break;
			}
			case 'term':
				pushProse(out, b.html, b.ko, lang);
				break;
			case 'map':
			case 'diagram':
				pushProse(out, b.caption, b.ko, lang);
				break;
			case 'formation':
				if (b.title || b.note) out.push({ kind: 'action', text: [b.title, b.note].filter(Boolean).join('. ') });
				break;
			case 'table':
				if (b.head.length) out.push({ kind: 'action', text: b.head.join(' · ') });
				break;
			case 'battle':
				break;
			case 'wed': {
				const names = b.couple.map((id) => who(id, undefined, undefined, lang, year)).join(lang === 'ko' ? ', ' : ' AND ');
				out.push({ kind: 'action', text: lang === 'ko' ? `${names}의 혼인.` : `${names} are married.` });
				break;
			}
			default:
				break;
		}
	}
}

/** Courier script for one episode. `bookends` adds the fade in and fade out. */
export function scriptOf(blocks: Block[], lang: Lang, year: Year, bookends = true): ScriptLine[] {
	const body: ScriptLine[] = [];
	walk(blocks, lang, year, body);
	if (!bookends) return body;
	const fadeIn: ScriptLine = { kind: 'transition', text: lang === 'ko' ? '페이드 인' : 'FADE IN:' };
	const fadeOut: ScriptLine = { kind: 'transition', text: lang === 'ko' ? '페이드 아웃' : 'FADE OUT.' };
	return [fadeIn, ...body, fadeOut];
}

function shotOf(im: ImageSlot): BoardShot {
	return { src: displayArtOf(im), alt: (im.alt ?? '').trim() };
}

/**
 * One numbered board per still (stills that share a beat share a card).
 * Prose with no drawing of its own rides on the next card, then the last.
 */
export function storyboardOf(entry: Pick<Entry, 'blocks' | 'images'>, lang: Lang, year: Year): BoardPanel[] {
	const images = filterVisibleCues(entry.images ?? []);
	const beats = buildBeats({ blocks: entry.blocks ?? [], images });
	const panels: BoardPanel[] = [];
	let carry: ScriptLine[] = [];

	for (const beat of beats) {
		const lines = scriptOf(beat.blocks, lang, year, false);
		const shots = beat.images.map(shotOf).filter((s) => s.src || s.alt);
		if (!shots.length) {
			carry.push(...lines);
			continue;
		}
		const shotLines: ScriptLine[] = shots.flatMap((s, i) =>
			s.alt
				? [{ kind: 'shot' as const, text: shots.length > 1 ? `${String.fromCharCode(65 + i)}. ${s.alt}` : s.alt }]
				: []
		);
		panels.push({ n: panels.length + 1, shots, lines: [...carry, ...shotLines, ...lines] });
		carry = [];
	}

	if (carry.length) {
		const last = panels.at(-1);
		if (last) last.lines.push(...carry);
		else panels.push({ n: 1, shots: [], lines: carry });
	}
	return panels;
}
