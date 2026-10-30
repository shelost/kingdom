// Wiki relationship + group stills: one compressed ref sheet and the canon text per item.
//   node --experimental-strip-types scripts/.cache/wiki-stills/build.mjs [id…]
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const ITEMS = [
	{ id: 'grp_brafounders', year: 661, people: ['boksin', 'dochim', 'sangji', 'sateksangya', 'pung'], refs: [] },
	{ id: 'grp_fourdragons', year: 645, people: ['taizong', 'lishiji'], refs: [] },
	{ id: 'grp_fourbeasts', year: 661, people: ['gaozong', 'xuerengui', 'sudingfang', 'lishiji', 'liurengui'], refs: [] },
	{ id: 'grp_sillaroyal', year: 630, people: ['sunduk', 'jinduk', 'chunmyung', 'chunchu', 'munhee', 'gotaso'], refs: [] },
	{ id: 'rel_haemosu_yuhwa', year: -59, people: ['haemosu', 'yuhwa'], refs: [] },
	{ id: 'rel_gesomun_gulgul', year: 660, people: ['gesomun', 'gulgul'], refs: [] },
	{ id: 'rel_hwanung_ungnyeo', year: -2333, people: ['hwanung', 'ungnyeo'], refs: [] },
	{ id: 'rel_jumong_yuhwa', year: -38, people: ['jumong', 'yuhwa'], refs: [] },
	{ id: 'rel_onjo_sosuno', year: -19, people: ['sosuno', 'onjo'], refs: [] },
	{ id: 'rel_chunchu_munmu', year: 648, people: ['chunchu', 'munmu'], refs: [] },
	{ id: 'rel_yushin_munmu', year: 643, people: ['yushin', 'munmu'], refs: [] },
	{ id: 'rel_gesomun_yeongnyu', year: 642, people: ['gesomun', 'yeongnyu'], refs: ['/sw_bidam.png'] },
	{ id: 'rel_daebyeol_sobyeol', year: -3000, people: ['daebyeol', 'sobyeol'], refs: [] },
	{ id: 'rel_seohyeon_manmyung', year: 594, people: ['seohyeon', 'manmyung'], refs: [] },
	{ id: 'rel_sunduk_jinduk', year: 640, people: ['sunduk', 'jinduk'], refs: [] }
];

const only = process.argv.slice(2);
const out = {};
for (const item of ITEMS) {
	if (only.length && !only.includes(item.id)) continue;
	const canon = JSON.parse(
		execFileSync('node', ['--experimental-strip-types', 'scripts/visual-canon.mjs', '--year', String(item.year), ...item.people], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore']
		})
	);
	const faces = canon.refs.filter((r) => r.startsWith('/ch_'));
	const sheet = execFileSync('node', ['scripts/small-refs.mjs', '--bust', item.id, ...faces, ...item.refs], {
		encoding: 'utf8'
	}).trim().split('\n').pop();
	out[item.id] = { faces, sheet, canon: canon.text };
	console.log(`\n=== ${item.id}\nSHEET ${sheet}\nFACES ${faces.join(' ')}\n${canon.text}`);
}
writeFileSync('scripts/.cache/wiki-stills/built.json', JSON.stringify(out, null, '\t'));
