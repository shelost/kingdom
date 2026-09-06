// Add Unified Silla / Balhae site stills on epilogue-2. Run: node scripts/.cache/patch-epilogue-sites.mjs
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const ch = story.find((c) => c.id === 'epilogue-2');
if (!ch) throw new Error('missing chapter epilogue-2');

const unified = ch.entries.find((e) => e.title === 'Unified Silla');
const balhae = ch.entries.find((e) => e.title === 'Balhae');
if (!unified || !balhae) throw new Error('missing epilogue entries');

function upsert(entry, slot) {
	entry.images ??= [];
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) entry.images[i] = { ...entry.images[i], ...slot };
	else entry.images.push(slot);
}

function upsertBlock(entry, htmlStart, block) {
	entry.blocks ??= [];
	const i = entry.blocks.findIndex((b) => typeof b.html === 'string' && b.html.startsWith(htmlStart));
	if (i >= 0) entry.blocks[i] = { ...entry.blocks[i], ...block };
	else entry.blocks.push(block);
}

const SILLA = '#3E79E4';
const MUNMU = '#C41E3A';
const GOGURYEO = '#C30000';

upsert(unified, {
	id: 'seokguram-disc',
	ratio: 1.778,
	tone: SILLA,
	at: 'a granite Buddha-disc in Tohamsan',
	alt: 'Seokguram reduced to a circular granite grotto-disc; tiny hanbok speck at the rim',
	prompt:
		'Minimal iconic 16:9 poster. NOT photoreal. NOT busy. Seokguram grotto, Unified Silla. ONE geometric device: a huge circular granite DISC — the cave-mouth — filling the center of the frame; the seated Buddha is a pale stone plane inside the disc, not a statue close-up. Use the attached photograph ONLY for the true round chamber and granite Buddha silhouette. Tiny silky hanbok monk-speck at the lower rim of the disc, no readable face. Munmu crimson #C41E3A as a thin rim-light on the disc edge. Flat Silla-blue #3E79E4 void. No clouds. No guardian catalog. No tourists. No temple clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: []
});

upsert(unified, {
	id: 'bulguksa-twin-stamps',
	ratio: 1.778,
	tone: SILLA,
	at: 'two pagodas on one Bulguksa court',
	alt: 'Bulguksa courtyard as two unequal stone stamps: laced Dabotap and plain Seokgatap',
	prompt:
		'Minimal iconic 16:9 poster. NOT photoreal. NOT busy. Bulguksa, Unified Silla. ONE geometric device: TWO unequal vertical STAMPS on a wet black courtyard plane — left, ornate Dabotap as a laced square-column; right, Seokgatap as a plain three-storey bar. Use the attached photographs ONLY for the true pagoda silhouettes. One tiny silky hanbok speck between the stamps, no readable face. Munmu crimson #C41E3A as a hairline accent on the wet floor. Flat Silla-blue #3E79E4 sky, no clouds. No wooden halls. No pines. No tourists. No railings. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: []
});

upsert(unified, {
	id: 'emille-bell-ring',
	ratio: 1.778,
	tone: '#5c5346',
	at: 'the Emille Bell',
	alt: 'The Sacred Bell of King Seongdeok as a huge bronze ovoid hanging in a charcoal void',
	prompt:
		'Minimal iconic 16:9 poster. NOT photoreal. NOT busy. Emille Bell — Sacred Bell of King Seongdeok. ONE geometric device: a huge bronze OVOID occupying the right two-thirds, mouth down, cropped by the top and bottom edges; a dragon-loop implied as a small dark knot at the crown. Use the attached photograph ONLY for the true Korean bell silhouette (dragon loop, sound-pipe, flared rim). Tiny silky hanbok speck under the lip, no readable face. Single bronze-gold accent on a flat charcoal void. No white museum pavilion. No wooden striker log. No trees. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: []
});

