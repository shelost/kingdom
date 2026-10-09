// node scripts/.cache/widgets/rank-check.mjs [year] → people sorted by compareByRank, with labels
import { loadPeople } from './load-people.mjs';
const { PROFILES, rankOf, compareByRank } = await loadPeople();
const year = process.argv[2] ? Number(process.argv[2]) : undefined;
const people = PROFILES.filter((p) => !p.entity || p.entity === 'god');
people.sort((a, b) => compareByRank(a, b, year));
let last = '';
for (const p of people) {
	const r = rankOf(p, year);
	if (r.kingdom !== last) console.log(`\n## ${r.section.en} / ${r.section.ko} (${r.metric})`), (last = r.kingdom);
	console.log(`${p.id.padEnd(18)} ${r.order}.${r.office} ${r.label} / ${r.ko}${r.officeLabel ? ' · ' + r.officeLabel : ''}`);
}
