<script lang="ts">
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import gsap from 'gsap';
	import CosmosFlat from '$lib/components/CosmosFlat.svelte';
	import { reading } from '$lib/reading.svelte';

	/**
	 * Queen Sunduk’s cold open. Black, then the reader’s own eyes, then the
	 * gardener and the last flower. Plays once per tab. The parent mounts this
	 * only while that episode is the one on screen.
	 */
	let { storyId, manual = false }: { storyId: string; manual?: boolean } = $props();

	const KEY = 'kingdom:wake:queen-sunduk';
	const STILL = '/temp/sunduk-wake-screen.jpg';

	let show = $state(false);
	let line = $state('');
	let lineKo = $state('');
	let tl: gsap.core.Timeline | undefined;

	const beats: { en: string; ko: string; hold: number; map?: boolean }[] = [
		{ en: 'There you are.', ko: '왔구나.', hold: 1.15 },
		{ en: 'Smell. Soul-Whole. The last one.', ko: '맡아. 혼살이꽃. 맨 마지막이야.', hold: 1.7 },
		{ en: 'Awake. Good.', ko: '깨어났네. 됐다.', hold: 1.15 },
		{
			en: 'Samhan. Three kingdoms. None of them will say the other two out loud.',
			ko: '삼한. 왕국이 셋. 누구도 나머지 둘을 입으로 말하지 않는다.',
			hold: 3.4,
			map: true
		},
		{
			en: 'Goguryeo keeps the north. Baekje keeps the sea.',
			ko: '고구려가 북쪽을 갖는다. 백제가 바다를 갖는다.',
			hold: 3.4,
			map: true
		},
		{
			en: 'Silla is the small one. Tomorrow they crown a woman, and the palace is already laughing.',
			ko: '신라는 작은 쪽이다. 내일 여자에게 왕관을 씌운다. 궁은 벌써 웃고 있다.',
			hold: 3.8,
			map: true
		}
	];

	let ended = false;

	function say(beat: { en: string; ko: string }) {
		line = reading.lang === 'ko' ? beat.ko : beat.en;
		lineKo = reading.lang === 'both' ? beat.ko : '';
	}

	function finish() {
		if (ended) return;
		ended = true;
		const play = tl;
		tl = undefined;
		play?.eventCallback('onComplete', null);
		play?.kill();
		try {
			sessionStorage.setItem(KEY, '1');
		} catch {
			/* private mode */
		}
		const article = document.querySelector(`[data-story-id="${storyId}"]`);
		const hook = article
			? [...article.querySelectorAll('.prose p')].find((p) => {
					const t = (p.textContent ?? '').trim();
					return t.startsWith('A Queen') || t.startsWith('여왕?');
				})
			: null;
		hook?.scrollIntoView({ behavior: 'auto', block: 'center' });
		show = false;
	}

	function allowed() {
		if (manual) return true;
		try {
			if (sessionStorage.getItem(KEY) === '1') return false;
		} catch {
			/* play anyway */
		}
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
		const hash = location.hash.replace(/^#/, '');
		return !hash || hash === storyId;
	}

	const playWake: Attachment<HTMLElement> = (node) => {
		document.body.appendChild(node);
		node.querySelector('.skip')?.addEventListener('click', finish);
		const ctx = gsap.context(() => {
			const lids = node.querySelectorAll<HTMLElement>('.lid');
			const still = node.querySelector<HTMLElement>('.still');
			const caption = node.querySelector<HTMLElement>('.caption');
			const map = node.querySelector<HTMLElement>('.map');
			if (!still || !caption || !map) return;
			gsap.set(lids, {
				scaleY: 1,
				transformOrigin: (i) => (i === 0 ? 'top center' : 'bottom center')
			});
			gsap.set(still, { autoAlpha: 0, filter: 'blur(10px)', scale: 1.14 });
			gsap.set(map, { autoAlpha: 0, scale: 1.08 });
			gsap.set(caption, { autoAlpha: 0, y: 14 });
			const play = gsap.timeline({ onComplete: finish });
			tl = play;
			play.to(lids, { scaleY: 0, duration: 2.6, ease: 'power2.inOut' }, 0.4);
			play.to(still, { autoAlpha: 1, filter: 'blur(0px)', scale: 1, duration: 2.6, ease: 'power2.out' }, 0.55);
			beats.forEach((beat, i) => {
				play.call(() => say(beat));
				play.fromTo(caption, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' });
				if (i === 1) {
					play.to(
						still,
						{ autoAlpha: 0, filter: 'blur(16px)', scale: 1.08, duration: 1.6, ease: 'power1.in' },
						'<0.45'
					);
				}
				if (beat.map && i === 3) {
					play.to(map, { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power1.out' }, '<');
				}
				play.to(caption, { autoAlpha: 0, duration: 0.3 }, `+=${beat.hold}`);
			});
		}, node);
		return () => {
			tl?.kill();
			ctx.revert();
			node.remove();
		};
	};

	onMount(() => {
		if (allowed()) show = true;
	});
</script>

{#if show}
	<div class="wake" {@attach playWake} role="dialog" aria-label="Before the story">
		<div class="visual">
			<img class="still" src={STILL} alt="" />
			<div class="map">
				<CosmosFlat
					year={632}
					scope="samhan"
					ko={reading.lang === 'ko'}
					terrain={true}
					washes={true}
					labels={true}
					nations={true}
					cities={false}
					tribes={false}
					rivers={true}
					detail={true}
					fish="off"
					mythic={false}
					nature={false}
					peoples={false}
					kinds={[]}
				/>
			</div>
			<div class="lid lid-top"></div>
			<div class="lid lid-bottom"></div>
		</div>
		<p class="caption">
			{line}
			{#if lineKo}<span class="ko" lang="ko">{lineKo}</span>{/if}
		</p>
		<button type="button" class="skip" onclick={finish}>
			{reading.lang === 'ko' ? '건너뛰기' : 'Skip'}
		</button>
	</div>
{/if}

<style>
	.wake {
		position: fixed;
		inset: 0;
		z-index: 400;
		display: flex;
		flex-direction: column;
		background: #000;
		overflow: hidden;
		padding-top: env(safe-area-inset-top);
	}
	.visual {
		position: relative;
		flex: 1;
		min-height: 0;
	}
	.still,
	.map {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.still {
		object-fit: cover;
		object-position: center;
	}
	.map {
		pointer-events: none;
		z-index: 1;
	}
	.map :global(.sheet) {
		border-radius: 0;
		background: #0c1014;
	}
	.lid {
		position: absolute;
		left: 0;
		width: 100%;
		height: 52%;
		background: #000;
		z-index: 2;
	}
	.lid-top {
		top: 0;
		transform-origin: top center;
	}
	.lid-bottom {
		bottom: 0;
		transform-origin: bottom center;
	}
	.caption {
		position: relative;
		z-index: 3;
		flex: 0 0 auto;
		margin: 0;
		padding: 0.9rem 1.15rem calc(1rem + env(safe-area-inset-bottom));
		color: #f4f1e8;
		font-size: 1.05rem;
		line-height: 1.4;
		text-align: center;
		background: #000;
	}
	.ko {
		display: block;
		margin-top: 0.35rem;
		font-size: 0.86em;
		opacity: 0.82;
	}
	.skip {
		position: absolute;
		z-index: 4;
		top: calc(0.55rem + env(safe-area-inset-top));
		right: 0.7rem;
		min-height: 44px;
		padding: 0 0.4rem;
		border: 0;
		background: transparent;
		color: rgba(244, 241, 232, 0.72);
		font: inherit;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
	}
	.skip:hover {
		color: #f4f1e8;
	}
	@media (max-width: 799px) {
		.still {
			object-fit: contain;
			background: #000;
		}
	}
	@media (min-width: 800px) {
		.caption {
			position: absolute;
			left: 8%;
			right: 8%;
			bottom: 8%;
			padding: 0;
			background: transparent;
			font-size: clamp(1.15rem, 2.4vw, 1.7rem);
			text-shadow: 0 2px 18px #000;
		}
		.map {
			inset: 0 0 24% 0;
		}
	}
</style>
