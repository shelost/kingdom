import fs from 'node:fs';
import { loadStory, lists } from '../story-ops.mjs';

const ids = ['pyongyang-668', 'seokmun-672', 'maeso-675', 'gibeolpo-676'];
for (const id of ids) {
	const d = JSON.parse(fs.readFileSync(`src/lib/data/battles/${id}.json`, 'utf8'));
	console.log(`\n######## ${id} — ${d.title} | place ${JSON.stringify(d.place)}`);
	console.log('units:', d.units.map((u) => `${u.id}(${u.side}:${u.label}${u.hero ? ' @' + u.hero : ''})`).join(', '));
	if (d.terrain) console.log('terrain:', JSON.stringify(d.terrain).slice(0, 800));
	for (const p of d.phases) {
		console.log(`\n-- phase ${p.id}: ${p.label}\n   caption: ${p.caption}`);
		for (const [u, v] of Object.entries(p.units ?? {})) console.log(`   ${u} at ${v.at} men ${v.men}${v.state ? ' ' + v.state : ''}${v.gone ? ' GONE' : ''} ${JSON.stringify({ ...v, at: undefined, men: undefined, facing: undefined, r: undefined })}`);
		for (const a of p.arrows ?? []) console.log(`   arrow ${a.side} ${a.kind} ${a.points.map((q) => q.join(',')).join(' → ')} ${a.label ?? ''}`);
		for (const e of p.events ?? []) console.log(`   event ${JSON.stringify(e)}`);
	}
}

const all = loadStory().flatMap((c) => c.entries);
for (const n of [86, 91, 95, 96]) {
	const e = all[n - 1];
	console.log(`\n\n================ #${n} ${e.id ?? ''} ${e.title ?? ''} year ${e.year}`);
	lists(e).forEach((list, li) => {
		list.forEach((b, i) => {
			const t =
				b.kind === 'dialogue'
					? `[${b.person ?? b.speaker}] ` + b.en.join(' / ')
					: b.kind === 'battle'
						? `<<< MAP ${b.battle} ${b.phase ?? ''} ${b.full ? 'FULL' : ''} >>>`
						: b.kind === 'flashback'
							? '(flashback)'
							: (b.html ?? b.en ?? b.title ?? JSON.stringify(b).slice(0, 200));
			console.log(`${li}.${i} ${b.kind}: ${t}`);
		});
	});
	console.log('images at:', (e.images ?? []).map((im) => im.at).join(' || '));
}
