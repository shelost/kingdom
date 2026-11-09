<script lang="ts">
	/**
	 * One cosmology name. Respects the page language:
	 * - Korean mode: Korean (+ hanja when kept), native script, no English
	 * - English mode: English + native script, no Korean / hanja
	 * Hells use a Material Symbol instead of hanja; peoples set their own script large
	 * in the same place, above the name. Tiers read apart at a glance: realms largest,
	 * peoples and hells bold, biomes and rivers italic in their own tint, oceans small
	 * and spaced.
	 */
	import type { CosmosLabelKind } from '$lib/cosmos';
	import { epithetLines, nameLines, type CosmosLine } from '$lib/cosmosLayer';
	import PeopleMark from '$lib/components/PeopleMark.svelte';
	import type { PeopleMarkId } from '$lib/peopleMarks';
	import { avatarOf, byId } from '$lib/people';
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
		mark = undefined,
		uiKo = false,
		color = undefined,
		kind = undefined,
		tint = undefined,
		night = false
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
		/** A people's mark, above the name. */
		mark?: PeopleMarkId;
		/** The page is in Korean. */
		uiKo?: boolean;
		color?: string;
		/** Label tier below the peoples: biome, river or ocean. */
		kind?: CosmosLabelKind;
		/** Text colour for a tiered label. */
		tint?: string;
		/** On ground that stays dark in light mode: keep the light lettering. */
		night?: boolean;
	} = $props();

	const title = $derived(
		(uiKo ? [ko, han, epithet?.ko, native] : [en, epithet?.en, native]).filter(Boolean).join(' · ')
	);
	const showHan = $derived(uiKo && !!han && han !== ko && !native && !icon);
	const main = $derived(uiKo ? ko : en);

	const words = $derived(nameLines(main, { realm, icon, ko: uiKo }));
	const subLines = $derived(epithet ? epithetLines((uiKo ? epithet.ko : epithet.en) ?? '', uiKo) : []);
	/** A people's script stands large over its name, where a hell sets its symbol. */
	const glyph = $derived(!!native && !icon && !sub && !mark);

	function faceSrc(person?: string): string | null {
		if (!person) return null;
		const p = byId.get(person);
		return p ? avatarOf(p) : null;
	}

	function faceLetter(en: string, ko: string): string {
		const raw = uiKo ? ko : en;
		const bare = raw
			.replace(/^(King|Queen|Emperor|Empress|Caliph|The Prophet|Under)\s+/i, '')
			.replace(/^(왕|여왕|황제|칼리파)\s*/, '');
		return [...bare][0] ?? '·';
	}
</script>

<span
	class={[
		'region',
		kind,
		{ sea, myth, hell: !!icon, realm, home, reach, sky, sub, glyph, night, nativeHeavy: !!native && !icon, enMode: !uiKo }
	]}
	style:--c={color}
	style:--t={tint}
	{title}
