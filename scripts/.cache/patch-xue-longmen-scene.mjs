import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const PEOPLE_IMG = 'src/lib/data/image-people.json';

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = {
	year: '645',
	sub: 'Spring',
	title: 'Longmen Field',
	tone: 'quiet poverty — a hut and a hoe',
	subtitle: '용문 밭',
	badges: ['🌾', 'flag:tang'],
	images: [
		{
			id: 'xue-longmen-field-dawn',
			ratio: 1.778,
			tone: '#c9a227',
			at: 'poor field of Longmen',
			alt: 'Dawn mist over a Longmen millet field: one rammed-earth hut, two tiny yellow-and-dust figures',
			prompt: '',
			refs: ['/ch_xue_rengui.png', '/ch_xue_liu.png'],
			people: ['xuerengui', 'xueliu']
		},
		{
			id: 'xue-longmen-hut-door',
			ratio: 0.75,
			tone: '#8a6a4a',
			at: 'hut door',
			alt: 'Lady Liu in the dark rectangle of a Longmen rammed-earth hut door',
			prompt: '',
			refs: ['/ch_xue_liu.png'],
			people: ['xueliu']
		},
		{
			id: 'xue-longmen-yellow-hoe',
			ratio: 1.778,
			tone: '#d4af37',
			at: 'plain yellow peasant cloth',
			alt: 'Xue Rengui in plain yellow hemp hoeing millet, face down, no armour',
			prompt: '',
			refs: ['/ch_xue_rengui.png'],
			people: ['xuerengui']
		},
		{
			id: 'xue-longmen-wife-close',
			ratio: 0.75,
			tone: '#c4a484',
			at: 'You have abilities',
			alt: 'Lady Liu close, dusty hemp, looking at her husband in the field',
			prompt: '',
			refs: ['/ch_xue_liu.png'],
			people: ['xueliu']
		},
		{
			id: 'xue-longmen-two-shot',
			ratio: 1.778,
			tone: '#c4a484',
			at: 'Hours like this do not come often',
			alt: 'Two-shot at the hut threshold: Xue in yellow peasant cloth, Liu in dusty hemp',
			prompt: '',
			refs: ['/ch_xue_rengui.png', '/ch_xue_liu.png'],
			people: ['xuerengui', 'xueliu']
		},
		{
			id: 'xue-longmen-graves',
			ratio: 1.778,
			tone: '#6b5a44',
			at: 'rebury his ancestors',
			alt: 'Unfinished ancestral mounds at the field edge; one hoe, empty mist',
			prompt: '',
			refs: ['/ch_xue_rengui.png'],
			people: ['xuerengui']
		},
		{
			id: 'xue-longmen-leave',
			ratio: 1.778,
			tone: '#e7e5e4',
			at: 'He goes',
			alt: 'Xue in yellow peasant cloth shoulders a ji at the hut; Liu watches from the door',
			prompt: '',
			refs: ['/ch_xue_rengui.png', '/ch_xue_liu.png'],
			people: ['xuerengui', 'xueliu']
		}
	],
	blocks: [
		{
			kind: 'p',
			html: 'In a poor field of <b>Longmen</b> — 絳州龍門, millet and rammed earth, a hut that does not pretend to be a kiln — a farmer named <b>Xue Li</b>, courtesy name <b>Rengui</b>, is planning to rebury his ancestors. He has the right soil for graves. He does not yet know he has the wrong year for quiet.',
			ko: '<b>용문</b> — 강주 용문, 기장과 판축, 가마라고 우기지 않는 흙집 — 의 가난한 밭에서, 농부 <b>설례</b>, 자는 <b>인귀</b>가 조상의 이장을 준비한다. 무덤 쓸 흙은 있다. 아직은, 조용히 살 해가 아니라는 것만 모른다.'
		},
		{
			kind: 'p',
			html: 'The cloth on his back is <b>plain yellow peasant hemp</b>. Not a banner. Not the white armour the mountain will learn later. Just the cheapest dye the village still sells, the colour of millet at the wrong hour. He hoes. His wife, <b>Liu</b>, keeps the hut door.',
			ko: '등에 걸친 것은 <b>평범한 노란 농부의 삼베</b>다. 깃발이 아니다. 나중에 산이 배우게 될 흰 갑옷도 아니다. 마을이 아직 파는 가장 싼 물감, 잘못된 시각의 기장 빛. 그는 호미질한다. 아내 <b>유씨</b>가 흙집 문을 지킨다.'
		},
		{
			kind: 'p',
			html: 'The Son of Heaven is calling up troops for Liaodong. The edict reaches villages that have never seen a palace, and wives who have never left the furrow.',
			ko: '천자가 요동으로 군사를 부른다. 조서는 궁을 본 적 없는 마을과, 이랑을 떠나 본 적 없는 아내들에게 닿는다.'
		},
		{
			kind: 'dialogue',
			chip: '#e8e3d5',
			person: 'xuerengui',
			lines: ['봉분이… 아직이야.', '흙이 모자란 게 아니라. 손이.', '조서는 — 들었어. 들었는데.'],
			en: [
				'The mounds… they’re not done.',
				'Not the dirt. The hands.',
				'The edict — I heard it. I did.'
			],
			zh: ['墳還沒圓。', '不是缺土。是缺手。', '詔書——聽見了。聽見了。'],
			zhLatn: [
				'Fén hái méi yuán.',
				'Búshì quē tǔ. Shì quē shǒu.',
				'Zhàoshū——tīngjiàn le. Tīngjiàn le.'
			]
		},
		{
			kind: 'dialogue',
			chip: '#c4a484',
			person: 'xueliu',
			lines: [
				'손 없다고 무덤이 기다려 주진 않아요.',
				'조서는 기다려 주지도 않고.',
				'당신은 호미가 아니라… 극을 들 사람이에요. 내가 아는 한.'
			],
			en: [
				'Mounds don’t wait because a man is short of hands.',
				'And the edict doesn’t wait either.',
				'You’re not a hoe. You’re a ji. As far as I can tell.'
			],
			zh: ['缺手，墳也不會等。', '詔書更不會等。', '你不是鋤。你是戟。就我看。'],
			zhLatn: [
				'Quē shǒu, fén yě bù huì děng.',
				'Zhàoshū gèng bù huì děng.',
				'Nǐ búshì chú. Nǐ shì jǐ. Jiù wǒ kàn.'
			]
		},
		{
			kind: 'dialogue',
			chip: '#e8e3d5',
			person: 'xuerengui',
			lines: ['극은 헛간에 있어.', '노란 옷은 여기 있고.', '유씨. 내가 가면 — 이 문은.'],
			en: ['The ji is in the shed.', 'The yellow clothes are here.', 'Liu. If I go — this door.'],
			zh: ['戟在棚裏。', '黃衣在這兒。', '柳氏。我若走——這門。'],
			zhLatn: ['Jǐ zài péng lǐ.', 'Huángyī zài zhèr.', 'Liǔshì. Wǒ ruò zǒu——zhè mén.']
		},
		{
			kind: 'dialogue',
			chip: '#c4a484',
			person: 'xueliu',
			lines: [
				'문은 내가 닫아요.',
				'당신은 문을 걱정하지 말고.',
				'때를 만나야 빛이 나는 법이에요. 지금이 그 때면 — 가면 돼요.'
			],
			en: [
				'I’ll shut the door.',
				'Don’t you start worrying about doors.',
				'Talent needs its hour. If this is the hour — then go.'
			],
			zh: ['門我關。', '你別操心門。', '才須遇時。若是此時——便去。'],
			zhLatn: ['Mén wǒ guān.', 'Nǐ bié cāoxīn mén.', 'Cái xū yù shí. Ruò shì cǐ shí——biàn qù.']
		},
		{
			kind: 'p',
			html: 'The chronicler does not invent her sentence. The <i>Xin Tangshu</i> already wrote it down, and it is sharper than anything a field would volunteer twice.',
			ko: '연대기는 아내의 말을 지어내지 않는다. <i>신당서</i>가 이미 적어 두었고, 밭이 두 번 입 밖으로 꺼내지 않을 만큼 날카롭다.'
		},
		{
			kind: 'quote',
			hanja: '夫有高世之材，要須遇時乃發。今天子自征遼東，求猛將，此難得之時，君盍圖功名以自顯？富貴還鄉，葬未晚。',
			ko: '무릇 세상을 넘을 재주가 있어도, 때를 만나야 드러난다. 지금 천자께서 몸소 요동을 치시며 맹장을 구하시니, 이는 얻기 어려운 때이다. 공은 어찌 공명을 도모하여 스스로를 드러내지 않는가? 부귀하여 고향에 돌아온 뒤에 장사하여도 늦지 않다.',
			html: 'A man of talent that outstrips his age must meet his hour before it can issue. Now the Son of Heaven himself campaigns against Liaodong and seeks fierce generals: this is a time rarely met. Why should you not seek merit and make yourself known? When you return in wealth and honour, it will not be too late to bury them.',
			source:
				'Xin Tangshu (新唐書) bk. 111, biography of Xue Rengui (薛仁貴) — speech of his wife, née Liu (妻柳)'
		},
		{
			kind: 'p',
			html: 'He goes. Not because the field is empty — because she is right, and because a man who can lift a <b>ji</b> should not spend the invasion stacking earth for the dead.',
			ko: '그는 간다. 밭이 비어서가 아니다 — 아내 말이 맞고, <b>극</b>을 들 수 있는 사내가 침공의 해를 죽은 자 흙 쌓는 데 쓰면 안 되니까.'
		},
		{
			kind: 'dialogue',
			chip: '#e8e3d5',
			person: 'xuerengui',
			lines: ['…조상님. 조금만 기다려 주십시오.', '이 극을 들고 돌아올 때까지요.', '노란 옷은 — 여기 두고 갈게요.'],
			en: [
				'…Ancestors. Wait a little longer.',
				'Until I come back carrying this ji.',
				'The yellow clothes — I’ll leave them here.'
			],
			zh: ['……列祖列宗。再稍待片刻。', '直至我持此戟歸來。', '黃衣——就留在這兒。'],
			zhLatn: [
				'…Lièzǔ lièzōng. Zài shāo dài piànkè.',
				'Zhízhì wǒ chí cǐ jǐ guīlái.',
				'Huángyī——jiù liú zài zhèr.'
			]
		},
		{
			kind: 'p',
			html: 'He presents himself to general <b>Zhang Shigui</b> and signs his name under the Tang muster. The clerk writes <i>Xue Rengui</i>. The clerk does not look up. History will.',
			ko: '장군 <b>장사귀</b> 앞에 나가 당의 병적에 이름을 올린다. 서기는 <i>설인귀</i>라 적는다. 서기는 고개를 들지 않는다. 역사는 들 것이다.'
		},
		{
			kind: 'quote',
			hanja: '薛仁貴，絳州龍門人。貞觀末，太宗親征遼東，仁貴謁將軍張士貴應募，請從行。',
			ko: '설인귀는 강주 용문 사람이다. 정관 말에 태종이 몸소 요동을 치니, 인귀가 장군 장사귀를 뵙고 응모하여 따라가기를 청하였다.',
			html: 'Xue Rengui was a man of Longmen in Jiangzhou. At the end of Zhenguan, Taizong campaigned in person against Liaodong; Rengui presented himself to General Zhang Shigui, answered the muster, and asked to go.',
			source: 'Jiu Tangshu (舊唐書) bk. 83, biography of Xue Rengui'
		},
		{
			kind: 'p',
			html: 'His weapon is the same one the storytellers later give to Lü Bu: the <b>fangtian ji</b> — crescent blade and spear-point on one shaft. In the Longmen shed it is a farmer’s choice. In the chronicle it becomes the shape you see before you see his face.',
			ko: '그의 무기는 훗날 이야기꾼들이 여포에게 쥐여 주는 것과 같다. <b>방천화극</b> — 초승달 날과 창끝이 한 자루에. 용문 헛간에서는 농부의 선택일 뿐이다. 이 연대기에서는, 얼굴보다 먼저 보이는 모양이 된다.'
		},
		{
			kind: 'p',
			html: 'Stages a few centuries later will not leave Liu in the hut. They will put her in a cold kiln and give her a name the official histories never wrote — <b>Liu Yingchun</b> — and a line that is opera, not Zhengshi. The chronicler files it as such.',
			ko: '몇 세기 뒤의 무대는 유씨를 흙집에 두지 않는다. 찬 가마에 넣고, 정사에 없는 이름 — <b>유영춘</b> — 을 붙이고, 정사가 아닌 창극의 한 줄을 준다. 연대기는 그렇게 적는다.'
		},
		{
			kind: 'quote',
			hanja: '兒夫投軍無音信，母子寒窯受苦情。',
			ko: '지아비는 종군하여 소식이 없고, 모자는 찬 가마에서 고통을 받는다.',
			html: 'My husband enlisted; there is no word. Mother and child suffer in a cold kiln.',
			source:
				'Jingju Fenhewan (京劇《汾河灣》, also 仁貴打雁) — opening of Liu Yingchun; theatrical/folk, not the Tang official histories'
		},
		{
			kind: 'p',
			html: 'By summer the yellow hemp is on a peg in Longmen, and the man who wore it is at Stallion Mountain, under the same Emperor who called him out of the field.',
			ko: '여름이 되면 노란 삼베는 용문의 못에 걸려 있고, 그것을 입었던 사내는 그를 밭에서 불러낸 바로 그 황제 아래, 주필산에 있다.'
		}
	],
	music: 'Seven Invasions'
};

