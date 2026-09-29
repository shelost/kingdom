import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function blockText(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return '';
}

function insertAfter(entry, needle, blocks) {
	const mark = blocks.find((b) => b.html);
	if (mark?.html && entry.blocks.some((x) => x.html === mark.html)) return;
	const i = entry.blocks.findIndex((b) => blockText(b).includes(needle));
	if (i < 0) throw new Error(`${entry.title}: missing needle «${needle}»`);
	entry.blocks.splice(i + 1, 0, ...blocks);
}

function upsertImage(entry, slot, afterId) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		Object.assign(entry.images[i], slot);
		return;
	}
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	if (after >= 0) entry.images.splice(after + 1, 0, slot);
	else entry.images.push(slot);
}

const daeya = findEntry('Daeya Fortress');

insertAfter(daeya, 'Leave tomorrow for tomorrow', [
	{
		kind: 'p',
		nsfw: true,
		html: 'They stop talking. <b>The lamp is too small for manners.</b> The red sash comes off the way it always does in this room — one impatient pull — and the teal silk follows it onto the boards. His yellow sleeve is already gone. Thirty-one, and she still puts him where she wants him.',
		ko: '말은 그만둔다. <b>등잔은 예절을 담기엔 너무 작다.</b> 붉은 허리끈이 이 방에서 늘 그러하듯 참을성 없이 한 번에 풀리고, 청록 비단이 마루로 내려간다. 노란 소매는 이미 없다. 서른하나. 그래도 그를 원하는 자리에 눕힌다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: '#c98fb0',
		person: 'gumilwife',
		lines: ['내일은 내일.', '오늘은 제 위에 있어요.', '이름 부르지 말고요. / 그냥… 그대로.'],
		en: ['Tomorrow can wait.', 'Tonight you stay under me.', 'Don’t use a name. / Just… stay.']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'She knows his body the way a person knows a door they have opened every winter. When he comes it is with her name, not a rank, and she keeps him there until the lamp ducks. They sleep facing the same wall. In the morning the silk will go back on as if the night had been ordinary.',
		ko: '겨울마다 연 문처럼 그의 몸을 안다. 그가 올 때 부르는 것은 품계가 아니라 이름이고, 등잔이 고개를 숙일 때까지 그를 그 자리에 둔다. 같은 벽을 보고 잔다. 아침이면 비단이, 밤이 평범했다는 듯이 다시 올라갈 것이다.'
	}
]);

const torn = daeya.blocks.find((b) => (b.html ?? '').includes('The chronicle does not draw the rest'));
if (torn) {
	torn.nsfw = true;
	torn.html =
		'What follows is not a kiss. It is a True Bone boy with the manners torn off. The chronicle used to look away here. It does not, tonight.';
	torn.ko =
		'그다음이 입맞춤이 아니다. 예절이 벗겨진 진골 소년이다. 이 기록은 여기서 눈을 돌리곤 했다. 오늘 밤은 돌리지 않는다.';
}

