/**
 * What Momal's answer widgets draw from: compact cards for people, episodes and
 * stills, plus the visible "thinking" steps built from the real retrieval.
 */

import IMAGE_PEOPLE from '$lib/data/image-people.json';
import { KINGDOMS, avatarOf, byId, colorOf } from '$lib/people';
import { chapters, entryId, type Entry, type ImageSlot } from '$lib/story';
import { lifespanOf } from '$lib/wiki';
import { findEpisode } from '$lib/server/askCorpus';
import type { AskFound } from '$lib/server/askContext';
import { familyTree, kinAmong, kinPeople } from '$lib/server/askKin';
import type { LiveRecord } from '$lib/server/askRecords';
import { widgetType } from '$lib/widgets';
import type {
	MomalEpisodeRef,
	MomalPersonRef,
	MomalRefs,
	MomalSource,
	MomalStep,
	MomalStill,
	MomalTrace
} from '$lib/momalTypes';

const STILLS_PER_PERSON = 6;
const slotPeople = IMAGE_PEOPLE as Record<string, string[]>;

function artOf(slot: ImageSlot, temp = false): string | undefined {
	return temp ? (slot.tempImage ?? slot.src) : (slot.src ?? slot.tempImage);
}

function shown(slot: ImageSlot): boolean {
	return !slot.nsfw && !slot.hidden && !slot.gallery && !!artOf(slot);
}

type Indexed = { entries: Map<string, Entry>; stills: Map<string, MomalStill[]> };
let indexed: Indexed | null = null;

function index(): Indexed {
	if (indexed) return indexed;
	const entries = new Map<string, Entry>();
	const stills = new Map<string, MomalStill[]>();
	for (const ch of chapters) {
		for (const entry of ch.entries) {
			if (entry.hidden) continue;
			const id = entryId(ch.id, entry.title);
			entries.set(id, entry);
			for (const slot of entry.images ?? []) {
				if (!shown(slot) || slot.ratio < 1.2) continue;
				const who = slotPeople[slot.id] ?? slot.people ?? [];
				for (const pid of who) {
					const list = stills.get(pid) ?? [];
					list.push({
						id: slot.id,
						src: artOf(slot)!,
						alt: slot.alt ?? entry.title,
						episode: id,
						episodeTitle: entry.title
					});
					stills.set(pid, list);
				}
			}
		}
	}
	indexed = { entries, stills };
	return indexed;
}

function coverOf(entry: Entry): string | undefined {
	const slots = entry.images ?? [];
	const pick = entry.thumbnail ? slots.find((s) => s.id === entry.thumbnail && !s.nsfw) : undefined;
	if (pick) return artOf(pick, entry.thumbnailLayer === 'temp');
	const wide = slots.find((s) => shown(s) && s.ratio >= 1.5) ?? slots.find(shown);
	return wide ? artOf(wide) : undefined;
}

export function personRef(id: string): MomalPersonRef | null {
	const p = byId.get(id);
	if (!p) return null;
	const k = KINGDOMS[p.kingdom];
	return {
		id: p.id,
		name: p.name,
		korean: p.korean,
		hanja: p.hanja,
		kingdom: k?.label ?? p.kingdom,
		kingdomKo: k?.korean,
		color: colorOf(p),
		avatar: avatarOf(p),
		life: lifespanOf(p) || undefined,
		title: p.title,
		tagline: p.tagline,
		invented: !!(p.bornInvented || p.diedInvented)
	};
}

export function episodeRef(id: string): MomalEpisodeRef | null {
	const ep = findEpisode(id);
	if (!ep) return null;
	const entry = index().entries.get(ep.id);
	return {
		id: ep.id,
		queryId: ep.queryId,
		title: ep.title,
		subtitle: ep.subtitle,
		year: ep.year,
		logline: entry?.logline,
		cover: entry ? coverOf(entry) : undefined
	};
}

export function stillsOf(id: string): MomalStill[] {
	const all = index().stills.get(id) ?? [];
	if (all.length <= STILLS_PER_PERSON) return all;
	const step = all.length / STILLS_PER_PERSON;
	return Array.from({ length: STILLS_PER_PERSON }, (_, i) => all[Math.floor(i * step)]);
}

