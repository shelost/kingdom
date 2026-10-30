// Prologue silhouette stills (same look as the three founding stills).
// Flow replacements keep their slot id; gallery stills are new slots that only
// show inside an emotion gallery (`gallery: true`).

export const CAP =
	'Every man not wearing a crown or helm wears the jougwan of the attached cap diagram: a small black peaked cap tied under the chin with TWO long barred pheasant tail feathers splayed upward in a V (shape only, ignore the labels). Women wear hair in a low bun with a long pin, no cap.';
export const STYLE =
	'Painterly Korean ink painting (sumukhwa) meets graphic film poster: splashed ink, dry-brush, hanji grain, hard flat black silhouettes against a luminous painted sky; no faces, no text, no seal, no watermark. Composed for a 2:1 letterbox crop: nothing important at the top or bottom edge.';

const p = (scene) => `Symbolic poster still. ${scene} ${CAP} ${STYLE}`;

/** Flow stills that replace the current prologue art (slot id = file id). */
export const FLOW = [
	{
		id: 'prologue-tigers',
		motion: 'tigers',
		alt: 'A tiger in black silhouette lounges on a pine crag smoking a long pipe under a huge pale moon; its smoke curls into the clouds while a bear watches from a cave below',
		prompt: p(
			'Back when tigers used to smoke. A huge pale cream moon; a gnarled pine crag on the right third; on it ONE tiger in black silhouette lounging on its side, a long thin Korean pipe in its mouth, the tiny pipe bowl the only ember-orange #e86820 spark; its smoke rises in one long curling ribbon that becomes the clouds across the sky. Below on the left, a bear in silhouette sits in a cave mouth looking up. Ink black, warm hanji cream, one ember-orange accent.'
		)
	},
	{
		id: 'prologue-heaven',
		motion: 'heaven',
		alt: 'Heaven opens: one figure descends a shaft of gold light toward a sacred birch on a black mountain, three thousand tiny followers fanned on the slopes',
		prompt: p(
			'Heaven sent down a man to the earth. The clouds split in a vast vertical seam; ONE robed figure in black silhouette descends down a single shaft of pale gold light #d4b86a, arms open, robes streaming upward; at the bottom a lone sacred birch tree crowns a black ink mountain peak; tiny follower silhouettes stream down the slopes like a fan; three small cloud-shapes (wind, rain, cloud) ride beside him. Ink black, cream, one pale gold shaft.'
		)
	},
	{
		id: 'prologue-love-birch',
		motion: 'birch',
		alt: 'A man and a woman in silhouette reach for each other beneath the great birch, its falling leaves catching a warm moon',
		prompt: p(
			'He fell in love with a woman. A single enormous sacred birch tree fills the frame as a black ink silhouette with a wide canopy; beneath it a man in a heavenly robe and a woman in a full Korean skirt (hair in a low bun, no cap) reach toward each other, fingertips almost touching, in black silhouette; behind them a huge warm moon the colour of birch bark #c9b18f; a drift of small falling leaves crosses the gap. Ink black, warm cream, one soft gold-beige accent. Tender, quiet, mythic.'
		)
	},
	{
		id: 'prologue-wanggum',
		motion: 'wanggum',
		alt: 'The first king stands on a black mountain throne before a rising bronze-mirror sun, rows of tiny figures bowing on the terraces below',
		prompt: p(
			'The first king of the first kingdom. A rising sun drawn as a huge ancient bronze mirror disc (patterned rim, bronze #b8956a) behind a stepped black mountain; on the summit ONE king in silhouette stands with a bronze dagger raised and a tall crown of antler-like gold branches; below on the terraced slopes, many tiny figures bow in long curving rows. Ink black, bronze, cream sky. Monumental, sacred.'
		)
	},
	{
		id: 'prologue-invasion',
		motion: 'invasion',
		alt: 'A black wave of foreign spears and banners pours over a ridge toward a walled city under a blood-red sky, arrows falling like rain',
		prompt: p(
			'Then... invasion! A blood-red sky #b3261e; on the left, a small walled city with a tiled gate tower in black silhouette; from the right, a huge black wave of foreign soldiers with long halberds, tall square banners and chariots pours over a ridge like a tidal wave, drawn as one mass of spear-points; a slanting rain of black arrows fills the upper sky. These invaders wear tall Han-style helmets and caps, NOT feather caps. Ink black, blood red, bone white.'
		)
	},
	{
		id: 'prologue-refugees',
		motion: 'refugees',
		alt: 'From a burning city, lines of refugees in silhouette scatter across a snowy plain in every direction like the fingers of a hand',
		prompt: p(
			'The people fled in all directions. A pale grey-white snowy plain under a dark dawn sky; far back, a small city burning with one column of ember-orange smoke; out of it, many thin lines of tiny refugee silhouettes (carrying bundles, leading oxen, a mother with a child on her back) fan out across the snow in five diverging trails like the fingers of a hand, north, east and south; long blue shadows; drifting ash and snow. Ink black, snow grey, one ember-orange accent.'
		)
	},
	{
		id: 'prologue-seventh-century',
		motion: 'samhan',
		alt: 'Three riders in silhouette on three peaks face one another across a sea of mist, red, gold and blue banners streaming',
		prompt: p(
			'Samhan is split into three kingdoms. A sea of white mist with three black ink mountain peaks rising out of it in a wide triangle; on each summit ONE armoured rider on a horse in black silhouette with a long streaming banner: the north peak banner crimson red, the west peak banner gold, the east peak banner blue; the three riders face one another across the mist. Ink black, cream mist, three banner colours as the only accents. Riders wear helmets.'
		)
	},
	{
		id: 'prologue-generation',
		motion: 'generation',
		alt: 'Seven figures in silhouette stand along a ridge before a vast rising star: a queen, a prince, a captain, a king with a cup, a general, a warlord with swords on his back, a monk-warrior with beads',
		prompt: p(
			'A new generation arises. A long low black ridge across the lower third; along it EXACTLY SEVEN distinct figures in black silhouette, evenly spaced, before one vast brilliant white star rising behind them on a deep indigo dawn: (1) a queen in a tall branching gold crown, (2) a slender young prince with a folding fan, (3) a modest clerk holding a ledger, (4) a big king raising a wine cup, (5) a general holding a sword reverse-grip along his forearm, (6) a tall warlord with five swords fanned on his back, (7) a monk-warrior with prayer beads wrapped on his sword wrist. Each pose different. Indigo, black, one white star with a thin gold rim.'
		)
	}
];

