// Appearance records at a character's introduction (idempotent: skips any hanja already in the book).
import fs from 'node:fs';
const F = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(F, 'utf8'));
fs.copyFileSync(F, 'scripts/.cache/prev-stills/story.json.pre-appearance.bak');

const Q = [
	{
		title: 'Queen Sunduk', person: 'sunduk',
		hanja: '德曼性寬仁明敏。',
		html: 'Deokman was generous and humane by nature, clear-sighted and quick.',
		ko: '덕만은 성품이 너그럽고 어질며, 총명하고 민첩하였다.',
		source: 'Samguk Sagi (三國史記) bk. 5, Silla Annals — Queen Seondeok, accession notice'
	},
	{
		title: 'Queen Sunduk', person: 'taizong',
		hanja: '龍鳳之姿，天日之表，年將二十，必能濟世安民矣。',
		html: '“The bearing of a dragon and a phoenix, the face of heaven’s sun. Before he is twenty he will rescue the age and give the people peace.”',
		ko: '“용과 봉황의 자태요, 하늘의 해와 같은 얼굴이다. 스무 살이 되기 전에 반드시 세상을 건지고 백성을 편안케 하리라.”',
		source: 'Jiu Tangshu (舊唐書) bk. 2, Annals of Taizong — a physiognomist on the boy Li Shimin'
	},
	{
		title: 'Gwanggaeto, the Great King', person: 'gwanggaeto',
		hanja: '生而雄偉，有倜儻之志。',
		html: 'He was born big and imposing, with a will that would not be bridled.',
		ko: '태어나면서부터 체격이 크고 웅장하였으며, 얽매이지 않는 뜻을 품었다.',
		source: 'Samguk Sagi (三國史記) bk. 18, Goguryeo Annals — King Gwanggaeto, accession notice'
	},
	{
		title: 'Buyeo', person: 'jumong',
		hanja: '骨表英奇。年甫七歲，嶷然異常，自作弓矢射之，百發百中。扶餘俗語，善射爲朱蒙，故以名云。',
		html: 'His frame and face were striking and strange. At seven he was already unlike other children; he made his own bow and arrows, and of a hundred shots, a hundred hit. In the Buyeo tongue a good archer is called <i>jumong</i>, and so they named him.',
		ko: '골격과 생김새가 빼어나고 기이하였다. 나이 겨우 일곱에 의젓함이 남달랐는데, 스스로 활과 화살을 만들어 쏘면 백 번 쏘아 백 번 맞혔다. 부여 말에 활 잘 쏘는 이를 주몽이라 하므로, 그렇게 이름 지었다고 한다.',
		source: 'Samguk Sagi (三國史記) bk. 13, Goguryeo Annals — King Dongmyeong'
	},
	{
		title: 'Suro', person: 'suro',
		hanja: '身長九尺則殷之天乙，顏如龍焉則漢之高祖，眉之八彩則有唐之高，眼之重瞳則有虞之舜。',
		html: 'He stood nine feet tall, like Tang of Yin. His face was a dragon’s, like the High Ancestor of Han. His eyebrows shone in eight colours, like Yao. His eyes had double pupils, like Shun.',
		ko: '키가 아홉 자이니 은나라 탕왕과 같고, 얼굴이 용과 같으니 한나라 고조와 같으며, 눈썹이 여덟 빛깔이니 요임금과 같고, 눈동자가 겹으로 있으니 순임금과 같았다.',
		source: 'Samguk Yusa (三國遺事) bk. 2, Garakguk-gi (駕洛國記)'
	},
	{
		title: 'Hyukgose', person: 'hyukgose',
		hanja: '浴於東泉，身生光彩，鳥獸率舞，天地振動，日月淸明。',
		html: 'They bathed him in the eastern spring. His body gave off light, the birds and beasts danced together, heaven and earth shook, and the sun and moon turned clear and bright.',
		ko: '동천에서 목욕시키니 몸에서 광채가 나고, 새와 짐승이 함께 춤추며, 하늘과 땅이 진동하고, 해와 달이 맑고 밝아졌다.',
		source: 'Samguk Yusa (三國遺事) bk. 1, Wonders — Silla’s Founder Hyeokgeose'
	},
	{
		title: 'Talhae', person: 'talhae',
		hanja: '身長九尺，風神秀朗，智識過人。',
		html: 'He stood nine feet tall, fine and bright in bearing, and cleverer than other men.',
		ko: '키가 아홉 자요, 풍채가 빼어나고 환하였으며, 지혜와 식견이 남보다 뛰어났다.',
		source: 'Samguk Sagi (三國史記) bk. 1, Silla Annals — Talhae Isageum'
	},
	{
		title: 'Queen Jinduk', person: 'jinduk',
		hanja: '勝曼姿質豐麗，長七尺，垂手過膝。',
		html: 'Seungman was full-figured and beautiful, seven feet tall, and her hands hung down past her knees.',
		ko: '승만은 자태가 풍만하고 아름다웠으며, 키가 일곱 자에, 손을 내리면 무릎 아래까지 닿았다.',
		source: 'Samguk Sagi (三國史記) bk. 5, Silla Annals — Queen Jindeok, accession notice'
	},
	{
		title: 'Kim Chunchu†', person: 'munmu',
		hanja: '姿表英特，聰明多智略。',
		html: 'He was striking in looks and bearing, quick-witted and full of stratagems.',
		ko: '자태와 풍채가 영특하고, 총명하여 지략이 많았다.',
		source: 'Samguk Sagi (三國史記) bk. 6, Silla Annals — King Munmu, accession notice'
	}
];

const text = JSON.stringify(story);
const entries = story.flatMap((p) => p.entries);
for (const { title, person, ...q } of Q) {
	if (text.includes(q.hanja.slice(0, 6))) { console.log('skip', person); continue; }
	const e = entries.find((x) => x.title === title);
	const i = e?.blocks.findIndex((b) => b.kind === 'card' && b.person === person);
	if (!e || i < 0) { console.log('MISSING', title, person); continue; }
	e.blocks.splice(i + 1, 0, { kind: 'quote', ...q, person });
	console.log('added', person, '→', title, 'after block', i);
}
fs.writeFileSync(F, JSON.stringify(story, null, '\t') + '\n');
