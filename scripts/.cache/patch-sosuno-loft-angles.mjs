import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const jumong = story.flatMap((c) => c.entries).find((e) => e.title === 'Jumong');
if (!jumong) throw new Error('Jumong missing');

const S = '#e8a04a';
const p = (html, ko, nsfw) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });
const d = (person, chip, en, lines, nsfw) => ({
	kind: 'dialogue',
	person,
	chip,
	en,
	lines,
	...(nsfw ? { nsfw: true } : {})
});

const iOgle = jumong.blocks.findIndex((b) => b.html?.includes('She ogles him from the loft'));
const iTabal = jumong.blocks.findIndex(
	(b, i) => i > iOgle && b.person === 'yeontabal' && b.en?.[0] === 'Sosuno!'
);
if (iOgle < 0 || iTabal < 0) throw new Error(`loft markers ${iOgle} ${iTabal}`);

const loft = [
	p(
		'She does not stay in the yard. Chin still up, loft stairs two at a time like a woman with grain to count. The window faces the millet. Shirt off. Red silk knotted at the hip. A back doing work. She does not know whose son he is. She knows the muscles. <b>She ogles him from the loft.</b>',
		'마당에 안 남는다. 턱은 올라가 있고, 곡식 세는 여자처럼 다락 계단을 두 칸씩 오른다. 창이 조밭을 본다. 저고리 벗음. 붉은 비단을 허리에. 일하는 등. 누구 아들인지는 모른다. 근육은 안다. <b>다락에서 그를 빤다.</b>',
		true
	),
	p(
		'Timber under the knees. Window frame as a hard vertical. He is a red smear in the millet, shirt gone, hips doing the count she will not give him. She leans. Bites. <b>하—</b>',
		'무릎 아래 나무. 창틀이 세로로 선다. 조밭에서 그는 붉은 번짐, 저고리 없고, 허리가 그녀가 안 줄 셈을 한다. 기댄다. 문다. <b>하—</b>',
		true
	),
	d(
		'sosuno',
		S,
		['Look at that back—', '하— no. Don’t look. You’re looking.', '음… stupid. He’s just… work.'],
		['등 봐—', '하— 아니. 보지 마. 보고 있잖아.', '음… 바보야. 그냥… 일이야.'],
		true
	),
	p(
		'Dusty-rose hiked. Thighs apart on the timber. One hand over her mouth. The other talking to the part of her that does not run a hunt. <b>Little Sosuno.</b>',
		'회분홍이 걷힌다. 나무 바닥에 다리 벌리고. 한 손은 입. 다른 손은 사냥 안 돌리는 쪽에 말을 건다. <b>작은 소서노.</b>',
		true
	),
	d(
		'sosuno',
		S,
		[
			'Little Sosuno… you’re hungry today aren’t you…',
			'I don’t blame you…. 음! look at him…',
			'Those big— 흐읍— chest…. back….',
			'Ah— 뚝. Wait. Wait—',
			'Out hunting for meat… I want— 하아—'
		],
		[
			'작은 소서노야… 오늘 배고프지…',
			'이해해…. 음! 저 놈 봐봐…',
			'그 근육— 흐읍— 가슴…. 등….',
			'아— 뚝. 잠깐. 잠깐—',
			'고기 잡으러 나갔네… 그거— 하아—'
		],
		true
	),
	p(
		'Silk hitch. Fingers under the chima. The loft is quiet except the wet. <b>질척.</b> She hates that she can hear it. She does it anyway.',
		'비단이 걸린다. 치마 밑으로 손가락. 다락은 그 젖은 소리만. <b>질척.</b> 들리는 게 싫다. 그래도 한다.',
		true
	),
	d(
		'sosuno',
		S,
		[
			'질척— don’t— 안 돼—',
			'You’re dripping. Listen. That’s you.',
			'Fill me— 하아— some of that meat—',
			'안 돼. 안 돼. 더—'
		],
		[
			'질척— 하지 마— 안 돼—',
			'흘리잖아. 들어. 네 소리야.',
			'채워— 하아— 그 고기 좀—',
			'안 돼. 안 돼. 더—'
		],
		true
	),
	p(
		'She comes on the timber with her teeth in her own wrist so the yard does not get a vote. Knees shake. Dusty-rose stuck to skin. <b>안 돼.</b> Then she hears her father on the stairs and the hunt-voice slams back into the mouth.',
		'마당이 투표하지 못하게 자기 손목을 문다. 무릎이 떤다. 회분홍이 피부에 붙는다. <b>안 돼.</b> 그다음 아버지가 계단에서 들리고, 사냥 목소리가 다시 입에 박힌다.',
		true
	)
];

jumong.blocks.splice(iOgle, iTabal - iOgle, ...loft);

const house = JSON.parse(readFileSync('src/lib/data/image-prompt-house.json', 'utf8'));
const suffix = typeof house.suffix === 'string' ? house.suffix.trim() : '';

