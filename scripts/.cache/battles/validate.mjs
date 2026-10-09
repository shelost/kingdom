/**
 * Checks every src/lib/data/battles/*.json (or the ids given) and every `battle` block in story.json.
 * `node validate.mjs [id …]`
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadStory, lists } from '../story-ops.mjs';

const DIR = path.join(ROOT, 'src/lib/data/battles');
const only = new Set(process.argv.slice(2));
const placesSrc = fs.readFileSync(path.join(ROOT, 'src/lib/places.ts'), 'utf8');
const PLACES = new Set([...placesSrc.matchAll(/^\t\tid: '([^']+)'/gm)].map((m) => m[1]));
const KINGDOMS = new Set(['silla', 'baekje', 'goguryeo', 'buyeo', 'jolbon', 'tang', 'gaya', 'yamato', 'tamla', 'joseon']);
const SHAPES = new Set(['block', 'line', 'column', 'wedge', 'ring', 'scatter', 'fleet']);
const ARROWS = new Set(['advance', 'charge', 'retreat', 'feint', 'flank', 'naval', 'pursuit']);
const EVENTS = new Set(['clash', 'fire', 'death', 'gate', 'flood', 'surrender', 'ambush']);
const TERRAIN = new Set(['sea', 'lake', 'marsh', 'forest', 'plain', 'town', 'river', 'road', 'ridge', 'wall', 'hill', 'mountain', 'fort', 'city', 'camp', 'gate', 'shrine', 'label', 'mound']);
const HANGUL = /[\uac00-\ud7a3]/;

const problems = [];
const battles = {};
const inField = ([x, y]) => x >= -40 && x <= 1040 && y >= -40 && y <= 600;

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
	let b;
	try {
		b = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
	} catch (e) {
		problems.push(`${file}: invalid JSON (${e.message})`);
		continue;
	}
	battles[b.id] = b;
	if (only.size && !only.has(b.id)) continue;
	const at = (m) => problems.push(`${b.id}: ${m}`);
	if (file !== `${b.id}.json`) at(`file name should be ${b.id}.json`);
	for (const k of ['title', 'ko', 'year', 'terrain', 'sides', 'units', 'phases', 'sources']) if (b[k] === undefined) at(`missing ${k}`);
	if (b.place && !PLACES.has(b.place)) at(`unknown place ${b.place}`);
	if (!b.sources?.length) at('no sources');
	if (b.note && !b.noteKo) at('note without noteKo');
	const sides = new Set((b.sides ?? []).map((s) => s.id));
	for (const s of b.sides ?? []) {
		if (!s.color && !KINGDOMS.has(s.kingdom)) at(`side ${s.id}: needs a known kingdom or a color`);
		if (!HANGUL.test(s.ko ?? '')) at(`side ${s.id}: ko missing`);
	}
	for (const t of b.terrain ?? []) {
		if (!TERRAIN.has(t.kind)) at(`terrain kind ${t.kind}`);
		for (const p of t.points ?? (t.at ? [t.at] : [])) if (!inField(p)) at(`terrain ${t.kind} point ${p} off the field`);
		if (t.label && !t.ko) at(`terrain "${t.label}" has no ko`);
		if (t.side && !sides.has(t.side)) at(`terrain side ${t.side}`);
	}
	const units = new Set();
	for (const u of b.units ?? []) {
		if (units.has(u.id)) at(`duplicate unit ${u.id}`);
		units.add(u.id);
		if (!sides.has(u.side)) at(`unit ${u.id}: unknown side ${u.side}`);
		if (!u.ko) at(`unit ${u.id}: no ko`);
	}
	const phaseIds = new Set();
	for (const p of b.phases ?? []) {
		const where = `phase ${p.id}`;
		if (phaseIds.has(p.id)) at(`duplicate ${where}`);
		phaseIds.add(p.id);
		for (const k of ['label', 'ko', 'caption', 'captionKo']) if (!p[k]) at(`${where}: missing ${k}`);
		if (p.captionKo && !HANGUL.test(p.captionKo)) at(`${where}: captionKo is not Korean`);
		for (const [id, s] of Object.entries(p.units ?? {})) {
			if (!units.has(id)) at(`${where}: unknown unit ${id}`);
			if (!Array.isArray(s.at) || !inField(s.at)) at(`${where}: unit ${id} position ${s.at}`);
			if (typeof s.men !== 'number' || s.men < 0) at(`${where}: unit ${id} men`);
			if (s.shape && !SHAPES.has(s.shape)) at(`${where}: unit ${id} shape ${s.shape}`);
			if (s.men > 0 && s.men % 1000 && s.men > 1000) at(`${where}: unit ${id} has ${s.men} men; use thousands so dots add up`);
		}
		for (const a of p.arrows ?? []) {
			if (!ARROWS.has(a.kind)) at(`${where}: arrow kind ${a.kind}`);
			if (!sides.has(a.side)) at(`${where}: arrow side ${a.side}`);
			if (!(a.points?.length >= 2) || !a.points.every(inField)) at(`${where}: arrow points`);
			if (a.label && !a.ko) at(`${where}: arrow "${a.label}" has no ko`);
		}
		for (const e of p.events ?? []) {
			if (!EVENTS.has(e.kind)) at(`${where}: event kind ${e.kind}`);
			if (!inField(e.at)) at(`${where}: event position`);
			if (e.label && !e.ko) at(`${where}: event "${e.label}" has no ko`);
		}
	}
}

let n = 0;
for (const c of loadStory())
	for (const e of c.entries) {
		n++;
		for (const list of lists(e))
			for (const blk of list)
				if (blk.kind === 'battle') {
					const b = battles[blk.battle];
					if (!b) problems.push(`#${n} ${e.title}: battle block for missing battle ${blk.battle}`);
					else if (blk.phase && !b.phases.some((p) => p.id === blk.phase)) problems.push(`#${n}: ${blk.battle} has no phase ${blk.phase}`);
				}
	}

console.log(problems.length ? problems.join('\n') : `ok (${Object.keys(battles).length} battles)`);
process.exitCode = problems.length ? 1 : 0;