upsert(unified, {
	id: 'cheomseongdae-bottle',
	ratio: 1.778,
	tone: SILLA,
	at: 'Sunduk’s bottle of stars',
	alt: 'Cheomseongdae as a bottle-shaped granite trapezoid on a vast empty Gyeongju plane',
	prompt:
		'Minimal iconic 16:9 poster. NOT photoreal. NOT busy. Cheomseongdae observatory, Gyeongju. ONE geometric device: the bottle-shaped tower as a single vertical TRAPEZOID of stacked granite — square base, swelling circular body, square window-mouth at the top — standing alone in the lower-center. Use the attached photograph ONLY for the true bottle silhouette. Tiny silky hanbok speck at the foot, no readable face. Flat Silla-blue #3E79E4 sky, no clouds. NO moon. NO crescent. NO flowers. No grass catalog. No other buildings. Munmu crimson #C41E3A as one thin slit in the square top window. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: []
});

upsert(unified, {
	id: 'anapji-mirror',
	ratio: 1.778,
	tone: SILLA,
	at: 'Anapji copying the sky',
	alt: 'Anapji / Wolji as a hard horizontal water-mirror; one thin palace bar reflected',
	prompt:
		'Minimal iconic 16:9 poster. NOT photoreal. NOT busy. Anapji (Wolji) palace pond, Gyeongju. ONE geometric device: a hard HORIZONTAL water-rectangle occupying the lower two-thirds, a wet mirror of flat Silla-blue #3E79E4; one thin dark palace-bar along the far edge, its reflection a second bar in the water. Use the attached photograph ONLY for the true pond-and-pavilion silhouette. Tiny silky hanbok specks on the shore, no readable faces. Munmu crimson #C41E3A as a single lantern-spark. Flat sky matching the water, no clouds. No night-tourism lights. No trees catalog. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: []
});

upsert(unified, {
	id: 'munmu-tide-rock',
	ratio: 1.778,
	tone: MUNMU,
	at: 'The bone-rock is still there',
	alt: 'Daewangam as a single rock-stamp in a vast Munmu-crimson tide plane',
	prompt:
		'Minimal iconic 16:9 poster. NOT photoreal. NOT busy. King Munmu’s underwater tomb, Daewangam, East Sea. ONE geometric device: a single jagged ROCK-STAMP sitting in the lower third of a vast flat tide-plane. Use the attached photograph ONLY for the true islet silhouette. Tiny silky hanbok speck on the shore-strip at the extreme left, no readable face. Face suggestion of the attached portrait only if a figure is visible. Munmu crimson #C41E3A as the water-plane; charcoal rock; one pale foam-rim. Flat sky, no clouds. No funeral pyre. No seagull flock. No stone tablet. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: ['/ch_kim_bupmin.png']
});

upsert(balhae, {
	id: 'sanggyeong-grid',
	ratio: 1.778,
	tone: GOGURYEO,
	at: 'stamped grid of halls on the Mudanjiang',
	alt: 'Sanggyeong as nested courtyard rectangles stamped on an empty northern field',
	prompt:
		'Minimal iconic 16:9 poster. NOT photoreal. NOT busy. Sanggyeong (Longquanfu), Balhae capital. ONE geometric device: three NESTED courtyard RECTANGLES stamped on a vast empty millet-gold field — inner hall, middle court, outer wall — not a Tang 3+6 seal, not city streets. Use the attached ruin photographs ONLY for the true empty-capital flatness and earth color. One tiny silky Goguryeo-red hanbok speck in the innermost rectangle, no readable face. Face suggestion of the attached portrait only as a distant rim-lit hint. Goguryeo red #C30000 as the wall-lines and the single accent. Flat pale sky, no clouds. No modern boardwalk. No visitor platform. No mountains catalog. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: ['/ch_dae_joyoung.png']
});

