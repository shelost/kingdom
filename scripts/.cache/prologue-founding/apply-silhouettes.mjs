// Prologue silhouette pass: new art on the flow stills and the emotion heroes,
// gallery-only silhouette slots, and each emotion card's character + gallery.
//   node scripts/.cache/prologue-founding/apply-silhouettes.mjs
// then install the art:
//   node scripts/install-temp-art.mjs scripts/.cache/prologue-founding/silhouettes-manifest.json
import fs from 'node:fs';
import path from 'node:path';
import { editStory } from '../story-ops.mjs';
import { FLOW, HEROES, GALLERY } from './silhouettes.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);

/** Each emotion card: its character, and the strip of stills (any episode) under it. */
const CARDS = {
	love: {
		focus: 'sunduk',
		gallery: ['sunduk-yushin-back-blush', 'sunduk-chunma-stars', 'prologue-gal-love', 'dy-range-lookaway', 'sd-last-oath', 'rel-sunduk-yushin', 'sunduk-wound-close']
	},
	revenge: {
		focus: 'chunchu',
		gallery: ['chunchu-revenge-oath', 'chunchu_hand_seal', 'prologue-gal-revenge', 'hadong-empty-saddle', 'scenes-star-chunchu-vow', 'muyeol-chunma-sabi', 'euija-pours-wine']
	},
	betrayal: {
		focus: 'gumil',
		gallery: ['scenes-daeya-gumil-watches', 'scenes-daeya-gold-in-hand', 'prologue-gal-betrayal', 'scenes-daeya-gumil-face', 'scenes-daeya-granary-fire', 'yunchung-gate-ride', 'scenes-daeya-gumil-kneels']
	},
	greed: {
		focus: 'euija',
		gallery: ['scenes-baekje-feast-smoke', 'hedonism', 'prologue-gal-greed', 'euija-sinrok-throne', 'parody-coup-poster-euija', 'euija-crown-eaten', 'euija-death-close']
	},
	loyalty: {
		focus: 'gyebek',
		gallery: ['duel-last-line-strip', 'bank-rice-balls', 'prologue-gal-loyalty', 'gomanari-forehead', 'hwangsan-black-white-gap', 'duel-oil-gwanchang-helm', 'gyebek-death-pieta']
	},
	pride: {
		focus: 'gesomun',
		gallery: ['gesomun-samjogo-river', 'poster_gesomun', 'prologue-gal-pride', 'gesomun-title', 'five-blades', 'scenes-star-gesomun-vow', 'death-gesomun-reaper']
	},
	rage: {
		focus: 'bidam',
		gallery: ['prologue-gal-rage-never', 'council-bidam-rise', 'prologue-gal-rage', 'bidam-gaya-slur-close', 'bidam-yushin-duel-day10', 'bidam-yushin-last-look', 'bidam-poster']
	}
};

