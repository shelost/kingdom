<script lang="ts">
	import { resolve } from '$app/paths';
	import { SvelteSet } from 'svelte/reactivity';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import Blocks from '$lib/components/Blocks.svelte';
	import VolumePreview from '$lib/components/books/VolumePreview.svelte';
	import { VOLUMES } from '$lib/books';
	import { chapters } from '$lib/story';
	import { onceInView } from '$lib/inView';
	import { collectWidgets, type WidgetInstance, type WidgetKind } from '$lib/widgets';

	const ALL = collectWidgets(chapters);

	function first(kind: WidgetKind): WidgetInstance | undefined {
		return ALL.find((w) => w.kind === kind);
	}

	const card = first('card');
	const map = first('map');
	const record = first('quote:annal') ?? first('quote:stele') ?? first('quote:letter');
	const place = first('place');
	const diagram = first('diagram') ?? first('formation');

	const shown = new SvelteSet<string>();
	const shelf = VOLUMES[0];

	const shots = {
		home: '/guide/home.jpg',
		read: '/guide/read.jpg',
		chapters: '/guide/chapters.jpg',
		volumes: '/guide/volumes.jpg',
		stories: '/guide/stories.jpg',
		wiki: '/guide/wiki.jpg',
		map: '/guide/map.jpg',
		tree: '/guide/tree.jpg',
		timeline: '/guide/timeline.jpg',
		characters: '/guide/characters.jpg',
		stage: '/guide/stage.jpg',
		images: '/guide/images.jpg',
		comic: '/guide/comic.jpg',
		music: '/guide/music.jpg',
		scenes: '/guide/scenes.jpg',
		quotes: '/guide/quotes.jpg',
		research: '/guide/research.jpg',
		widgets: '/guide/widgets.jpg'
	} as const;
</script>

