<script lang="ts">
	/** Near Lands · 옆나라 and Far Lands · 먼나라. 이승/저승 are a different split. */
	let { ko = false }: { ko?: boolean } = $props();

	const BANDS = [
		{
			en: 'Near Lands',
			ko: '옆나라',
			whoEn: 'Samhan · China · Japan · Northern Nomads',
			whoKo: '한 · 화 · 왜 · 북적'
		},
		{
			en: 'Far Lands',
			ko: '먼나라',
			whoEn: 'Tibet · India · Persia · Rome · Southern Seas',
			whoKo: '토번 · 천축 · 파사 · 불림 · 남해'
		}
	];
</script>

<div class="bands">
	{#each BANDS as b (b.en)}
		<p>
			<span class={['name', { hangul: ko }]}>{ko ? b.ko : b.en}</span>
			<span class="who">{ko ? b.whoKo : b.whoEn}</span>
		</p>
	{/each}
</div>

<style>
	.bands {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
		max-width: 16rem;
		padding: 0.45rem 0.6rem;
		border-radius: 0.55rem;
		background: rgb(8 8 10 / 0.72);
		pointer-events: none;
	}

	p {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem 0.45rem;
		margin: 0;
	}

	.name {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--fg-strong, #f4efe4);
	}

	.name.hangul {
		font-family: 'Noto Serif KR', var(--serif);
		letter-spacing: 0.08em;
		color: var(--gold, #e2b657);
	}

	.who {
		flex-basis: 100%;
		font-size: 0.62rem;
		letter-spacing: 0.02em;
		color: var(--fg-faint, #b7aa96);
	}

	:global(html[data-theme='light']) .bands {
		background: rgb(255 252 246 / 0.82);
	}
</style>