>
	{#if mark}
		<PeopleMark id={mark} />
	{:else if icon}
		<span class="material-symbols-outlined hell-icon" aria-hidden="true">{icon}</span>
	{:else if glyph}
		<span class="native">{native}</span>
	{:else if showHan}
		<span class="han">{han}</span>
	{/if}
	<span class="main">
		{#each words as word, i (i)}<span class="word">{word}</span>{/each}
	</span>
	{#if native && !glyph && !icon}<span class="native">{native}</span>{/if}
	{#if epithet}
		{#if uiKo}
			{#if epithet.han && showHan && epithet.han !== epithet.ko}<span class="han sub">{epithet.han}</span>{/if}
			{#each subLines as line, i (i)}<span class="subline">{line}</span>{/each}
		{:else}
			{#each subLines as line, i (i)}<span class="epithet">{line}</span>{/each}
		{/if}
	{/if}
	{#if standing}<span class="dynasty">{uiKo ? standing.ko : standing.en}</span>{/if}
	{#if ruler}
		<span class={['ruler', { divided: ruler.divided }]}>
			{#if ruler.faces?.length}
				<span class="faces">
					{#each ruler.faces as face (`${face.person ?? ''}|${face.en}`)}
						{@const src = faceSrc(face.person)}
						{#if src}
							<img class="avatar" src={src} alt="" />
						{:else}
							<span class="avatar letter">{faceLetter(face.en, face.ko)}</span>
						{/if}
					{/each}
				</span>
			{/if}
			<span class="who">{uiKo ? ruler.ko : ruler.en}</span>
		</span>
	{/if}
	{#each lines as x (x.key)}
		<span class={['line', { reach: x.protectorate, people: x.people }]}>
			{#if uiKo && x.han && x.ko !== x.han && !native}<span class="han">{x.han}</span>{/if}
			<b>{uiKo ? x.ko : x.en}</b>
		</span>
	{/each}
</span>

<style lang="scss">
	.region {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.02em;
		text-align: center;
		font-style: normal;
		white-space: nowrap;
		color: #fff;
		text-shadow: 0 1px 6px rgb(0 0 0 / 0.95), 0 0 2px rgb(0 0 0 / 0.85);
		pointer-events: none;
		/** Light mode drops every text shadow, so names on pale ground turn to ink. */
		:global(html[data-theme='light']) &:not(.night) {
			color: #1f1a14;
		}
		:global(html[data-theme='light']) &.biome:not(.night),
		:global(html[data-theme='light']) &.river:not(.night),
		:global(html[data-theme='light']) &.ocean:not(.night) {
			color: color-mix(in oklab, var(--t, #1f1a14) 45%, #1f1a14);
		}
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
		line-height: 1.04;
		opacity: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		.enMode & {
			font-family: 'Platypi', var(--serif);
			font-size: 0.78em;
			font-weight: 700;
			letter-spacing: -0.03em;
			text-transform: none;
		}
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
		font-family: 'Noto Serif Tibetan', 'Noto Serif Devanagari', 'Kohinoor Devanagari', 'Devanagari Sangam MN', 'Kailasa', 'Noto Sans Inscriptional Pahlavi', 'Geeza Pro', 'Noto Naskh Arabic', 'Khmer Sangam MN', 'Khmer MN', 'Noto Sans Old Turkic', var(--serif);
		font-size: 0.72em;
		font-weight: 500;
		letter-spacing: 0.01em;
		line-height: 1.15;
		opacity: 0.75;
		.nativeHeavy & {
			font-size: 1em;
			font-weight: 800;
			letter-spacing: 0.01em;
			opacity: 0.95;
			margin-top: 0.06em;
		}
		.glyph & {
			/** The people's own script, set where a hell sets its symbol. */
			font-size: 1.15em;
			font-weight: 700;
			line-height: 1.1;
			margin: 0 0 0.06em;
			opacity: 0.95;
		}
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
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2em;
		margin-top: 0.3em;
		padding: 0.28em 0.55em 0.22em;
		border-radius: 999px;
		background: #0b0b0d;
		color: #fff;
		box-shadow: 0 1px 4px rgb(0 0 0 / 0.5);
		font-family: var(--sans, inherit);
		font-size: 0.56em;
		font-weight: 700;
		letter-spacing: 0;
		text-shadow: none;
		&.divided {
			border: 1px dashed rgb(255 255 255 / 0.55);
		}
	}

	.faces {
		display: flex;
		gap: 0.28em;
	}

	.avatar {
		width: 1.85em;
		height: 1.85em;
		border-radius: 50%;
		object-fit: cover;
		background: #2a241c;
		border: 1px solid rgb(255 255 255 / 0.72);
		font-size: 0.85em;
		&.letter {
			display: grid;
			place-items: center;
			font-weight: 700;
		}
	}

	.sea .main {
		font-size: 1.1em;
		letter-spacing: -0.01em;
	}

	.myth .main {
		font-size: 1.15em;
		letter-spacing: -0.01em;
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
		& b {
			font-family: 'Noto Serif KR', var(--serif);
			font-weight: 700;
		}
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

	/** Biomes: spaced italic capitals in the biome's own colour. */

	.biome {
		color: var(--t, #fff);
	}

	.biome .main,
	.enMode.biome .main {
		font-family: var(--serif);
		font-size: 0.78em;
		font-style: italic;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.biome .epithet,
	.biome .subline {
		font-size: 0.56em;
		letter-spacing: 0.04em;
		opacity: 0.85;
	}

	/** Rivers: a light italic in the water's colour. */

	.river {
		color: var(--t, #fff);
	}

	.river .main,
	.enMode.river .main {
		font-family: var(--serif);
		font-size: 0.7em;
		font-style: italic;
		font-weight: 500;
		letter-spacing: 0.04em;
	}

	/** Oceans: small, light, widely tracked. */

	.ocean {
		color: var(--t, #fff);
	}

	.ocean .main,
	.enMode.ocean .main {
		font-family: var(--sans, inherit);
		font-size: 0.56em;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.85;
	}

	.ocean .han {
		font-size: 0.48em;
		letter-spacing: 0.12em;
	}

	/** 이승, 저승 and the Western Heavens: the largest names on the map, one line each. */

	.realm .main {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 2.2em;
		font-weight: 800;
		letter-spacing: -0.01em;
		opacity: 1;
	}

	.enMode.realm .main {
		font-family: var(--serif);
		font-size: 1.7em;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-transform: none;
	}

	.home .main {
		font-size: 1.2em;
		letter-spacing: -0.01em;
	}

	.enMode.home .main {
		font-family: var(--serif);
		font-size: 0.95em;
		letter-spacing: -0.02em;
	}
</style>