{#snippet shot(src: string, caption: string)}
	<figure class="shot">
		<img {src} alt="" />
		<figcaption>{caption}</figcaption>
	</figure>
{/snippet}

{#snippet live(w: WidgetInstance, note: string)}
	<div class="specimen">
		<p class="specimen-kicker">{note}</p>
		<div
			class={['specimen-stage', { pending: !shown.has(w.kind) }]}
			{@attach onceInView(() => void shown.add(w.kind), { threshold: 0, rootMargin: '480px 0px' })}
		>
			{#if shown.has(w.kind)}
				<Blocks blocks={[w.block]} year={w.year} idPrefix={`guide-${w.kind}-`} unpinned />
			{/if}
		</div>
	</div>
{/snippet}

<svelte:head>
	<title>Guide · King for All</title>
	<meta
		name="description"
		content="What each room of King for All is for: the book, the wiki, the volumes, the map, and the rest."
	/>
</svelte:head>

<main class="guide">
	<SiteNavSpace />

	<article class="letter">
		<p class="kicker">Guide</p>
		<h1>The rooms</h1>

		<p>
			<em>King for All</em> is one book. Everything else on this site is a room around it. The bar
			along the top keeps the rooms you will use most: Chapters, Volumes, Home, Wiki, Images, Map
			and 3D. The rest sit behind the <span class="mark">⋯</span>. Each room below is shown as it
			stands, and, where the room is really an object from the script, that object is set out live.
		</p>

		<h2>Where to begin</h2>
		<p>
			<a href={resolve('/')}>Home</a> is the hall. A loop of the peninsula plays in the middle, a
			wall of stills hangs beside it, and a short shelf of volumes stands underneath. If you have
			been here before, the door says Continue and opens the episode you left. If you have not, it
			says Read and starts at the beginning.
		</p>
		{@render shot(shots.home, 'Home. The living map, the wall of stills, a short shelf, and the doors into the world.')}

		<p>
			<a href={resolve('/read')}>Read</a> is the book. It opens on the foreword, then the episodes.
			While you are in it, the settings along the edge change how it is told. Full scroll is the
			whole chronicle in one sitting. Episodes hands you one at a time, with a previous and a next.
			Script, Immersion and Cinema are three ways of sitting in a scene. Screenplay is the text
			alone. Storyboard is each still with the line that belongs under it.
		</p>
		{@render shot(shots.read, 'Read. An episode opens on its title, a summary of the hour, and the ground it stands on. The contents stay at the left.')}
		{#if card}
			{@render live(card, 'A person, the first time they walk on')}
		{/if}

		<p>
			Dialogue has its own switch. Script sets the lines like a play. Comic puts them in balloons.
			Tweet makes every speech a post. Hybrid uses messages for people who know each other, and
			posts for councils and strangers. English and Korean are the same switch, one setting for the
			whole site. Star a sentence as you go and it is kept for you on the quotes page.
		</p>

		<h2>The library</h2>
		<p>
			<a href={resolve('/books')}>Library</a> puts the shelf and the contents on one page: the 3D
			volumes on the left, every episode scrolling on the right. One volume is one chapter. The
			spines are gathered by part, and the cloth takes its colour from the kingdom or the person
			that chapter belongs to. Take a book down and its episode list opens; or scroll the rail and
			open any row to read.
		</p>
		{@render shot(shots.volumes, 'Library. Shelf on the left, chapters on the right.')}
		{#if shelf}
			<div class="specimen">
				<p class="specimen-kicker">One volume, in the hand</p>
				<div class="book">
					<VolumePreview volume={shelf} pose="stand" height={13} />
				</div>
			</div>
		{/if}

		<p>
			<a href={resolve('/stories')}>Stories</a> is the shelf for the books that come after this
			chronicle: outlines, still waiting to be bound.
		</p>
		{@render shot(shots.stories, 'Stories. The later books, as outlines.')}

		<h2>The world the book stands in</h2>
		<p>
			<a href={resolve('/wiki')}>Wiki</a> is the cast and the set. People, gods, animals, places,
			kingdoms, clans, courts, swords, ideas, and the bonds between them. Search by name, or narrow
			the shelves by kind and by kingdom. Open a card for the portrait, the titles held year by
			year, the family, and the scenes they walk through.
		</p>
		{@render shot(shots.wiki, 'Wiki. Filter the shelves, then open a card. Kingdom, era, story, and whether a portrait exists.')}
		{#if place}
			{@render live(place, 'A place, the first time the story stands there')}
		{/if}

		<p>
			<a href={resolve('/map')}>Map</a> is the peninsula on one sheet. The borders move with the
			years. Click a place and its wiki entry opens.
		</p>
		{@render shot(shots.map, 'Map. The peninsula, the year, and the painted boards of the places. Click a name.')}
		{#if map}
			{@render live(map, 'The same map, cropped into a chapter')}
		{/if}

		<p>
			<a href={resolve('/tree')}>Family tree</a> is Silla’s royal house, from Jijeung down to Sinmun,
			with the Gaya Kim line drawn in. Gold is Sacred Bone, blue is True Bone, purple is Gaya. The
			house view is the blood. The other view lays the same people out by year. Click a face.
		</p>
		{@render shot(shots.tree, 'Family tree. Gold, blue, and purple for the bones. House, or the years.')}

		<p>
			<a href={resolve('/timeline')}>Timeline</a> is every dated thing on one axis. One view stacks
			the episodes, so you can see which stories share a year. The other stacks the lives, so you
			can see who is alive in the same season, and who misses whom by a winter.
		</p>
		{@render shot(shots.timeline, 'Timeline. Episodes down the years, and the other stories running beside them.')}

		<p>
			<a href={resolve('/characters')}>Characters</a> draws the bonds as a graph. Drag it, filter it,
			and open any face into the wiki.
		</p>
		{@render shot(shots.characters, 'Characters. Faces joined by the bonds between them. Drag, filter, open.')}

		<p>
			<a href={resolve('/stage')}>3D</a> is the ground under particular scenes: Wolseong, Sabi,
			Pyongyang, Wirye, and the fortresses. Pick a site and a year and walk it.
		</p>
		{@render shot(shots.stage, '3D. A site on the right, the ground on the left, the year along the top.')}

		<h2>Pictures and sound</h2>
		<p>
			<a href={resolve('/images')}>Images</a> is every still in the chronicle, as a gallery. Search
			them. The ones marked with a star stay in their own pile.
		</p>
		{@render shot(shots.images, 'Images. The stills, searchable, with the starred ones kept apart.')}

		<p>
			<a href={resolve('/comic')}>Comic</a> tells a few of the stories as pages. The arrows turn
			them, and so do the arrow keys.
		</p>
		{@render shot(shots.comic, 'Comic. One story, page by page.')}

		<p>
			<a href={resolve('/music')}>Music</a> is the short themes: a kingdom, a person, a few bars,
			and the sheet beside the player.
		</p>
		{@render shot(shots.music, 'Music. A theme, its player, and the sheet.')}

		<p>
			<a href={resolve('/scenes')}>Scenes</a> sets the stills to those themes and plays them one
			after another.
		</p>
		{@render shot(shots.scenes, 'Scenes. A still, with its theme under it.')}

		<h2>Beside the book</h2>
		<p>
			<a href={resolve('/quotes')}>Quotes</a> keeps three kinds of line. The ones the book itself
			will not let go of. The ones copied from the historical record. And the ones you star while
			reading. A line remembers its episode, and will take you back.
		</p>
		{@render shot(shots.quotes, 'Quotes. Iconic lines, the record, and the sentences you star.')}
		{#if record}
			{@render live(record, 'A line from the record, on its own paper')}
		{/if}

		<p>
			<a href={resolve('/research')}>Research</a> is what the people wore, taken from the tombs, the
			murals and the dynastic histories: crowns, feather caps, gold, dress, armour. The pictures in
			the story are checked against this room.
		</p>
		{@render shot(shots.research, 'Research. Crowns, caps, dress and armour, from the objects that survive.')}

		<p>
			<a href={resolve('/about')}>About</a> is the note on why the story exists, and how the script,
			the cast, the pictures and the map were made. The foreword at the head of the book is the
			same note, said once, before the first episode.
		</p>

		<h2>The desk</h2>
		<p>
			<a href={resolve('/widgets')}>Widgets</a> collects every card, map and diagram that appears
			between the lines, so you can look at the pieces without reading toward them.
			<a href={resolve('/dashboard')}>Dashboard</a> ranks the episodes. <a href={resolve('/grade')}>Grade</a>
			is where a still is kept or cut. <a href={resolve('/directory')}>Directory</a> is the long
			index of the whole site. These are the workshop. The book does not need them.
		</p>
		{@render shot(shots.widgets, 'Widgets. Every card, map and diagram in the script, gathered by kind.')}
		{#if diagram}
			{@render live(diagram, 'A diagram, as it sits between the lines')}
		{/if}

		<p class="sign">Start at the hall, or open the book.</p>
	</article>
</main>

<style lang="scss">
	.guide {
		min-height: 100dvh;
		padding: 0 max(1.25rem, env(safe-area-inset-right, 0px) + 1rem) calc(4rem + var(--tabbar-space, 0px)) max(1.25rem, env(safe-area-inset-left, 0px) + 1rem);
		color: var(--fg);
	}

	.letter {
		max-width: 38rem;
		margin: 0 auto;
		padding: clamp(2.5rem, 8vh, 5rem) 0 3rem;
	}

	.kicker {
		margin: 0 0 0.4rem;
		font-family: var(--ui);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	h1 {
		margin: 0 0 1.8rem;
		font-family: var(--serif);
		font-size: clamp(2.2rem, 5vw, 3rem);
		font-weight: 400;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--fg-strong);
	}

	h2 {
		margin: 2.6rem 0 0.85rem;
		font-family: var(--serif);
		font-size: 1.35rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--fg-strong);
	}

	p {
		margin: 0 0 1.05rem;
		font-size: 1rem;
		font-weight: var(--weight-body);
		line-height: 1.65;
		color: var(--fg-dim);
	}

	em {
		font-style: italic;
		font-weight: 500;
		color: var(--fg);
	}

	a {
		font-weight: 500;
		color: var(--fg-strong);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.18em;
	}

	.mark {
		font-family: var(--ui);
		letter-spacing: 0.08em;
		color: var(--fg);
	}

	.shot {
		width: min(56rem, calc(100vw - 2.5rem));
		margin: 0.4rem 0 1.6rem;
		margin-left: 50%;
		transform: translateX(-50%);
		& img {
			display: block;
			width: 100%;
			height: auto;
			border: 1px solid var(--hairline);
			border-radius: 12px;
			background: var(--bg);
		}
	}

	.shot figcaption,
	.specimen-kicker {
		margin: 0.45rem 0 0;
		font-family: var(--ui);
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.45;
		letter-spacing: 0.01em;
		color: var(--fg-faint);
	}

	.specimen {
		margin: 0.2rem 0 1.7rem;
	}

	.specimen-stage.pending {
		min-height: 8rem;
	}

	.book {
		display: flex;
		justify-content: center;
		margin-top: 0.8rem;
		min-height: 16rem;
	}

	.sign {
		margin: 2.2rem 0 0;
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.1rem;
		color: var(--fg-strong);
	}
</style>
