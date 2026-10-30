import fs from 'node:fs';

const PATH = 'src/lib/data/key-events.json';
const people = {
	gwansan: ['muryuk', 'kingsung'],
	'great-gaya': ['sadaham', 'muryuk'],
	'cloud-king-dies': ['jinheung', 'yongsu'],
	'jinji-deposed': ['jinji', 'yongsu'],
	'ghost-bridge': ['yongsu', 'gildal'],
	'yushin-hwarang': ['yushin', 'seohyeon'],
	'palace-stream': ['yongsu', 'chunchu'],
	salsu: ['munduk'],
	'munhee-wedding': ['chunchu', 'munhee', 'yushin', 'seohyeon', 'yongsu'],
	nangbi: ['yushin'],
	'sunduk-crowned': ['sunduk', 'yushin', 'bidam', 'yongsu'],
	'gyebek-dives': ['gyebek', 'euija'],
	'euija-crowned': ['euija'],
	'daeya-falls': ['pumsuk', 'gotaso', 'gyebek', 'chunchu'],
	'yeon-massacre': ['gesomun', 'yeongnyu'],
	'chunchu-cell': ['chunchu', 'gesomun'],
	ansi: ['yangmanchun', 'taizong', 'gesomun'],
	bidam: ['bidam', 'yushin', 'sunduk', 'alchun'],
	'sunduk-dies': ['sunduk', 'yushin'],
	'taizong-dies': ['taizong', 'wuzetian'],
	'chunchu-crowned': ['chunchu', 'yushin'],
	hwangsan: ['gyebek', 'yushin', 'bangul', 'gwanchang'],
	'sabi-falls': ['euija', 'sudingfang'],
	'chunchu-dies': ['chunchu'],
	'white-river': ['pung', 'takutsu', 'liurengui'],
	'gesomun-dies': ['gesomun'],
	'pyongyang-falls': ['lishiji', 'namseng', 'bojang'],
	'yushin-dies': ['yushin'],
	gibeolpo: ['munmu']
};

const events = JSON.parse(fs.readFileSync(PATH, 'utf8'));
for (const e of events) {
	if (people[e.id]) e.people = people[e.id];
}
fs.writeFileSync(PATH, JSON.stringify(events, null, '\t') + '\n');
console.log(
	'people on',
	events.filter((e) => e.people?.length).length,
	'/',
	events.length
);
