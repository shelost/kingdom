<script lang="ts">
	/**
	 * The Tang world in rings. Heaven's disc floats over the throne and one
	 * beam drops onto the Son of Heaven; his ten offices stand round him; the
	 * ten circuits lie round them; and six foreign kings lean inward on the
	 * rim, tribute running toward the centre.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRing from '../KitRing.svelte';
	import { HUE, box, getKit, ring, stepIndex, type Tone } from '../kit.svelte';
	import { CIRCUITS, COURT, HEAVEN, REALM, SON, STEPS, VASSALS } from '../../TangImperial.svelte';

	let { step }: { step?: string } = $props();

	const kit = getKit();
	const level = $derived(stepIndex(STEPS, step));
	const EDGE = [2.6, 2.9, 4.1, 6.0];
	$effect(() => {
		const e = EDGE[level];
		kit.fit(box(-e, e, -e, e, 4.8));
	});

	/** The current layer carries the accent; layers already shown settle back. */
	const tone = (layer: number): Tone => (layer === level ? 'accent' : 'base');

	const R_COURT = 2.0;
	const R_REALM = 3.4;
	const R_VASSAL = 5.1;
	const court = ring(COURT.length, R_COURT, -126).map((p) => ({ ...p, ...COURT[p.i] }));
	const circuits = ring(CIRCUITS.length, R_REALM, -90).map((p) => ({ ...p, ...CIRCUITS[p.i] }));
	const vassals = VASSALS.map((v) => {
		const a = (v.deg * Math.PI) / 180;
		return { ...v, a, x: R_VASSAL * Math.cos(a), z: R_VASSAL * Math.sin(a) };
	});
	/** Leaning the top toward the throne: a turn about the tangent. */
	const BOW = 0.38;
	const courtH = (kind: string) => (kind === 'dept' ? 1.0 : kind === 'censor' ? 0.8 : 0.55);
</script>

<!-- Heaven and the one man under it -->
<KitNode
	at={[0, 4.3, 0]}
	shape="disc"
	size={[0.8]}
	height={0.08}
	tone={level === 0 ? 'hot' : 'accent'}
	color={HUE.tang}
	glow={level === 0 ? 0.5 : 0.15}
/>
<KitLabel
	at={[1.7, 4.4, 0]}
	ko={HEAVEN.ko}
	han={HEAVEN.han}
	en={HEAVEN.en}
	size="sm"
	tone="note"
	accent={HUE.tang}
	delay={150}
/>
<KitLink
	points={[
		[0, 4.28, 0],
		[0, 2.2, 0]
	]}
	radius={0.05}
	tone="accent"
	color={HUE.tang}
	pulse
	delay={300}
/>
<KitNode size={[1.3, 1.3]} height={0.3} tone="dim" color={HUE.tang} delay={250} />
<KitNode at={[0, 0.3, 0]} shape="disc" size={[0.4]} height={1.15} tone="hot" color={HUE.tang} delay={400} />
<KitLabel
	at={[0, 1.85, 0]}
	ko={SON.ko}
	han={SON.han}
	en={SON.en}
	tone="strong"
	accent={HUE.tang}
	delay={550}
/>

<!-- the court -->
{#each court as c (c.han)}
	<KitNode
		at={[c.x, 0, c.z]}
		shape={c.kind === 'ministry' ? 'disc' : 'slab'}
		size={c.kind === 'ministry' ? [0.24] : [0.55, 0.55]}
		height={courtH(c.kind)}
		tone={c.kind === 'censor' && level === 1 ? 'hot' : tone(1)}
		color={HUE.tang}
		rotation={[0, -c.a, 0]}
		show={level >= 1}
		delay={500 + c.i * 70}
	/>
	<KitLabel
		at={[c.x * 1.08, courtH(c.kind) + 0.35, c.z * 1.08]}
		ko={c.ko}
		han={c.han}
		en={c.en}
		size="xs"
		minor={c.kind === 'ministry'}
		show={level === 1}
		delay={650 + c.i * 70}
	/>
{/each}

<!-- the realm -->
<KitRing radius={R_REALM} tube={0.025} tone={level === 2 ? 'accent' : 'dim'} color={HUE.tang} show={level >= 2} delay={600} />
{#each circuits as c (c.han)}
	<KitNode
		at={[c.x, 0, c.z]}
		size={[1.15, 0.6]}
		height={0.16}
		tone={tone(2)}
		color={HUE.tang}
		rotation={[0, -c.a - Math.PI / 2, 0]}
		show={level >= 2}
		delay={700 + c.i * 60}
	/>
	<KitLabel
		at={[c.x, 0.3, c.z]}
		ko={c.ko}
		han={c.han}
		size="xs"
		tone="muted"
		minor
		show={level === 2}
		delay={900 + c.i * 60}
	/>
{/each}
<KitLabel
	at={[0, 0.05, R_REALM + 0.75]}
	ko={REALM.ko}
	han={REALM.han}
	en={REALM.en}
	size="xs"
	tone="note"
	accent={HUE.tang}
	show={level === 2}
	delay={1300}
/>

<!-- the kings of the edge, bowing in -->
{#each vassals as v, i (v.han)}
	<KitLink
		points={[
			[v.x * 0.92, 0.06, v.z * 0.92],
			[v.x * 0.72, 0.06, v.z * 0.72]
		]}
		tone={v.hue ? 'accent' : 'base'}
		color={v.hue}
		pulse
		pulseColor={HUE.tang}
		phase={i / 6}
		show={level >= 3}
		delay={900 + i * 120}
	/>
	<KitNode
		at={[v.x, 0, v.z]}
		height={0.95}
		tone={v.hue ? 'accent' : 'base'}
		color={v.hue}
		shape="disc"
		size={[0.36]}
		rotation={[-BOW * Math.sin(v.a), 0, BOW * Math.cos(v.a)]}
		show={level >= 3}
		delay={800 + i * 120}
	/>
	<KitLabel
		at={[v.x * 1.06, 1.4, v.z * 1.06]}
		ko={v.ko}
		han={v.han}
		en={v.en}
		size="xs"
		tone={v.hue ? 'accent' : 'plain'}
		accent={v.hue}
		show={level >= 3}
		delay={1000 + i * 120}
	/>
{/each}
