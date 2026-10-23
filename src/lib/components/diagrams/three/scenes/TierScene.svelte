<script lang="ts">
	/**
	 * The Bone Rank pyramid, opened at one layer. It rises whole, the 王 on its summit and the
	 * opened layer named; then the camera closes on that layer and it splits into its own rungs,
	 * bottom up. The layers above lift to make room and everything else dims; each rung carries
	 * one label on its riser and its people on its front tread. A crowned ladder (the royal
	 * house) makes the top rung the King's: the 王 moves onto it and the king stands behind it.
	 * Opened below the Sacred Bone (Muyeol), it lets the Sacred layer go.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitKing from '../KitKing.svelte';
	import { getKit, mix, spread, useReveal, type Bounds, type Vec3 } from '../kit.svelte';
	import { LAYERS, enFor } from '../../BoneRank.svelte';
	import { LADDERS, SACRED_RING, TRUE_RING } from '../../TierLadder.svelte';
	import { byId, avatarOf, nameOf } from '$lib/people';

	let { step, diagram = 'royal-lines', year = null }: { step?: string; diagram?: string; year?: number | null } = $props();

	const kit = getKit();

	/** The whole pyramid: layer height, apex width, and how much wider each layer below is. */
	const H = 0.85;
	const APEX_W = 1.7;
	const STEP_W = 1.2;
	/** The opened layer's rungs: their height, and how far they stay inside the layers around them. */
	const RUNG_H = 0.72;
	const INSET = 0.2;
	/** Faces in a row: their usual spacing, and the closest they get before the row spreads out. */
	const FACE_GAP = 0.55;
	const MIN_GAP = 0.34;
	/** When the camera closes in and the layer splits: once the pyramid has risen. */
	const SPLIT_AT = 2300;
	const VIEW = { az: 0.42, el: 0.55 };

	const def = $derived(LADDERS[diagram] ?? LADDERS['royal-lines']);
	const at = $derived(def.steps[step ?? ''] ?? Object.values(def.steps)[0]);
	const bone = $derived(at.bone ?? def.bone);
	const layer = $derived(LAYERS[bone]);
	const n = $derived(def.tiers.length);
	const crowned = $derived(!!def.tiers[0]?.crown);
	/** A crowned ladder opened below the Sacred Bone: the Sacred Bone is gone. */
	const sacredGone = $derived(crowned && bone > 0);

	/** 0 → 1 at SPLIT_AT once the figure plays; straight to 1 when the kit skips animation. */
	const opening = useReveal(() => ({ delay: SPLIT_AT, duration: 1 }));
	const split = $derived(opening.current > 0.5);

	/** Width of LAYERS[i] (apex first). */
	const widthOf = (i: number) => APEX_W + i * STEP_W;
	/** Base of LAYERS[i] in the closed pyramid. */
	const baseOf = (i: number) => (LAYERS.length - 1 - i) * H;

	const openBase = $derived(baseOf(bone));
	const bandTop = $derived(openBase + n * RUNG_H);
	/** How far the layers above the opened one rise once it splits. */
	const lift = $derived(n * RUNG_H - H);

	/** Every layer, bottom first: where it sits, and how it looks before and after the split. */
	const layers = $derived(
		LAYERS.map((l, i) => {
			const opened = i === bone;
			const gone = sacredGone && i === 0;
			const color = l.a < 1 ? mix(l.c, kit.palette.bg, 1 - l.a) : l.c;
			return {
				l,
				i,
				w: widthOf(i),
				y: baseOf(i) + (i < bone && split ? lift : 0),
				tone: gone ? ('ghost' as const) : split ? ('dim' as const) : ('accent' as const),
				color,
				glow: opened && !split ? 0.35 : 0,
				show: !(split && (opened || gone)),
				delay: 150 + (LAYERS.length - 1 - i) * 110
			};
		}).reverse()
	);

	/** The opened layer's rungs, top first, stepping out from just over the layer above to just inside the one below. */
	const rungs = $derived.by(() => {
		const w = widthOf(bone);
		const bottom = w + STEP_W - INSET;
		const top = bone > 0 ? w - STEP_W + INSET : Math.max(1.1, w - STEP_W + INSET);
		return def.tiers.map((t, i) => ({
			...t,
			i,
			w: n > 1 ? top + ((bottom - top) * i) / (n - 1) : w,
			y: openBase + (n - 1 - i) * RUNG_H,
			top: openBase + (n - i) * RUNG_H,
			lit: at.lit === i
		}));
	});
	/** Rung i rises (and is named, and peopled) bottom up, after the split. */
	const wait = (i: number) => 150 + (n - 1 - i) * 150;

	/**
	 * Where rung i's people stand. On a front tread the row sits right of the riser label
	 * below it, squeezed if it must be; a row that cannot fit there at MIN_GAP spreads across
	 * the whole tread, over the label (which sits low on its riser to leave the room). On the
	 * top rung they centre on its top, behind the 王 when crowned.
	 */
	function standers(i: number) {
		const r = rungs[i];
		const who = at.who[i] ?? [];
		const z = i === 0 ? (r.crown ? -r.w / 4 : r.w / 4) : (r.w + rungs[i - 1].w) / 4;
		const cap = r.w / 2 - 0.25;
		const gaps = Math.max(1, who.length - 1);
		const squeezed = Math.min(FACE_GAP, (cap - 0.3) / gaps);
		const across = Math.min(gaps * FACE_GAP, cap * 2) / 2;
		const xs =
			i > 0 && squeezed >= MIN_GAP
				? spread(who.length, 0.3, 0.3 + squeezed * (who.length - 1))
				: spread(who.length, -across, across);
		return who.map((s, k) => {
			const p = typeof s === 'string' ? byId.get(s) : undefined;
			return {
				key: typeof s === 'string' ? s : s.en,
				at: [xs[k], r.top, z] as Vec3,
				img: p ? avatarOf(p, undefined, year) : null,
				ko: typeof s === 'string' ? undefined : s.ko,
				en: p ? nameOf(p, year) : typeof s === 'string' ? s : s.en,
				ring: typeof s === 'string' && at.trueBone?.includes(s) ? TRUE_RING : SACRED_RING,
				plain: !p
			};
		});
	}

	/** The 王: on the summit, then on the King's rung (crowned) or riding up with the lifted summit. */
	const glyphW = $derived(crowned ? rungs[0].w : APEX_W);
	const glyphAt = $derived<Vec3>(
		split ? (crowned ? [0, bandTop, rungs[0].w * 0.12] : [0, LAYERS.length * H + lift, 0]) : [0, LAYERS.length * H, 0]
	);

	const baseW = widthOf(LAYERS.length - 1);
	const whole: Bounds = { min: [-baseW / 2, 0, -baseW / 2], max: [baseW / 2, LAYERS.length * H + 0.9, baseW / 2] };
	/**
	 * Close on the band's front: risers, treads and the people on them; the back half stays
	 * out of the frame. Above it, the king standing on top (crowned) or the whole lifted
	 * summit with its 王, so nothing is cut through the middle.
	 */
	const close = $derived.by((): Bounds => {
		const half = rungs[n - 1].w / 2;
		const back = crowned ? rungs[0].w / 2 : half * 0.2;
		return {
			min: [-half - 0.1, openBase - 0.15, -back],
			max: [half + 0.1, bandTop + (crowned ? 1.05 : H + 0.15), half + 0.1]
		};
	});
	$effect(() => kit.fit(split ? close : whole, VIEW));