upsert(balhae, {
	id: 'balhae-lotus-tile',
	ratio: 1.778,
	tone: GOGURYEO,
	at: 'lotus tiles',
	alt: 'A single Balhae lotus eave-tile as a huge circular medallion on a red void',
	prompt:
		'Minimal iconic 16:9 poster. NOT photoreal. NOT busy. Balhae lotus eave-tile (wadang). ONE geometric device: a huge circular LOTUS-MEDALLION filling the left two-thirds — seed-pod center, radiating petals, gray-buff clay — cropped by the frame edges like a pressed stamp. Use the attached Shangjing brick photograph ONLY for clay color and stamped relief language, then turn it into a lotus wadang disc (not a rectangular brick). Tiny silky red hanbok speck at the lower-right, no readable face. Goguryeo red #C30000 as the void-plane. Flat void, no clouds. No palace. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: []
});

upsert(balhae, {
	id: 'balhae-stone-lantern',
	ratio: 1.778,
	tone: GOGURYEO,
	at: 'a stone lantern, the shard still warm',
	alt: 'Balhae stone lantern as a thin octagonal column in a red northern void',
	prompt:
		'Minimal iconic 16:9 poster. NOT photoreal. NOT busy. Balhae stone lantern (Xinglong Temple type at Sanggyeong): a tall octagonal granite lamp-pillar. ONE geometric device: a thin vertical COLUMN from the bottom edge to the top, stacked drums and an octagonal fire-chamber, standing alone. Tiny silky red hanbok speck at the base, no readable face. Goguryeo red #C30000 as a single slit of light in the lantern chamber; the rest flat charcoal void. Flat sky, no clouds. No temple buildings. No Silla pagoda. No courtyard clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: []
});

const stoneHtml =
	'The later court leaves stone where the armies were: a granite Buddha-disc in Tohamsan, two pagodas on one Bulguksa court, the Emille Bell, Sunduk’s bottle of stars, Anapji copying the sky.';
upsertBlock(unified, 'The later court leaves stone', {
	kind: 'p',
	html: stoneHtml,
	ko: '뒷날 조정은 군대 자리에 돌을 남긴다. 토함산의 화강암 부처 원반, 불국사 한 마당의 탑 둘, 에밀레종, 선덕의 별 병, 하늘을 베껴 둔 안압지.'
});

const boneHtml = 'The bone-rock is still there — <b>Daewangam</b>, a hundred paces out, waiting for the tide.';
upsertBlock(unified, 'The bone-rock is still there', {
	kind: 'p',
	html: boneHtml,
	ko: '뼈를 모신 바위는 아직도 그 자리에 있다 — <b>대왕암</b>, 뭍에서 백 걸음, 밀물을 기다린다.'
});

const sangHtml =
	'<b>Sanggyeong</b> is later a stamped grid of halls on the Mudanjiang — lotus tiles, a stone lantern, the shard still warm.';
upsertBlock(balhae, '<b>Sanggyeong</b> is later a stamped grid', {
	kind: 'p',
	html: sangHtml,
	ko: '뒷날 <b>상경</b>은 무단강가에 찍힌 궁성 격자다 — 연꽃 와당, 석등, 조각은 여전히 따뜻하다.'
});

function moveBlockAfter(entry, htmlStart, afterNeedle) {
	const blocks = entry.blocks;
	const from = blocks.findIndex((b) => typeof b.html === 'string' && b.html.startsWith(htmlStart));
	const after = blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(afterNeedle));
	if (from < 0 || after < 0 || from === after + 1) return;
	const [block] = blocks.splice(from, 1);
	const newAfter = blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(afterNeedle));
	blocks.splice(newAfter + 1, 0, block);
}

moveBlockAfter(unified, 'The bone-rock is still there', 'They burn him on the shore');
moveBlockAfter(unified, 'The later court leaves stone', 'The bone-rock is still there');
moveBlockAfter(balhae, '<b>Sanggyeong</b> is later a stamped grid', 'raise a kingdom called Balhae');

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(
	'patched',
	unified.images.map((i) => i.id).join(', '),
	'|',
	balhae.images.map((i) => i.id).join(', ')
);