/** Cards for any ids the model named, keyed by the id it used, plus the family ties among them. */
export function refsFor(people: string[], episodes: string[]): MomalRefs {
	const refs: MomalRefs = { people: {}, episodes: {}, stills: {}, kin: kinAmong(people), family: {} };
	for (const id of people) {
		const ref = personRef(id);
		if (!ref) continue;
		refs.people[id] = ref;
		refs.stills[id] = stillsOf(id);
		const fam = familyTree(id);
		if (fam) refs.family[id] = fam;
	}
	for (const id of kinPeople(refs.kin, refs.family)) {
		if (refs.people[id]) continue;
		const ref = personRef(id);
		if (ref) refs.people[id] = ref;
	}
	for (const id of episodes) {
		const ref = episodeRef(id);
		if (ref) refs.episodes[id] = ref;
	}
	return refs;
}

function uniq(list: string[]): string[] {
	return [...new Set(list.filter(Boolean))];
}

/** The briefing as the reader sees it while Momal thinks. `live` is null until outside records return. */
export function buildTrace(found: AskFound, live: LiveRecord[] | null, ms: number): MomalTrace {
	const people = found.ids;
	const episodes = found.episodes.map((e) => e.queryId);
	if (found.focus.episode && !episodes.includes(found.focus.episode.queryId))
		episodes.unshift(found.focus.episode.queryId);
	const refs = refsFor(people, episodes);

	const steps: MomalStep[] = [];
	const where = found.focus.episode?.title ?? (found.focus.personId ? byId.get(found.focus.personId)?.name : '');
	if (where) steps.push({ icon: 'visibility', en: 'Read the page you are on', ko: '지금 보는 페이지를 읽음', items: [where] });
	const names = people.flatMap((id) => (refs.people[id] ? [refs.people[id].name] : []));
	if (names.length)
		steps.push({
			icon: 'person_search',
			en: `Looked up ${names.length} ${names.length === 1 ? 'person' : 'people'} in the wiki`,
			ko: `위키에서 인물 ${names.length}명을 찾음`,
			items: names
		});
	const ties = Object.values(refs.kin);
	if (ties.length)
		steps.push({
			icon: 'family_history',
			en: `Traced ${ties.length} family ${ties.length === 1 ? 'tie' : 'ties'} on the tree`,
			ko: `족보에서 관계 ${ties.length}개를 따라감`,
			items: ties.map((k) => `${refs.people[k.a]?.name ?? k.a} · ${refs.people[k.b]?.name ?? k.b}: ${k.en}`)
		});
	if (found.widgets.length)
		steps.push({
			icon: 'widgets',
			en: `Found ${found.widgets.length} ${found.widgets.length === 1 ? 'widget' : 'widgets'} in the book`,
			ko: `책에서 위젯 ${found.widgets.length}개를 찾음`,
			items: found.widgets.map((w) => `${widgetType(w.w.kind)?.label ?? w.w.kind} · ${w.w.entryTitle}`)
		});
	if (found.episodes.length)
		steps.push({
			icon: 'auto_stories',
			en: `Opened ${found.episodes.length} ${found.episodes.length === 1 ? 'episode' : 'episodes'}`,
			ko: `에피소드 ${found.episodes.length}편을 펼침`,
			items: found.episodes.map((e) => e.title)
		});
	if (found.scenes.length)
		steps.push({
			icon: 'theaters',
			en: `Read ${found.scenes.length} ${found.scenes.length === 1 ? 'scene' : 'scenes'} of the script`,
			ko: `대본 ${found.scenes.length}장면을 읽음`,
			items: uniq(found.scenes.map((s) => s.title))
		});
	const quoted = uniq(found.records.map((r) => r.source));
	if (quoted.length)
		steps.push({
			icon: 'history_edu',
			en: `Checked ${found.records.length} passages of the record`,
			ko: `기록 ${found.records.length}구절을 대조함`,
			items: quoted
		});
	steps.push(
		live === null
			? { icon: 'travel_explore', en: 'Searching outside records…', ko: '바깥 기록을 찾는 중…', items: [] }
			: {
					icon: 'travel_explore',
					en: live.length ? `Searched ${live.length} outside records` : 'No outside records found',
					ko: live.length ? `바깥 기록 ${live.length}건을 찾음` : '바깥 기록 없음',
					items: uniq(live.map((r) => r.source))
				}
	);

	const sources: MomalSource[] = [
		...quoted.map((label): MomalSource => ({ label, layer: 'record' })),
		...(live ?? []).map((r): MomalSource => ({ label: r.source, url: r.url, layer: 'record' }))
	];

	return { ...refs, ms, steps, sources };
}
