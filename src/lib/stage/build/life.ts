import * as THREE from 'three';
import type { P2 } from './geo';
import { Folk, type Dress, type Who } from './people';
import { Fleet, type BoatKind } from './boats';
import { cameraProbe, type RigUniforms } from './rig';

/**
 * A site's life: the crowd on the palace road (running out of the main hall's door when People
 * turns on), the folk the site placed by hand (guards on the walls, officials in the courts, monks
 * at the temples), and the boats. Figures and hulls are the stylized toy-miniature rigs of
 * `people.ts` and `boats.ts`, dressed by kingdom from the costume canon and the ship boards.
 */
export type LifeSpec = {
	kingdom: Dress;
	/** A road or yard the default crowd walks. */
	walk?: P2[];
	/** Centreline of the water. The default boats drift along it. */
	river?: P2[];
	/** Metres from the centreline to the bank path. */
	bank?: number;
	waterY?: number;
	height: (x: number, z: number) => number;
	seed: number;
	/** Size of the default crowd on `walk`. */
	people?: number;
	/** How many default boats on `river`. */
	boats?: number;
	/** Under 0.55: a stream only small craft can use (skiffs); otherwise the kingdom's river fleet. */
	boat?: number;
	/** The main hall's door: the crowd runs out of it when People turns on and back in when it turns off. */
	door?: P2;
	/** Hand-placed people. */
	folk?: Folk;
	/** Hand-placed boats. */
	fleet?: Fleet;
};

export type Life = {
	group: THREE.Group;
	people: THREE.Group;
	boats: THREE.Group;
	/** Animate the crowd and the boats in or out. */
	show(people: boolean, boats: boolean): void;
	tick(t: number, dt: number): void;
};

/** How many more people a site's crowd gets than its spec asks for. */
const CROWD = 2.5;
/** Seconds for the whole crowd to come out (or go home). */
const ARRIVE = 2.6;

/** Who walks the palace road: mostly white-clad townsfolk, a few officials and ladies. */
const ROAD: Who[] = ['man', 'woman', 'man', 'woman', 'official', 'man', 'woman', 'lady', 'man', 'woman'];

/** The default river fleet per kingdom: its own ship where one would be on that water, then ferries and skiffs. */
const RIVER: Record<Dress, BoatKind[]> = {
	silla: ['ferry', 'skiff', 'silla', 'skiff'],
	baekje: ['baekje', 'ferry', 'skiff', 'skiff'],
	goguryeo: ['goguryeo', 'ferry', 'skiff', 'skiff'],
	gaya: ['ferry', 'skiff', 'skiff'],
	tamla: ['tamla', 'teu', 'teu', 'tamla'],
	tang: ['tang', 'ferry', 'skiff'],
	yamato: ['yamato', 'skiff', 'ferry']
};

/** The run of a river that passes near a point, so boats stay by the palace instead of the whole valley. */
export function reach(path: P2[], x: number, z: number, radius: number): P2[] {
	let lo = -1;
	let hi = -1;
	path.forEach((p, i) => {
		if (Math.hypot(p[0] - x, p[1] - z) <= radius) {
			if (lo < 0) lo = i;
			hi = i;
		}
	});
	if (lo < 0 || hi <= lo) return path;
	return path.slice(lo, hi + 1);
}

export function buildLife(spec: LifeSpec): Life {
	const group = new THREE.Group();
	group.name = 'life';
	const people = new THREE.Group();
	const boats = new THREE.Group();
	const probe = cameraProbe();
	group.add(people, boats, probe.mesh);

	const folk = spec.folk ?? new Folk(spec.kingdom, spec.height, spec.seed);
	if (spec.walk && spec.people) {
		folk.walk(ROAD, spec.walk, Math.round(spec.people * CROWD), { lane: 2.4, y: spec.height, from: spec.door ?? spec.walk[0] });
	}
	const waterY = spec.waterY ?? 0;
	const fleet = spec.fleet ?? new Fleet(waterY, spec.kingdom, spec.seed);
	if (spec.river && spec.boats) {
		const kinds = (spec.boat ?? 1) < 0.55 ? (['skiff'] as BoatKind[]) : RIVER[spec.kingdom];
		const lane = Math.min(18, (spec.bank ?? 20) * 0.3);
		for (let i = 0; i < spec.boats; i++) fleet.drift(kinds[i % kinds.length], spec.river, 1, { lane, y: waterY });
	}

	const folkU: RigUniforms = { time: { value: 0 }, show: { value: 0 } };
	const fleetU: RigUniforms = { time: { value: 0 }, show: { value: 0 } };
	const crowdBuild = folk.count ? folk.build(folkU) : null;
	const fleetBuild = fleet.count ? fleet.build(fleetU) : null;
	if (crowdBuild) people.add(crowdBuild.group);
	if (fleetBuild) boats.add(fleetBuild.group);

	let crowd = 0;
	let crowdTo = 1;
	let sail = 0;
	let sailTo = 1;

	function show(on: boolean, sailing: boolean) {
		crowdTo = on ? 1 : 0;
		sailTo = sailing ? 1 : 0;
		if (on) people.visible = true;
		if (sailing) boats.visible = true;
	}

	function tick(t: number, dt: number) {
		const step = dt / ARRIVE;
		crowd = crowdTo > crowd ? Math.min(crowdTo, crowd + step) : Math.max(crowdTo, crowd - step);
		sail = sailTo > sail ? Math.min(sailTo, sail + step) : Math.max(sailTo, sail - step);
		people.visible = crowd > 0;
		boats.visible = sail > 0;
		folkU.time.value = t;
		folkU.show.value = crowd;
		fleetU.time.value = t;
		fleetU.show.value = sail;
		const cam = probe.seen() ? probe.pos : null;
		if (people.visible) crowdBuild?.tick(t, dt, crowd, cam);
		if (boats.visible) fleetBuild?.tick(t, dt, sail, cam);
	}

	return { group, people, boats, show, tick };
}
