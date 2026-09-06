import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) for (const en of ch.entries ?? []) out.push(en);
	return out;
}

function findEntry(title) {
	const en = entries().find((e) => e.title === title);
	if (!en) throw new Error(`missing entry ${title}`);
	return en;
}

function insertAfter(images, afterId, slots) {
	const exist = new Set(images.map((im) => im.id));
	const fresh = slots.filter((s) => !exist.has(s.id));
	if (!fresh.length) return [];
	const i = images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`missing slot ${afterId}`);
	images.splice(i + 1, 0, ...fresh);
	return fresh.map((s) => s.id);
}

function prependIfMissing(images, slot) {
	if (images.some((im) => im.id === slot.id)) return [];
	images.unshift(slot);
	return [slot.id];
}

function rewrite(images, id, patch) {
	const im = images.find((x) => x.id === id);
	if (!im) throw new Error(`missing slot ${id}`);
	Object.assign(im, patch);
}

const added = [];

added.push(
	...insertAfter(findEntry('Queen Sunduk').images, 'yushin-fans-sunduk-only', [
		{
			id: 'sunduk-flirt-walkby',
			ratio: 1.778,
			tone: '#E8552B',
			at: 'He looks only at the Queen',
			alt: 'Queen Sunduk as sovereign — a knowing flirt as marshal Yushin walks the corridor past her',
			prompt:
				'Intimate cinematic still, 16:9. Queen Sunduk as adult queen, tall Silla gold crown with jade gogok, vermilion #E8552B silky hanbok, royal-blue shoulder plane. She glances over her shoulder with a flirting, amused smile as Kim Yushin in Confucian-blue #2A5FB8 court-military walks the corridor past her, not stopping. Faces match the attached portraits. Warm lamplight, blush on her throat. Skin-forward but modest. Painterly anime-adjacent cinema. No text, no watermark.',
			refs: ['/ch_sunduk.png', '/ch_kim_yushin.png']
		},
		{
			id: 'sunduk-flirt-blush',
			ratio: 0.75,
			tone: '#E8552B',
			at: 'He looks only at the Queen',
			alt: 'Close: Queen Sunduk flushed, smiling, watching Yushin’s blue sleeve leave the frame',
			prompt:
				'Intimate cinematic CLOSE-UP, 9:16. Faces fill the frame. Adult Queen Sunduk, gold Silla crown, vermilion #E8552B silk. Flushed cheeks, half-lidded romantic smile, in love, watching Kim Yushin walk by — only his Confucian-blue #2A5FB8 sleeve and ponytail at the edge. Face matches the attached Sunduk portrait. Warm erotic lamp. Painterly anime-adjacent. Modest. No text, no watermark.',
			refs: ['/ch_sunduk.png', '/ch_kim_yushin.png']
		}
	])
);

added.push(
	...prependIfMissing(findEntry('The Harmony Council').images, {
		id: 'harmony-council-wide',
		ratio: 2.4,
		tone: '#3E79E4',
		alt: 'Wide Wolseong council hall: round cushion ring, white robes, one blue incense column',
		prompt:
			'Wide cinematic EXPOSITION still, 16:9. REAL Silla Harmony Council hall. Layout matches the attached empty-chamber reference: circular ring of floor-cushions around a bronze brazier, dark wooden pillars, one vertical light shaft. Councillors seated in WHITE silky court hanbok on the cushions. BLUE incense smoke rising at the exact center. Tiny figures, faces match attached portraits only as distant hints. Flat dark hall. No crowd dump. No clouds. No text, no watermark.',
		refs: [
			'/temp/council_chamber_smoke_light.png',
			'/ch_bidam.png',
			'/ch_kim_yushin.png',
			'/ch_alchun.png'
		]
	})
);