const slots = [
	{
		id: 'sosuno-seq-loft-ots',
		at: 'She ogles him from the loft',
		alt: 'OTS Jumong’s working back in millet; Sosuno ogles from the loft window, bitten lip',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		prompt:
			'Intimate 16:9 OTS. OVER-SHOULDER of shirtless Jumong working millet, FACE ONLY from ch_jumong, red silk at hip #e8563f, mid-swing not a standing clone. Midground: Sosuno at a timber loft window ogles, dusty-rose hanbok NOT gold, FACE ONLY from ch_sosuno, binyeo, bitten lip, flush, wanting. ONE device: the window frame as a hard vertical. Shallow DOF, creamy bokeh, hard key, crushed blacks. #e8a04a rim on her. Same Jolbon loft. No text. No watermark. ' +
			suffix
	},
	{
		id: 'sosuno-seq-loft-dutch',
		at: '하—',
		alt: 'Dutch loft: Sosuno leaning in the window, dusty-rose, wanting; Jumong a red bokeh in millet',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		prompt:
			'Intimate 16:9 DUTCH. Sosuno leaning into a timber loft window, hiked dusty-rose silk, FACE ONLY from ch_sosuno, binyeo, blown pupils, bitten lip, not a cold girl-boss. Jumong tiny red #e8563f in millet bokeh, FACE ONLY from ch_jumong. ONE device: the tilted window bar. Shallow DOF, creamy bokeh, hard key, crushed blacks. #e8a04a rim. Same loft. No text. No watermark. ' +
			suffix
	},
	{
		id: 'sosuno-seq-loft-ecu',
		at: '하아—',
		alt: 'ECU: Sosuno loft face fill, blown pupils, bitten lip, creamy bokeh',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		prompt:
			'Intimate 16:9 ECU. Sibling of sosuno-seq-cold-ecu grammar, inverted: FACE FILL Sosuno, blown pupils, bitten lip, heavy blush, wanting pervert, manhwa panel, sweat, not shuttered cold eyes. FACE ONLY from ch_sosuno, binyeo, dusty-rose NOT gold. Timber loft melts to creamy bokeh. ONE device: her eye as the frame. Shallow DOF, rack-focus, hard key, crushed blacks. #e8a04a rim. No text. No watermark. ' +
			suffix
	},
	{
		id: 'sosuno-seq-loft-profile',
		at: '흐읍—',
		alt: 'Profile: Sosuno at the loft window, 흐읍, hand over mouth, Jumong red smear outside',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		prompt:
			'Intimate 16:9 PROFILE. Sosuno in profile at timber loft window, dusty-rose hiked, one hand over mouth 흐읍, flush, FACE ONLY from ch_sosuno, binyeo. Millet bokeh outside. ONE device: the window sill as a hard horizontal. Shallow DOF, creamy bokeh, hard key, crushed blacks. #e8a04a rim. Same loft. No clone standing portrait. No text. No watermark. ' +
			suffix
	},
	{
		id: 'sosuno-seq-loft-worm',
		at: 'Little Sosuno.',
		alt: 'Worm’s-eye from timber: Sosuno thighs apart, hiked dusty-rose, looking out the loft',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		prompt:
			'Intimate 16:9 WORM’S-EYE from packed-earth timber floor. Sosuno kneeling thighs apart, dusty-rose hiked around hips, looking out the loft window, FACE ONLY from ch_sosuno, binyeo, wanting, flush. ONE device: floorboards racing to her. Shallow DOF, hard key, crushed blacks. #e8a04a rim. Same loft. One Sosuno. No text. No watermark. ' +
			suffix
	},
	{
		id: 'sosuno-seq-loft-hand',
		at: '질척.',
		alt: 'ECU hand under hiked dusty-rose silk, wet, timber loft bokeh',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		prompt:
			'Intimate 16:9 ECU. Foreground: Sosuno’s hand under hiked dusty-rose silk, wet fingers, silk hitch, implied heat. FACE a creamy bokeh in the loft, FACE ONLY from ch_sosuno if visible, binyeo. ONE device: the silk edge as a diagonal. Shallow DOF, creamy bokeh, hard key, crushed blacks. #e8a04a accent. Same timber loft. Manhwa panel. No text. No watermark. ' +
			suffix
	},
	{
		id: 'sosuno-seq-loft-climax',
		at: '안 돼.',
		alt: 'ECU wrecked pleasure: Sosuno teeth in wrist, ahegao-adjacent, loft timber bokeh',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		prompt:
			'Intimate 16:9 ECU. Sosuno climax face, ahegao-adjacent, teeth in her own wrist, blown pupils, heavy blush, sweat, manhwa panel, hiked dusty-rose. FACE ONLY from ch_sosuno, binyeo. Timber loft creamy bokeh. ONE device: the bitten wrist as a bar across the lower third. Shallow DOF, hard key, crushed blacks. #e8a04a rim. Same loft. Not a cold command face. No text. No watermark. ' +
			suffix
	}
];

function upsert(slot) {
	const row = {
		id: slot.id,
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: true,
		at: slot.at,
		alt: slot.alt,
		refs: slot.refs,
		people: slot.people,
		prompt: slot.prompt
	};
	const i = jumong.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) jumong.images[i] = { ...jumong.images[i], ...row };
	else {
		const after = jumong.images.findIndex((im) => im.id === 'nsfw-sosuno-loft-hike');
		if (after >= 0) jumong.images.splice(after + 1, 0, row);
		else jumong.images.push(row);
	}
}

for (const s of slots) upsert(s);

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('patched loft', loft.length, 'blocks,', slots.map((s) => s.id).join(', '));
