/** Fill Tamla myth gaps with still slots. Does not touch starred files. */
import { readFileSync, writeFileSync } from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(STORY, 'utf8'));

const STYLE =
	'HEEWON STYLE. Painted webtoon cinema in the look of hek-vine-up and hek-still-burning: bold tapered ink contours, simplified expressive faces, garments in loaded brushstrokes with canvas grain, watercolor sky and oil-glazed darks. Simple pseudo-3D — the main object (vine, helmet, flower, fish, tree) reads as sculpted paint, not a 3D render, not photoreal, not flat cel. ONE device. Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge. FACE ONLY from the attached portrait. No text. No watermark. No glow aura. No body halo.';

const slots = {
	'Heaven–Earth King': [
		{
			id: 'hek-world-one',
			ratio: 2,
			time: 'day',
			at: 'In the beginning there were two suns and two moons.',
			alt: 'One undivided world under two suns and two moons, farmers fallen in the fields',
			people: ['heavenearthking'],
			refs: ['/ch_heaven_earth_king.png'],
			prompt: `${STYLE} DAY, paper-white like hek-vine-up. FAR WIDE worm's-eye. ONE device: two suns and two moons hung in one pale sky over a single undivided land — no border, no sea split, packed earth and one road that spirits and farmers share. Tiny farmers have dropped with hoes still in their hands. A tiny Heaven–Earth King, cream robe with red and blue cloth, stands on a ridge in the lower third, back to us, looking at a world that is still one piece. Monumental emptiness. Natural sky, not a void.`
		},
		{
			id: 'hek-wisdom-meet',
			ratio: 2,
			time: 'day',
			at: 'He comes down to the world to find the mother of that dream',
			alt: 'Heaven–Earth King finds the Lady of Wisdom in the poorest house',
			people: ['heavenearthking', 'chongmyeong'],
			refs: ['/ch_heaven_earth_king.png', '/ch_lady_wisdom.png'],
			prompt: `${STYLE} DAY, paper-white through a poor doorway. LEFT face of the sheet = Heaven–Earth King, elderly, white topknot and goatee, cream robe with red and blue cloth peeks. RIGHT face = Lady of Wisdom, young, her portrait face and dress. Worm's-eye from the packed-earth floor. ONE device: the dark timber doorframe. She is on her knees at a rice measure, looking up, mouth open mid-answer. He fills the doorway, one hand on the lintel, not a standing portrait. She is small and bright; he is the large dark shape. Poorest house: straw, one bowl, no furniture catalog.`
		},
		{
			id: 'hek-twins-born',
			ratio: 2,
			time: 'night',
			at: 'She has twins.',
			alt: 'The Lady of Wisdom has just borne the twins, one quiet and one already complaining',
			people: ['chongmyeong', 'daebyeol', 'sobyeol'],
			refs: ['/ch_lady_wisdom.png'],
			prompt: `${STYLE} NIGHT interior like hek-still-burning. One oil lamp on the floor beside the lens, raking up. The Lady of Wisdom — FACE from the attached portrait — is on straw, spent, hair loose, holding two newborns. The elder is quiet, eyes open, looking. The younger's mouth is already open, complaining. ONE device: the lamp's pool on the two small bodies. Heaven–Earth King is only a hand and a red sleeve on the doorframe, not a second portrait. Crushed dark, one warm key. Intimate, not a catalog of babies.`
		},
		{
			id: 'hek-king-war-helm',
			update: true,
			people: ['heavenearthking', 'pungudosa', 'beongae', 'byeorak', 'hwadeok'],
			refs: ['/ch_heaven_earth_king.png'],
			prompt: `${STYLE} STORM, dark like hek-still-burning. Worm's-eye from the dirt. Heaven–Earth King strides back from the war — FACE from the attached portrait, white goatee under a heavy rounded IRON helmet with cheek straps and TWO long barred pheasant feathers rising in a V, the feather language of a jougwan on iron, not a lacquer cap. Steel-grey lamellar. Red #C30000 and blue #3E79E4 cloth peek only, real fabric, not a glow. ONE device: the feathered helmet against one cloud-break. Four tiny furies far behind him in the dust, not an army. He is mid-stride, bow low, not a standing clone.`
		},
		{
			id: 'hek-wind-rain-epic',
			update: true,
			people: ['pungudosa', 'beongae', 'byeorak', 'hwadeok'],
			refs: [
				'/ch_wind_sage.png',
				'/ch_lightning_general.png',
				'/ch_thunder_marshal.png',
				'/ch_fire_warrior.png'
			],
			prompt: `${STYLE} DAY storm breaking to paper-white, the pseudo-3D of hek-vine-up. Extreme worm's-eye from the dirt under their feet. FOUR furies in one diagonal charge, Greco-Roman spectacle painted as simple animated webtoon, not a marble frieze. Sheet left to right: Wind-Rain Sage (white robe, dark blue sash, white hair, rain already on the air), Lightning General (blue robe, black beard, a pale bolt in his hands), Thunder Marshal (gold robe, black hair loose, a bolt across her body), Flame Warrior (red robe, fire climbing one sleeve as real light, not a body glow). ONE device: a single lightning seam splitting the paper sky. Faces from the sheet, each one once. No army. No text.`
		},
		{
			id: 'hek-scoundrel-horde',
			update: true,
			prompt: `${STYLE} DAY, paper-white sky, the yard in ink. LEFT face = Sumyung Jangja, smug, rich silk, chin up. He stands on a storehouse step like a little king. ONE device: a row of nine storehouse doors receding. At his feet a horse mid-kick and a dog mid-bite, tiny hired men behind, beasts in the shadow of the doors. His power is the yard, not a speech. He is mid-laugh, not a standing fashion plate. Crushed shadow under the eaves, one hard sun shaft on his face.`
		},
		{
			id: 'hek-helmet-closes',
			update: true,
			prompt: `${STYLE} NIGHT, hek-still-burning dark. CLOSE two-shot. LEFT face = Heaven–Earth King, white goatee, no helmet on his own head now. RIGHT face = Sumyung, the smugness gone. The king sets his IRON helmet onto Sumyung's head — rounded iron, cheek straps, TWO pheasant feathers in a V. ONE device: the helmet coming down between their faces. One lamp on the ground rakes the iron. Sumyung's mouth is open, refusing. The feathers catch the lamp. No glow. No text.`
		}
	],
	'Goddess Supreme': [
		{
			id: 'gs-sky-trees',
			ratio: 2,
			time: 'day',
			at: 'The Sky Princess treats hers like a bed.',
			alt: 'The Sky Princess plants a new tree and dresses the cloud garden',
			people: ['samsin'],
			refs: ['/ch_sky_princess.png'],
			prompt: `${STYLE} DAY, paper-white cloud garden like hek-vine-up. The Sky Princess — young, black hair with small gold flowers, FACE from the attached portrait, pale blue jeogori — kneels in dirt planting a young tree, one hand patting soil, the other holding a ribbon she is tying on a branch. ONE device: a row of new saplings receding into white haze, each dressed with a different flower. She is mid-work, dirt on her sleeve, pleased with the tree, not a clasped-hands pose. She loves this. Monumental soft sky, the garden small and careful.`
		},
		{
			id: 'gs-dragon-spear',
			ratio: 2,
			time: 'day',
			at: 'His daughter is not at the table. She is out in the dark water, hunting.',
			alt: 'The Dragon Lady hunts a fish with a spear in dark water',
			people: ['yongnyeo'],
			refs: ['/ch_dragon_lady.png'],
			prompt: `${STYLE} Underwater, dark blue, one shaft of surface light like hek-still-burning's single key. The Dragon Lady — young, black braid with green flowers, FACE from the attached portrait, pale blue robe — drives a spear at a silver fish, body twisted, tomboy, teeth set, hair streaming. ONE device: the spear as a hard diagonal. Fish scatter. She is winning this one. No court table. No pleading face. Pseudo-3D water and the fish, painted, not a photograph.`
		}
	],
	Gardener: [
		{
			id: 'hlk-invent-bloom',
			ratio: 2,
			time: 'day',
			at: 'At dusk the boy walks east with a gray hood',
			alt: 'The gardener invents a flower that has never grown before',
			people: ['sara'],
			refs: ['/ch_sara.png'],
			prompt: `${STYLE} DAY, paper-white, hek-vine-up garden. Hallakgungi the gardener — FACE from the attached portrait — kneels in a long row of flowers, each bloom a different invention: one laughing open, one weeping closed, one bone-white, one fighting red. His hands are in the dirt shaping a bud that is not like any of them. ONE device: the row as a single diagonal, the newest bud sharp in the foreground, the older inventions dissolving down the row. He is mid-invention, dirt to the wrists, not posing. No crowd.`
		},
		{
			id: 'hlk-life-last',
			ratio: 2,
			time: 'day',
			at: 'Rows of flowers run on anyway, to a gate.',
			alt: 'The life flower opens at the end of the gardener’s row',
			people: ['sara'],
			refs: ['/ch_sara.png'],
			prompt: `${STYLE} DAY, paper-white. The same gardener — FACE from the attached portrait — sits back on his heels at the end of the row. The last flower has just opened: a blue life flower with a gold heart, taller than the others, the culmination of every bloom he invented. ONE device: that one flower against the white sky, his dirty hands lower in the frame, not touching it yet. All the earlier flowers are small and different behind him. Quiet. He looks at it like he did not expect it to live. No text.`
		}
	]
};

let added = 0;
let updated = 0;
for (const ch of story) {
	for (const entry of ch.entries ?? []) {
		const batch = slots[entry.title];
		if (!batch) continue;
		entry.images ??= [];
		for (const slot of batch) {
			const prev = entry.images.find((im) => im.id === slot.id);
			if (prev && slot.update) {
				if (slot.prompt) prev.prompt = slot.prompt;
				if (slot.people) prev.people = slot.people;
				if (slot.refs) prev.refs = slot.refs;
				if (!prev.alt || prev.alt === 'x') prev.alt = slot.alt ?? prev.alt;
				prev.time ??= 'day';
				updated++;
			} else if (!prev) {
				const { update, ...rest } = slot;
				entry.images.push(rest);
				added++;
			}
		}
	}
}

writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log({ added, updated });