let found = false;
for (const ch of Object.values(story)) {
	const entries = ch.entries;
	if (!Array.isArray(entries)) continue;
	const i = entries.findIndex((e) => e.title === 'Stallion Mountain');
	if (i < 0) continue;
	found = true;
	const stallion = entries[i];
	stallion.images = (stallion.images ?? []).filter((im) => im.id !== 'xue-longmen-farewell');
	const dropAt = (stallion.blocks ?? []).findIndex(
		(b) => b.kind === 'p' && String(b.html || '').includes('By summer he is no longer')
	);
	if (dropAt > 0) {
		stallion.blocks = stallion.blocks.slice(dropAt);
		stallion.blocks[0] = {
			kind: 'p',
			html: 'The Longmen field is behind him. By summer he is no longer a name on a muster roll. He is at Stallion Mountain, under the same Emperor who called him out of the yellow hemp.',
			ko: '용문의 밭은 뒤에 있다. 여름이 되면 그는 더 이상 병적의 이름 하나가 아니다. 노란 삼베에서 그를 불러낸 바로 그 황제 아래, 주필산에 있다.'
		};
	}
	entries.splice(i, 0, entry);
	break;
}

if (!found) throw new Error('Stallion Mountain not found');
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const ip = JSON.parse(fs.readFileSync(PEOPLE_IMG, 'utf8'));
ip['xue-longmen-field-dawn'] = ['xuerengui', 'xueliu'];
ip['xue-longmen-hut-door'] = ['xueliu'];
ip['xue-longmen-yellow-hoe'] = ['xuerengui'];
ip['xue-longmen-wife-close'] = ['xueliu'];
ip['xue-longmen-two-shot'] = ['xuerengui', 'xueliu'];
ip['xue-longmen-graves'] = ['xuerengui'];
ip['xue-longmen-leave'] = ['xuerengui', 'xueliu'];
ip['xue-longmen-farewell'] = ['xuerengui', 'xueliu'];
fs.writeFileSync(PEOPLE_IMG, JSON.stringify(ip, null, '\t') + '\n');
console.log('inserted Longmen Field');
