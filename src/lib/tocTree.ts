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
	samhan: [
		{
			parent: 'Queen Sunduk',
			children: [{ title: 'Jinheung, The Crescent Moon' }]
		},
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
			children: [{ title: 'Jinheung’s Betrayal' }]
		}
	],
	'iron-will': [
		{
			parent: 'Daeya Fortress',
			children: [{ title: 'The First Kim' }]
		},
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
		},
		{
			parent: 'Ansi',
			children: [{ title: 'Jumong' }]
		}
	],
	'chunchu-era': [
		{
			parent: 'The Hwarang',
			children: [
				{ title: 'Harbour Ledgers', label: 'A Girl from the Harbor', after: 'Flowering Youth' },
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
			parent: 'Gyebek’s Exile',
			children: [
				{ title: 'Tamla, the Island of Oranges', label: 'Tamla' },
				{ title: 'Big Star and Little Star' },
				{ title: 'The Great Lady’s Apron', label: 'Sulmun & The Three Princes' },
				{ title: 'Kangrim', label: 'Hallakgungi' },
				{ title: 'Her Own Navel-String' },
				{ title: 'The Girl Who Cut Her Hair' },
				{ title: 'The Ox and the Iron Chest' },
				{ title: 'The Ones That End in Stone' },
				{ title: 'The Tribute of Oranges' }
			]
		},
		{
			parent: 'Euija’s Descent',
			children: [
				{ title: 'Euija’s Coup', label: 'The Coup' },
				{ title: 'Black Rock', label: 'Nightmares' },
				{ title: 'The Nine Plagues', label: 'Nine Omens' },
				{ title: 'Five Thousand' },
				{ title: 'The Fifth Year' }
			]
		},
		{
			parent: 'The Three Loyalists',
			children: [{ title: 'Onjo' }]
		}
	],
	'fall-of-baekje': [
		{
			parent: 'Yellow Mountain Fields',
			children: [
				{ title: 'Dangun & Old Joseon' },
				{ title: 'Sabi Palace' },
				{ title: 'The Death of Buyeo Euija' },
				{ title: 'The Seven Branched Sword' }
			]
		},
		{
			parent: 'The Death of Kim Chunchu',
			children: [{ title: 'The Four Beasts' }]
		},
		{
			parent: 'Baekje Restoration Society',
			children: [{ title: 'White River' }]
		}
	],
	'final-stand': [
		{
			parent: 'Snake River',
			children: [{ title: 'The Surrender of Tamla', after: 'Yumla Defied' }]
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
			parent: 'The Protectorate',
			children: [{ title: 'The Fall of Joseon' }, { title: 'Stone Gate' }]
		},
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
