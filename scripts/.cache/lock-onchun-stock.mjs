import { editStory, entryOf } from './story-ops.mjs';
import fs from 'node:fs';

const TAIL = fs.readFileSync(new URL('./onchun-intro-tail.txt', import.meta.url), 'utf8').trim();

const LOCK =
	'CLEAN Korean WEBTOON / manhwa character-intro splash, SAME FILM STOCK as the other stills of this feast: BOLD THICK black ink contour, FLAT saturated crimson and ochre silk, simple 2-3 value shading, simple webtoon faces, dark steam, creamy lamp bokeh. NO watercolor granulation. NO ink-wash paper stain. NO speckles. NO fine-line architectural drawing. NO ukiyo-e. NO pale tourist onsen.';

const IDS = new Set([
	'ulbul-onchun-wide',
	'ulbul-onchun-ladies',
	'ulbul-onchun-kiss',
	'ulbul-onchun-plan',
	'ulbul-onchun-call',
	'ulbul-onchun-seize',
	'ulbul-onchun-heads',
	'ulbul-saburu-watch'
]);

editStory((story) => {
	const en = entryOf(story, 'five-principles', 'Ulbul');
	if (!en) throw new Error('missing Ulbul');
	for (const im of en.images ?? []) {
		if (!IDS.has(im.id)) continue;
		im.time = 'night';
		if (im.id === 'ulbul-onchun-wide') {
			im.prompt = `${LOCK} MEDIUM movie still, bank height, irregular stone Goguryeo hot spring. LARGE webtoon figures in the lower two-thirds. A court lady STANDING on wet stone mid-dance: SHORT white jeogori, saekdong striped pleated chima (red-white-yellow bands, not a rainbow), rouge, bun and pin, long sleeves. A hunter: SHORT dotted ochre hip-length LEFT-closing jacket, baggy trousers, black trim, small black PEAKED jougwan on the topknot with TWO barred pheasant feathers in a V and chin cords — NOT a round helmet, NOT a long yellow robe, NOT a Joseon gat. A few revelers in the water, cups, one drum. One timber giwa eave dissolving in dark steam. ONE device: the steam-line of the pool. #C30000 lamp bounce on silk, never a glow. ${TAIL}`;
			im.alt = 'Bank-height feast: court lady dancing, hunter in a jougwan, steam and lamps';
		} else if (im.id === 'ulbul-onchun-ladies') {
			im.prompt = `${LOCK} INTIMATE two-shot, dutch. A court lady MID-DANCE on wet stone wrapping a hunter with LONG sleeves: SHORT white jeogori, saekdong striped chima hiked, rouge, bun and pin, blush, parted lips. Hunter: SHORT dotted ochre hip-length jacket, baggy trousers, black trim, small black PEAKED jougwan with TWO pheasant feathers in a V, chin cords, wanting grin. ONE device: her sleeve as a ribbon across the frame. #C30000 lamp bounce. Skin-forward through cloth, not nude. ${TAIL}`;
		} else if (im.id === 'ulbul-onchun-kiss') {
			im.prompt = `${LOCK} INTIMATE CLOSE two-shot. A court lady KISSES a hunter, mouths together, laughing, blush, heavy lids. She: SHORT white jeogori slipping one shoulder, saekdong striped chima, rouge, bun and pin. He: SHORT dotted ochre jacket, small black PEAKED jougwan TILTED with TWO barred pheasant feathers in a V, chin cords — NOT a round helmet. Wet silk. ONE device: dark steam plane behind their heads. #C30000 lamp bounce. Romance heat, charge not exposure. ${TAIL}`;
		} else if (typeof im.prompt === 'string') {
			im.prompt = im.prompt
				.replace(/DAY GROUND unless the scene says night:[^.]+?\./, 'Night-dusk ground: crushed dark steam and stone, the figures the saturated inked thing.')
				.replace(/FAR WIDE establishing\. DUSK GROUND, pale steam dissolving to paper-white\./, 'MEDIUM movie still, dark steam.')
				.replace(/high-key paper-white sky and pale stone, the figure the dark inked thing\./, 'crushed dark steam and stone, figures the saturated inked thing.');
			if (!im.prompt.startsWith('CLEAN Korean WEBTOON')) im.prompt = `${LOCK} ${im.prompt}`;
		}
	}
	return true;
});

console.log('locked onchun film stock');