added.push(
	...insertAfter(findEntry('The Harmony Council').images, 'council_morning', [
		{
			id: 'harmony-debate-hands',
			ratio: 1.778,
			tone: '#e8e6df',
			at: 'One by one the hands go up',
			alt: 'Harmony Council debate — white robes around a round cushion ring, blue incense, hands rising',
			prompt:
				'Cinematic historical still, 16:9. REAL Silla Harmony Council. Layout matches the attached chamber: round cushion ring, bronze brazier, dark pillars. Every councillor in WHITE silky court hanbok. BLUE incense smoke from the center. Faces match attached portraits: Bidam, Yushin, Alchun, Chunchu as a visitor. Hands rising. Painterly cinema. No crowd dump. No text, no watermark.',
			refs: [
				'/temp/council_chamber_smoke_light.png',
				'/ch_bidam.png',
				'/ch_kim_yushin.png',
				'/ch_alchun.png',
				'/ch_chunchu.png'
			]
		},
		{
			id: 'harmony-debate-veto',
			ratio: 1.778,
			tone: '#141C2E',
			at: 'I object',
			alt: 'Across the white-robed round table — Bidam’s still hand, blue smoke between him and standing Yushin',
			prompt:
				'Intimate cinematic still, 16:9. Across a round Harmony Council cushion-ring. WHITE silky robes. BLUE incense smoke between elder Bidam (silver hair, navy under-collar) seated and Kim Yushin STANDING in Confucian duty — he does not sit lotus. Faces match attached portraits. Bidam’s hand flat on the table. Chamber matches the attached empty-hall layout. Painterly cinema. No text, no watermark.',
			refs: [
				'/temp/council_chamber_smoke_light.png',
				'/ch_bidam_old.png',
				'/ch_kim_yushin.png'
			]
		},
		{
			id: 'harmony-debate-white',
			ratio: 1.778,
			tone: '#e8e6df',
			at: 'Unanimity has failed',
			alt: 'White sleeves around blue incense — the Harmony Council after the veto, one empty cushion',
			prompt:
				'Cinematic historical still, 16:9. Harmony Council after the veto. WHITE silky court hanbok only. Round cushion ring matching the attached chamber. BLUE incense column at center. One empty cushion. Faces match attached portraits as three-quarter figures, not a group dump. Dark pillars. Painterly cinema. No text, no watermark.',
			refs: [
				'/temp/council_chamber_smoke_light.png',
				'/ch_bidam_old.png',
				'/ch_kim_yushin.png',
				'/ch_alchun.png'
			]
		}
	])
);

added.push(
	...insertAfter(findEntry('King Euija, the 31st Eraha').images, 'euija-poster', [
		{
			id: 'euija-maid-hip',
			ratio: 1.778,
			tone: '#7f1d1d',
			nsfw: true,
			at: 'Two court maids attend him',
			alt: 'Euija seated; a plump-hipped Sabi maid stands close in cream-mint silk, thigh weight',
			prompt:
				'Intimate cinematic still, 16:9. Adult King Euija seated in wine-red Sabi silk, gold-yellow headband, thick mustache — face matches attached Euija portrait. A court maid with LARGE plump thighs and wide hips stands beside him, cream jeogori, mint chima hiked at the hip, silk sheen. Face matches attached maid portrait. Accompanying, not a group portrait. Warm lamp. Adult/mature. Painterly anime-adjacent. No text, no watermark.',
			refs: ['/ch_buyeo_euija.png', '/ch_maid_1.png']
		},
		{
			id: 'euija-maid-grab',
			ratio: 1.778,
			tone: '#7f1d1d',
			nsfw: true,
			at: 'Two court maids attend him',
			alt: 'Euija’s hand closing on a maid’s plump ass as she pours — close, lamp-lit, flushed',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Adult King Euija grabbing a handful of a court maid’s plump ass as she leans to pour wine. LARGE hips and thick thighs, mint silk hiked. Faces match attached portraits. Erotic lamp light, blush. Dynamic pose. Adult/mature, passionate. Painterly anime-adjacent. No text, no watermark.',
			refs: ['/ch_buyeo_euija.png', '/ch_maid_2.png']
		}
	])
);

