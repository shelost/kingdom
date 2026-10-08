<script lang="ts">
	import Cardinal from './Cardinal.svelte';
	import { DRAGONS } from '../../FourDragons.svelte';

	const quarters = DRAGONS.map((d) => ({
		...d,
		hot: d.overlap,
		note: d.overlap ? { ko: '사신에도', en: 'also Four Beasts' } : undefined
	}));
</script>

<Cardinal
	emperor={{ ko: '서토 황제', en: 'Second Emperor' }}
	{quarters}
	foot={{ ko: '사룡', en: 'Four Dragons · only Blue survives into the Beasts' }}
/>