/** One hero still per emotion card (replaces the current art; the old art moves into the gallery). */
export const HEROES = [
	{
		id: 'prologue-love',
		emotion: 'love',
		alt: 'A queen in silhouette at the top of the star tower reaches toward a falling star; far below, a marshal looks up at her and not at the sky',
		prompt: p(
			'Love. A tall bottle-shaped stone star-observatory tower (Cheomseongdae) in black silhouette on the right third; at its top ONE queen in a branching gold crown silhouette reaches up toward a single falling star streaking vermilion #E8552B across a deep night sky; on the ground far below on the left, ONE armoured man in silhouette stands looking up at HER, not at the star. Ink black, deep indigo, one vermilion star-streak. Longing, distance.'
		)
	},
	{
		id: 'prologue-revenge',
		emotion: 'revenge',
		alt: 'A prince in silhouette stands motionless on a dark ridge while a fortress burns on the horizon, his shadow stretched toward it',
		prompt: p(
			'Revenge. A dark ridge in the foreground; ONE slender man in black silhouette stands perfectly still, fists closed at his sides, robe and feather cap edges lifting in the wind; far on the horizon a fortress burns, its smoke a huge column against a magenta #D8258C dusk sky; his long shadow stretches toward the fire. Ink black, magenta sky, ember sparks. Cold, patient, terrible.'
		)
	},
	{
		id: 'prologue-betrayal',
		emotion: 'betrayal',
		alt: 'From inside, one clerk in silhouette pulls a fortress gate open; enemy torches flood the gap like a river of fire',
		prompt: p(
			'Betrayal. Seen from INSIDE a fortress at night: two heavy timber gate leaves with iron bosses, black silhouettes, swung open; between them ONE thin clerk in silhouette, still holding the gate bar he has just lifted, his back to us; through the opening a river of enemy torches floods toward him, a hard orange #e8742a light-seam pouring through the gap onto the dark yard. Behind him a granary roof burns. Ink black, slate-blue #6b7f9e night, one orange seam.'
		)
	},
	{
		id: 'prologue-greed',
		emotion: 'greed',
		alt: 'A big laughing king in silhouette sprawls on a throne heaped with gold and wine jars, a crown too heavy for his head, maids pouring around him',
		prompt: p(
			'Greed. A wine-red hall; ONE big king in black silhouette sprawls laughing on a throne set on a mountain of wine jars, coins and cups, head thrown back, one arm raised with an overflowing cup; on his head a crown of tall flame-shaped gold ornaments; small maid silhouettes pour from jars around him; amber #e08a2e lamplight glints off coins spilling down the heap. Ink black, wine red, amber gold. Gluttony, joy, ruin coming.'
		)
	},
	{
		id: 'prologue-loyalty',
		emotion: 'loyalty',
		alt: 'One general on a black horse waits alone at the gap of a palisade under a vast yellow sky, his sword held reverse-grip along his arm',
		prompt: p(
			'Loyalty. A vast yellow-gold storm sky #d9b13a over a low black field; a broken timber palisade line across the lower third with one gap; in the gap ONE armoured general on a black horse in silhouette, helm with a tall plume, sword held REVERSE-GRIP with the straight blade laid back along his forearm; behind him a thin line of a few spear silhouettes; ahead, empty ground. Ink black, gold sky, one cloud-break. Unmoving. He will not leave.'
		)
	},
	{
		id: 'prologue-pride',
		emotion: 'pride',
		alt: 'A warlord in silhouette stands on a red gate tower with five swords fanned on his back, a three-legged crow landing on his raised arm before a red sun',
		prompt: p(
			'Pride. A huge red sun #d0362f; a two-tier gate tower of Pyongyang in black silhouette; on its roof ridge ONE tall warlord stands with legs apart, FOUR straight ring-pommel swords fanned on his back like wings and one in his hand; a three-legged crow lands on his raised forearm, wings spread. Ink black, crimson sun, cream sky. Arrogant, magnificent, alone.'
		)
	},
	{
		id: 'prologue-rage',
		emotion: 'rage',
		alt: 'A monk-warrior in silhouette roars on a fortress wall as a star falls behind him, prayer beads swinging from his sword wrist',
		prompt: p(
			'Rage. A deep navy night #141C2E over a stone fortress rampart; ONE monk-warrior in black silhouette mid-roar on the rampart, sword raised high, a long string of prayer beads swinging from his sword wrist (the beads catch thin gold light); behind him a huge falling star tears a white-gold streak diagonally down the sky; below, a ring of tiny enemy campfires. Ink black, navy, one white-gold streak.'
		)
	}
];