added.push(
	...insertAfter(findEntry('Euija’s Descent').images, 'euija-maid-stair-hem', [
		{
			id: 'euija-maid-thigh-close',
			ratio: 0.75,
			tone: '#7f1d1d',
			nsfw: true,
			at: 'The hems keep time',
			alt: 'Close: a Sabi maid’s plump thigh and hip in mint silk, Euija’s gold headband spark at the edge',
			prompt:
				'Intimate cinematic CLOSE-UP, 9:16. Adult Baekje court maid, LARGE plump thighs and wide hips filling the frame, mint-green silky chima riding high, cream jeogori. Face matches attached maid portrait. King Euija only as a gold-yellow headband spark and a wine-red sleeve at the edge. Erotic lamp. Adult/mature. Painterly. No text, no watermark.',
			refs: ['/ch_maid_3.png', '/ch_buyeo_euija.png']
		},
		{
			id: 'euija-maid-ass-hand',
			ratio: 1.778,
			tone: '#7f1d1d',
			nsfw: true,
			at: 'who is bold enough to speak',
			alt: 'Euija grabbing a handful of maid ass — she flushed, he grinning, wine-red lamp',
			prompt:
				'Intimate cinematic still, 16:9. Adult King Euija grinning, gold-yellow headband, grabbing a handful of a court maid’s plump ass. She is flushed, overwhelmed. LARGE hips and thighs, mint silk. Faces match attached portraits. Dynamic passionate pose, erotic lighting. Adult/mature. Painterly anime-adjacent. No text, no watermark.',
			refs: ['/ch_buyeo_euija.png', '/ch_maid_1.png']
		}
	])
);

const daeya = findEntry('Daeya Fortress').images;
rewrite(daeya, 'nsfw-pumsuk-gumilwife-surprise', {
	ratio: 0.75,
	tone: '#8AAFA0',
	alt: 'Close: Yehwa’s blushing surprise as young Pumsuk steps into her lamp',
	refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png'],
	prompt:
		'Intimate cinematic CLOSE-UP, 9:16. Faces fill the frame. Adult Yehwa (Geomil’s wife), tan skin, dark bun, wooden sprig pin, teal-sage #8AAFA0 silk — blushing surprise, lips parted. Young adult Pumsuk at the edge in ice-blue #7EB8F0 silk, not yet the aggressor. Faces match attached portraits. Erotic gold lamp. Painterly anime-adjacent. Adult/mature. No text, no watermark.'
});
rewrite(daeya, 'nsfw-pumsuk-gumilwife-overwhelm', {
	ratio: 0.75,
	tone: '#8AAFA0',
	alt: 'Close: Yehwa overwhelmed with desire, eyes wet, teal silk open at the throat',
	refs: ['/ch_gumil_wife.png', '/ch_pumsuk.png'],
	prompt:
		'Intimate cinematic CLOSE-UP, 9:16. Faces fill the frame. Adult Yehwa overwhelmed with lust, blushing hard, wet eyes, mouth open. Teal-sage #8AAFA0 silk slipped at the shoulder. Pumsuk’s ice-blue #7EB8F0 hand at the edge of frame. Faces match attached portraits. Erotic rim light. Dynamic lean. Adult/mature. Painterly. No text, no watermark.'
});
rewrite(daeya, 'nsfw-pumsuk-gumilwife-allure', {
	ratio: 1.778,
	tone: '#8AAFA0',
	alt: 'Yehwa looking back over her shoulder, flushed allure, hip weight, teal silk',
	refs: ['/ch_gumil_wife.png'],
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. Adult Yehwa looking back over her shoulder, flushed, in love and inviting. LARGE hip weight, teal-sage #8AAFA0 silk taut. Face matches attached portrait. Erotic lamp. Skin-forward. Adult/mature. Painterly anime-adjacent. No text, no watermark.'
});
rewrite(daeya, 'nsfw-pumsuk-gumilwife-pressed', {
	ratio: 0.75,
	tone: '#7EB8F0',
	alt: 'Bodies pressed — Pumsuk kissing Yehwa, both flushed, ice-blue and teal silk',
	refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png'],
	prompt:
		'Intimate cinematic CLOSE-UP, 9:16. Adult Pumsuk and adult Yehwa pressed together in a passionate kiss. Faces fill the frame, blushing, overwhelmed. His ice-blue #7EB8F0 silk; her teal-sage #8AAFA0. Faces match attached portraits. Dynamic lean, erotic gold-and-blue rim light. Adult/mature. Painterly. No text, no watermark.'
});
rewrite(daeya, 'nsfw-pumsuk-gumilwife-hands', {
	ratio: 1.778,
	tone: '#7EB8F0',
	alt: 'Pumsuk’s hands on Yehwa’s waist — he is starting to claim her, flushed, in love',
	refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png'],
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. Adult Pumsuk’s hands on adult Yehwa’s waist, he is becoming the aggressor, flushed and in love. Faces match attached portraits. Ice-blue #7EB8F0 and teal-sage #8AAFA0 silk. Erotic lamp. Dynamic passionate pose. Adult/mature. Painterly. No text, no watermark.'
});