/** Comic-mode lines, each said by the card's character somewhere in the chronicle. */
const SAY = {
	'prologue-love': { person: 'sunduk', en: 'Say the name I had before the room.', ko: '그 전의 이름을 불러.' },
	'prologue-gal-love': { person: 'sunduk', en: 'Then stop being a general about it.', ko: '그럼 장군처럼 굴지 마.' },
	'prologue-revenge': {
		person: 'chunchu',
		en: 'Daeya was a room I wasn’t in. I won’t stand outside the room again.',
		ko: '대야는 제가 없던 방이었습니다. 다시는 방 밖에 서 있지 않겠습니다.'
	},
	'prologue-gal-revenge': { person: 'chunchu', en: 'We start with Baekje.', ko: '백제부터 합니다.' },
	'prologue-betrayal': { person: 'gumil', en: 'He smiled at me.', ko: '웃더라.' },
	'prologue-gal-betrayal': { person: 'gumil', en: 'I’ll get the four years. I will.', ko: '사 년 치 받아 낼 끼다. 진짜로.' },
	'prologue-greed': { person: 'euija', en: 'Then we’ll build more chairs. Or empty some.', ko: '그럼 자리를 더 만들지. 아니면 몇 개 비우든가.' },
	'prologue-gal-greed': { person: 'euija', en: 'I am in a mighty generous mood.', ko: '맘이 후허구먼.' },
	'prologue-loyalty': { person: 'gyebek', en: 'If even death showed up early, we must be on time.', ko: '죽음이 일찍 왔다면, 우리는 제시각인 겨.' },
	'prologue-gal-loyalty': { person: 'gyebek', en: 'Your Majesty… I gave my word.', ko: '폐하… 약조를 드렸습니다.' },
	'prologue-pride': { person: 'gesomun', en: 'I am… none other than… Yeon Gesomun!!', ko: '내가... 바로... 연개소문이다!!' },
	'prologue-gal-pride': { person: 'gesomun', en: 'Titles drown too.', ko: '칭호도 물에 빠진다.' },
	'prologue-rage': { person: 'bidam', en: 'You Gaya wretch…!', ko: '가야 놈 새끼가…!' },
	'prologue-gal-rage': { person: 'bidam', en: 'Blood is inevitable.', ko: '피는 못 속인다.' }
};

const AT = { love: 'Love.', revenge: 'Revenge.', betrayal: 'Betrayal.', greed: 'Greed.', loyalty: 'Loyalty.', pride: 'Pride.', rage: 'Rage.' };

const report = editStory((story) => {
	const entry = story.find((c) => c.id === 'prologue-samhan')?.entries[0];
	if (!entry) throw new Error('prologue-samhan not found');
	const byId = new Map(entry.images.map((im) => [im.id, im]));
	const done = { replaced: 0, added: 0, cards: 0 };

	// The old Rage art has no other home: keep it in Bidam's strip.
	const rage = byId.get('prologue-rage');
	if (rage?.src && !byId.has('prologue-gal-rage-never')) {
		const kept = { id: 'prologue-gal-rage-never', ratio: rage.ratio ?? 2, at: AT.rage, alt: rage.alt, src: rage.src, gallery: true, people: ['bidam'] };
		entry.images.splice(entry.images.indexOf(rage) + 1, 0, kept);
		byId.set(kept.id, kept);
		done.added++;
	}

	for (const item of [...FLOW, ...HEROES]) {
		const slot = byId.get(item.id);
		if (!slot) throw new Error(`no slot ${item.id}`);
		delete slot.src;
		slot.ratio = 2;
		slot.alt = item.alt;
		slot.prompt = item.prompt;
		slot.motion = item.motion ?? item.emotion;
		if (SAY[item.id]) slot.say = SAY[item.id];
		done.replaced++;
	}

	for (const item of GALLERY) {
		const fields = { ratio: 2, at: AT[item.emotion], alt: item.alt, prompt: item.prompt, gallery: true, motion: item.emotion, say: SAY[item.id] };
		const slot = byId.get(item.id);
		if (slot) Object.assign(slot, fields);
		else {
			const hero = byId.get(`prologue-${item.emotion}`);
			entry.images.splice(entry.images.indexOf(hero) + 1, 0, { id: item.id, ...fields });
			done.added++;
		}
	}

	for (const b of entry.blocks) {
		const card = b.kind === 'p' && b.emotion ? CARDS[b.emotion] : undefined;
		if (!card) continue;
		b.focus = card.focus;
		b.gallery = card.gallery;
		done.cards++;
	}
	return done;
});

const manifest = [...FLOW, ...HEROES, ...GALLERY].map(({ id, alt, prompt }) => ({ id, alt, prompt }));
fs.writeFileSync(path.join(HERE, 'silhouettes-manifest.json'), JSON.stringify(manifest, null, '\t') + '\n');
console.log(report, `manifest: ${manifest.length} items`);
