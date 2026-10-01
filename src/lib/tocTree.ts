import { chapters, entryId, scenesOf, type Chapter, type Entry } from '$lib/story';

/** A nested TOC row: another episode in the same chapter, optionally relabeled. */
export type NestedLeaf = {
	title: string;
	label?: string;
	/** Place this child after the parent’s scene/day with this label; otherwise after all scenes. */
	after?: string;
	/** Also list this child’s scene/day headers under the parent. */
	expandScenes?: boolean;
};

export type NestSpec = {
	parent: string;
	/** Spine label when the stored episode title is the old working name. */
	label?: string;
	children: NestedLeaf[];
};

/**
 * Fold sibling episodes under a scene-parent so the chapter list stays a spine,
 * not a flat dump of flashes. Labels follow the chronicle’s scene names.
 */
export const CHAPTER_NESTS: Record<string, NestSpec[]> = {
	jumong: [],
	samhan: [
		{
			parent: 'The Eight Great Clans',
			children: [{ title: 'Gunchogo, The Hurricane' }, { title: 'Ocean Trade' }]
		},
		{
			parent: 'The Summit',
			children: [{ title: 'Birth of Namseng' }, { title: 'Gwanggaeto, The Conqueror' }]
		}
	],
	'five-principles': [
		{
			parent: 'Gotaso’s Wedding',
			children: [{ title: 'Yeon’s Three Sons' }]
		},
		{
			parent: 'King Euija, the 31st Eraha',
			children: [{ title: 'The Severing' }]
		}
	],
	'iron-will': [
		{
			parent: 'Yeon’s Massacre',
			children: [
				{ title: 'Chunchu & Gesomun' },
				{ title: 'Euija & Gesomun' },
				{ title: 'Kim Yushin' }
			]
		}
	],
	'seventh-invasion': [
		{
			parent: 'Emperor of the West',
			children: [{ title: 'Great River' }]
		},
		{
			parent: 'Stallion Mountain',
			children: [{ title: 'Eastern Fortress' }, { title: 'Boiling River' }]
		}
	],
	'chunchu-era': [
		{
			parent: 'The Hwarang',
			children: [
				{ title: 'Harbour Ledgers', label: 'A Girl from the Harbor', after: 'Flowering Youth', expandScenes: true },
				{
					title: 'The Harmony Council',
					label: 'The Three Eternal Hwarang',
					after: 'Flowering Youth'
				}
			]
		},
		{
			parent: 'Bidam’s Rebellion',
			children: [
				{ title: 'Gaya, the Lost Nations' },
				{ title: 'The Fall of Gaya' },
				{ title: 'Chunchu Goes to the East' }
			]
		},
		{
			parent: 'The Emperor',
			children: [
				{
					title: 'Death of the Second Emperor',
					after: 'Shimin & Chunchu',
					expandScenes: true
				}
			]
		},
		{
			parent: 'The Royal Secretariat',
			label: 'Queen Jinduk',
			children: [{ title: 'King Muyeol' }, { title: 'Hyukgosé' }]
		}
	],
	'fall-of-euija': [
		{
			parent: 'Turtle',
			children: [
				{ title: 'Tamla, the Island of Oranges', label: 'Sulmun & The Three Princes' },
				{ title: 'Big Star and Little Star' }
			]
		},
		{
			parent: 'Her Own Navel-String',
			children: [{ title: 'Black Rock' }]
		},
		{
			parent: 'The Girl Who Cut Her Hair',
			children: [
				{ title: 'The Ox and the Iron Chest' },
				{ title: 'The Ones That End in Stone' },
				{ title: 'Five Thousand' }
			]
		}
	],
	'fall-of-baekje': [
		{
			parent: 'Yellow Mountain Fields',
			children: [{ title: 'Sabi Palace' }, { title: 'The Death of Buyeo Euija' }]
		},
		{
			parent: 'The Death of Kim Chunchu',
			children: [{ title: 'The Four Beasts' }]
		}
	],
	'final-stand': [
		{
			parent: 'Snake River',
			children: [{ title: 'The Surrender of Tamla', after: 'Yumla Defied' }]
		},
		{
			parent: 'Juryu Fortress',
			children: [{ title: 'The Seven Branched Sword' }, { title: 'White River' }]
		},
		{
			parent: 'The Death of Yeon Gesomun',
			children: [
				{ title: 'The Brothers’ Coup', after: 'King Yumla', expandScenes: true }
			]
		}
	],
	'silla-tang-war': [
		{
			parent: 'The Death of Kim Yushin',
			children: [{ title: "The Wanggeom's Guest" }]
		},
		{
			parent: 'Maeso Fortress',
			label: 'Final Battles',
			children: [{ title: 'Strike Harbor', after: 'Maeso Fortress' }]
		}
	]
};

