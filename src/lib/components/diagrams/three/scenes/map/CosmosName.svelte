<script lang="ts">
	/**
	 * One cosmology name. Respects the page language:
	 * - Korean mode: Korean (+ hanja when kept), native script, no English
	 * - English mode: English + native script, no Korean / hanja
	 * Hells use a Material Symbol instead of hanja. All labels are white.
	 */
	import type { CosmosLine } from '$lib/cosmosLayer';
	import type { RealmRuler } from '$lib/realmRulers';

	let {
		han,
		ko,
		en,
		epithet = undefined,
		standing = null,
		ruler = null,
		lines = [],
		sea = false,
		myth = false,
		realm = false,
		home = false,
		reach = false,
		sky = false,
		sub = false,
		native = '',
		icon = '',
		uiKo = false,
		color = undefined
	}: {
		han: string;
		/** Korean reading. */
		ko: string;
		en: string;
		epithet?: { han?: string; ko?: string; en: string };
		standing?: { en: string; ko: string } | null;
		/** Who rules it this year: a black pill under the name. */
		ruler?: RealmRuler | null;
		lines?: CosmosLine[];
		sea?: boolean;
		myth?: boolean;
		realm?: boolean;
		home?: boolean;
		reach?: boolean;
		sky?: boolean;
		/** A people inside a civilization: smaller than the parent name. */
		sub?: boolean;
		/** That civilization's own script — shown in both languages. */
		native?: string;
		/** Material Symbols ligature for a hell. */
		icon?: string;
		/** The page is in Korean. */
		uiKo?: boolean;
		color?: string;
	} = $props();

	const title = $derived(
		(uiKo ? [ko, han, epithet?.ko, native] : [en, epithet?.en, native]).filter(Boolean).join(' · ')
	);
	const showHan = $derived(uiKo && !!han && han !== ko && !native && !icon);
	const main = $derived(uiKo ? ko : en);
	/** Hell courts stack one word per line so the names stay narrow. */
	const words = $derived(icon ? main.split(' ') : [main]);
</script>

<span
	class={['region', { sea, myth, hell: !!icon, realm, home, reach, sky, sub, nativeHeavy: !!native && !icon, enMode: !uiKo }]}
	style:--c={color}
	{title}