/** New gallery-only silhouettes, one per emotion. */
export const GALLERY = [
	{
		id: 'prologue-gal-love',
		entryAt: 'Love.',
		emotion: 'love',
		alt: 'A queen and a marshal in silhouette pass in a long corridor, each looking away from the other',
		prompt: p(
			'Love that cannot be said. A long palace corridor of timber pillars in black silhouette, a band of warm vermilion #E8552B dusk light between the pillars; ONE queen in a branching gold crown and ONE armoured marshal with a sword at his hip pass each other in the middle, both turning their heads away from the other, a small gap of light between their shoulders. Ink black, vermilion light, cream.'
		)
	},
	{
		id: 'prologue-gal-revenge',
		entryAt: 'Revenge.',
		emotion: 'revenge',
		alt: 'A small boat with one envoy in silhouette crosses a vast moonlit sea toward the west',
		prompt: p(
			'The long road of revenge. A vast black sea under a huge pale moon; ONE tiny sailing boat with a single square sail; in it ONE envoy standing in silhouette, looking west toward a faint far shore of palace roofs on the horizon; a magenta #D8258C streak of moonlight on the water leads to him. Ink black, pale moon, one magenta streak. Lonely and determined.'
		)
	},
	{
		id: 'prologue-gal-betrayal',
		entryAt: 'Betrayal.',
		emotion: 'betrayal',
		alt: 'A woman in silhouette walks away along a fortress wall at dawn, a small gold ornament glinting in her hand; a man watches from a doorway',
		prompt: p(
			'Before the betrayal. Grey-blue dawn #6b7f9e over a long fortress wall; ONE woman in a full skirt (hair in a low bun) walks away along the wall top, her hand holding ONE small gold belt ornament that catches the only warm light; at the far left ONE thin clerk stands in a dark doorway watching her go. Ink black, slate blue, one gold glint.'
		)
	},
	{
		id: 'prologue-gal-greed',
		entryAt: 'Greed.',
		emotion: 'greed',
		alt: 'A king in silhouette stands on a mountain of wine jars, reaching to pluck the moon',
		prompt: p(
			'Greed. A tall teetering tower of stacked wine jars and treasure chests rising from a dark river bluff; on the very top ONE big king in silhouette with a crown of flame-shaped gold ornaments stands on tiptoe, arm stretched up to grab a huge amber #e08a2e moon; tiny figures at the base hold the tower up. Ink black, amber moon, cream sky. Comic and doomed.'
		)
	},
	{
		id: 'prologue-gal-loyalty',
		entryAt: 'Loyalty.',
		emotion: 'loyalty',
		alt: 'A general in silhouette stands in a doorway with his sword lowered as the lamp inside his home goes out',
		prompt: p(
			'The price of loyalty. Night; a small tiled house; ONE armoured general in silhouette stands in the open doorway with his head bowed and a straight sword lowered at his side; inside, one oil lamp is guttering out, its last yellow #d9b13a light spilling across the threshold toward his feet; a black horse waits by the gate. Ink black, one fading gold light. Silent, grieving, resolved.'
		)
	},
	{
		id: 'prologue-gal-pride',
		entryAt: 'Pride.',
		emotion: 'pride',
		alt: 'A warlord in silhouette stands alone in a frozen river with two swords as an enemy host is swallowed by the water behind him',
		prompt: p(
			'Pride. A vast pale frozen river at dusk; ONE warlord in silhouette stands knee-deep in the cracked ice in the centre, a straight ring-pommel sword in EACH hand held low and wide, more swords fanned on his back; behind him a huge enemy host with white banners is breaking through the ice and sinking; a crimson #d0362f sun low on the horizon. Ink black, ice white, crimson sun.'
		)
	},
	{
		id: 'prologue-gal-rage',
		entryAt: 'Rage.',
		emotion: 'rage',
		alt: 'Two swordsmen in silhouette clash in mud between two camps, prayer beads flying from one wrist',
		prompt: p(
			'Rage. A muddy field between two lines of distant camp fires at dawn; TWO swordsmen in black silhouette mid-clash in the centre, straight swords crossed in an X, one with a string of prayer beads snapping and scattering gold beads into the air from his wrist, the other in a marshal helmet; mud splashing; navy #141C2E sky with a single cold blue #2A5FB8 dawn break. Ink black, navy, scattered gold beads.'
		)
	}
];
