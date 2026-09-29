import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const refs = {
	'family-seq-ride-wide': ['/pl_eastern_palace.png', '/ch_chunchu.png', '/ch_gotaso.png', '/ch_bupmin_child.png'],
	'family-seq-ride-close': ['/ch_chunchu.png', '/ch_gotaso.png', '/pl_eastern_palace.png'],
	'moon-seq-hall-bird': ['/pl_moon_palace.png'],
	'sunduk-seq-coronation-sym': ['/pl_moon_palace.png', '/ch_sunduk.png', '/bn_sunduk.png'],
	'sabi-seq-hall-bird': ['/pl_sabi_palace.png', '/pl_sabi_port.png'],
	'euija-seq-disguise-yard': ['/ch_euija_young.png', '/pl_sabi_port.png'],
	'gyebek-seq-dive-wide': ['/ch_gyebek_boy.png', '/ch_euija_young.png', '/pl_white_river.png'],
	'gyebek-seq-surface': ['/ch_gyebek_boy.png', '/pl_white_river.png'],
	'gyebek-seq-name': ['/ch_gyebek_boy.png', '/ch_euija_young.png', '/pl_white_river.png'],
	'gyebek-fb-burn': ['/ch_gyebek_boy.png'],
	'gyebek-fb-run': ['/ch_gyebek_boy.png'],
	'gyebek-fb-beg': ['/ch_gyebek_boy.png'],
	'gesomun-seq-yeon-snow': ['/pl_yeon_fortress.png', '/ch_yeon_gesomun.png'],
	'gesomun-seq-pyongyang-wide': ['/pl_pyongyang_city.png', '/ch_yeon_gesomun.png'],
	'gesomun-seq-pyongyang-gate': ['/pl_pyongyang_city.png', '/ch_yeon_gesomun.png'],
	'pyongyang-seq-hall-bird': ['/pl_pyongyang_city.png']
};

const yeonSlot = {
	id: 'gesomun-seq-yeon-snow',
	ratio: 1.778,
	tone: '#C30000',
	at: 'Eastern Commandery the safest',
	alt: 'Dutch crane: one rider below a snowy Yeon mountain fortress, red munru above the cloud sea',
	refs: refs['gesomun-seq-yeon-snow'],
	people: ['gesomun']
};

let inserted = false;
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		const images = en.images ?? [];
		for (const im of images) {
			if (refs[im.id]) im.refs = refs[im.id];
		}
		const idx = images.findIndex((im) => im.id === 'gesomun-seq-pyongyang-wide');
		if (idx >= 0 && !images.some((im) => im.id === 'gesomun-seq-yeon-snow')) {
			images.splice(idx, 0, yeonSlot);
			inserted = true;
		}
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(inserted ? 'inserted gesomun-seq-yeon-snow' : 'yeon slot already present; refs updated');