added.push(
	...insertAfter(daeya, 'nsfw-pumsuk-gumilwife-hands', [
		{
			id: 'nsfw-pumsuk-yehwa-claim',
			ratio: 0.75,
			tone: '#7EB8F0',
			nsfw: true,
			at: 'I am the one shaking.',
			alt: 'Pumsuk the aggressor — pinning Yehwa, flushed, in love, ice-blue silk open',
			prompt:
				'Intimate cinematic CLOSE-UP, 9:16. Adult Pumsuk the aggressor, in love, pinning adult Yehwa (Geomil’s wife) against a dark plane. Faces match attached portraits. His ice-blue #7EB8F0 silk open; her teal-sage #8AAFA0. Blushing, overwhelmed desire, passionate almost-kiss. He is hungry and devoted. Erotic rim light. Dynamic pose. Adult/mature. Painterly. No text, no watermark.',
			refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png']
		},
		{
			id: 'nsfw-pumsuk-yehwa-devotion',
			ratio: 1.778,
			tone: '#8AAFA0',
			nsfw: true,
			at: 'Put that politeness… on my waist.',
			alt: 'Close faces: Pumsuk flushed and hungry for Yehwa, her mouth parted, lamp gold',
			prompt:
				'Intimate cinematic CLOSE-UP, 16:9. Faces fill the frame. Adult Pumsuk aggressive and in love toward adult Yehwa. Faces match attached portraits. Blush, wet mouths, overwhelmed lust, devotion. He holds her face. Erotic gold lamp. Skin-forward. Adult/mature. Painterly anime-adjacent. No text, no watermark.',
			refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png']
		}
	])
);

added.push(
	...prependIfMissing(findEntry('Unified Silla').images, {
		id: 'unified-silla-wide',
		ratio: 2.4,
		tone: '#3E79E4',
		alt: 'Wide Gyeongju morning: one blue Silla court on the basin, three old colors as thin banner specks',
		prompt:
			'Wide cinematic EXPOSITION still, 16:9. REAL Gyeongju / Seorabeol basin, 676. One long wooden Silla palace hall as a blue #3E79E4 plane. Tiny silky court figures. Three old kingdom colors only as thin banner specks — Silla blue, Baekje yellow, Goguryeo red — now under one court. Flat pale sky, no clouds. Painterly cinema. No text, no watermark.',
		refs: ['/ch_munmu.png']
	})
);

