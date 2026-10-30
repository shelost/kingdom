// Large time jumps get a title card: `jump` on the scene plate ("Ten Years Later…") with the place beneath.
// The opening time phrase of the next paragraph is trimmed where the card now says it.
import { editStory } from './story-ops.mjs';

/** entry title → plate index → patch. `place` names a places.ts id when the label is not a place. */
const JUMPS = {
	'Commander Yeon': {
		45: {
			jump: { en: 'Years Later…', ko: '여러 해 뒤…', place: 'pyongyang' },
			trim: [
				['Years later, on the north wall of Pyongyang in a winter worse than this one,', 'On the north wall, in a winter worse than this one,'],
				['여러 해 뒤, 이번보다 더 혹독한 겨울, 평양 북쪽 성벽 위에', '이번보다 더 혹독한 겨울, 북쪽 성벽 위에']
			],
			at: ['Years later, on the north', 'On the north wall, in a winter']
		}
	},
	Jolbon: {
		187: {
			jump: { en: 'Thirteen Winters Later…', ko: '열세 해 뒤…', place: 'jolbon' },
			trim: [
				['Thirteen winters pass. ', ''],
				['열세 해 겨울이 지난다. ', '']
			]
		}
	},
	Suro: {
		113: {
			jump: { en: 'Six Years Later…', ko: '여섯 해 뒤…', place: 'geumgwan' },
			trim: [
				['Six years go by. ', ''],
				['여섯 해가 지난다. ', '']
			]
		}
	},
	Muryuk: {
		34: { jump: { en: 'Eight Years Later…', ko: '여덟 해 뒤…' } },
		122: { jump: { en: 'Some Years Later…', ko: '몇 해 뒤…' } },
		130: { jump: { en: 'The Years After…', ko: '그 뒤로 여러 해…' } },
		140: { jump: { en: 'Thirty Years Later…', ko: '서른 해 뒤…' } },
		201: { jump: { en: 'Eight Years Later…', ko: '여덟 해 뒤…' } }
	},
	Seohyun: {
		26: { jump: { en: 'Twenty Years Later…', ko: '스무 해 뒤…' } },
		67: { jump: { en: 'Ten Years Later…', ko: '열 해 뒤…' } }
	},
	Jahee: {
		40: {
			jump: { en: 'Ten Years Later…', ko: '십 년 뒤…', place: 'surabol' },
			trim: [
				['Ten years later the bruise is long gone.', 'The bruise is long gone.'],
				['십 년 뒤, 멍은 진작 사라졌다.', '멍은 진작 사라졌다.']
			]
		}
	},
	'Hyukgosé': {
		36: {
			jump: { en: 'A Few Years Later…', ko: '몇 해 뒤…' },
			trim: [
				['A few years later, at Alyungjung well,', 'At Alyungjung well,'],
				['몇 해 뒤, 알영정 우물가에서', '알영정 우물가에서']
			]
		}
	},
	Alji: {
		10: { jump: { en: 'Ten Springs Later…', ko: '열 해 뒤…' } }
	},
	'Prosperity Mountain': {
		10: { jump: { en: 'Three Summers Earlier…', ko: '세 해 전…' }, label: ['Bear Ford', '웅진'] }
	},
	'The King for All': {
		39: {
			jump: { en: 'Five Summers Later…', ko: '다섯 해 뒤…', place: 'surabol' },
			trim: [
				['Five summers later the king for all is dying', 'The king for all is dying'],
				['다섯 해 뒤 여름, 모두의 임금이', '모두의 임금이']
			]
		},
		48: { jump: { en: 'Eleven Years Later…', ko: '열한 해 뒤…', place: 'surabol' } }
	}
};

editStory((story) => {
	let n = 0;
	for (const ch of story) {
		for (const entry of ch.entries) {
			const patches = JUMPS[entry.title];
			if (!patches) continue;
			for (const [index, patch] of Object.entries(patches)) {
				const i = Number(index);
				const plate = entry.blocks[i];
				if (plate?.kind !== 'scene' && plate?.kind !== 'day') throw new Error(`${entry.title} #${i} is not a plate`);
				if (plate.jump) continue;
				plate.jump = patch.jump;
				if (patch.label) [plate.label, plate.ko] = patch.label;
				const next = entry.blocks[i + 1];
				for (const [from, to] of patch.trim ?? []) {
					const field = /[가-힣]/.test(from) ? 'ko' : 'html';
					if (!next?.[field]?.includes(from)) throw new Error(`${entry.title} #${i + 1}: “${from}” not found`);
					next[field] = next[field].replace(from, to);
					if (field === 'html') next.html = next.html.replace(/^([a-z])/, (c) => c.toUpperCase());
				}
				if (patch.at) {
					for (const slot of entry.images ?? []) if (slot.at === patch.at[0]) slot.at = patch.at[1];
				}
				n++;
			}
		}
	}
	console.log(`jumps: ${n}`);
	return n > 0;
});
