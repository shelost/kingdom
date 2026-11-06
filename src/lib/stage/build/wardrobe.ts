import * as THREE from 'three';
import { Folk, type Dress, type Role, type FolkBuild } from './people';
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

const LINEUP: { role: Role; en: string; ko: string }[] = [
	{ role: 'man', en: 'Commoner', ko: '평민 남자' },
	{ role: 'woman', en: 'Commoner woman', ko: '평민 여자' },
	{ role: 'lady', en: 'Noblewoman', ko: '귀부인' },
	{ role: 'official', en: 'Official', ko: '관리' },
	{ role: 'monk', en: 'Monk', ko: '승려' },
	{ role: 'guard', en: 'Spearman', ko: '창병' },
	{ role: 'archer', en: 'Archer', ko: '궁수' },
	{ role: 'rider', en: 'Rider', ko: '기마인' }
];

const NAME: Record<Dress, { en: string; ko: string }> = {
	silla: { en: 'Silla dress', ko: '신라 복식' },
	baekje: { en: 'Baekje dress', ko: '백제 복식' },
	goguryeo: { en: 'Goguryeo dress', ko: '고구려 복식' },
	gaya: { en: 'Gaya dress', ko: '가야 복식' },
	tamla: { en: 'Tamla dress', ko: '탐라 복식' },
	tang: { en: 'Tang dress', ko: '당 복식' },
	yamato: { en: 'Yamato dress', ko: '왜 복식' }
};

/** Metres between figures; the rider takes a horse's length. */
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

	const widths = LINEUP.map((l) => (l.role === 'rider' ? RIDER_GAP : GAP));
	const length = widths.reduce((s, w) => s + w, 0);
	box(b, 'stone', at(spec.x, y - PLINTH, spec.z, rot), 0, (PLINTH + 0.6) / 2 - 0.6, 0, length + 1.4, PLINTH + 0.6, 3.2, { bevel: 0.08 });

	const folk = new Folk(spec.dress, () => y, 900 + LINEUP.length);
	const labels: Label[] = [];
	let d = -length / 2;
	LINEUP.forEach((l, i) => {
		const along = d + widths[i] / 2;
		d += widths[i];
		const px = spec.x + rx * along;
		const pz = spec.z + rz * along;
		// the rider stands side-on so the horse reads
		folk.stand(l.role, px, pz, l.role === 'rider' ? rot + Math.PI / 2 : rot, { y });
		labels.push({
			id: `costume-${l.role}`,
			en: l.en,
			ko: l.ko,
			at: [px, y + (l.role === 'rider' ? 2.55 : 2.15), pz],
			status: 'recorded',
			note: spec.note,
			view: WARDROBE_VIEW
		});
	});

	const u: RigUniforms = { time: { value: 0 }, show: { value: 1 } };
	const built: FolkBuild = folk.build(u);
	built.group.name = 'wardrobe';

	const eye = 10.5;
	const view: View = {
		id: WARDROBE_VIEW,
		en: NAME[spec.dress].en,
		ko: NAME[spec.dress].ko,
		pos: [spec.x + fx * eye + rx * 1.5, y + 1.9, spec.z + fz * eye + rz * 1.5],
		target: [spec.x, y + 1.05, spec.z],
		fov: 42
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
