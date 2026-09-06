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

const UNTAG = new Set([
	'yushin-fans-sunduk-only',
	'munhee-sewing-later',
	'euija-maids-two',
	'yehwa-daeya-stares',
	'pumsuk-half-share',
	'euija-gesomun-thigh',
	'taizong-vast-harem',
	'jumong_01',
	'haemosu-copper-room',
	'sosuno-shy-heat',
	'jumong-sosuno-nights',
	'hwarang-female-fans',
	'three-youths-dukman',
	'gaya-ridge-night',
	'nsfw-suro-heo-hungry',
	'nsfw-suro-heo-obsession',
	'nsfw-suro-heo-devour',
	'nsfw-suro-heo-cling',
	'nsfw-suro-heo-chamber',
	'gaozong-vast-harem',
	'euija-court-maids',
	'euija-maid-wine-slit',
	'euija-maids-compete',
	'euija-maids-hundreds'
]);

let untagged = 0;
for (const en of entries()) {
	for (const im of en.images ?? []) {
		if (im.nsfw && UNTAG.has(im.id)) {
			delete im.nsfw;
			untagged++;
		}
	}
}

const council = findEntry('The Harmony Council');
council.images = council.images.filter(
	(im) => !['harmony-debate-hands', 'harmony-debate-veto', 'harmony-debate-white'].includes(im.id)
);

const wide = council.images.find((im) => im.id === 'harmony-council-wide');
if (wide) {
	wide.src = '/img_sunduk_02.png';
	wide.tempImage = '/temp/harmony-council.jpg';
	wide.ratio = 3.333;
	wide.tone = '#3a3a3a';
	wide.alt =
		'The Harmony Council — white robes around a round table, incense rising at the center';
	wide.prompt =
		'Reuse the canon harmony-council still: round table, white court robes, central incense. No new generation.';
	wide.refs = ['/img_sunduk_02.png', '/temp/harmony-council.jpg'];
}

const ansi = findEntry('Ansi').images;
if (!ansi.some((im) => im.id === 'taizong-ji-silhouette')) {
	const i = ansi.findIndex((im) => im.id === 'taizong-ansi-face');
	ansi.splice(i + 1, 0, {
		id: 'taizong-ji-silhouette',
		ratio: 1.778,
		tone: '#c97a2e',
		at: 'The Second Emperor tries the wall first',
		alt: 'Taizong in full Tang armor on the Ansi field — a silhouette, large ji, only yellow rim-light',
		prompt:
			'Minimal iconic 16:9 poster. Taizong, Second Emperor of Tang, fighting at Ansi. ONE geometric device: a huge ji (halberd) as a hard diagonal shaft. Figure is a full-armor SILHOUETTE — face concealed by helmet and shadow. Face suggestion of the attached portrait only as a yellow rim on the visor. Emperor-amber #c97a2e as the single yellow highlight on armor edges and the ji blade. Striking silky Tang campaign-military, few hues. Flat charcoal void. No army catalog. No palace. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
		refs: ['/ch_taizong.png']
	});
}
if (!ansi.some((im) => im.id === 'taizong-ji-charge')) {
	const i = ansi.findIndex((im) => im.id === 'taizong-ji-silhouette');
	ansi.splice(i + 1, 0, {
		id: 'taizong-ji-charge',
		ratio: 0.75,
		tone: '#c97a2e',
		at: 'the lacquered bowl leaves his head',
		alt: 'Low worm’s-eye: armored Taizong charging with a long ji — black silhouette, yellow light only',
		prompt:
			'Minimal iconic 9:16 poster. Taizong charging at Ansi. ONE geometric device: a long ji rising as a vertical yellow-edge line. Full Tang armor conceals the face — silhouette only. Emperor-amber #c97a2e as thin rim-light on helmet, shoulder, and blade. Flat charcoal void. No army. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
		refs: ['/ch_taizong.png']
	});
}

const sundukBlush = findEntry('Queen Sunduk').images.find((im) => im.id === 'sunduk-flirt-blush');
if (sundukBlush) {
	sundukBlush.nsfw = true;
	sundukBlush.alt =
		'Private chamber: Queen Sunduk flushed, looking down, both arms folded toward her loins as Yushin has just left';
	sundukBlush.prompt =
		'Intimate cinematic still, 9:16. PRIVATE inner palace chamber — closed door, one lamp, no corridor audience. Adult Queen Sunduk as sovereign, gold Silla crown, vermilion #E8552B silky hanbok. She does NOT stare at the viewer. Head turned down and aside, blushing, in love, a private reaction after Kim Yushin walked past. BOTH ARMS point toward her loins — hands clasped low at the lower abdomen / lap, sleeves falling inward. Yushin only as a Confucian-blue #2A5FB8 sleeve vanishing through a door-slit. Face matches the attached Sunduk portrait. More painterly and grounded, not a public pose. Modest clothing. No text, no watermark.';
}