insertAfter(daeya, 'It does not, tonight', [
	{
		kind: 'p',
		nsfw: true,
		html: 'The hall goes dark around her. One lamp, and <b>the sexiest body in the fortress</b> becomes a silhouette — waist first, then the heavy chest, then the hip the yard has been staring at since spring. He makes a sound that is not a word. <b>Hearts in his eyes</b>, if anyone were cruel enough to look that close. Drool. He is twenty-four and the training is a joke.',
		ko: '전각이 그녀 둘레에서 어두워진다. 등 하나, 그리고 <b>이 성에서 가장 섹시한 몸</b>이 실루엣이 된다 — 먼저 허리, 그다음 가슴, 그다음 봄부터 마당이 보던 엉덩이. 그는 단어가 아닌 소리를 낸다. 가까이 볼 만큼 잔인한 사람이 있다면 <b>눈 안에 하트</b>. 침. 스물넷. 훈련은 농담이다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'The teal silk comes off one tie at a time because she likes watching him break in pieces. Shoulder. Then the knot. Then nothing she can still pretend is a feast. <b>She meant to lead.</b> She has led every man in this fortress who was allowed to look. She does not expect to be the one who loses the room.',
		ko: '청록 비단은 끈을 하나씩 푼다. 그가 조각으로 무너지는 걸 보고 싶어서. 어깨. 매듭. 그리고 잔치라고 우길 수 있는 것이 아무것도 없다. <b>이끌려고 했다.</b> 봐도 되는 사내들은 다 이끌어 봤다. 방을 잃는 쪽이 자기가 될 줄은 몰랐다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: '#7aa8d8',
		person: 'pumsuk',
		lines: ['못 참아.', '못 참겠소.', '안에 — 안에 두시오. / 빼지 마.'],
		en: ['I can’t.', 'I cannot wait.', 'Inside — leave it inside. / Don’t pull away.']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He fucks like a boy who has been polite his whole life and has just discovered that politeness was a lid. She starts on top, laughing, and the laugh turns into a sound she did not budget for. The screen does not hide it. The feast on the other side pretends not to hear a woman screaming a True Bone’s name.',
		ko: '평생 예의 바르던 소년이, 예의가 뚜껑이었다는 걸 방금 안 것처럼 박는다. 그녀가 위에 올라 웃다, 웃음이 예산에 없던 소리가 된다. 병풍이 가려 주지 않는다. 저쪽 잔치는 진골 이름을 지르는 여자를 안 들은 척한다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: '#c98fb0',
		person: 'gumilwife',
		lines: ['잠깐 —', '너무 — 너무 깊게.', '나… 나 먼저…', '안 돼, 빼지 마. / 그 안에. 다.'],
		en: ['Wait —', 'Too — too deep.', 'I… I’m first…', 'Don’t you dare pull out. / In me. All of it.']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He finishes inside her the first time before the lamp has burned an inch, and it is not a polite amount. She feels it go — hot, stupid, endless — and her mouth opens on a sound that is no longer a strategy. He does not stop. He is not built to stop. She came here to take a half of a True Bone and she is the one shaking on the boards, asking for the next one before she has caught this one.',
		ko: '등잔이 한 치도 안 줄어 첫 번째로 그 안에 붓고, 예의를 지키는 양이 아니다. 뜨겁고, 바보같고, 끝이 없다. 입이 열리며 나는 소리는 이제 작전이 아니다. 멈추지 않는다. 멈추게 생긴 몸이 아니다. 진골의 반을 가지러 온 여자가, 마루 위에서 떨며, 이번 것을 받기도 전에 다음을 청한다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: '<b>They do not stop until the lamp dies.</b> Twice more. She loses count of who is on top. Dawn is a grey slit under the door and he is still in her, still moving like the night owes him another. She is hoarse. She is wet to the thigh. She is, for the first time in this fortress, not the one running the room. Now he is the one who cannot stop.',
		ko: '<b>등잔이 죽을 때까지 멈추지 않는다.</b> 두 번 더. 누가 위인지 잊는다. 새벽은 문틈의 회색 줄이고, 그는 아직 그 안에 있으며, 밤이 한 번 더 빚진 것처럼 움직인다. 목이 쉬었다. 허벅지까지 젖었다. 이 성에서 처음으로, 방을 운영하는 쪽이 아니다. 이제는 그가 멈추지 못하는 쪽이다.'
	}
]);

upsertImage(
	daeya,
	{
		id: 'nsfw-gumil-yehwa-sash',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'The lamp is too small for manners',
		alt: 'Night before: Maehwa’s teal silk and red sash coming off in the lamp, Gumil behind her',
		refs: ['/ch_gumil_wife.png', '/ch_gumil.png'],
		people: ['gumilwife', 'gumil'],
		prompt: 'Intimate cinematic 16:9 night. Maehwa silk slipping, Gumil behind. No text. No watermark.'
	},
	'nsfw-gumil-yehwa-night'
);

upsertImage(
	daeya,
	{
		id: 'nsfw-gumil-yehwa-spent',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'When he comes it is with her name',
		alt: 'After: Maehwa on Gumil’s chest, teal silk wrecked, lamp almost dead',
		refs: ['/ch_gumil_wife.png', '/ch_gumil.png'],
		people: ['gumilwife', 'gumil'],
		prompt: 'Intimate cinematic 16:9 aftermath. Maehwa and Gumil spent. No text. No watermark.'
	},
	'nsfw-gumil-yehwa-sash'
);

upsertImage(
	daeya,
	{
		id: 'nsfw-yehwa-shadow-body',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'the sexiest body in the fortress',
		alt: 'Maehwa as a lamp-cut silhouette — hourglass in a vast dark hall',
		refs: ['/ch_gumil_wife.png'],
		people: ['gumilwife'],
		prompt: 'Intimate cinematic 16:9. Maehwa figure in dramatic shadow. No text. No watermark.'
	},
	'nsfw-pumsuk-yehwa-horndog'
);

upsertImage(
	daeya,
	{
		id: 'nsfw-pumsuk-heart-stare',
		ratio: 0.5625,
		tone: '#7EB8F0',
		nsfw: true,
		at: 'Hearts in his eyes',
		alt: 'Pumsuk close — ice-blue heart pupils, drool, Maehwa a shadow behind him',
		refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png'],
		people: ['pumsuk', 'gumilwife'],
		prompt: 'Intimate cinematic 9:16. Pumsuk heart pupils. No text. No watermark.'
	},
	'nsfw-yehwa-shadow-body'
);

upsertImage(
	daeya,
	{
		id: 'nsfw-pumsuk-yehwa-press',
		ratio: 1.778,
		tone: '#7EB8F0',
		nsfw: true,
		at: 'She meant to lead',
		alt: 'Pressed together in the lamp — Pumsuk wrecked, Maehwa’s smirk starting to fail',
		refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png'],
		people: ['pumsuk', 'gumilwife'],
		prompt: 'Intimate cinematic 16:9. Pumsuk and Maehwa pressed. No text. No watermark.'
	},
	'nsfw-pumsuk-heart-stare'
);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Yehwa nights');
