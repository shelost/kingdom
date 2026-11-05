/**
 * Fold Northern Buyeo into Haemosu; rename Jolbon → Buyeo; open Hodong on the Nakrang map;
 * wire Amnok + copper-room ruins into the crossing end.
 */
import { editStory } from './story-ops.mjs';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');

editStory((story) => {
	const ch = story.find((c) => c.entries?.some((e) => e.title === 'Haemosu'));
	if (!ch) throw new Error('Haemosu chapter missing');
	const iHae = ch.entries.findIndex((e) => e.title === 'Haemosu');
	const iBuy = ch.entries.findIndex((e) => e.title === 'Buyeo');
	const iJol = ch.entries.findIndex((e) => e.title === 'Jolbon');
	if (iHae < 0 || iBuy < 0 || iJol < 0) throw new Error(`indices ${iHae} ${iBuy} ${iJol}`);

	const hae = ch.entries[iHae];
	const buy = ch.entries[iBuy];
	const jol = ch.entries[iJol];

	/* Drop Haemosu's egg cliffhanger next-card. */
	hae.blocks = hae.blocks.filter(
		(b) => !(b.kind === 'p' && /What on earth is inside Yuhwa's egg/i.test(b.html || ''))
	);

	/* Bridge into the Buyeo childhood without restating the egg tease. */
	const bridge = {
		kind: 'p',
		html: 'In time Yuhwa lays a great egg. Gumwa’s hall tries to throw it out. The egg declines.',
		ko: '이윽고 유화는 큰 알을 낳는다. 금와의 전각은 그것을 내다 버리려 한다. 알은 사양한다.'
	};

	/* Shorten Buyeo: keep historical spine; drop a few yard-banter exchanges. */
	const dropEn = new Set([
		'I’ll take the fly.',
		'If it lands, I meant to applaud.',
		'Then put the mark farther.',
		'…How’d you know? | I didn’t tell anyone.',
		'Mother, you’re terrifying. | …For how many days?',
		'And if it’s a girl?',
		'Then she’ll work it out faster.'
	]);
	const buyBlocks = buy.blocks.filter((b) => {
		if (b.kind !== 'dialogue') return true;
		const key = (b.en || []).join(' | ');
		return !dropEn.has(key) && !dropEn.has((b.en || []).join(' / '));
	});

	/* Rewrite the crossing: Amnok + copper-room ruins; Haemosu watches. */
	const patchCrossing = (blocks) => {
		for (let i = 0; i < blocks.length; i++) {
			const b = blocks[i];
			if (b.kind === 'p' && /Jumong reaches the water alone/i.test(b.html || '')) {
				b.html =
					'Jumong reaches the <b>Amnok</b> alone — Habek’s river, the same wet line his mother was cast out of. His death is already written for that day. No ford. No boat. On the near bank, half sunk in mud and willow, the copper room Haemosu built for Yuhwa still stands in pieces: green-black plates, a door that no longer closes, the afternoon’s heat long gone.';
				b.ko =
					'주몽이 홀로 <b>압록강</b>에 닿는다 — 하백의 강, 어머니가 쫓겨 나온 바로 그 물줄기다. 그날 죽기로 이미 적혀 있는 목숨이다. 여울도 배도 없다. 가까운 쪽 강가, 진흙과 버들에 반쯤 잠긴 채, 해모수가 유화를 위해 지은 구리방이 아직 조각으로 서 있다. 녹슨 검은 판, 더 이상 닫히지 않는 문, 오후의 열기는 오래전에 식었다.';
			}
			if (b.kind === 'p' && /The river answers\. Tortoises/i.test(b.html || '')) {
				b.html =
					'The <b>Amnok</b> answers. Tortoises rise and lock shell to shell in the dark, right past the ruined copper door. Jumong runs the wet backs as if they had always been a road — the son crossing where the father once stopped the sky.';
				b.ko =
					'<b>압록강</b>이 응답한다. 부서진 구리방 문 바로 옆에서 자라들이 떠올라 어둠 속에서 등딱지를 잇는다. 주몽이 젖은 등 위를 달린다 — 원래부터 길이었던 것처럼. 아버지가 하늘을 멈추었던 그 자리에서, 아들이 건넌다.';
			}
			if (b.kind === 'p' && /The two brothers stay on the near stones/i.test(b.html || '')) {
				b.html =
					'The two brothers stay on the near stones beside the copper wreck. Jumong is already a red speck on the far dark of the Amnok. Haemosu throws an arm across Haewonmek’s shoulder and watches his son go, laughing like the job is done.';
				b.ko =
					'두 형제는 구리 잔해 옆, 가까운 쪽 돌에 남는다. 주몽은 이미 압록 먼 어둠의 붉은 점이다. 해모수가 해원맥의 어깨에 팔을 걸치고 아들이 가는 것을 보며, 일이 끝난 듯이 웃는다.';
			}
			if (b.kind === 'p' && /A soaked exile, a hall full of spears/i.test(b.html || '')) {
				b.html =
					'<b>South of the Amnok the pine has a name. A soaked exile, a hall full of spears, and a chieftain’s daughter who won’t look at him…!</b>';
				b.ko =
					'<b>압록 남쪽, 소나무에 이름이 있다. 흠뻑 젖은 망명자, 창이 가득한 전각, 그리고 그를 쳐다보지 않는 족장의 딸…!</b>';
			}
		}
		return blocks;
	};

	hae.year = '−59–−38';
	hae.blocks = [...hae.blocks, bridge, ...patchCrossing(buyBlocks)];

	/* Carry useful Buyeo stills into Haemosu (dedupe by id). */
	const seen = new Set((hae.images || []).map((im) => im.id));
	for (const im of buy.images || []) {
		if (seen.has(im.id)) continue;
		seen.add(im.id);
		(hae.images ||= []).push(im);
	}

	/* Rename Jolbon → Buyeo (founding episode). */
	jol.title = 'Buyeo';
	/* Soften in-episode "Jolbon" display where it is the place name on cards/next lines. */
	const renameText = (s) =>
		typeof s === 'string'
			? s
					.replace(/\bJolbon\b/g, 'Buyeo')
					.replace(/졸본/g, '부여')
			: s;
	const walkRename = (blocks) => {
		for (const b of blocks || []) {
			for (const k of ['html', 'ko', 'en', 'label', 'title', 'caption', 'at', 'alt']) {
				if (typeof b[k] === 'string') b[k] = renameText(b[k]);
			}
			if (Array.isArray(b.en)) b.en = b.en.map(renameText);
			if (Array.isArray(b.lines)) b.lines = b.lines.map(renameText);
			if (b.kind === 'flashback' && b.blocks) walkRename(b.blocks);
		}
	};
	walkRename(jol.blocks);
	for (const im of jol.images || []) {
		if (im.at) im.at = renameText(im.at);
		if (im.alt) im.alt = renameText(im.alt);
	}

	/* Remove the old Northern-Buyeo episode slot. */
	ch.entries.splice(iBuy, 1);

	/* Hodong: open on Nakrang / Goguryeo map. */
	const hodong = ch.entries.find((e) => e.title === 'Hodong');
	if (hodong) {
		const mapIdx = hodong.blocks.findIndex(
			(b) => b.kind === 'map' && Array.isArray(b.places) && b.places.includes('nakrang')
		);
		let mapBlock =
			mapIdx >= 0
				? hodong.blocks.splice(mapIdx, 1)[0]
				: { kind: 'map', year: 32, places: ['okjeo', 'nakrang', 'gungnae'] };
		mapBlock = {
			...mapBlock,
			year: 32,
			places: ['okjeo', 'nakrang', 'gungnae'],
			title: 'Nakrang and Goguryeo',
			ko: '낙랑과 고구려',
			caption: 'Two roofs on the wet east. One drum between them.',
			captionKo: '동쪽 습지에 지붕 둘. 그 사이에 북 하나.'
		};
		/* Drop the pine cold-open maps to the front of the drum half: keep pine material, but lead with Nakrang map + short hook. */
		const open = [
			mapBlock,
			{
				kind: 'p',
				html: 'Two nations on the wet east: <b>Goguryeo</b> under a hunt-king, and <b>Nakrang</b> under a drum that screams when enemies come.',
				ko: '동쪽 습지에 나라 둘. 사냥하는 왕의 <b>고구려</b>, 그리고 적이 오면 스스로 울리는 북을 믿는 <b>낙랑</b>.'
			},
			{
				kind: 'p',
				html: 'Before the drum, he is just a boy who grins like his grandfather.',
				ko: '북이 있기 전, 그는 그저 할아버지처럼 웃는 아이일 뿐이다.'
			}
		];
		/* Remove the duplicated opening line if present. */
		hodong.blocks = hodong.blocks.filter(
			(b) => !(b.kind === 'p' && /^Before the drum, he is just a boy/.test(b.html || ''))
		);
		hodong.blocks = [...open, ...hodong.blocks];
	}

	console.log(
		'Haemosu blocks',
		hae.blocks.length,
		'images',
		(hae.images || []).length,
		'| removed Buyeo | Jolbon→',
		jol.title,
		'| Hodong opens with map'
	);
});

/* toc + logos + place display */
const tocPath = path.join(ROOT, 'src/lib/tocTree.ts');
let toc = fs.readFileSync(tocPath, 'utf8');
toc = toc.replace(
	"'Haemosu', 'Buyeo', 'Jolbon', 'Hodong'",
	"'Haemosu', 'Buyeo', 'Hodong'"
);
fs.writeFileSync(tocPath, toc);

const logosPath = path.join(ROOT, 'src/lib/titleLogos.ts');
let logos = fs.readFileSync(logosPath, 'utf8');
logos = logos
	.replace(
		'* Jumong has no episode of that name — the founding beat is Jolbon.',
		'* Jumong has no episode of that name — the founding beat is Buyeo (ex-Jolbon).'
	)
	.replace(/Jolbon: '\/title_jumong\.png'/g, "Buyeo: '/title_jumong.png'")
	.replace(/Jolbon: '\/title_jumong-1\.png'/g, "Buyeo: '/title_jumong-1.png'")
	.replace(/Jolbon: 'jumong'/g, "Buyeo: 'jumong'");
fs.writeFileSync(logosPath, logos);

const placesPath = path.join(ROOT, 'src/lib/places.ts');
let places = fs.readFileSync(placesPath, 'utf8');
places = places.replace(
	/(id: 'jolbon',\n\t\tfounded: -37,\n\t\t)name: 'Jolbon',\n\t\tkorean: '졸본 \(환인\)',\n\t\thanja: '卒本',/,
	`$1name: 'Buyeo',\n\t\tkorean: '졸본부여',\n\t\thanja: '卒本扶餘',`
);
places = places.replace(
	/(id: 'buyeo_north',\n\t\tfounded: -200,\n\t\tfell: 494,\n\t\t)name: 'Buyeo',\n\t\tkorean: '부여',\n\t\thanja: '夫餘',/,
	`$1name: 'Northern Buyeo',\n\t\tkorean: '북부여',\n\t\thanja: '北夫餘',`
);
fs.writeFileSync(placesPath, places);

/* people: nakrangso avatar already copied to ch_nakrangso.png; ensure path */
const peoplePath = path.join(ROOT, 'src/lib/people.ts');
let people = fs.readFileSync(peoplePath, 'utf8');
people = people.replace(
	/(id: 'nakrangso',\n\t\tgender: 'f',\n\t\tavatar: )'\/ch_nakrangso\.png'/,
	`$1'/ch_nakrangso.png'`
);
/* Tabal voice: Jolbon → Buyeo where it's the place name answer */
people = people.replace(
	'answers with his own name for the pine: Jolbon.',
	'answers with his own name for the pine: Buyeo.'
);
fs.writeFileSync(peoplePath, people);

console.log('toc/logos/places/people updated');
