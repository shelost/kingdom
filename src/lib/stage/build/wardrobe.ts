import * as THREE from 'three';
import { Folk, mounted, type Dress, type Role, type FolkBuild } from './people';
import { at, box, type Builder } from './kit';
import type { RigUniforms } from './rig';
import type { Label, View } from './types';

/**
 * A costume lineup: one of each figure a kingdom's crowd is built from, standing on a low stone
 * plinth with a camera of its own, so the dress can be read up close. Labels show only from it.
 */
export type WardrobeSpec = {
	dress: Dress;
	/** Centre of the plinth. */
	x: number;
	z: number;
	/** Direction the row faces (0 = +z, south). */
	rot?: number;
	/** Ground under the plinth; the site's height by default. */
	y?: number;
	/** The research behind this kingdom's dress, for the label notes. */
	note?: string;
};

export type Wardrobe = {
	group: THREE.Group;
	labels: Label[];
	view: View;
	tick(t: number, dt: number): void;
};

export const WARDROBE_VIEW = 'costume';

type Entry = { role: Role; en: string; ko: string };

const LINEUP: Entry[] = [
	{ role: 'man', en: 'Commoner', ko: '평민 남자' },
	{ role: 'woman', en: 'Commoner woman', ko: '평민 여자' },
	{ role: 'lady', en: 'Noblewoman', ko: '귀부인' },
	{ role: 'official', en: 'Official', ko: '관리' },
	{ role: 'monk', en: 'Monk', ko: '승려' },
	{ role: 'guard', en: 'Spearman', ko: '창병' },
	{ role: 'archer', en: 'Archer', ko: '궁수' },
	{ role: 'rider', en: 'Rider', ko: '기마인' }
];

/** What sets each kingdom's dress apart, renamed or added to the common lineup. */
const SIGNATURE: Record<Dress, Entry[]> = {
	silla: [
		{ role: 'hwarang', en: 'Hwarang', ko: '화랑' },
		{ role: 'noble', en: 'King in the gold crown', ko: '금관을 쓴 왕' }
	],
	baekje: [
		{ role: 'official', en: 'Official, silver flower cap', ko: '은제관식 관리' },
		{ role: 'noble', en: 'King, gold flame ornaments', ko: '금제관식의 왕' }
	],
	goguryeo: [
		{ role: 'guard', en: 'Spearman, red wing flaps', ko: '창병' },
		{ role: 'cavalry', en: 'Armoured cavalry (gaemamusa)', ko: '개마무사' },
		{ role: 'noble', en: 'King in the flame crown', ko: '금관을 쓴 왕' }
	],
	gaya: [
		{ role: 'guard', en: 'Spearman, tall cone helm', ko: '종장판 투구 창병' },
		{ role: 'cavalry', en: 'Armoured cavalry', ko: '철기병' },
		{ role: 'noble', en: 'King in the leaf crown', ko: '금관을 쓴 왕' }
	],
	tamla: [{ role: 'noble', en: 'Lord of Tamla', ko: '성주' }],
	tang: [
		{ role: 'man', en: 'Commoner, round-collar coat', ko: '단령 평민' },
		{ role: 'noble', en: 'Emperor, tongtian cap', ko: '통천관의 황제' }
	],
	yamato: [
		{ role: 'man', en: 'Commoner, mizura hair', ko: '미즈라 평민' },
		{ role: 'noble', en: 'Prince in the gilt crown', ko: '왕족' }
	]
};

function lineup(dress: Dress): Entry[] {
	const sig = SIGNATURE[dress];
	const out = LINEUP.map((l) => sig.find((s) => s.role === l.role) ?? l);
	for (const s of sig) if (!out.includes(s)) out.push(s);
	return out;
}

const NAME: Record<Dress, { en: string; ko: string }> = {
	silla: { en: 'Silla dress', ko: '신라 복식' },
	baekje: { en: 'Baekje dress', ko: '백제 복식' },
	goguryeo: { en: 'Goguryeo dress', ko: '고구려 복식' },
	gaya: { en: 'Gaya dress', ko: '가야 복식' },
	tamla: { en: 'Tamla dress', ko: '탐라 복식' },
	tang: { en: 'Tang dress', ko: '당 복식' },
	yamato: { en: 'Yamato dress', ko: '왜 복식' }
};

/** Metres between figures; riders take a horse's length. */
const GAP = 1.7;
const RIDER_GAP = 2.8;
const PLINTH = 0.28;

export function wardrobe(spec: WardrobeSpec, b: Builder, height: (x: number, z: number) => number): Wardrobe {
	const rot = spec.rot ?? 0;
	const fx = Math.sin(rot);
	const fz = Math.cos(rot);
	// along the row: the facing turned a quarter to the right
	const rx = Math.cos(rot);
	const rz = -Math.sin(rot);
	const y = (spec.y ?? height(spec.x, spec.z)) + PLINTH;

	const list = lineup(spec.dress);
	const widths = list.map((l) => (mounted(l.role) ? RIDER_GAP : GAP));
	const length = widths.reduce((s, w) => s + w, 0);
	box(b, 'stone', at(spec.x, y - PLINTH, spec.z, rot), 0, (PLINTH + 0.6) / 2 - 0.6, 0, length + 1.4, PLINTH + 0.6, 3.2, { bevel: 0.08 });

	const folk = new Folk(spec.dress, () => y, 900 + list.length);
	const labels: Label[] = [];
	let d = -length / 2;
	list.forEach((l, i) => {
		const along = d + widths[i] / 2;
		d += widths[i];
		const px = spec.x + rx * along;
		const pz = spec.z + rz * along;
		// the rider stands side-on so the horse reads
		folk.stand(l.role, px, pz, mounted(l.role) ? rot + Math.PI / 2 : rot, { y });
		labels.push({
			id: `costume-${l.role}`,
			en: l.en,
			ko: l.ko,
			// alternate heights so neighbouring tags never overlap
			at: [px, y + (mounted(l.role) ? 2.55 : 2.15) + (i % 2) * 0.5, pz],
			status: 'recorded',
			note: spec.note,
			view: WARDROBE_VIEW
		});
	});

	const u: RigUniforms = { time: { value: 0 }, show: { value: 1 } };
	const built: FolkBuild = folk.build(u);
	built.group.name = 'wardrobe';

	// far enough back that the whole plinth fits a frame about 4:3 wide
	const fov = 36;
	const halfWide = Math.tan(THREE.MathUtils.degToRad(fov / 2)) * 1.3;
	const eye = (length / 2 + 1) / halfWide;
	const view: View = {
		id: WARDROBE_VIEW,
		en: NAME[spec.dress].en,
		ko: NAME[spec.dress].ko,
		pos: [spec.x + fx * eye, y + 2.2, spec.z + fz * eye],
		target: [spec.x, y + 1.0, spec.z],
		fov
	};

	return {
		group: built.group,
		labels,
		view,
		tick(t, dt) {
			u.time.value = t;
			built.tick(t, dt, 1, null);
		}
	};
}