const face = ansi.find((im) => im.id === 'taizong-ansi-face');
if (face) {
	face.alt =
		'Taizong’s first readable face — matches the yellow-robe portrait: black futou, pointed beard, yellow camp light';
	face.prompt =
		'Intimate cinematic CLOSE-UP still, 9:16. Taizong, Second Emperor of Tang — first readable face. Face MUST match the attached portrait exactly: black Tang futou cap, full pointed black beard and mustache, stern eyes, late-forties, yellow imperial robe #c97a2e at the throat. ONE geometric device: a lacquered siege-helmet leaving the top edge as a hard black bowl. Yellow camp-light #c97a2e as the single accent on wet skin. Real adult proportions. Flat charcoal void. No army. No clouds. No text. No watermark. Painterly, not photoreal.';
	face.refs = ['/ch_taizong.png'];
}

for (const id of ['euija-maid-hip', 'euija-maid-grab', 'euija-maid-thigh-close', 'euija-maid-ass-hand']) {
	const im = entries()
		.flatMap((e) => e.images ?? [])
		.find((x) => x.id === id);
	if (!im) throw new Error(`missing ${id}`);
	im.nsfw = true;
}

const hip = entries()
	.flatMap((e) => e.images ?? [])
	.find((x) => x.id === 'euija-maid-hip');
hip.alt = 'Euija seated; a bottom-heavy maid in full mint chima stands close — hip weight under silk, some calf';
hip.prompt =
	'Intimate cinematic still, 16:9. Adult King Euija seated, gold-yellow headband, wine-red silk — face matches attached portrait. A court maid with a BOTTOM-HEAVY figure stands beside him in a FULL mint-green chima and cream jeogori — the dress stays on. His hand rests on the curve of her hip OVER the silk. Some leg visible where the hem lifts at the calf only. No bare buttocks, no nude hip. Faces match attached portraits. Warm lamp. Painterly, period, not modern. Adult/mature. No text, no watermark.';

const grab = entries()
	.flatMap((e) => e.images ?? [])
	.find((x) => x.id === 'euija-maid-grab');
grab.alt = 'Euija’s hand on a maid’s plump backside OVER her mint dress as she pours — hem shows calf';
grab.prompt =
	'Intimate cinematic still, 16:9. Adult King Euija, gold-yellow headband — face matches attached portrait. A court maid pours wine; his hand gathers a handful of her plump backside OVER the mint-green chima. Dress stays on. Bottom-heavy hips. Some leg at the hem. No bare skin of the buttocks. Faces match attached maid portrait. Period silk, not modern. Warm lamp. Adult/mature. No text, no watermark.';

const thigh = entries()
	.flatMap((e) => e.images ?? [])
	.find((x) => x.id === 'euija-maid-thigh-close');
thigh.alt = 'Close: mint chima pulled aside at the hem — a plump calf and thigh line, still dressed';
thigh.prompt =
	'Intimate cinematic CLOSE-UP, 9:16. Adult Baekje court maid, BOTTOM-HEAVY hips under a full mint-green chima. The hem is lifted only enough to show calf and a line of thigh — she is still dressed. Cream jeogori. Face matches attached maid portrait. Euija as a gold-yellow headband spark at the edge. No bare buttocks. Period, not modern. Painterly. Adult/mature. No text, no watermark.';

const ass = entries()
	.flatMap((e) => e.images ?? [])
	.find((x) => x.id === 'euija-maid-ass-hand');
ass.alt = 'Euija grabbing a maid’s plump backside over the dress — she flushed, silk stretched, some leg';
ass.prompt =
	'Intimate cinematic still, 16:9. Adult King Euija grinning, gold-yellow headband, hand closing on a court maid’s plump backside OVER her mint silk chima. Dress stays on; the silk shows a bottom-heavy figure. Some leg at the hem. She is flushed. Faces match attached portraits. Period, not modern, not nude. Warm lamp. Adult/mature. No text, no watermark.';

const fans = findEntry('The Flower Youth').images.find((im) => im.id === 'hwarang-female-fans');
if (fans) {
	delete fans.nsfw;
	fans.alt =
		'Girls in hanbok crowd the Hwarang yard fence, watching Yushin on the dust field';
	fans.prompt =
		'Cinematic historical still, 16:9. REAL Surabol Hwarang yard. Young women in striking silky hanbok crowd a wooden fence in the foreground — readable faces, not insect specks, not a sword duel. Marshal Yushin in Confucian-blue #2A5FB8 trains on the pale dust field beyond. Faces match attached portraits. Flat Confucian-blue sky, no clouds. Painterly cinema. Modest. No text, no watermark.';
	fans.refs = ['/ch_kim_yushin.png', '/ch_maid_1.png', '/ch_maid_2.png'];
}

const yushinFans = findEntry('Queen Sunduk').images.find((im) => im.id === 'yushin-fans-sunduk-only');
if (yushinFans) {
	delete yushinFans.nsfw;
	yushinFans.alt =
		'Capital daughters turn as Yushin walks by; he looks only toward Queen Sunduk in the side alcove';
	yushinFans.prompt =
		'Cinematic historical still, 16:9. Silla palace corridor. Young women in hanbok turn and lean as Kim Yushin in Confucian-blue #2A5FB8 walks past — he does not look at them. Queen Sunduk in vermilion #E8552B waits in a side alcove; his gaze goes only to her. Faces match attached portraits. Readable figures, not abstract specks. Painterly cinema. Modest. No text, no watermark.';
	yushinFans.refs = ['/ch_kim_yushin.png', '/ch_sunduk.png', '/ch_maid_1.png'];
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('untagged', untagged);
console.log('council slots', findEntry('The Harmony Council').images.map((im) => im.id).join(', '));
