import fs from 'node:fs';

const FILE = new URL('../../src/lib/relations.ts', import.meta.url);
const MAP = {
	'rel-gotaso-pumsuk': 'daeya',
	'rel-chunchu-munhee': 'moon_palace',
	'rel-munmu-jayi': 'eastern_harbor',
	'rel-yushin-sunduk': 'wolji',
	'rel-pumsuk-gumilwife': 'daeya',
	'rel-euija-maids': 'flower_cliff',
	'rel-haemosu-yuhwa': 'amnok',
	'rel-jumong-sosuno': 'jolbon_well',
	'rel-suro-heo': 'geumgwan',
	'rel-ibiga-jeonggyeon': 'seongsan',
	'rel-hwanung-ungnyeo': 'asadal',
	'rel-gesomun-gulgul': 'western_wall',
	'rel-jacheongbi-mundoryeong': 'western_flower_field',
	'rel-chunchu-euija': 'sabi',
	'rel-chunchu-yushin': 'hwarang_yard',
	'rel-sunduk-chunmyung': 'cheomseongdae',
	'rel-chunchu-gotaso': 'daeya',
	'rel-munhee-bohee': 'moon_palace',
	'rel-euija-gyebek': ['baekgang', 'gibeolpo'],
	'rel-seongchung-heungsu': 'tanhyeon',
	'rel-heungsu-gyebek': 'gibeolpo',
	'rel-jumong-yuhwa': 'jolbon',
	'rel-jumong-haemosu': 'jolbon',
	'rel-onjo-sosuno': 'wirye',
	'rel-gesomun-chunchu': 'pyongyang',
	'rel-euija-gesomun': 'sabi',
	'rel-hwanung-dangun': 'paektu',
	'rel-yushin-munmu': 'hwarang_yard',
	'rel-yumla-kangrim': 'underworld',
	'rel-kangrim-haewonmek': 'underworld',
	'rel-daebyeol-sobyeol': 'heaven',
	'rel-yumla-daebyeol': 'underworld',
	'rel-sara-jacheongbi': 'western_flower_field',
	'rel-heavenearthking-chongmyeong': 'heaven',
	'rel-go-yang': 'samseonghyeol',
	'rel-yang-bu': 'samseonghyeol',
	'rel-go-bu': 'samseonghyeol',
	'rel-sunduk-bidam': 'radiance',
	'rel-xue-liu': 'changan',
	'rel-taizong-xuerengui': 'jupil',
	'rel-yushin-bidam': 'hwarang_yard',
	'rel-sunduk-jinduk': 'moon_palace',
	'rel-yushin-munhee': 'moon_palace',
	'rel-chunchu-munmu': 'eastern_harbor',
	'rel-gesomun-yeongnyu': 'pyongyang',
	'rel-gesomun-bojang': 'pyongyang',
	'rel-gesomun-namseng': 'pyongyang',
	'rel-namseng-namgun': 'pyongyang',
	'rel-euija-yung': 'sabi',
	'rel-euija-tae': 'sabi',
	'rel-euija-hyo': 'sabi',
	'rel-euija-yun': 'sabi',
	'rel-euija-pung': 'sabi',
	'rel-tae-yun': 'sabi',
	'rel-euija-queensatek': 'sabi',
	'rel-euija-ungo': 'sabi',
	'rel-yung-hyo': 'sabi',
	'rel-tae-hyo': 'sabi',
	'rel-yung-pung': 'sabi',
	'rel-satek-yunbi': 'deer_rock',
	'rel-jijeok-hana': 'deer_rock',
	'rel-jungto-sooyoung': 'pyongyang',
	'rel-gesomun-jungto': 'pyongyang',
	'rel-gesomun-sooyoung': 'pyongyang',
	'rel-jumong-yuri': 'jolbon',
	'rel-haemosu-habek': 'amnok',
	'rel-haemosu-haewonmek': 'amnok',
	'rel-habek-yuhwa': 'amnok',
	'rel-hwanin-hwanung': 'heaven',
	'rel-suro-ijinasi': 'geumgwan',
	'rel-taizong-gaozong': 'changan',
	'rel-seonpum-jayi': 'eastern_harbor',
	'rel-yushin-gyebek': 'hwangsan',
	'rel-gesomun-yangmanchun': 'ansi',
	'rel-chunchu-ongunhae': 'pyongyang',
	'rel-kingmu-euija': 'sabi',
	'rel-munmu-gotaso': 'eastern_harbor',
	'rel-seohyeon-yushin': 'nangbi',
	'rel-seohyeon-manmyung': ['locked_room', 'mannogun'],
	'rel-sukwon-bidam': 'hwarang_gate',
	'rel-yongsu-chunchu': 'ghost_bridge',
	'rel-sunduk-chunchu': 'moon_palace',
	'rel-chunmyung-chunchu': 'moon_palace',
	'rel-jinheung-sukhuljong': 'gwansan',
	'rel-jinheung-sadaham': 'moon_palace',
	'rel-chunmyung-yongsu': 'ghost_bridge',
	'rel-seohyeon-yongsu': 'moon_palace',
	'rel-sukhuljong-seohyeon': 'locked_room',
	'rel-jinheung-muryuk': 'daegaya',
	'rel-sadaham-muryuk': 'daegaya',
	'rel-sadaham-mishil': 'moon_palace'
};

let src = fs.readFileSync(FILE, 'utf8');
let n = 0;
for (const [id, place] of Object.entries(MAP)) {
	if (new RegExp(`id: '${id}'[\\s\\S]{0,120}placeId:`).test(src)) continue;
	const val = Array.isArray(place) ? `[${place.map((p) => `'${p}'`).join(', ')}]` : `'${place}'`;
	const next = src.replace(new RegExp(`(id: '${id}'(?:, avatar: '[^']+')?,\\n)`), `$1\t\tplaceId: ${val},\n`);
	if (next === src) {
		console.warn('miss', id);
		continue;
	}
	src = next;
	n++;
}
fs.writeFileSync(FILE, src);
console.log(`placed ${n} bonds`);