added.push(
	...insertAfter(findEntry('Unified Silla').images, 'unified-silla-day', [
		{
			id: 'unified-silla-banners',
			ratio: 1.778,
			tone: '#3E79E4',
			at: 'King for All',
			alt: 'Munmu small under one blue Silla sky — yellow and red only as folded banners at his feet',
			prompt:
				'Cinematic historical still, 16:9. REAL Seorabeol courtyard. King Munmu small in crimson-blue silk, gold Silla crown. Face matches attached portrait. One Confucian-blue #3E79E4 sky plane. Folded Baekje-yellow and Goguryeo-red banners at his feet. Flat sky, no clouds. Painterly cinema. No text, no watermark.',
			refs: ['/ch_munmu.png']
		},
		{
			id: 'unified-silla-two-thrones',
			ratio: 1.778,
			tone: '#C41E3A',
			at: 'King Munmu',
			alt: 'One crimson Munmu plane, one pink Munhee witness — two small figures on a wet Gyeongju court',
			prompt:
				'Cinematic historical still, 16:9. REAL Gyeongju court. Two tiny silky figures: King Munmu in crimson #C41E3A, Queen Munmyung (Munhee) in pink #E07FA8. Faces match attached portraits as distant hints. Wet black floor, one blue hall-bar. Flat sky, no clouds. Painterly cinema. No text, no watermark.',
			refs: ['/ch_munmu.png', '/ch_munhee.png']
		}
	])
);

added.push(
	...prependIfMissing(findEntry('Balhae').images, {
		id: 'balhae-wide',
		ratio: 2.4,
		tone: '#C30000',
		alt: 'Wide northern millet plain at dawn — one red mountain-keep, tiny father and son walking north',
		prompt:
			'Wide cinematic EXPOSITION still, 16:9. REAL Manchurian millet plain, 698. One Goguryeo-red #C30000 mountain-keep on a far ridge. Two tiny silky figures walking north. Gold dawn, flat sky, no clouds. Painterly cinema. No text, no watermark.',
		refs: ['/ch_dae_joyoung.png']
	})
);

added.push(
	...insertAfter(findEntry('Balhae').images, 'balhae-new-dawn', [
		{
			id: 'balhae-two-courts',
			ratio: 1.778,
			tone: '#C30000',
			at: 'Goguryeo rises again as Balhae',
			alt: 'Two courts after the war: Silla blue south, Balhae red north, one pale sea between',
			prompt:
				'Cinematic historical still, 16:9. Two distant courts on one peninsula-plane: south a blue #3E79E4 Silla hall, north a red #C30000 Balhae keep, a pale sea-strip between. Tiny figures only. Flat sky, no clouds. Unified aftermath, not a flag collage. Painterly cinema. No text, no watermark.',
			refs: ['/ch_munmu.png', '/ch_dae_joyoung.png']
		},
		{
			id: 'balhae-north-walk',
			ratio: 1.778,
			tone: '#C30000',
			at: 'When we stop… what do we call it?',
			alt: 'Dae Jo-yeong as a boy on the millet road, red headband, father a step behind, north ridge',
			prompt:
				'Cinematic historical still, 16:9. REAL northern millet road. Young Dae Jo-yeong walking north, red headband, tan mantle — face matches attached portrait. A smaller father-silhouette behind. One red #C30000 ridge. Gold dawn. Flat sky, no clouds. Painterly cinema. No text, no watermark.',
			refs: ['/ch_dae_joyoung.png']
		}
	])
);