export type TocLeaf = {
	id: string;
	title: string;
	year?: string;
	kind: 'entry' | 'scene' | 'flashback' | 'day';
};

const nestedTitleSets = new Map<string, Set<string>>();
for (const [chapterId, nests] of Object.entries(CHAPTER_NESTS)) {
	const set = new Set<string>();
	for (const nest of nests) {
		for (const child of nest.children) set.add(child.title);
	}
	nestedTitleSets.set(chapterId, set);
}

export function isNestedChild(chapterId: string, title: string): boolean {
	return nestedTitleSets.get(chapterId)?.has(title) ?? false;
}

export function nestChildren(chapterId: string, parentTitle: string): NestedLeaf[] {
	return CHAPTER_NESTS[chapterId]?.find((n) => n.parent === parentTitle)?.children ?? [];
}

export function spineLabel(ch: Chapter, en: Entry): string {
	return CHAPTER_NESTS[ch.id]?.find((n) => n.parent === en.title)?.label ?? en.title;
}

/** Episode titles that stay on the chapter spine (parents + ungrouped siblings). */
export function spineEntries(ch: Chapter): Entry[] {
	return ch.entries.filter((en) => !isNestedChild(ch.id, en.title));
}

function childLeaf(ch: Chapter, child: NestedLeaf, ep: Entry): TocLeaf {
	return {
		id: entryId(ch.id, ep.title),
		title: child.label ?? ep.title,
		year: ep.year,
		kind: 'entry'
	};
}

function pushChild(
	ch: Chapter,
	child: NestedLeaf,
	ep: Entry,
	leaves: TocLeaf[]
) {
	leaves.push(childLeaf(ch, child, ep));
	if (!child.expandScenes) return;
	const cid = entryId(ch.id, ep.title);
	for (const cs of scenesOf(ep.blocks, cid)) {
		leaves.push({ id: cs.id, title: cs.title, kind: cs.kind });
	}
}

export function tocLeavesFor(ch: Chapter, en: Entry, eid: string, readingEntry: Entry): TocLeaf[] {
	const byTitle = new Map(ch.entries.map((e) => [e.title, e]));
	const nested = nestChildren(ch.id, en.title);
	const placed = new Set<NestedLeaf>();
	const leaves: TocLeaf[] = [];
	for (const s of scenesOf(readingEntry.blocks, eid)) {
		leaves.push({ id: s.id, title: s.title, kind: s.kind });
		for (const child of nested) {
			if (child.after !== s.title) continue;
			const ep = byTitle.get(child.title);
			if (!ep) continue;
			placed.add(child);
			pushChild(ch, child, ep, leaves);
		}
	}
	for (const child of nested) {
		if (placed.has(child)) continue;
		const ep = byTitle.get(child.title);
		if (!ep) continue;
		pushChild(ch, child, ep, leaves);
	}
	return leaves;
}

/** True if this episode or any of its TOC children is the scroll/episode target. */
export function branchContains(leaves: TocLeaf[], activeEntry: string, sceneId: string): boolean {
	if (!activeEntry && !sceneId) return false;
	return leaves.some((leaf) => leaf.id === activeEntry || leaf.id === sceneId);
}

/** Dev check: nested titles exist on the chapter. */
export function assertTocNests(): string[] {
	const missing: string[] = [];
	const byId = new Map(chapters.map((c) => [c.id, c]));
	for (const [chapterId, nests] of Object.entries(CHAPTER_NESTS)) {
		const ch = byId.get(chapterId);
		if (!ch) {
			missing.push(`chapter ${chapterId}`);
			continue;
		}
		const titles = new Set(ch.entries.map((e) => e.title));
		for (const nest of nests) {
			if (!titles.has(nest.parent)) missing.push(`${chapterId} / parent ${nest.parent}`);
			for (const child of nest.children) {
				if (!titles.has(child.title)) missing.push(`${chapterId} / ${child.title}`);
			}
		}
	}
	return missing;
}
