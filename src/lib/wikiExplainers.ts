/**
 * Right-hand shelf notes for wiki categories that are not self-explanatory.
 * Plain shelves (characters, cities, nations…) skip the panel.
 */
import type { WikiKind } from '$lib/wiki';

export type WikiShelfNote = {
	id: string;
	label: string;
	body: string;
};

export type WikiExplainer = {
	eyebrow: string;
	title: string;
	lede: string;
	shelves: readonly WikiShelfNote[];
	/** Gods keep the three-court chart under the lede. */
	chart?: 'pantheon';
};

export const WIKI_EXPLAINERS: Partial<Record<WikiKind, WikiExplainer>> = {
	god: {
		eyebrow: '삼계',
		title: 'The Pantheon',
		lede: 'Hannim sits above. Below him three courts: living world (red), land of the dead (blue), western flower field (green). Heaven–Earth King once held living and dead together — his border wears all three.',
		chart: 'pantheon',
		shelves: [
			{
				id: 'I',
				label: 'Tier I · Lords',
				body: 'Daebyul (Big Star), Sobyul (Lord of Life), Hallakgungi (The Gardener).'
			},
			{
				id: 'II',
				label: 'Tier II · Domains',
				body: 'Life — Haemosu, Ibiga, Sky Princess / Samsin. Death — Yumla, Bari, Dragon Lady / Gusamsin.'
			},
			{
				id: 'ensembles',
				label: 'Ensembles',
				body: 'Four Furies · Three Cavern Goddesses · Grim Reapers — small gray titles under each tier, not a separate sort.'
			},
			{
				id: 'IV',
				label: 'Tier IV · Particulars',
				body: 'Junggyun (Lady of the Right View), Sulmun (The Giant Lady), Ungnyeo (Bear-Woman), and other place gods.'
			}
		]
	},
	animal: {
		eyebrow: '짐승',
		title: 'Animals',
		lede: 'Named horses, and the beast a kingdom keeps as its sign. The card says who rides it.',
		shelves: [
			{
				id: 'horse',
				label: 'Horses',
				body: 'War mounts. Yushin’s three, Gyebek’s black, Gesomun’s Damul, the Six Steeds.'
			},
			{
				id: 'guardian',
				label: 'Guardians',
				body: 'One sign each: heavenly horse, white deer, three-legged crow, yellow dragon, bear, pony, kite.'
			},
			{
				id: 'rest',
				label: 'The rest',
				body: 'The magistrate’s bloodhounds, and the fox later houses invented.'
			}
		]
	},
	flower: {
		eyebrow: '꽃',
		title: 'Flowers',
		lede: 'All of them grow in the western field. The first shelf has an order.',
		shelves: [
			{
				id: 'revive',
				label: 'Resurrection',
				body: 'Six, in order: bone, flesh, blood, organ, breath, soul.'
			},
			{
				id: 'curse',
				label: 'Curse blooms',
				body: 'Laugh, weep, fight, flame, rich, kind, ruin.'
			},
			{
				id: 'life',
				label: 'Life',
				body: 'Samsin’s one bloom for one person. It dies when they do.'
			}
		]
	},
	people: {
		eyebrow: '열 겨레',
		title: 'Ten Peoples',
		lede: 'Civilizations, not the kingdoms that sit inside them.',
		shelves: [
			{
				id: 'near',
				label: 'Near lands',
				body: 'Samhan, Wa, and the northern marches.'
			},
			{
				id: 'far',
				label: 'Far lands',
				body: 'Stations on the road west. Past them the map turns to myth.'
			}
		]
	},
	concept: {
		eyebrow: '리',
		title: 'Concepts',
		lede: 'The ages, the pacts, the ideas they argue with, and the sayings they reach for.',
		shelves: [
			{ id: 'era', label: 'Eras', body: 'The spans on the border timeline, hegemonies included.' },
			{
				id: 'alliance',
				label: 'Alliances',
				body: 'Love, Iron, Blood, and the bargain with the West.'
			},
			{ id: 'idiom', label: 'Idioms', body: 'The lines people actually quote.' },
			{
				id: 'idea',
				label: 'Ideas',
				body: 'Rank, rite, and the institutions that are not a council.'
			}
		]
	},
	object: {
		eyebrow: '물',
		title: 'Objects',
		lede: 'Things a person carries, and the posts that keep a gate. The card lists who held it when that applies.',
		shelves: [
			{
				id: 'sword',
				label: 'Swords',
				body: 'One ring-pommel shape. The openwork inside the ring is the name.'
			},
			{ id: 'instrument', label: 'Instruments', body: 'What gets played, and who plays it.' },
			{ id: 'clothing', label: 'Clothing', body: 'Robes, caps, and crowns.' },
			{
				id: 'relic',
				label: 'Relics',
				body: 'Jangseung at the gate, Samsin’s painting, Bihyung’s door charm — and other kept posts and hangings.'
			}
		]
	},
	tribe: {
		eyebrow: '족',
		title: 'Tribes',
		lede: 'Peoples without a drawn border. Each keeps an animal or ground epithet — stag, bear, falcon; river, steppe, forest — and a culture the courts only meet at the edge.',
		shelves: [
			{
				id: 'north',
				label: 'Northern band',
				body: 'Sukshin of the forest, Malgal of the rivers, Khitan of the steppe — and the older Xianbei horse roof.'
			},
			{
				id: 'wa',
				label: 'Yamato fringe',
				body: 'Emishi stag tribes, Kumaso bear tribes, Hayato falcon tribes — wash under Yamato’s rising sun.'
			}
		]
	}
};
