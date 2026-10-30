/**
 * Local briefing for Momal (the Ask guide): our wiki, the whole script, and
 * every record card already quoted in story.json. Live Wikipedia / Namu /
 * Samguk fetches sit in askRecords.ts.
 */

import SUMMARIES from '$lib/data/scene-summaries.json';
import { KINGDOMS, byId, nameOf, type Person } from '$lib/people';
import { foldRoman } from '$lib/romanFold';
import { plainText } from '$lib/speech';
import {
	chapters,
	entryId,
	entrySlug,
	type Block,
	type Entry
} from '$lib/story';
import { clanOf, familyOf, formatYear, kindOf, lifespanOf } from '$lib/wiki';

type PackedPerson = {
	id: string;
	card: string;
	hay: string;
	names: string[];
};

type PackedEpisode = {
	id: string;
	queryId: string;
	title: string;
	subtitle?: string;
	year: string;
	logline: string;
	cast: string[];
	card: string;
	hay: string;
};

type PackedScene = {
	id: string;
	episodeId: string;
	title: string;
	body: string;
	hay: string;
};

type PackedRecord = {
	episodeId: string;
	source: string;
	body: string;
	hay: string;
};

type Packed = {
	people: PackedPerson[];
	alias: Map<string, string>;
	episodes: PackedEpisode[];
	byQuery: Map<string, PackedEpisode>;
	scenes: PackedScene[];
	records: PackedRecord[];
};

const STOP = new Set(
	`who what where when why how is are was were the a an of in on for to about tell me please explain does did this that episode character person named called
누구 누구야 누구인가 뭐 뭐야 무엇 어떤 설명해 알려줘 대해 은 는 이 가 을 를 에 의 좀 요 인가 입니까`.split(
		/\s+/
	)
);

const PERIOD = /silla|baekje|goguryeo|samhan|samguk|삼국|三國|신라|백제|고구려|sagi|yusa/i;

const strip = plainText;

