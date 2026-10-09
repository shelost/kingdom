// node scripts/.cache/widgets/dump-people.mjs → one line per PEOPLE character (+ gods)
import { loadPeople } from './load-people.mjs';
const { PROFILES: PEOPLE } = await loadPeople({ ranks: process.argv.includes('--ranks') });
for (const p of PEOPLE) {
	if (p.entity && p.entity !== 'god') continue;
	const st = (p.stages ?? []).map((s) => `${s.id ?? '?'}[${s.from ?? ''}-${s.until ?? ''}]${s.korean ?? ''}/${s.hanja ?? ''}${s.avatar ? '' : '(noav)'}${s.lookOnly ? '(look)' : ''}`).join(' ');
	console.log(
		[p.id, p.kingdom, p.entity ?? '', p.name, p.korean ?? '', p.hanja ?? '', p.boneRank ? 'bone=' + p.boneRank : '', p.clan ? 'clan=' + p.clan : '', p.godTier ? 'tier=' + p.godTier : '', (p.orgs ?? []).join(','), p.born ?? '', p.died ?? '', st, (p.career ?? []).map((c) => `${c.title}${c.from ? '@' + c.from : ''}`).join('; ')]
			.filter((x) => x !== '')
			.join(' | ')
	);
}
