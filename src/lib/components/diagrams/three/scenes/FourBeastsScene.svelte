<script lang="ts">
	import Cardinal from './Cardinal.svelte';
	import { BEASTS } from '../../FourBeasts.svelte';

	const quarters = BEASTS.map((b) => ({
		...b,
		hot: b.survivor,
		note: b.survivor ? { ko: '사룡에도', en: 'also Four Dragons' } : undefined
	}));
</script>

<Cardinal
	emperor={{ ko: '제3황제', en: 'Third Emperor' }}
	{quarters}
	heir={{ ko: '백호 2세', en: 'Xue Rengui' }}
	foot={{ ko: '사신', en: 'Four Beasts · Xue takes the fallen Tiger' }}
/>
