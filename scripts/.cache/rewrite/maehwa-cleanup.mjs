// One-shot: Maehwa — drop NSFW slots, move morning-after confrontation in, war-drums finale.
import fs from 'node:fs';
const f = 'src/lib/data/story.json';
const s = JSON.parse(fs.readFileSync(f, 'utf8'));
const ch = s.find((c) => c.id === 'iron-will');
const maehwa = ch.entries.find((x) => x.title === 'Maehwa');
const daeya = ch.entries.find((x) => x.title === 'Siege of Daeya');
// 1. drop NSFW image slots, collect temp files
const removed = maehwa.images.filter((im) => im.nsfw);
maehwa.images = maehwa.images.filter((im) => !im.nsfw);
const temps = [...new Set(removed.map((i) => i.tempImage).filter(Boolean))];
console.log('removed slots:', removed.length, 'kept:', maehwa.images.length, 'temps:', temps.length);
// 2. move Daeya blocks 0..15 (dawn confrontation) to Maehwa's end
const moved = daeya.blocks.splice(0, 16);
console.log('moved blocks:', moved.length, 'first:', moved[0].kind, 'last:', (moved[15].html || '').slice(0, 40));
// un-bold old teaser ending (now mid-story)
const tail = maehwa.blocks[maehwa.blocks.length - 1];
tail.html = tail.html.replace(/<\/?b>/g, '');
tail.ko = tail.ko.replace(/<\/?b>/g, '');
maehwa.blocks.push(...moved);
// 3. war-drums finale
maehwa.blocks.push(
	{
		kind: 'scene',
		label: 'The North Wall',
		ko: '북벽'
	},
	{
		kind: 'p',
		html: 'The drums start before the quarrel is over. Low, from the north wall. The signal-drum, not the parade one. Gumil knows the difference the way a man knows his own wife\u2019s step. Everybody in the fortress stops talking at once.',
		ko: '다툼이 끝나기도 전에 북소리가 시작된다. 낮게, 북벽에서. 의식용이 아니라 신호용 북이다. 구밀은 제 아내 발소리 알듯 그 차이를 안다. 성 안의 모든 말이 한꺼번에 멎는다.'
	},
	{
		kind: 'dialogue',
		chip: '#8a8a94',
		speaker: 'A runner',
		lines: ['대장— 북쪽 길에 먼지요. 종대요.', '누구?', '백제요. 윤충의 깃발이요.'],
		en: ['Commander\u2014 dust on the north road. Columns.', 'Whose?', 'Baekje. Yunchung\u2019s banners.']
	},
	{
		kind: 'p',
		html: '<b>The drums have started, and Daeya has three weeks. The siege is next\u2026!</b>',
		ko: '<b>북이 울렸다. 대야에는 세 주가 남았다. 다음은 공성이다\u2026!</b>'
	}
);
fs.writeFileSync(f, JSON.stringify(s, null, '\t') + '\n');
fs.writeFileSync('/tmp/maehwa-temps.json', JSON.stringify(temps));
console.log('done. maehwa blocks:', maehwa.blocks.length, 'daeya blocks:', daeya.blocks.length);
console.log('daeya now opens:', daeya.blocks[0].kind, (daeya.blocks[0].label || daeya.blocks[0].html || '').slice(0, 60));