>
	{#if icon}
		<span class="material-symbols-outlined hell-icon" aria-hidden="true">{icon}</span>
	{:else if showHan}
		<span class="han">{han}</span>
	{/if}
	<span class="main">
		{#each words as word, i (i)}<span class="word">{word}</span>{/each}
	</span>
	{#if native}<span class="native">{native}</span>{/if}
	{#if epithet}
		{#if uiKo}
			{#if epithet.han && showHan && epithet.han !== epithet.ko}<span class="han sub">{epithet.han}</span>{/if}
			{#if epithet.ko}<span class="subline">{epithet.ko}</span>{/if}
		{:else if epithet.en}
			<span class="epithet">{epithet.en}</span>
		{/if}
	{/if}
	{#if standing}<span class="dynasty">{uiKo ? standing.ko : standing.en}</span>{/if}
	{#if ruler}<span class={['ruler', { divided: ruler.divided }]}>{uiKo ? ruler.ko : ruler.en}</span>{/if}
	{#each lines as x (x.key)}
		<span class={['line', { reach: x.protectorate, people: x.people }]}>
			{#if uiKo && x.han && x.ko !== x.han && !native}<span class="han">{x.han}</span>{/if}
			<b>{uiKo ? x.ko : x.en}</b>
		</span>
	{/each}
</span>

<style>
	.region {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.02em;
		font-style: normal;
		white-space: nowrap;
		color: #fff;
		text-shadow:
			0 1px 6px rgb(0 0 0 / 0.95),
			0 0 2px rgb(0 0 0 / 0.85);
		pointer-events: none;
	}

	.han {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.58em;
		font-weight: 600;
		letter-spacing: 0.01em;
		line-height: 1.1;
		opacity: 0.72;
	}

	.main {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1.05em;
		font-weight: 700;
		letter-spacing: 0.01em;
		line-height: 1;
		opacity: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.enMode .main {
		font-family: 'Platypi', var(--serif);
		font-size: 0.78em;
		font-weight: 700;
		letter-spacing: -0.03em;
		text-transform: none;
	}

	.hell .hell-icon {
		font-size: 1.05em;
		margin-bottom: 0.08em;
	}

	.han.sub,
	.subline {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.72em;
		font-weight: 600;
		letter-spacing: 0;
		opacity: 0.85;
	}

	.native {
		font-family: 'Noto Serif Tibetan', 'Noto Serif Devanagari', 'Kohinoor Devanagari', 'Devanagari Sangam MN', 'Kailasa', 'Geeza Pro', 'Noto Naskh Arabic', 'Khmer Sangam MN', 'Khmer MN', 'Noto Sans Old Turkic', var(--serif);
		font-size: 0.72em;
		font-weight: 500;
		letter-spacing: 0.01em;
		line-height: 1.15;
		opacity: 0.75;
	}

	.nativeHeavy .native {
		font-size: 1em;
		font-weight: 800;
		letter-spacing: 0.01em;
		opacity: 0.95;
		margin-top: 0.06em;
	}

	.hell-icon {
		font-size: 1.35em;
		font-weight: 700;
		line-height: 1;
		opacity: 0.95;
		font-variation-settings: 'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24;
	}

	.sub .main {
		font-size: 0.92em;
		letter-spacing: 0;
	}

	.sub .han,
	.sub .native {
		font-size: 0.46em;
	}

	.sub.nativeHeavy .native {
		font-size: 0.72em;
		font-weight: 700;
	}

	.epithet {
		font-family: var(--serif);
		font-size: 0.66em;
		font-style: italic;
		letter-spacing: 0.01em;
		opacity: 0.9;
	}

	.dynasty {
		margin-top: 0.12em;
		padding: 0 0.45em;
		border: 1px solid rgb(255 255 255 / 0.45);
		border-radius: 999px;
		font-family: var(--sans, inherit);
		font-size: 0.52em;
		font-weight: 600;
		letter-spacing: 0;
		opacity: 0.9;
	}

	.ruler {
		margin-top: 0.3em;
		padding: 0.18em 0.7em;
		border-radius: 999px;
		background: #0b0b0d;
		color: #fff;
		box-shadow: 0 1px 4px rgb(0 0 0 / 0.5);
		font-family: var(--sans, inherit);
		font-size: 0.56em;
		font-weight: 700;
		letter-spacing: 0;
		text-shadow: none;
	}

	.ruler.divided {
		border: 1px dashed rgb(255 255 255 / 0.55);
	}

	.sea .main {
		font-size: 1.1em;
		letter-spacing: 0.01em;
	}

	.myth .main {
		font-size: 1.15em;
	}

	.hell .main {
		font-size: 0.95em;
		letter-spacing: 0;
		line-height: 1.02;
	}

	.enMode.hell .main {
		font-size: 0.62em;
		letter-spacing: 0.01em;
		text-transform: uppercase;
	}

	.reach .main {
		font-size: 0.9em;
		letter-spacing: 0;
	}

	.line {
		display: flex;
		gap: 0.35em;
		align-items: baseline;
		font-family: var(--sans, inherit);
		font-size: 0.58em;
		font-weight: 600;
		letter-spacing: 0;
		opacity: 0.9;
	}

	.line b {
		font-family: 'Noto Serif KR', var(--serif);
		font-weight: 700;
	}

	.enMode .line b {
		font-family: var(--serif);
		letter-spacing: -0.02em;
	}

	.line .han {
		font-size: 0.9em;
	}

	.line.reach {
		padding: 0 0.35em;
		border: 1px dashed rgb(255 255 255 / 0.4);
		border-radius: 3px;
	}

	/** 이승, 저승 and the flower fields — larger and set apart from civ names. */
	.realm .main {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1.85em;
		font-weight: 800;
		letter-spacing: 0;
		opacity: 1;
	}

	.enMode.realm .main {
		font-family: var(--serif);
		font-size: 1.35em;
		font-weight: 700;
		letter-spacing: -0.015em;
		text-transform: none;
	}

	.home .main {
		font-size: 1.2em;
		letter-spacing: 0.01em;
	}

	.enMode.home .main {
		font-family: var(--serif);
		font-size: 0.95em;
		letter-spacing: -0.02em;
	}
</style>
