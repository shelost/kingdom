<script lang="ts">
	/**
	 * A beam along a polyline: it draws itself from the first point to the
	 * last when the figure plays. With `pulse`, a bead travels along it (a
	 * document, a vote, a tribute) — only while the figure is on screen and
	 * motion is allowed; otherwise the bead rests partway, as a still.
	 */
	import { T, useTask, useThrelte } from '@threlte/core';
	import { Mesh, Quaternion, Vector3 } from 'three';
	import {
		getKit,
		toneColor,
		useFollow,
		useReveal,
		type Tone,
		type Vec3
	} from './kit.svelte';
	import { ballGeometry, beamGeometry } from './geometry';

	let {
		points,
		radius = 0.035,
		tone = 'base',
		color,
		delay = 0,
		show = true,
		duration = 700,
		pulse = false,
		pulseTone = 'accent',
		pulseColor,
		speed = 0.45,
		phase = 0
	}: {
		points: Vec3[];
		radius?: number;
		tone?: Tone;
		color?: string;
		delay?: number;
		show?: boolean;
		duration?: number;
		pulse?: boolean;
		pulseTone?: Tone;
		pulseColor?: string;
		/** Laps per second. */
		speed?: number;
		/** Where the bead starts (0–1), so parallel beams don't march in step. */
		phase?: number;
	} = $props();

	const kit = getKit();
	const { invalidate } = useThrelte();
	const draw = useReveal(() => ({ delay, show, duration }));
	const pts = useFollow(() => points, () => delay * 0.3);
	const fill = $derived(toneColor(kit.palette, tone, color));
	const bead = $derived(toneColor(kit.palette, pulseTone, pulseColor ?? color));

	const UP = new Vector3(0, 1, 0);

	const segs = $derived.by(() => {
		const p = pts.current;
		const out: { a: Vector3; b: Vector3; len: number; start: number }[] = [];
		let start = 0;
		for (let i = 0; i < p.length - 1; i++) {
			const a = new Vector3(...p[i]);
			const b = new Vector3(...p[i + 1]);
			const len = a.distanceTo(b);
			if (len < 1e-4) continue;
			out.push({ a, b, len, start });
			start += len;
		}
		return out;
	});
	const total = $derived(segs.reduce((s, g) => s + g.len, 0));

	const pieces = $derived.by(() => {
		const reach = draw.current * total;
		return segs.flatMap((s, i) => {
			const f = Math.max(0, Math.min(1, (reach - s.start) / s.len));
			if (f <= 0) return [];
			const dir = new Vector3().subVectors(s.b, s.a).normalize();
			const mid = new Vector3().copy(s.a).addScaledVector(dir, (s.len * f) / 2);
			const q = new Quaternion().setFromUnitVectors(UP, dir);
			return [
				{
					i,
					position: [mid.x, mid.y, mid.z] as Vec3,
					quaternion: [q.x, q.y, q.z, q.w] as [number, number, number, number],
					scale: [radius, s.len * f, radius] as Vec3
				}
			];
		});
	});

	function pointAt(t: number, out: Vector3): Vector3 {
		const d = t * total;
		for (const s of segs) {
			if (d <= s.start + s.len) return out.copy(s.a).lerp(s.b, (d - s.start) / s.len);
		}
		const last = segs[segs.length - 1];
		return last ? out.copy(last.b) : out.set(0, 0, 0);
	}

	const drawn = $derived(draw.current >= 0.999 && total > 0);
	const moving = $derived(pulse && drawn && kit.visible && !kit.reduced);

	let ball = $state.raw<Mesh>();
	let t = 0;
	const tmp = new Vector3();

	$effect(() => {
		// Rest position for stills (reduced motion / off screen / first frame).
		if (!ball || !drawn || !pulse) return;
		void segs;
		t = phase;
		pointAt(kit.reduced ? 0.62 : t, tmp);
		ball.position.copy(tmp);
		invalidate();
	});

	useTask(
		(delta) => {
			if (!ball) return;
			t = (t + delta * speed * (2.5 / Math.max(total, 0.5))) % 1;
			ball.position.copy(pointAt(t, tmp));
		},
		{ running: () => moving }
	);
</script>

{#each pieces as p (p.i)}
	<T.Mesh
		geometry={beamGeometry()}
		dispose={false}
		position={p.position}
		quaternion={p.quaternion}
		scale={p.scale}
		castShadow
	>
		<T.MeshStandardMaterial color={fill} roughness={0.5} metalness={0.05} />
	</T.Mesh>
{/each}

{#if pulse && drawn}
	<T.Mesh
		bind:ref={ball}
		geometry={ballGeometry()}
		dispose={false}
		scale={radius * 2.6}
		castShadow
	>
		<T.MeshStandardMaterial color={bead} emissive={bead} emissiveIntensity={0.55} roughness={0.35} />
	</T.Mesh>
{/if}