</script>

{#each layers as L (L.i)}
	<KitNode
		at={[0, L.y, 0]}
		size={[L.w, L.w]}
		height={H}
		tone={L.tone}
		color={L.color}
		glow={L.glow}
		corner={0.06}
		show={L.show}
		delay={L.delay}
		moveDelay={0}
	/>
{/each}

<KitKing at={glyphAt} w={glyphW} label={false} delay={1300} />

<!-- before the split: which layer is about to open -->
<KitLabel
	at={[0, openBase + H / 2, widthOf(bone) / 2 + 0.02]}
	ko={layer.ko}
	en={enFor(layer.en)}
	size="sm"
	tone="accent"
	accent={layer.c}
	show={!split}
	delay={split ? 0 : 1400}
/>

{#each rungs as r (r.en)}
	<KitNode
		at={[0, r.y, 0]}
		size={[r.w, r.w]}
		height={RUNG_H}
		tone="accent"
		color={mix(layer.c, kit.palette.bg, r.lit ? 0 : 0.06 + r.i * 0.08)}
		glow={r.lit ? 0.35 : 0}
		corner={0.05}
		show={split}
		delay={wait(r.i)}
	/>
	<KitLabel
		at={[-r.w / 4, r.y + RUNG_H * 0.42, r.w / 2 + 0.02]}
		ko={r.ko}
		han={r.crown ? undefined : r.han}
		en={enFor(r.en)}
		size="lg"
		tone="accent"
		accent={r.lit ? SACRED_RING : layer.c}
		show={split}
		delay={wait(r.i) + 450}
	/>
	{#each standers(r.i) as s (s.key)}
		{#if s.plain}
			<KitLabel at={s.at} ko={s.ko} en={enFor(s.en)} size="xs" tone="muted" show={split} delay={wait(r.i) + 750} />
		{:else}
			<KitLabel
				at={s.at}
				lift={r.crown}
				img={s.img}
				faceZoom={1.8}
				tone="note"
				accent={s.ring}
				show={split}
				delay={wait(r.i) + 750}
			/>
		{/if}
	{/each}
{/each}