const wides = [
	[
		'Gotaso’s Wedding',
		'gotaso-wedding-wide',
		'Wide Silla wedding hall: empty wet floor, one pink #F0A3C0 silk accent at a distant low table',
		'#F0A3C0'
	],
	[
		'Yeon’s Massacre',
		'yeon-massacre-wide',
		'Wide Pyongyang banquet hall after the killing: empty tables, one red #C30000 wall-plane',
		'#C30000'
	],
	[
		'Li Shimin, the 2nd Huangdi',
		'lishimin-wide',
		'Wide empty Taiji hall: one gold throne-bar, tiny Tang court specks, flat charcoal void',
		'#d4b86a'
	],
	[
		'Eastern Fortress',
		'eastern-fortress-wide',
		'Wide Andong / Baekam ridge: one white Tang shaft on a dark Korean mountain-keep',
		'#C41E3A'
	],
	[
		'Jumong',
		'jumong-wide',
		'Wide Jolbon river-bend at dawn: one red bow-speck on a gold water-plane',
		'#C30000'
	],
	[
		'Ansi',
		'ansi-wide',
		'Wide Ansi stone ring on a ridge: earthen ramp, tiny siege specks, flat pale sky',
		'#C30000'
	],
	[
		'The Flower Youth',
		'flower-youth-wide',
		'Wide empty Hwarang yard: one blue practice-line, wet sand, no crowd',
		'#2A5FB8'
	],
	[
		'Bidam’s Rebellion',
		'bidam-rebellion-wide',
		'Wide Myeonghwal / Radiance keep at night: one gold incense column, blue Silla fires below',
		'#141C2E'
	],
	[
		'Silla-Tang Alliance',
		'silla-tang-wide',
		'Wide two-hall plane: Silla blue bar and Tang gold bar across one wet floor',
		'#3E79E4'
	],
	[
		'Death of the Second Emperor',
		'second-emperor-wide',
		'Wide empty Chang’an night court: one gold screen-slit, no throne clutter',
		'#d4b86a'
	],
	[
		'The Royal Secretariat',
		'secretariat-wide',
		'Wide empty Silla secretariat: one long desk-bar, pink and blue ink specks',
		'#D8258C'
	],
	[
		'King Muyeol',
		'muyeol-wide',
		'Wide Seorabeol coronation court: one magenta plane, tiny crown-speck',
		'#D8258C'
	],
	[
		'Euija’s Descent',
		'euija-descent-wide',
		'Wide empty Sabi banquet hall: one gold headband spark, wine-red floor',
		'#7f1d1d'
	],
	[
		'Big Star and Little Star',
		'stars-wide',
		'Wide heaven-earth split: one pale gold plane over one red living-world strip',
		'#F4F1E8'
	],
	[
		'Black Rock',
		'black-rock-wide',
		'Wide black volcanic ridge: one red lava-seam, tiny myth-specks',
		'#14141a'
	],
	[
		'The Girl Who Cut Her Hair',
		'jacheongbi-wide',
		'Wide empty millet field: one green #8FBF8A hair-ribbon on a dirt road',
		'#8FBF8A'
	],
	[
		'The Ox and the Iron Chest',
		'ox-chest-wide',
		'Wide empty farm yard: one iron-chest stamp, ox as a brown bar at the gate',
		'#8FBF8A'
	],
	[
		'Annual Meeting of the Three Realms',
		'three-realms-wide',
		'Wide three-plane court: heaven gold, living red, flower-field green — tiny god-specks',
		'#F4F1E8'
	],
	[
		'Yellow Mountain Fields',
		'hwangsan-wide',
		'Wide Hwangsanbeol yellow field, Maebong behind, three tiny palisade camps',
		'#FFCB51'
	],
	[
		'The Death of Kim Chunchu',
		'chunchu-death-wide',
		'Wide empty Seorabeol night: one magenta #D8258C empty-chair plane',
		'#D8258C'
	],
	[
		'The Brothers’ Coup',
		'brothers-coup-wide',
		'Wide Pyongyang inner court: one red split-floor, two tiny brother-specks',
		'#C30000'
	],
	[
		'The Final Stand',
		'final-stand-wide',
		'Wide last ridge: three tiny dragon-colors on one empty mountain road',
		'#C30000'
	],
	[
		'The King for All',
		'king-for-all-wide',
		'Wide peninsula-plane: one blue court, one red north keep, pale sea between',
		'#3E79E4'
	]
];

for (const [title, id, alt, tone] of wides) {
	added.push(
		...prependIfMissing(findEntry(title).images, {
			id,
			ratio: 2.4,
			tone,
			alt,
			prompt: `Wide cinematic EXPOSITION still, 16:9. Camera far back. REAL recognizable place. ${alt} Tiny silky hanbok figures, few hues, one accent. Flat sky, no clouds. Painterly cinema, not photoreal, not cartoon. No readable text, no watermark.`
		})
	);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('added', added.filter(Boolean).join(', '));
