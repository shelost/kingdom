import { editStory } from './story-ops.mjs';

function find(entries, title) {
	for (const e of entries || []) {
		if (e.title === title) return e;
		const hit = find(e.entries, title);
		if (hit) return hit;
	}
}
function walkTop(story, title) {
	for (const ch of story) {
		if (ch.title === title) return ch;
		const hit = find(ch.entries, title) || find(ch.chapters, title);
		if (hit) return hit;
	}
}
function walkBlocks(blocks, fn) {
	for (const b of blocks || []) {
		fn(b);
		if (b.blocks) walkBlocks(b.blocks, fn);
	}
}

editStory((story) => {
	const jinhung = walkTop(story, 'Jinhung, the Cloud');
	if (!jinhung) throw new Error('Jinhung not found');
	const jb = jinhung.blocks;
	const battleI = jb.findIndex((b) => b.kind === 'battle' && b.battle === 'daegaya-562');
	const porchI = jb.findIndex((b) => b.html?.startsWith('A Park girl on the porch'));
	if (battleI >= 0 && porchI >= 0 && battleI < porchI) {
		const [battle] = jb.splice(battleI, 1);
		const porch = jb.findIndex((b) => b.html?.startsWith('A Park girl on the porch'));
		jb.splice(porch + 1, 0, battle);
		console.log('Jinhung: battle map now after the cup, before the ridge.');
	}

	walkBlocks(jb, (b) => {
		if (
			b.html ===
			'At the edge of the square a general in a cone helm watches, and does not stop him. The last rope snaps, whips, and sits the general in the mud. The boy does not look sorry. The king on the far ridge laughs once, the same laugh as the cup. Gaya, as a name, is over.'
		) {
			b.html =
				'At the edge of the square a general in a cone helm watches him cut, and does not stop him. They have not spoken yet. The king on the far ridge laughs once, the same laugh as the cup. Gaya, as a name, is over.';
			b.ko =
				'광장 가장자리에서 고깔 투구의 장수가 그가 자르는 걸 보고, 말리지 않는다. 아직 말은 없다. 먼 능선의 임금이 한 번 웃는다. 잔 때와 같은 웃음. 가야라는 이름은, 여기까지다.';
			console.log('Jinhung: meet is the cutting, not the snap.');
		}
	});

	const dropSnap = (blocks) => {
		let n = 0;
		if (!blocks) return 0;
		for (let i = 0; i < blocks.length; ) {
			const b = blocks[i];
			if (
				b.html?.startsWith('The end of it snaps like a whip') ||
				b.html?.startsWith('The end of it comes back like a whip')
			) {
				blocks.splice(i, 1);
				n++;
				while (
					blocks[i] &&
					blocks[i].kind === 'dialogue' &&
					(blocks[i].en?.[0] === 'Sorry.' || blocks[i].en?.[0] === 'I noticed.')
				) {
					blocks.splice(i, 1);
					n++;
				}
				continue;
			}
			if (b.blocks) n += dropSnap(b.blocks);
			i++;
		}
		return n;
	};

	const retarget = (entryTitle, id, at, alt) => {
		const e = walkTop(story, entryTitle);
		if (!e?.images) throw new Error(`no images on ${entryTitle}`);
		const img = e.images.find((x) => x.id === id);
		if (!img) throw new Error(`${id} not on ${entryTitle}`);
		img.at = at;
		if (alt) img.alt = alt;
	};

	const sadaham = walkTop(story, 'Sadaham');
	if (!sadaham) throw new Error('Sadaham not found');
	console.log(`Sadaham: dropped ${dropSnap(sadaham.blocks)} snap blocks.`);

	const muryuk = walkTop(story, 'Muryuk');
	if (!muryuk) throw new Error('Muryuk not found');
	walkBlocks(muryuk.blocks, (b) => {
		if (b.html?.startsWith('Muryuk stays where he is — in the mud, now')) {
			b.html =
				'Muryuk stays where he is, long enough to look like a man guarding prisoners. He isn’t guarding anything. He is thinking about a cart, and a wall a hand lower than the neighbours’, and a word he has spent thirty years saying like the name of a dog that bit him.';
			b.ko =
				'무력은 그 자리에 서 있다. 포로를 지키는 사람처럼 보일 만큼 오래. 아무것도 지키고 있지 않다. 수레를 생각하고 있다. 이웃집보다 한 뼘 낮은 담을, 그리고 서른 해 동안 자기를 문 개 이름처럼 불러 온 한 낱말을.';
			console.log('Muryuk: standing watch, not seated by the snap.');
		}
	});
	console.log(`Muryuk: dropped ${dropSnap(muryuk.blocks)} snap blocks.`);

	retarget(
		'Sadaham',
		'meet-sadaham-rope',
		'Those are the king’s, boy.',
		'Sadaham cuts a captive’s rope in the wet square; the unnamed general in the cone helm watches and does not stop him.'
	);
	retarget(
		'Muryuk',
		'meet-muryuk-rope',
		'Those are the king’s, boy.',
		'Muryuk watches the boy cut the last knots; they meet over the rope, not in the mud.'
	);
	console.log('Slots retargeted to the knot.');
});