function norm(s: string): string {
	return foldRoman(s.toLowerCase().normalize('NFKC').replace(/['’]/g, '').replace(/\s+/g, ' ').trim());
}

function namesOf(p: Person): string[] {
	return [p.id, p.name, p.korean, p.hanja, ...(p.aliases ?? []), ...(p.sobriquets ?? [])].filter(
		(n): n is string => !!n && n.trim().length > 0
	);
}

function walk(blocks: Block[] | undefined, visit: (b: Block) => void) {
	for (const b of blocks ?? []) {
		visit(b);
		if (b.kind === 'flashback') walk(b.blocks, visit);
	}
}

function blockPlain(b: Block): string {
	if (b.kind === 'p' || b.kind === 'quote' || b.kind === 'monologue' || b.kind === 'moral' || b.kind === 'cite') {
		return strip([b.html, 'ko' in b ? b.ko : ''].filter(Boolean).join(' '));
	}
	if (b.kind === 'dialogue') {
		const who = b.person ? (byId.get(b.person)?.name ?? b.person) : (b.speaker ?? 'Someone');
		const lines = [...(b.en ?? []), ...(b.lines ?? [])].map(strip).filter(Boolean);
		return lines.map((line) => `${who}: ${line}`).join('\n');
	}
	if (b.kind === 'verse') {
		return [...(b.en ?? []), ...(b.lines ?? [])].map(strip).join(' / ');
	}
	if (b.kind === 'edict' || b.kind === 'covenant' || b.kind === 'oath' || b.kind === 'poem') {
		return strip([b.html, 'ko' in b ? b.ko : '', 'hanja' in b ? b.hanja : '', b.source].filter(Boolean).join(' '));
	}
	return '';
}

function personCard(p: Person): string {
	const lines: string[] = [];
	const aka = namesOf(p).filter((n) => n !== p.id && n !== p.name);
	lines.push(`${p.name}${p.korean ? ` / ${p.korean}` : ''}${p.hanja ? ` / ${p.hanja}` : ''}  (wiki id: ${p.id})`);
	if (aka.length) lines.push(`Also called: ${aka.join(', ')}`);
	const k = KINGDOMS[p.kingdom];
	lines.push(`Kind: ${kindOf(p)} · ${k.label}${k.korean ? ` / ${k.korean}` : ''}`);
	if (p.title) lines.push(`Title: ${p.title}`);
	const clan = clanOf(p);
	if (clan) lines.push(`Clan: ${clan}`);
	const life = lifespanOf(p);
	if (life) {
		const invented = [p.bornInvented && 'birth is the chronicle’s', p.diedInvented && 'death is the chronicle’s']
			.filter(Boolean)
			.join('; ');
		lines.push(`Lived: ${life}${invented ? ` (${invented})` : ''}`);
	}
	if (p.tagline) lines.push(`Tagline: ${p.tagline}`);
	if (p.quote) lines.push(`Defining line: "${p.quote}"`);
	if (p.arc) lines.push(`Chronicle arc: ${p.arc}`);
	if (p.events?.length) {
		lines.push('Events:');
		for (const ev of p.events) {
			lines.push(`- ${ev.year != null ? `${formatYear(ev.year)}: ` : ''}${ev.label}`);
		}
	}
	const family = familyOf(p);
	if (family.length) {
		lines.push(`Family / bonds: ${family.map((f) => `${f.role} — ${nameOf(f.person)}`).join('; ')}`);
	}
	return lines.join('\n');
}

function castIds(entry: Entry): string[] {
	if (entry.cast?.length) return entry.cast;
	const ids: string[] = [];
	const seen = new Set<string>();
	walk(entry.blocks, (b) => {
		if (b.kind === 'dialogue' && b.person && !seen.has(b.person)) {
			seen.add(b.person);
			ids.push(b.person);
		}
	});
	return ids.slice(0, 10);
}

function uniqueTitleSlugs(): Set<string> {
	const counts = new Map<string, number>();
	for (const ch of chapters) {
		for (const e of ch.entries) {
			const slug = entrySlug(e.title);
			counts.set(slug, (counts.get(slug) ?? 0) + 1);
		}
	}
	const unique = new Set<string>();
	for (const [slug, n] of counts) if (n === 1) unique.add(slug);
	return unique;
}

function sceneChunks(entry: Entry, episodeId: string): PackedScene[] {
	const out: PackedScene[] = [];
	let title = entry.title;
	let buf: string[] = [];
	const summaries = SUMMARIES as Record<string, { en?: string; ko?: string }>;

	const flush = (id: string, sceneTitle: string) => {
		const script = buf.join('\n').trim();
		buf = [];
		const sum = summaries[id];
		const summary = [sum?.en, sum?.ko].filter(Boolean).join(' / ');
		if (!script && !summary) return;
		const body = [
			summary ? `Summary: ${summary}` : '',
			script ? `Script:\n${script.slice(0, 2200)}` : ''
		]
			.filter(Boolean)
			.join('\n');
		out.push({
			id,
			episodeId,
			title: sceneTitle,
			body,
			hay: norm(`${sceneTitle} ${summary} ${script.slice(0, 4000)}`)
		});
	};

	let sceneSlug = 'open';
	const used = new Map<string, number>();
	const slugFor = (label: string) => {
		const base = entrySlug(label) || 'scene';
		const k = (used.get(base) ?? 0) + 1;
		used.set(base, k);
		return k === 1 ? base : `${base}-${k}`;
	};

	walk(entry.blocks, (b) => {
		if (b.kind === 'scene' || b.kind === 'day' || b.kind === 'story' || b.kind === 'section') {
			flush(`${episodeId}-${sceneSlug}`, title);
			sceneSlug = slugFor(b.label);
			title = b.label;
			return;
		}
		if (b.kind === 'flashback' && b.title) {
			flush(`${episodeId}-${sceneSlug}`, title);
			sceneSlug = slugFor(b.title);
			title = b.title;
			return;
		}
		const t = blockPlain(b);
		if (t) buf.push(t);
	});
	flush(`${episodeId}-${sceneSlug}`, title);
	return out;
}

function build(): Packed {
	const unique = uniqueTitleSlugs();
	const people: PackedPerson[] = [];
	const alias = new Map<string, string>();
	for (const p of byId.values()) {
		if (kindOf(p) === 'other' && !p.arc && !p.tagline) continue;
		const names = namesOf(p);
		const card = personCard(p);
		people.push({ id: p.id, card, hay: norm(`${names.join(' ')} ${card}`), names });
		for (const n of names) {
			const key = norm(n);
			if (key.length < 2) continue;
			if (!alias.has(key)) alias.set(key, p.id);
		}
	}

	const episodes: PackedEpisode[] = [];
	const byQuery = new Map<string, PackedEpisode>();
	const scenes: PackedScene[] = [];
	const records: PackedRecord[] = [];

	for (const ch of chapters) {
		for (const entry of ch.entries) {
			if (entry.hidden) continue;
			const id = entryId(ch.id, entry.title);
			const slug = entrySlug(entry.title);
			const queryId = unique.has(slug) ? slug : id;
			const cast = castIds(entry);
			const logline = entry.logline
				? `${entry.logline.en}${entry.logline.ko ? ` / ${entry.logline.ko}` : ''}`
				: '';
			const castNames = cast
				.map((cid) => {
					const p = byId.get(cid);
					return p ? `${p.name}${p.korean ? ` (${p.korean})` : ''}` : cid;
				})
				.join(', ');
			const card = [
				`Episode: ${entry.title}${entry.subtitle ? ` / ${entry.subtitle}` : ''}`,
				`Id: ${id}  ·  ?ep=${queryId}  ·  Year: ${entry.year}`,
				`Arc: ${ch.title}${ch.korean ? ` / ${ch.korean}` : ''}`,
				logline ? `Logline: ${logline}` : '',
				castNames ? `Cast: ${castNames}` : '',
				entry.place ? `Place: ${entry.place}` : ''
			]
				.filter(Boolean)
				.join('\n');
			const ep: PackedEpisode = {
				id,
				queryId,
				title: entry.title,
				subtitle: entry.subtitle,
				year: entry.year,
				logline,
				cast,
				card,
				hay: norm(`${entry.title} ${entry.subtitle ?? ''} ${queryId} ${id} ${logline} ${castNames}`)
			};
			episodes.push(ep);
			byQuery.set(queryId, ep);
			byQuery.set(id, ep);
			byQuery.set(norm(entry.title), ep);
			if (entry.subtitle) byQuery.set(norm(entry.subtitle), ep);

			scenes.push(...sceneChunks(entry, id));

			walk(entry.blocks, (b) => {
				if (b.kind !== 'quote' && b.kind !== 'edict' && b.kind !== 'covenant' && b.kind !== 'oath') return;
				const source = b.source;
				const body = [
					`Source: ${source}`,
					b.hanja ? `Hanja: ${strip(b.hanja)}` : '',
					b.ko ? `Korean: ${strip(b.ko)}` : '',
					`English: ${strip(b.html)}`
				]
					.filter(Boolean)
					.join('\n');
				records.push({
					episodeId: id,
					source,
					body,
					hay: norm(`${source} ${body} ${entry.title}`)
				});
			});
		}
	}

	return { people, alias, episodes, byQuery, scenes, records };
}

let packed: Packed | null = null;

function corpus(): Packed {
	if (!packed) packed = build();
	return packed;
}

export function cleanQuery(q: string): string {
	return q
		.replace(/[?!.,:;'"“”‘’]/g, ' ')
		.split(/\s+/)
		.filter((w) => w && !STOP.has(w.toLowerCase()))
		.join(' ')
		.trim();
}

function tokens(q: string): string[] {
	return norm(cleanQuery(q) || q)
		.split(/[^a-z0-9가-힣]+/)
		.filter((t) => t.length >= 2);
}

function scoreHay(hay: string, toks: string[]): number {
	let s = 0;
	for (const t of toks) {
		if (hay.includes(t)) s += t.length >= 4 ? 6 : 3;
	}
	return s;
}

export function pageFocus(page: string): { personId?: string; episode?: PackedEpisode; path: string } {
	const pack = corpus();
	let path = page || '';
	try {
		const u = new URL(page, 'http://local.invalid');
		path = `${u.pathname}${u.search}`;
		const id = u.searchParams.get('id');
		const ep = u.searchParams.get('ep');
		const personId = id && pack.people.some((p) => p.id === id) ? id : undefined;
		const episode = ep ? pack.byQuery.get(ep) ?? pack.byQuery.get(norm(ep)) : undefined;
		return { personId, episode, path };
	} catch {
		return { path };
	}
}

export function retrieveAsk(query: string, page: string): {
	people: PackedPerson[];
	episodes: PackedEpisode[];
	scenes: PackedScene[];
	records: PackedRecord[];
	focus: ReturnType<typeof pageFocus>;
} {
	const pack = corpus();
	const focus = pageFocus(page);
	const q = query.trim();
	const cleaned = norm(cleanQuery(q) || q);
	const toks = tokens(q);

	const personIds: string[] = [];
	const addPerson = (id: string) => {
		if (!personIds.includes(id)) personIds.push(id);
	};

	const aliasHit = pack.alias.get(cleaned);
	if (aliasHit) addPerson(aliasHit);
	for (const [key, id] of pack.alias) {
		if (key.length < 3 || id === aliasHit) continue;
		const hit = /[가-힣]/.test(key)
			? cleaned.includes(key)
			: new RegExp(`(?:^| )${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?: |$)`).test(cleaned);
		if (hit) addPerson(id);
	}
	if (focus.personId) addPerson(focus.personId);
	if (focus.episode) for (const id of focus.episode.cast) addPerson(id);

	if (personIds.length < 4) {
		const ranked = pack.people
			.map((p) => ({ p, s: scoreHay(p.hay, toks) + (p.names.some((n) => norm(n) === cleaned) ? 80 : 0) }))
			.filter((x) => x.s > 0)
			.sort((a, b) => b.s - a.s);
		for (const x of ranked) {
			addPerson(x.p.id);
			if (personIds.length >= 5) break;
		}
	}

	const people = personIds
		.map((id) => pack.people.find((p) => p.id === id))
		.filter((p): p is PackedPerson => !!p)
		.slice(0, 5);

	const episodeIds: string[] = [];
	const addEp = (id: string) => {
		if (!episodeIds.includes(id)) episodeIds.push(id);
	};
	if (focus.episode) addEp(focus.episode.id);
	const titleHit = pack.byQuery.get(cleaned);
	if (titleHit) addEp(titleHit.id);
	const epRanked = pack.episodes
		.map((e) => ({
			e,
			s:
				scoreHay(e.hay, toks) +
				(people.some((p) => e.cast.includes(p.id)) ? 12 : 0) +
				(norm(e.title) === cleaned || norm(e.subtitle ?? '') === cleaned ? 40 : 0)
		}))
		.filter((x) => x.s > 0)
		.sort((a, b) => b.s - a.s);
	for (const x of epRanked) {
		addEp(x.e.id);
		if (episodeIds.length >= 4) break;
	}
	const episodes = episodeIds
		.map((id) => pack.episodes.find((e) => e.id === id))
		.filter((e): e is PackedEpisode => !!e)
		.slice(0, 4);

	const wantedEps = new Set(episodes.map((e) => e.id));
	const scenes = pack.scenes
		.map((sc) => ({
			sc,
			s:
				scoreHay(sc.hay, toks) +
				(wantedEps.has(sc.episodeId) ? 8 : 0) +
				(focus.episode?.id === sc.episodeId ? 6 : 0)
		}))
		.filter((x) => x.s > 8)
		.sort((a, b) => b.s - a.s)
		.slice(0, 6)
		.map((x) => x.sc);

	const records = pack.records
		.map((r) => ({
			r,
			s:
				scoreHay(r.hay, toks) +
				(wantedEps.has(r.episodeId) ? 10 : 0) +
				(PERIOD.test(r.source) ? 2 : 0)
		}))
		.filter((x) => x.s > 6)
		.sort((a, b) => b.s - a.s)
		.slice(0, 8)
		.map((x) => x.r);

	return { people, episodes, scenes, records, focus };
}

export function searchHints(people: PackedPerson[]): { korean: string; english: string; hanja?: string }[] {
	return people.slice(0, 3).map((p) => {
		const person = byId.get(p.id);
		return {
			korean: person?.korean || person?.name || p.id,
			english: person?.name || p.id,
			hanja: person?.hanja
		};
	});
}
