<script lang="ts">
	import { resolve } from '$app/paths';
	import WikiPeek from '$lib/components/WikiPeek.svelte';

	const read = resolve('/read');
	const wiki = resolve('/wiki');
	const episodes = resolve('/episodes');
	const about = resolve('/about');
	const guide = resolve('/guide');
	const map = resolve('/map');
	const stories = resolve('/stories');
	const home = resolve('/');
	const namu = resolve('/namuwiki');
	const comic = resolve('/comic');
	const images = resolve('/images');
	const tree = resolve('/tree');
	const timeline = resolve('/parallel');
	const music = resolve('/music');
	const research = resolve('/research');
	const stage = resolve('/stage');
	const scenes = resolve('/scenes');

	function person(id: string) {
		return `${wiki}?id=${id}`;
	}

	type TocItem = { id: string; n: string; title: string; children?: { id: string; n: string; title: string }[] };

	const TOC: TocItem[] = [
		{
			id: 'background',
			n: '1',
			title: 'Background',
			children: [
				{ id: 'historical-setting', n: '1.1', title: 'Historical setting' },
				{ id: 'sources', n: '1.2', title: 'Sources' },
				{ id: 'inspiration', n: '1.3', title: 'Inspiration' }
			]
		},
		{
			id: 'composition',
			n: '2',
			title: 'Composition and form',
			children: [
				{ id: 'narrator', n: '2.1', title: 'Narrator' },
				{ id: 'language', n: '2.2', title: 'Language' },
				{ id: 'pictures-and-rooms', n: '2.3', title: 'Pictures and rooms' }
			]
		},
		{
			id: 'plot',
			n: '3',
			title: 'Plot summary',
			children: [
				{ id: 'prologue', n: '3.1', title: 'Prologue' },
				{ id: 'part-i', n: '3.2', title: 'Part I: Land of Samhan' },
				{ id: 'part-ii', n: '3.3', title: 'Part II: People of Samhan' },
				{ id: 'part-iii', n: '3.4', title: 'Part III: Unification of Samhan' }
			]
		},
		{
			id: 'record-and-invention',
			n: '4',
			title: 'Historical record and fiction',
			children: [
				{ id: 'annals', n: '4.1', title: 'What the annals keep' },
				{ id: 'departures', n: '4.2', title: 'Departures' },
				{ id: 'order-of-telling', n: '4.3', title: 'Order of telling' }
			]
		},
		{
			id: 'themes',
			n: '5',
			title: 'Themes',
			children: [
				{ id: 'king-for-all', n: '5.1', title: 'A king for all' },
				{ id: 'rooms-and-ranks', n: '5.2', title: 'Rooms and ranks' },
				{ id: 'myth-as-weather', n: '5.3', title: 'Myth as weather' }
			]
		},
		{
			id: 'characters',
			n: '6',
			title: 'Characters',
			children: [
				{ id: 'silla-cast', n: '6.1', title: 'Silla' },
				{ id: 'baekje-cast', n: '6.2', title: 'Baekje' },
				{ id: 'goguryeo-cast', n: '6.3', title: 'Goguryeo' },
				{ id: 'tang-cast', n: '6.4', title: 'Tang' },
				{ id: 'myth-cast', n: '6.5', title: 'Gods and the dead' }
			]
		},
		{ id: 'structure', n: '7', title: 'Structure' },
		{
			id: 'technology',
			n: '8',
			title: 'Technology and media',
			children: [
				{ id: 'media', n: '8.1', title: 'Forms of the work' },
				{ id: 'stack', n: '8.2', title: 'Software' }
			]
		},
		{
			id: 'reception',
			n: '9',
			title: 'Reception',
			children: [
				{ id: 'aims', n: '9.1', title: 'Aims' },
				{ id: 'critical', n: '9.2', title: 'Critical response' }
			]
		},
		{ id: 'impact', n: '10', title: 'Cultural impact' },
		{ id: 'gallery', n: '11', title: 'Gallery' },
		{ id: 'related', n: '12', title: 'Related works' },
		{ id: 'see-also', n: '13', title: 'See also' },
		{ id: 'references', n: '14', title: 'References' }
	];

	let tocOpen = $state(true);
	let query = $state('');
	/** Same side panel as the wiki and the map. A plain click opens it; a modified click follows the link. */
	let wikiId = $state<string | null>(null);
	let wikiExpanded = $state(false);

	function onContentClick(event: MouseEvent) {
		if (event.defaultPrevented || event.button !== 0) return;
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		const a = (event.target as Element | null)?.closest?.('a');
		if (!a || a.target === '_blank') return;
		let url: URL;
		try {
			url = new URL(a.href);
		} catch {
			return;
		}
		if (url.origin !== location.origin) return;
		if (url.pathname !== new URL(wiki, location.origin).pathname) return;
		const id = url.searchParams.get('id');
		if (!id) return;
		event.preventDefault();
		wikiId = id;
		wikiExpanded = false;
	}

	function closeWiki() {
		wikiId = null;
		wikiExpanded = false;
	}

	function watchNames(node: HTMLElement) {
		const fn = (event: MouseEvent) => onContentClick(event);
		node.addEventListener('click', fn);
		return () => node.removeEventListener('click', fn);
	}

	function onSearch(event: SubmitEvent) {
		event.preventDefault();
		const q = query.trim();
		const url = q ? `${wiki}?q=${encodeURIComponent(q)}` : wiki;
		window.location.assign(url);
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && wikiId) closeWiki();
	}}
/>

<svelte:head>
	<title>King for All — Wikipedia</title>
	<meta
		name="description"
		content="King for All (삼한왕검) is a bilingual interactive chronicle of Samhan by Heewon Ahn, set from mythic time through the unification wars of the seventh century."
	/>
</svelte:head>

<div class="vector-page">
	<a class="skip" href="#content">Jump to content</a>

	<header class="mw-header">
		<div class="mw-header-inner">
			<a class="mw-logo" href="#top">
				<span class="mw-logo-mark" aria-hidden="true">
					<svg viewBox="0 0 32 32" width="32" height="32">
						<circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" stroke-width="1.4" />
						<path
							d="M4 16h24M16 2c4 4.2 6 9 6 14s-2 9.8-6 14c-4-4.2-6-9-6-14s2-9.8 6-14z"
							fill="none"
							stroke="currentColor"
							stroke-width="1.1"
						/>
						<path d="M7 11h18M7 21h18" fill="none" stroke="currentColor" stroke-width="1" />
					</svg>
				</span>
				<span class="mw-wordmark">WIKIPEDIA</span>
			</a>

			<form class="mw-search" onsubmit={onSearch}>
				<label class="visually-hidden" for="wiki-search">Search the chronicle</label>
				<input id="wiki-search" name="q" bind:value={query} placeholder="Search King for All" autocomplete="off" />
				<button type="submit">Search</button>
			</form>

			<nav class="mw-personal" aria-label="Chronicle">
				<a href={home}>Home</a>
				<a href={read}>Read</a>
				<a href={wiki}>Wiki</a>
				<a href={map}>Map</a>
			</nav>
		</div>
	</header>

	<div class="mw-page-container">
		<nav class={['vector-toc', { 'is-hidden': !tocOpen }]} aria-label="Contents">
			<div class="vector-toc-head">
				<span>Contents</span>
				<button type="button" onclick={() => (tocOpen = !tocOpen)}>{tocOpen ? 'hide' : 'show'}</button>
			</div>
			{#if tocOpen}
				<ul>
					{#each TOC as item (item.id)}
						<li>
							<a href={`#${item.id}`}><span class="tocnumber">{item.n}</span> <span class="toctext">{item.title}</span></a>
							{#if item.children}
								<ul>
									{#each item.children as child (child.id)}
										<li>
											<a href={`#${child.id}`}
												><span class="tocnumber">{child.n}</span> <span class="toctext">{child.title}</span></a
											>
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</nav>

		<div class="mw-content-container">
			<article id="content" {@attach watchNames}>
				<h1 id="top">
					King for All
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h1>
				<div class="siteSub">From Wikipedia, the free encyclopedia</div>

				<p class="hatnote">
					This article is about the chronicle. For the sobriquet of King Munmu, see
					<a href="#king-for-all">§ A king for all</a>.
				</p>

				<table class="infobox">
					<tbody>
						<tr>
							<th colspan="2" class="infobox-title">King for All</th>
						</tr>
						<tr>
							<td colspan="2" class="infobox-image">
								<img src="/album_sunduk.png" alt="A crowned woman in red looks up into a blue shaft of light. The Korean title 삼한왕검 sits in the corner." />
								<div class="infobox-caption">
									Title image. <a href={person('sunduk')}>Queen Sunduk</a> under the Korean name of the work, 삼한왕검.
								</div>
							</td>
						</tr>
						<tr>
							<th scope="row">Author</th>
							<td>Heewon Ahn</td>
						</tr>
						<tr>
							<th scope="row">Original title</th>
							<td lang="ko">삼한왕검</td>
						</tr>
						<tr>
							<th scope="row">Language</th>
							<td>English and Korean, written together</td>
						</tr>
						<tr>
							<th scope="row">Subject</th>
							<td>Samhan; the Korean Three Kingdoms</td>
						</tr>
						<tr>
							<th scope="row">Genre</th>
							<td>Historical fiction; myth; political satire; webtoon</td>
						</tr>
						<tr>
							<th scope="row">Set in</th>
							<td>The Korean peninsula, Tamla, and the Tang court, from mythic time to 698</td>
						</tr>
						<tr>
							<th scope="row">Media type</th>
							<td>Interactive chronicle: script, comic, map, wiki, stills</td>
						</tr>
						<tr>
							<th scope="row">Episodes</th>
							<td>101, in 13 arcs and 3 parts</td>
						</tr>
						<tr>
							<td colspan="2" class="infobox-below">
								<a href={read}>Read the chronicle</a>
							</td>
						</tr>
					</tbody>
				</table>

				<table class="infobox infobox-subbox">
					<tbody>
						<tr>
							<th colspan="2" class="infobox-title">Korean name</th>
						</tr>
						<tr>
							<th scope="row">Hangul</th>
							<td lang="ko">삼한왕검</td>
						</tr>
						<tr>
							<th scope="row">Hanja</th>
							<td lang="zh">三韓王儉</td>
						</tr>
						<tr>
							<th scope="row">Revised Romanization</th>
							<td>Samhan wanggeom</td>
						</tr>
						<tr>
							<th scope="row">McCune–Reischauer</th>
							<td>Samhan wanggŏm</td>
						</tr>
					</tbody>
				</table>

				<p>
					<b><i>King for All</i></b> (<span lang="ko">삼한왕검</span>; <span lang="zh">三韓王儉</span>; revised romanization:
					<i>Samhan wanggeom</i>) is a bilingual interactive chronicle by Heewon Ahn. It is a work of historical fiction, myth
					and political satire set in <a href="#historical-setting">Samhan</a>, the Korean Three Kingdoms, from mythic time
					through the unification wars of the seventh century and the founding of Balhae in 698.<sup class="reference"
						><a href="#cite_note-about">[1]</a></sup
					>
					The political narrative runs from the accession of <a href={person('sunduk')}>Queen Seondeok</a> of Silla in 632 to
					the Silla–Tang settlement of the 670s. Founding myths, the traditions of
					<a href={person('nation-tamla')}>Tamla</a>, and the gods of the Three Realms are placed inside that span, usually as
					memory, an island story, or a night that is not assigned a year.<sup id="cite_ref-about" class="reference"
						><a href="#cite_note-about">[1]</a></sup
					>
				</p>
				<p>
					Ahn began the work as a webcomic. It is published as a bilingual script with the pictures set in the episodes, and
					the same text is also offered as a <a href={comic}>comic</a>, a <a href={wiki}>wiki</a> of people, places, clans and
					objects, painted stills, a <a href={map}>map</a> whose borders change by year, and the Silla royal
					<a href={tree}>tree</a>.<sup class="reference"><a href="#cite_note-about">[1]</a></sup>
					<sup id="cite_ref-guide" class="reference"><a href="#cite_note-guide">[2]</a></sup> Ahn names the 2009 television
					series <i>Queen Seondeok</i> as the point of departure, and political satire as a standing concern: each kingdom’s
					social system, and the deaths that system makes appear necessary.<sup class="reference"
						><a href="#cite_note-about">[1]</a></sup
					>
				</p>
				<p>
					The English title is a line given to <a href={person('munmu')}>Kim Beopmin</a>, later King Munmu of Silla: a king for
					everyone, rather than a king for Sacred Bone or True Bone. The Korean title applies the old royal name
					<i>wanggeom</i> to the same claim, a king of all Samhan. The script contains 101 episodes in 13 arcs and three parts.
					A sequel outline, <i>The God King</i> (<span lang="ko">후삼제왕</span>), continues into the Later Three Kingdoms,
					828–943.<sup id="cite_ref-stories" class="reference"><a href="#cite_note-stories">[3]</a></sup>
				</p>

				<div class="toc-mobile">
					<div class="toc-mobile-title">Contents</div>
					<ol>
						{#each TOC as item (item.id)}
							<li>
								<a href={`#${item.id}`}>{item.title}</a>
								{#if item.children}
									<ol>
										{#each item.children as child (child.id)}
											<li><a href={`#${child.id}`}>{child.title}</a></li>
										{/each}
									</ol>
								{/if}
							</li>
						{/each}
					</ol>
				</div>

				<h2 id="background">
					Background
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<h3 id="historical-setting">
					Historical setting
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					By the 630s the Korean peninsula is three kingdoms and a string of smaller roofs. <b>Silla</b>, with its capital at
					Surabol, ranks people by bone: Sacred Bone may wear the crown, True Bone may rise, and everyone else stops at a
					ceiling the law will not discuss. <b>Baekje</b>, at Sabi, is run by eight great clans who treat the king as a story
					they can still edit. <b>Goguryeo</b>, which the chronicle often still calls Goryeo, holds the north from Pyongyang and
					is about to be taken in hand by the Yeon house. Off the south coast, <b>Tamla</b> keeps its own princes and its own
					myths. West of all of them, the <b>Tang</b> emperor is running out of countries.
				</p>
				<p>
					The chronicle opens on that late hour and then walks backward whenever a grudge, a stele, or a ghost needs a cause.
					<a href={person('jinheung')}>King Jinhung</a>’s stones, <a href={person('gwanggaeto')}>King Gwanggaeto</a>’s stele,
					the fall of <a href={person('gaero')}>King Gaero</a>, and the founding generations of Jumong, Onjo, Suro and Hyukgose
					are not a separate history book. They are told when someone in 641 still has to live with them.
				</p>

				<h3 id="sources">
					Sources
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					The spine is the Korean historical record, above all Kim Busik’s <i>Samguk sagi</i> (1145) and the later
					<i>Samguk yusa</i>, with the <i>Nihon shoki</i> for the Yamato fleets and Tang material for the western court.<sup
						id="cite_ref-sagi"
						class="reference"><a href="#cite_note-sagi">[4]</a></sup
					>
					Annals, steles and letters appear in the episodes as their own papers, set apart from the narration, and are left in
					the wording of the record.<sup class="reference"><a href="#cite_note-guide">[2]</a></sup> What the records do not give
					— a private name, an invented year, a motive, a conversation in a yard — is the chronicle’s, and the work’s own guide
					treats that split as something a reader should be able to see.
				</p>
				<p>
					The same rule governs myth. Eggs, heavenly horses, the underworld and the Tamla tales are painted and told as myth.
					The history around them stays in the chronicle’s ordinary register. Hyukgose’s egg is a myth; the six chiefs crowning
					the boy is a scene. A tale told on Tamla at night is a myth; the morning after, with Gyebek still on the island, is
					not.
				</p>

				<h3 id="inspiration">
					Inspiration
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					Heewon describes the work as begun from the 2009 series <i>Queen Seondeok</i> (<i>Seondeok yeowang</i>), and as a
					webcomic that the text overtook.<sup class="reference"><a href="#cite_note-about">[1]</a></sup> The television series
					is a palace drama of Sunduk’s reign. <i>King for All</i> keeps that court and then refuses to stay in it. Baekje’s
					clans, Goguryeo’s commanders, the Tang invasion, and the gods are not background for one queen. They are the other
					rooms of the same century. The author states the wager directly: an international reader should be able to enter
					without a prior course in the period, and the absurdities of each kingdom’s system should be felt as the cause of
					events, not as scenery.<sup class="reference"><a href="#cite_note-about">[1]</a></sup>
				</p>

				<h2 id="composition">
					Composition and form
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<p>
					The script is one file of scenes: narration, dialogue, day-headers, flashbacks, quoted records, and the cards, maps
					and diagrams that sit in the page.<sup class="reference"><a href="#cite_note-about">[1]</a></sup> Episodes are grouped
					Part, then Arc, then Chapter, then Episode. Three parts carry titles: <b>Land of Samhan</b> (<span lang="ko">삼한산천</span>),
					<b>People of Samhan</b> (<span lang="ko">삼한공신</span>), and <b>Unification of Samhan</b> (<span lang="ko">삼한일통</span>).
					A prologue stands before the first part. Each part ends on an epilogue that leaves the peninsula’s courts for a
					moment: the Tang court, the gods’ summit, and the first winter of Balhae.
				</p>
				<p>
					A reader can take the book as a script, as a comic, or as a court feed. Dialogue can sit as a play, in balloons, or
					as posts. English and Korean are one switch for the whole site. Full scroll is the chronicle in a sitting; Episodes
					hands over one chapter at a time.<sup class="reference"><a href="#cite_note-guide">[2]</a></sup>
				</p>

				<h3 id="narrator">
					Narrator
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					The narration is a third person who already knows how the lives end, and who talks to the reader as if the two of
					them were watching a court they have both seen before. He has favourites. He teases a death without spending it. He
					speaks of heaven and the gods as family gossip, never as a scripture he has to gloss. The chronicle does not name
					him, and he does not name himself.<sup class="reference"><a href="#cite_note-about">[1]</a></sup> Mouths do not do his
					job. People talk to each other; the narrator keeps the business a scene needs and the one aside he is allowed.
				</p>

				<h3 id="language">
					Language
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					Every narrative block and every speech is written in English and in Korean. The Korean is written to be said, in the
					speech level that person would actually use: banmal between sisters and old friends, a stiffer register in a Silla
					hall, a Tang court that stays formal. It is not a calque of the English line.<sup class="reference"
						><a href="#cite_note-about">[1]</a></sup
					>
					When English has two words for one idea, the speaker’s kingdom picks. Goguryeo keeps the older stock (oath, hearth,
					yield). Baekje reaches for the Greek-rooted word and will not flatter living Tang. Silla, which has decided to learn
					the new high culture, takes the Latinate twin. A person’s own voice can override the kingdom. Mortal speakers do not
					cite AD years. They count winters, reigns, and “since Daeya fell.”
				</p>

				<h3 id="pictures-and-rooms">
					Pictures and rooms
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<figure class="thumb tright">
					<img src="/album_yushin.png" alt="A dark rider on a rearing horse, sword out, set against a full moon and a starfield. The Korean title sits in the corner." />
					<figcaption>
						<a href={person('yushin')}>Kim Yushin</a> in the chronicle’s portrait set. The same face, horse and blade are held
						to a visual canon so a man does not change clothes between episodes.
					</figcaption>
				</figure>
				<p>
					Stills are painted in one house look: webtoon figures, a watercolour-and-oil world, a Romantic layout, and film
					lighting. Faces come from the portraits in the wiki. A visual canon fixes dress, horse, sword and armour by year.
					Myths are ink on bare paper. Battles are painted frames with the kingdoms’ own ships and banners. Close fights use
					manga angles.<sup class="reference"><a href="#cite_note-about">[1]</a></sup>
				</p>
				<p>
					The map is one map. Borders are drawn site by site and year by year, so a kingdom swells and shrinks as the reader
					moves. The wiki holds the cast and the set: every person, place, clan, sword and horse, with the portrait, title and
					career for the year the scene is in. Cards in the script follow. A prince who becomes a king keeps the face and
					changes the name.<sup class="reference"><a href="#cite_note-guide">[2]</a></sup>
				</p>

				<h2 id="plot">
					Plot summary
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<p>
					What follows is the spine of the chronicle and the best-known turns. Episodes often leave their year. A founding, a
					lost war, or a myth is told when the later scene needs it, then the book returns to the room it left.
				</p>

				<h3 id="prologue">
					Prologue
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					“Back When Tigers Smoked” opens before any kingdom. The world does not yet know how to make a soul. The Sky Princess
					finds the Life Flower. Heaven–Earth King names her, and names the sea’s daughter against her. The prologue closes on
					the title itself: the story of crowning a leader who can bring people out of the dark, and then, in both languages,
					<b>the King for All</b>.
				</p>

				<h3 id="part-i">
					Part I: Land of Samhan
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					<b>The Three Kingdoms</b> (632–642) starts in Surabol with a sentence the court thinks is a joke. A queen. Sunduk
					takes the crown, and the Harmony Council — six nobles, one brazier, nobody standing until they all agree — has to
					live with her. Four winters later two old hwarang are sent west to Jade Gate Valley, a place with a polite name and a
					war behind it. The book then shows the older Silla that made this court: Jinhung, the Cloud King, whose stones
					Surabol likes to talk about and Sabi would rather not.
				</p>
				<p>
					Baekje is introduced through the man who is late to his own future. At thirty-two
					<a href={person('euija')}>Prince Euija</a> is only now named crown prince, after the clans have spent years deciding
					which of his sons they own. The eight great clans are listed like a roll call — Satek, Yunbi, Jinmo, Mokli, Hae, Bek,
					Guk, Ahn — and the Deer Rock Council shows how a sealed box and a night on the rock still leave eight houses free to
					help heaven decide. A flash of <a href={person('gyeonggeunchogo')}>King Gunchogo</a> riding north, and of
					<a href={person('gogugwon')}>King Gogugwon</a> meeting him, ends on a stray arrow. The north, in the same years, is
					already telling bedtime stories about <a href={person('gesomun')}>Commander Yeon</a> that are not for bed. Five tribes,
					a wife seven months gone, and a High Summit where five commanders and one king can hear his hooves before he sits.
					<a href={person('gwanggaeto')}>King Gwanggaeto</a>’s stele is allowed its sixty-four fortresses, and then the thing
					the stone does not list.
				</p>
				<figure class="thumb tleft">
					<img
						src="/album_jumong.png"
						alt="A young man in a red headband smiles with tears on his face, a bowstring crossing the foreground. The Korean title sits in the corner."
					/>
					<figcaption>
						<a href={person('jumong')}>Jumong</a>, told later, inside the Goguryeo–Tang war: the exile who grins, and the bow
						the chronicle treats as his real weapon.
					</figcaption>
				</figure>
				<p>
					<b>The Five Precepts</b> (641, with long memories) is the generation that will have to finish the century.
					<a href={person('munmu')}>Bupmin</a> is fifteen, old enough for the hwarang headband and too young to invent a
					country alone. <a href={person('sadaham')}>Sadaham</a> is already a ghost the yard still calls to roll. Gotaso, “a
					young girl who is going to do what she’s going to do,” and Munhee, whose story starts when a dream is sold, set the
					Kim house’s private weather. Momal is the hall’s word for a job the boats actually did. Euija, now styled in advance
					as righteous and merciful, has a sense of humour about the style. Under him sit the older Baekje wounds: King Seong
					and a betrayal that does not come from enemies, Gaero and the head Goguryeo waited a hundred years to take, Yunchung
					as the one man Euija trusts to deliver, and Yeon Namseng as one of three sons who could not be less alike and who
					have only one seal. Ulbul, a salt seller, is the first king in a cave.
				</p>
				<p>
					<b>Iron Will</b> (642) is the year the systems spend what they have been saving. In Silla, bone decides how high
					<a href={person('gumil')}>Gumil</a> can climb, and he has climbed exactly that high. Maehwa pours wine at a banquet.
					Jukjuk is asked for the story, not whether she is hurt. The revolt is a summer of bowing that turns into a banquet
					the king is coming to. To keep Silla alive, <a href={person('chunchu')}>Chunchu</a> walks into Pyongyang and asks the
					most dangerous man in Samhan for a favour. Yeon and the king of Baekje sit one table and swear. A earlier campaign
					shows why the name Kim Yushin already empties a road. In Baekje’s markets they spit <a href={person('gyebek')}>Gyebek</a>’s
					title and add, quietly, that he has not met the man yet. The part’s last beat of the year is the same star, the same
					minute, in three places.
				</p>
				<p>
					The epilogue leaves the peninsula. In 643, far west, a man who owns half the world hears a new name and turns it on
					his tongue like a grape he has not decided to eat. The four dragons of that court are the Tang answer already forming.
				</p>

				<h3 id="part-ii">
					Part II: People of Samhan
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					<b>The Goguryeo–Tang War</b> (643–645) gives that emperor his titles — Heaven-Sent General, Khan of Heaven — and the
					problem that he is running out of countries. Goguryeo has spent fourteen years on a wall. At Yodong the blue dragon
					walks around it. A flash of King Dongcheon shows an older king picking a fight, then a battlefield he has not looked
					at. At Stallion Mountain a farmer in a white coat walks onto the field as a name on a muster roll, with the emperor
					watching. Ansi dances all night, follows a man with a lazy eye, and answers to no one, until the emperor is at the
					gate. The Sui disaster is told through <a href={person('munduk')}>Eulji Mundeok</a>, who surrenders seven times on the
					way south while the river gets closer. Only then does the book tell where this north came from:
					<a href={person('haemosu')}>Haemosu</a> looks down from the sun’s road, and <a href={person('jumong')}>Jumong</a> is
					still wet from the river when the spears find him. Hodong and the self-sounding drum close the founding on a princess
					who cuts the drum for a boy.
				</p>
				<p>
					<b>The Chunchu Era</b> (643–654) returns to Surabol and does not stay there.
					<a href={person('bidam')}>Bidam</a> takes the Council’s first chair and keeps his hand down alone against the queen’s
					cousin. The queen falls. The gate shuts. Between that and the next reign the book tells
					<a href={person('suro')}>Suro</a> and the sky god who looked at a ridge too long, then five nights of tea between
					camps, with the score still tied, until Bidam asks the question Yushin has never answered in Surabol. Muryuk is the
					Gaya prince whose father promised him everything the sun touches, and then Silla came shopping. The cavern throws
					Bidam out. A white horse burns for a falling star. Yushin leaves the gate. Seohyeon, on a road before there is a
					Yushin, is the father who should have been looking where he was going. Three Gaya men wait in the steam. The gate
					opens from the inside.
				</p>
				<p>
					<a href={person('jinduk')}>Queen Jinduk</a> wears a crown made for her cousin and padded at the temples. Chunchu goes
					to <a href={person('taizong')}>Li Shimin</a> with an offer, in a city where everyone else brings tribute. One seal and
					one speed become the Royal Secretariat, and fewer uncles. Bihyung is the capital’s mad prince, and very good at it.
					Kim Yongsu is the strange boy nobody kills. In 654 the crown that has sat on the queen for seven years is moved; the
					work has been sitting on her nephew’s table, and Chunchu becomes King Muyeol. Away from that table,
					<a href={person('jayi')}>Jahee</a> has already decided a prince’s arithmetic is sloppy. The quay does not care that
					he is a prince.
				</p>
				<p>
					<b>Haedong Jeungja</b> (655–660) is Euija’s reign under the name the court likes, the Zengzi of the East. Queen Satek
					dies, and the king loses the right to say no. Two years later he takes the chairs back. Lady Eungo’s eight grudges
					and forty-one sons are loyalties he created by decree. The fall announces itself in omens that are real because
					people saw them, which the chronicle treats as the only sense that mattered. Onjo’s founding — a boy with a sling,
					and a father’s hall that never mentions Buyeo — is told here, as Baekje’s beginning inside Baekje’s end. Seongchung
					asked for one word and got a wine jar. Heungsu is sent for because he was sent away for being right.
					<a href={person('gyebek')}>Gyebek</a> comes off a boat without counting. The country he swore to is already eating
					itself.
				</p>
				<p>
					The part’s epilogue leaves the year entirely. <b>Three Realms</b> is Kangrim’s first summit: three rivers, a pavilion
					past any calendar, and a question he should not ask.
				</p>

				<h3 id="part-iii">
					Part III: Unification of Samhan
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<figure class="thumb tright">
					<img
						src="/album_gyebek.png"
						alt="An armoured man kneels with his back to the viewer, a straight sword planted in the dirt, a red cloak, and a pale ink circle behind him."
					/>
					<figcaption>
						<a href={person('gyebek')}>Gyebek</a> before the sword. The Yellow Mountain campaign is told after he has already
						woken on Tamla, and after the island has told him its myths.
					</figcaption>
				</figure>
				<p>
					<b>The Fall of Baekje</b> (660–662) begins on a beach. <a href={person('yuridora')}>Yuri Dora</a>’s island has a man
					in the sand who does not know where he is. Before Hwangsan is fought on the page, Tamla tells its shelf of myths:
					Heaven–Earth King and the two suns, the Goddess Supreme and the two daughters who want the seat of life, the gardener
					who wins it, Kangrim sent down alive to arrest the judge of the dead, three princes climbing out of a hole, and
					Sanbangdeok coming out of the rock. Then the field. Five thousand men against an empire and a kingdom, and Gyebek has
					already done the arithmetic. In the western capital a confession is already written, with a space at the bottom for
					Euija’s name. Chunchu, the man who arranged it, is fifty-eight and cannot get out of bed. Baekje is finished, says
					everyone except Baekje. <a href={person('pung')}>Prince Pung</a> has lived across the sea for twenty years. Echi comes
					in white to mend a net the West has thrown over the country. Pyongyang is a red gate on a grey ridge. At Snake River
					in 662 the White Tiger still believes rivers are roads, and Yeon has been waiting for a man who thinks that.
				</p>
				<p>
					<b>The Fall of Goguryeo</b> (662–668) opens with nineteen generals named for a campaign, two of whom call in sick and
					are seen at a match. <a href={person('boksin')}>Gwisil Boksin</a>, the general who crowned Baekje’s last king, is sick
					in bed and asking for a visit; the king remembers another supper. At the White River in 663 the West, Samhan and the
					East meet in one mouth of water, and the tide is nobody’s friend. In 665 the Eternal General is dying. Three brothers
					and one seal follow: Namgeon, then Namsan, and when the ring closes on the city they pick a monk, the man nobody can
					buy.
				</p>
				<p>
					<b>The Silla–Tang War</b> (670–676, opening into Silla’s own myths) is the alliance eating the ally. Before the
					battles, the book tells how Silla began: <a href={person('hyukgose')}>Park Hyukgose</a> and the white horse by the
					well, Talhae in a chest on the tide, Alji and a rooster crowing at night, and two small kings who ask a third to
					count a strip of dirt. <a href={person('xuerengui')}>Xue Rengui</a> would like to win the war by post. The king does not go
					to bed. Go Anseung stands under a Goguryeo flag that Gum Mojam raised; they disagree about dying, and only one of
					them sees the morning. Silla wins the morning at Stone Gate and then chases, which costs the year.
					<a href={person('wonsul')}>Wonsul</a> comes home alive. His father asks the king to execute him, and the king answers
					with something he said at fifteen. Old Yushin still finds the cavern. The three in the steam look the age they always
					looked. Dangun is told here, before there are any kingdoms: a son in heaven who keeps looking down. The day after his
					uncle’s funeral, Munmu brings one question into the steam, and fifteen generations come to answer it. Xue Rengui
					returns by sea at Maeso, guided by a Silla boy whose father the king killed. At Gibulpo, the river mouth where the
					West landed sixteen years earlier, a captain who has never won anything loses twice on purpose.
				</p>
				<p>
					<b>King of Samhan</b> is the morning Munmu becomes king of all Samhan and opens the hall to the yard. Five summers
					later, Kangrim asks him the question. The last epilogue is Balhae, in 698: the winter after Pyongyang falls, an old
					man carries a piece of a crown through the snow.
				</p>

				<h2 id="record-and-invention">
					Historical record and fiction
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<p>
					The chronicle treats the annals and the novel as different kinds of sentence. A coronation, a campaign, or a quoted
					edict may sit next to a conversation no clerk wrote down. Where they part, the work’s own guide is written to say so:
					what the sources give, what this telling adds, and one line on the difference.<sup class="reference"
						><a href="#cite_note-guide">[2]</a></sup
					>
					The Qing historian Zhang Xuecheng’s ratio for <i>Romance of the Three Kingdoms</i> — seven parts fact and three parts
					fiction — is cited in the work only as a warning. <i>King for All</i> does not offer a ratio. It keeps the seam
					visible.<sup class="reference"><a href="#cite_note-sagi">[4]</a></sup>
				</p>

				<h3 id="annals">
					What the annals keep
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					The political spine is the one in Kim Busik’s <i>Samguk sagi</i> (1145). Queen Seondeok succeeds in 632. Yeon
					Gaesomun takes the Goguryeo court in 642. Gyebaek dies at Hwangsanbeol in 660 with a force the annals number at five
					thousand. Baekje falls the same year, Goguryeo in 668, and Silla spends the next years pushing Tang back to the
					Liaodong. Quoted edicts, steles and letters are left in the wording of the record and set on their own paper, apart
					from the narration.<sup class="reference"><a href="#cite_note-sagi">[4]</a></sup>
					<sup class="reference"><a href="#cite_note-guide">[2]</a></sup>
					Myth and biography draw on <i>Samguk yusa</i>. The Yamato fleets draw on the <i>Nihon shoki</i>.
				</p>

				<h3 id="departures">
					Departures
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					What the records do not give — a private name, a motive, a talk in a yard — is the chronicle’s. Invented years are
					marked as invented on the people they belong to. The table is not a complete list. It is the departures a reader is
					most likely to mistake for the annal.
				</p>
				<table class="wikitable">
					<thead>
						<tr>
							<th>Matter</th>
							<th>In the record</th>
							<th>In the chronicle</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Queen Seondeok, 632</td>
							<td>The <i>Samguk sagi</i> records her accession after King Jinpyeong.</td>
							<td>The opening court treats a queen as a joke it then has to live with.</td>
						</tr>
						<tr>
							<td>Gyebaek at Hwangsanbeol, 660</td>
							<td>The annals give him five thousand men and his death on the field.</td>
							<td>
								The battle is told after an exile on <a href={person('nation-tamla')}>Tamla</a>, and after the island has
								told him its myths.
							</td>
						</tr>
						<tr>
							<td><a href={person('gumilwife')}>Maehwa</a></td>
							<td>The histories do not give her a name.</td>
							<td>
								She is named. The fall of Daeya, and much that follows from it, is staged through her.
							</td>
						</tr>
						<tr>
							<td>Gyebek’s brother</td>
							<td>No such name in the annals.</td>
							<td>Called Aso in this telling. The eastern roof he takes keeps the river’s own name.</td>
						</tr>
						<tr>
							<td>“A king for all”</td>
							<td>Munmu’s reign, the war, and the expulsion of Tang are historical.</td>
							<td>
								The sentence is the chronicle’s. <a href={person('munmu')}>Beopmin</a> says it as a boy in 632 and is still
								answerable for it when the hall is his.
							</td>
						</tr>
						<tr>
							<td>Founding myths</td>
							<td>Chiefly <i>Samguk yusa</i>: Jumong, Hyukgose, Suro, Dangun, Onjo.</td>
							<td>Told when a later scene needs them, and painted as ink. The history around the myth stays in the ordinary register.</td>
						</tr>
						<tr>
							<td><a href={person('kangrim')}>Kangrim</a></td>
							<td>Not an annal figure.</td>
							<td>A psychopomp. At each great death he asks one question, and the wording does not change.</td>
						</tr>
						<tr>
							<td>The narrator</td>
							<td>No such person.</td>
							<td>Unnamed. He speaks of heaven as family gossip and never says who he is.</td>
						</tr>
					</tbody>
				</table>

				<h3 id="order-of-telling">
					Order of telling
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					Founding myths are withheld until their own episodes. An earlier scene may swear by a bow, a well, or “Buyeo blood”
					without stopping to teach the genealogy. Reputations are built in other people’s fear — a rider who does not finish
					his rice, a pursuit that breaks when a name is shouted — rather than in a narrator’s introduction. The same event is
					not told three times, as narration, as a speech, and as a quotation. If the scene has already done the work, the
					annal is not asked to do it again.
				</p>

				<h2 id="themes">
					Themes
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<h3 id="king-for-all">
					A king for all
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<blockquote>
					<p>I want to be the king for all. Not a king for Sacred Bone. Not a king for True Bone. For all.</p>
				</blockquote>
				<p>
					Bupmin says it as a child, in 632, and the chronicle lets him keep the sentence until he is Munmu and the hall is
					actually his. He is written as the person who means what he says: earnest, plain, brave before he is wise, clumsy
					with Jahee and straight with everyone else. He does not bend the age the way Chunchu, Yeon or Euija do. He watches a
					sister fail to come home, watches a father invent a country, learns the war from the wrong end of the map, and
					finishes a sentence he stole as a boy. The desire is a kingdom that includes the quay. The wound is an empty seat.
				</p>
				<p>
					Chunchu’s version of the same century is the other half of the theme. He is barred from the throne by bone, grandson
					of a deposed king, and for years the cleverest man in rooms he is not allowed to rule. The west, as he argues for it,
					is a method — seal, speed, a secretariat — and not a costume. His limit is that he does not know what the capital
					looks like from Daeya until Daeya kills his daughter. Wit becomes patience. He takes the throne. He also leaves his
					son a half-won war and an alliance that wants the peninsula as furniture. Munmu’s work, in the last part, is to walk
					that road to the end and then expel the west his father invited.
				</p>

				<h3 id="rooms-and-ranks">
					Rooms and ranks
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					The author’s note calls the satire the point: every character is a product of their rooms.<sup class="reference"
						><a href="#cite_note-about">[1]</a></sup
					>
					Silla’s bone rank, Baekje’s eight clans, Goguryeo’s five tribes, and Tang’s appetite for a map with no outside are
					not lectures. They are the reason a banquet becomes a revolt, a sealed box becomes a council, and a man sent away for
					being right is the man a falling king has to send for. Euija is the one voice the book allows to say the idea in the
					open, because he is the king who will lose to it: a country is a territory governed by a single story. He breeds sons
					until the clans each own one, purges the houses, seals the palace, and then discovers the story was never only his.
				</p>
				<p>
					Smaller rooms do the same work without a speech. Gumil has climbed as high as his bone allows, and the book is
					interested in what a man does at a ceiling. Maehwa is poor enough that the record would not have kept her name. Jahee
					corrects a prince’s margins and later sits as queen still treating the realm as a tide table. Wonsul survives a
					battle and is asked to die for the surviving, because his father’s idea of a house is stricter than the king’s.
				</p>

				<h3 id="myth-as-weather">
					Myth as weather
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					The author’s phrase is that history is the spine and myth is the weather.<sup class="reference"
						><a href="#cite_note-about">[1]</a></sup
					>
					Gods are not a prologue the politics then forgets. Haemosu stops the chariot once, and Jumong is the consequence.
					The cavern goddesses sit under Surabol through the whole Silla century: they pronounce, they want, they drive Bidam
					out, and they are still there when Yushin is old and when Munmu brings his question. Kangrim, who walks the living
					into the land of the dead, asks one question at the great deaths. It is a ritual, not an interview, and the book does
					not vary it away. Tamla’s myths are told to a Baekje general who has already lost, which is a different use of a
					creation story than telling it at the beginning so the reader will feel oriented.
				</p>

				<h2 id="characters">
					Characters
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<figure class="thumb tright">
					<img src="/album_chunchu.png" alt="A man in dark court dress stands in a wedge of light, one hand raised, the rest of the hall in shadow." />
					<figcaption>
						<a href={person('chunchu')}>Kim Chunchu</a>, later King Muyeol. Barred from the throne by bone, he is the chronicle’s
						case for a method: a seal, a speed, and a secretariat.
					</figcaption>
				</figure>
				<p>
					The cast is large. A career in the wiki changes by year: a prince becomes a king, keeps the face, and takes a new
					name. The groupings below follow the courts the three parts return to. Names are the chronicle’s. Where the historical
					spelling differs, it is given in parentheses. A name opens that person’s article in the side panel.
				</p>
				<h3 id="silla-cast">
					Silla
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					<a href={person('sunduk')}>Queen Seondeok</a> is the door. The court that crowns her does not believe a queen is a
					serious sentence, and then has to govern under her.
					<a href={person('chunchu')}>Kim Chunchu</a> spends years as the cleverest man in rooms he is not allowed to rule, makes
					the Tang alliance, and dies before its bill arrives.
					<a href={person('yushin')}>Kim Yushin</a> is the marshal: Confucian, not a temple man, and a name that breaks a pursuit
					before the horse is in sight.
					<a href={person('munmu')}>Kim Beopmin</a>, later King Munmu, says the title line as a boy and is the king who has to
					make it true, including against the alliance his father invited.
					<a href={person('bidam')}>Bidam</a> keeps his hand down in the council. He is written as a Buddhist and as a man of
					this soil. <a href={person('munhee')}>Munhee</a> and <a href={person('jayi')}>Jahee</a> keep the private half of the
					Kim house: one a dream sold and a household held, the other a quay, a margin, and later the realm’s books.
				</p>
				<h3 id="baekje-cast">
					Baekje
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					<a href={person('euija')}>King Uija</a> is a late heir who comes to believe a country is a territory governed by a
					single story, and who writes one his eight clans cannot survive.
					<a href={person('gyebek')}>Gyebaek</a> holds the sword the other way around. His five thousand at the Yellow Mountain
					are told after Tamla has already told him its myths.
					<a href={person('gumilwife')}>Maehwa</a> is the chronicle’s name for a woman the histories leave unnamed. The fall of
					Daeya runs through her.
				</p>
				<h3 id="goguryeo-cast">
					Goguryeo
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					<a href={person('gesomun')}>Yeon Gaesomun</a> is the Eternal General: crude, quoting only his own kings, with three
					sons and one seal. <a href={person('jumong')}>Jumong</a> and <a href={person('haemosu')}>Haemosu</a> are not an
					overture. They are told inside the Tang war, the egg and the river and the sun who stops once.
				</p>
				<h3 id="tang-cast">
					Tang
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					<a href={person('taizong')}>Emperor Taizong</a> hears a new name in 643 and is at Ansi in 645. He is the alliance
					Chunchu thinks he can use. <a href={person('xuerengui')}>Xue Rengui</a> would prefer to win the last war by letter.
					The peninsula keeps requiring him in person.
				</p>
				<h3 id="myth-cast">
					Gods and the dead
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					<a href={person('kangrim')}>Kangrim</a> walks the living into the land of the dead and asks one question at the end of
					a great life. The cavern goddesses sit under Seorabeol for the whole Silla century. Dangun, Hyukgose, Suro and the
					Tamla myths are told when the later story needs a cause, not as a prologue the politics then forgets.
				</p>
				<table class="wikitable">
					<thead>
						<tr>
							<th>Person</th>
							<th>Side</th>
							<th>Place in the chronicle</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><a href={person('sunduk')}>Queen Sunduk</a> (Seondeok)</td>
							<td>Silla</td>
							<td>The queen the opening court finds ridiculous. Her reign is the door into the century.</td>
						</tr>
						<tr>
							<td><a href={person('chunchu')}>Kim Chunchu</a>, later King Muyeol</td>
							<td>Silla</td>
							<td>Barred by bone, then the man who makes the Tang alliance and does not live to see what it costs.</td>
						</tr>
						<tr>
							<td><a href={person('yushin')}>Kim Yushin</a></td>
							<td>Silla</td>
							<td>Marshal. Confucian, not a temple man. The name that breaks a pursuit before the horse arrives.</td>
						</tr>
						<tr>
							<td><a href={person('munmu')}>Kim Bupmin</a>, later King Munmu</td>
							<td>Silla</td>
							<td>The king for all. He inherits the war and the alliance, and he is the one who ends both.</td>
						</tr>
						<tr>
							<td><a href={person('bidam')}>Bidam</a></td>
							<td>Silla</td>
							<td>High councillor, hwarang, and the man who keeps his hand down. Buddhist, and of this soil.</td>
						</tr>
						<tr>
							<td><a href={person('munhee')}>Munhee</a> and <a href={person('jayi')}>Jahee</a></td>
							<td>Silla</td>
							<td>One sells a dream and keeps a house; the other meets a prince at a quay and later keeps the realm’s books with him.</td>
						</tr>
						<tr>
							<td><a href={person('euija')}>King Euija</a> (Uija)</td>
							<td>Baekje</td>
							<td>Late heir, then the king who believes a country is a story and writes one his clans cannot survive.</td>
						</tr>
						<tr>
							<td><a href={person('gyebek')}>Gyebek</a> (Gyebaek)</td>
							<td>Baekje</td>
							<td>Holds the sword the other way. Five thousand at the Yellow Mountain, after Tamla has already told him the myths.</td>
						</tr>
						<tr>
							<td><a href={person('gesomun')}>Yeon Gesomun</a></td>
							<td>Goguryeo</td>
							<td>The Eternal General. Crude, and he quotes only his own kings. Three sons, one seal.</td>
						</tr>
						<tr>
							<td><a href={person('jumong')}>Jumong</a> and <a href={person('haemosu')}>Haemosu</a></td>
							<td>Goguryeo, and before it</td>
							<td>The egg, the river, and the sun who stops once. Told inside the Tang war, not before it.</td>
						</tr>
						<tr>
							<td><a href={person('taizong')}>Emperor Taizong</a> (Li Shimin)</td>
							<td>Tang</td>
							<td>Hears a name in 643, walks around a wall in 645, and is the alliance Chunchu thinks he can use.</td>
						</tr>
						<tr>
							<td><a href={person('xuerengui')}>Xue Rengui</a></td>
							<td>Tang</td>
							<td>Would like to win the last war by post. The peninsula keeps making him come in person.</td>
						</tr>
						<tr>
							<td><a href={person('kangrim')}>Kangrim</a></td>
							<td>The dead</td>
							<td>Walks people in, and asks the same question at the end of a great life.</td>
						</tr>
					</tbody>
				</table>

				<h2 id="structure">
					Structure
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<p>
					Counts below are episodes present in the script, including the prologue and the three epilogues. A flashback keeps
					the year it remembers; the arc that contains it keeps the year the reader is in.
				</p>
				<table class="wikitable">
					<thead>
						<tr>
							<th>Part</th>
							<th>Arc</th>
							<th>Years</th>
							<th>Episodes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td rowspan="5">Before, and Part I<br /><span lang="ko">삼한산천</span> · Land of Samhan</td>
							<td>Prologue</td>
							<td>Mythic time</td>
							<td>1</td>
						</tr>
						<tr>
							<td>The Three Kingdoms</td>
							<td>632–642</td>
							<td>12</td>
						</tr>
						<tr>
							<td>The Five Precepts</td>
							<td>641</td>
							<td>12</td>
						</tr>
						<tr>
							<td>Iron Will</td>
							<td>642</td>
							<td>9</td>
						</tr>
						<tr>
							<td>Epilogue · Four Dragons</td>
							<td>643</td>
							<td>1</td>
						</tr>
						<tr>
							<td rowspan="4">Part II<br /><span lang="ko">삼한공신</span> · People of Samhan</td>
							<td>Goguryeo–Tang War</td>
							<td>643–645</td>
							<td>9</td>
						</tr>
						<tr>
							<td>The Chunchu Era</td>
							<td>643–654</td>
							<td>14</td>
						</tr>
						<tr>
							<td>Haedong Jeungja</td>
							<td>655–660</td>
							<td>7</td>
						</tr>
						<tr>
							<td>Epilogue · Three Realms</td>
							<td>—</td>
							<td>1</td>
						</tr>
						<tr>
							<td rowspan="4">Part III<br /><span lang="ko">삼한일통</span> · Unification of Samhan</td>
							<td>The Fall of Baekje</td>
							<td>660–662</td>
							<td>14</td>
						</tr>
						<tr>
							<td>The Fall of Goguryeo</td>
							<td>662–668</td>
							<td>6</td>
						</tr>
						<tr>
							<td>Silla–Tang War</td>
							<td>670–676</td>
							<td>14</td>
						</tr>
						<tr>
							<td>Epilogue · Balhae</td>
							<td>698</td>
							<td>1</td>
						</tr>
					</tbody>
				</table>
				<p>
					The full list, with each episode’s logline, is the <a href={episodes}>episode directory</a>.
				</p>

				<h2 id="technology">
					Technology and media
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<p>
					The chronicle is one body of data with several ways of sitting in it. The script, the comic, the map, the wiki and the
					stills are not adaptations by other hands. A sentence can open the person it names; the map’s borders are the same
					borders the episodes walk; a portrait in the wiki is the face the stills are required to match.<sup class="reference"
						><a href="#cite_note-about">[1]</a></sup
					>
					<sup class="reference"><a href="#cite_note-guide">[2]</a></sup>
				</p>

				<h3 id="media">
					Forms of the work
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<table class="wikitable">
					<thead>
						<tr>
							<th>Form</th>
							<th>What it is</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><a href={read}>Chronicle</a></td>
							<td>The bilingual script, as narration and dialogue. It can be read straight through or one episode at a time.</td>
						</tr>
						<tr>
							<td><a href={comic}>Comic</a></td>
							<td>The same dialogue in balloons. The webcomic the work was begun as.</td>
						</tr>
						<tr>
							<td><a href={episodes}>Episodes</a></td>
							<td>The directory: part, arc, chapter, episode, with a logline for each.</td>
						</tr>
						<tr>
							<td><a href={images}>Stills</a> and <a href={scenes}>scenes</a></td>
							<td>
								Painted frames. Figures are drawn in a webtoon line; the world is watercolour and oil. Myths are ink. Battles
								use each kingdom’s ships and banners.
							</td>
						</tr>
						<tr>
							<td><a href={wiki}>Wiki</a></td>
							<td>People, places, clans, swords, horses, eras and alliances. A career changes with the year.</td>
						</tr>
						<tr>
							<td><a href={map}>Map</a></td>
							<td>One map of the peninsula and, further out, of the known world. Borders are painted site by site and year by year.</td>
						</tr>
						<tr>
							<td><a href={tree}>Royal house</a> and <a href={timeline}>parallel</a></td>
							<td>The Silla line, and the years the borders and the reigns share.</td>
						</tr>
						<tr>
							<td><a href={stage}>Stage</a></td>
							<td>Selected places as rooms a reader can enter.</td>
						</tr>
						<tr>
							<td><a href={music}>Music</a> and <a href={research}>research</a></td>
							<td>Score for the chronicle, and the annals, steles and museum objects the telling is checked against.</td>
						</tr>
					</tbody>
				</table>

				<h3 id="stack">
					Software
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					The site is a SvelteKit application written in TypeScript and built with Vite. Pages use Svelte 5. The map is a
					Three.js scene, reached through Threlte, with D3 for geography, zoom and layout, and TopoJSON plus a world atlas for
					the wide frames. Political colour is painted on a canvas, year by year, and crossfaded when a border changes. Motion
					on the page uses GSAP. The script, the people and the borders are data the views read. They are not generated at
					reading time.
				</p>
				<table class="wikitable">
					<thead>
						<tr>
							<th>Layer</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Svelte 5 and SvelteKit</td>
							<td>The application: reading, wiki, map, comic and the rest of the rooms.</td>
						</tr>
						<tr>
							<td>TypeScript and Vite</td>
							<td>The language of the data and the build.</td>
						</tr>
						<tr>
							<td>Three.js and Threlte</td>
							<td>The map as a scene, in a flat view and in orbit.</td>
						</tr>
						<tr>
							<td>D3, TopoJSON, world atlas</td>
							<td>Coasts, zoom, and the frames from the peninsula out to the cosmos.</td>
						</tr>
						<tr>
							<td>Canvas</td>
							<td>Kingdom colour, relief and the fade between one year’s borders and the next.</td>
						</tr>
						<tr>
							<td>GSAP</td>
							<td>Motion in the interface.</td>
						</tr>
					</tbody>
				</table>

				<h2 id="reception">
					Reception
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<p>
					As of 2026 the chronicle has not been issued by a publisher and has not been reviewed in the trade press. What
					follows is the author’s account of what the work is for. It is not a critical consensus.<sup class="reference"
						><a href="#cite_note-about">[1]</a></sup
					>
				</p>

				<h3 id="aims">
					Aims
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					Ahn describes three aims, in that order.
				</p>
				<p>
					The first is pleasure. The author’s note calls the work “primarily a story.” Courts, grudges, a sword held backwards,
					and a joke a hall is not ready for are meant to be read before they are interpreted. The satire of bone-rank, clan
					and tribe is there so that a banquet can become a revolt for a reason, not so that a reader can collect a thesis.<sup
						class="reference"><a href="#cite_note-about">[1]</a></sup
					>
				</p>
				<p>
					The second is a trial of form, in a period when a model can draft a page or a picture. The script, the comic, the map
					that changes by year, the wiki that opens beside a name, and the stills held to one visual canon are offered as one
					work. Ahn’s claim is that the remaining taste is a person’s: which face, which year, which sentence is allowed to
					stand, and which seam between the annal and the scene stays visible. The experiment is the arrangement, not a claim
					that a machine wrote the book.<sup class="reference"><a href="#cite_note-guide">[2]</a></sup>
				</p>
				<p>
					The third is audience. Korean history and mythology, in this account, are still told mostly to people who already
					share them. The bilingual text, the unnamed narrator, and the refusal to open with a genealogy are the means. A
					reader who does not know the period is meant to enter at Queen Seondeok and meet Jumong, Dangun and Tamla only when
					the story requires them.<sup class="reference"><a href="#cite_note-about">[1]</a></sup>
				</p>

				<h3 id="critical">
					Critical response
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h3>
				<p>
					No independent criticism is recorded here. Comparison with other historical comics is useful only as a description of
					the shelf Ahn is writing toward. Yasuhisa Hara’s <i>Kingdom</i> and Makoto Yukimura’s <i>Vinland Saga</i> are
					serialised dramas that carry a distant history to readers who did not come for a syllabus, and that invent the
					private life around a public war. <i>Romance of the Three Kingdoms</i> is the older example of the same bargain, and
					the one the chronicle refuses to imitate in silence: the famous scenes of that novel became, for many readers, the
					history. <i>King for All</i> wants the pleasure of that kind of book and a margin that still says which sentence was
					the annal’s.
				</p>

				<h2 id="impact">
					Cultural impact
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<figure class="thumb tleft">
					<img src="/album_dangun.png" alt="A small figure stands under an enormous pale disc, ink and one wash of colour, the rest of the sheet bare." />
					<figcaption>
						Dangun, told late, after the kingdoms exist. The myth is ink. The history around it is not.
					</figcaption>
				</figure>
				<p>
					The work has no public life yet outside its own site: no translation deal, no adaptation, no reported readership
					beyond the people who open it. The impact Ahn describes is prospective, and it is the third aim stated as a hope.
				</p>
				<p>
					If the experiment works, a reader who came for the story would leave knowing the bone-rank, the eight clans, the fall
					of Baekje, the wall at Ansi, and the myths of Dangun, Jumong and Tamla, and would have met them as entertainment
					rather than as a course. The same reader would have watched a border move, opened a person beside the sentence that
					named them, and been able to see which night was invented. That is the influence the project is built to have. It is
					not an influence it can yet claim.<sup class="reference"><a href="#cite_note-about">[1]</a></sup>
				</p>
				<p>
					A sequel outline, <i>The God King</i>, and a shelf of later books set in China, Persia and the steppe are filed as
					outlines. They are the direction of the same project. They are not further evidence of an impact that has not
					happened.<sup class="reference"><a href="#cite_note-stories">[3]</a></sup>
				</p>

				<h2 id="gallery">
					Gallery
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<ul class="gallery">
					<li>
						<figure>
							<img src="/album_sunduk.png" alt="Queen Seondeok in a red robe, looking up into a blue shaft of light." />
							<figcaption>Queen Seondeok</figcaption>
						</figure>
					</li>
					<li>
						<figure>
							<img src="/album_yushin.png" alt="Kim Yushin on a rearing horse, sword drawn, against a moon." />
							<figcaption>Kim Yushin</figcaption>
						</figure>
					</li>
					<li>
						<figure>
							<img src="/album_gyebek.png" alt="Gyebaek kneeling with a straight sword planted in the dirt." />
							<figcaption>Gyebaek</figcaption>
						</figure>
					</li>
					<li>
						<figure>
							<img src="/album_jumong.png" alt="Jumong smiling, a bowstring across the foreground." />
							<figcaption>Jumong</figcaption>
						</figure>
					</li>
					<li>
						<figure>
							<img src="/album_taizong.png" alt="Emperor Taizong in yellow silk, a lamp low in the frame." />
							<figcaption>Emperor Taizong</figcaption>
						</figure>
					</li>
					<li>
						<figure>
							<img src="/album_haemosu.png" alt="Haemosu in a sun chariot above a dark river." />
							<figcaption>Haemosu</figcaption>
						</figure>
					</li>
					<li>
						<figure>
							<img src="/album_hyukgose.png" alt="The boy Hyukgose and a white horse by a well, painted in ink." />
							<figcaption>Hyukgose</figcaption>
						</figure>
					</li>
					<li>
						<figure>
							<img src="/album_cavern_three.png" alt="Three women in a steam cavern, each in a different coloured skirt." />
							<figcaption>The cavern</figcaption>
						</figure>
					</li>
					<li>
						<figure>
							<img src="/album_fortress.png" alt="A stone gate with a tiled pavilion and a red seam in the doors." />
							<figcaption>A fortress gate</figcaption>
						</figure>
					</li>
					<li>
						<figure>
							<img src="/album_salsu.png" alt="A river battle under a broken sky, small figures and a wide wash of water." />
							<figcaption>Salsu</figcaption>
						</figure>
					</li>
				</ul>

				<h2 id="related">
					Related works
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<p>
					The site keeps outlines for later books, shelved by place and century.<sup class="reference"
						><a href="#cite_note-stories">[3]</a></sup
					>
					The one tied directly to this chronicle is <b>The God King</b> (<span lang="ko">후삼제왕</span>, “Later Three Emperors”),
					set from 828 to 943. Its tagline calls it the sequel: three men pick up the names of three dead kingdoms. After it,
					<b>Kingmaker</b> (<span lang="ko">태종대왕</span>) is the life of Yi Bang-won, and <b>Breaking</b> (<span lang="ko">대한사람</span>)
					is three volumes: Reform (1876–1884), Revolution (1884–1897), and Resistance (1897–1910).
					<b>Seed</b> (<span lang="ko">씨알소리</span>) is the life of Ham Seok-heon. Other outlines leave Korea for China, Persia, the steppe, and further. They are
					outlines, not the finished script.
				</p>
				<p>
					Inside this work, the comic view, the painted volumes, the moving map and the wiki are not adaptations by other
					hands. They are other ways of sitting in the same text. The webcomic the author first intended is the form the
					pictures are still walking toward.<sup class="reference"><a href="#cite_note-about">[1]</a></sup>
				</p>

				<h2 id="see-also">
					See also
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<ul>
					<li><a href={read}>The chronicle</a></li>
					<li><a href={episodes}>Episode directory</a></li>
					<li><a href={wiki}>Wiki of the cast and the set</a></li>
					<li><a href={map}>Map of the peninsula by year</a></li>
					<li><a href={about}>Author’s note</a></li>
					<li><a href={stories}>Later outlines</a></li>
					<li><a href={namu}>나무위키 문서</a></li>
					<li>Three Kingdoms of Korea</li>
					<li><i>Samguk sagi</i></li>
					<li><i>Queen Seondeok</i> (2009 series)</li>
				</ul>

				<h2 id="references">
					References
					<span class="mw-editsection" aria-hidden="true">[edit]</span>
				</h2>
				<ol class="references">
					<li id="cite_note-about">
						<a href="#cite_ref-about" class="back">^</a>
						Heewon Ahn. “About.” <i>King for All</i>. The note calls the work “primarily a story — an epic set in 7th-century
						Samhan,” names <i>Queen Seondeok</i> (2009) as the inspiration, and names political satire of each kingdom’s
						social system as a major theme. It also describes the bilingual script, the unnamed storyteller, the painted
						stills, and the single map.
						<a href={about}>About</a>.
					</li>
					<li id="cite_note-guide">
						<a href="#cite_ref-guide" class="back">^</a>
						Heewon Ahn. “The rooms.” <i>King for All</i> guide. Describes the reading modes, the episode directory, and the
						cards, records, maps and diagrams that sit inside the script.
						<a href={guide}>Guide</a>.
					</li>
					<li id="cite_note-stories">
						<a href="#cite_ref-stories" class="back">^</a>
						“Stories.” <i>King for All</i>. Outlines for the books after this one, including <i>The God King</i> (<span lang="ko"
							>후삼제왕</span
						>), tagged as the sequel and set in the Later Three Kingdoms, 828–943.
						<a href={stories}>Stories</a>.
					</li>
					<li id="cite_note-sagi">
						<a href="#cite_ref-sagi" class="back">^</a>
						Kim Busik. <i>Samguk sagi</i> (三國史記). 1145. The principal annal the chronicle dramatizes and, where an episode
						quotes the record, leaves in the record’s wording. Later myth and biography also draw on <i>Samguk yusa</i> and,
						for Yamato, the <i>Nihon shoki</i>.
					</li>
				</ol>

				<div class="navbox">
					<div class="navbox-title">King for All</div>
					<div class="navbox-row">
						<div class="navbox-label">Text</div>
						<div class="navbox-list">
							<a href={read}>Read</a> · <a href={episodes}>Episodes</a> · <a href={about}>About</a> ·
							<a href={guide}>Guide</a>
						</div>
					</div>
					<div class="navbox-row">
						<div class="navbox-label">World</div>
						<div class="navbox-list">
							<a href={wiki}>Wiki</a> · <a href={map}>Map</a> · <a href={resolve('/tree')}>Royal house</a> ·
							<a href={resolve('/parallel')}>Parallel</a> · <a href={stories}>Later books</a>
						</div>
					</div>
					<div class="navbox-row">
						<div class="navbox-label">Parts</div>
						<div class="navbox-list">
							<a href="#part-i">Land of Samhan</a> · <a href="#part-ii">People of Samhan</a> ·
							<a href="#part-iii">Unification of Samhan</a>
						</div>
					</div>
				</div>

				<div class="catlinks">
					<div class="catlinks-label">Categories:</div>
					<ul>
						<li>Korean historical fiction</li>
						<li>Works about the Three Kingdoms of Korea</li>
						<li>Interactive fiction</li>
						<li>Bilingual books</li>
						<li>21st-century novels</li>
						<li>Silla</li>
						<li>Baekje</li>
						<li>Goguryeo</li>
					</ul>
				</div>
			</article>
		</div>
	</div>

	<footer class="mw-footer">
		<p>
			This page is the encyclopedia article for the chronicle, laid out in the Vector article style. It is part of
			<a href={home}>King for All</a>, not a page on wikipedia.org.
		</p>
		<ul>
			<li><a href={about}>Author’s note</a></li>
			<li><a href={read}>Read</a></li>
			<li><a href="#top">Top</a></li>
		</ul>
	</footer>
</div>

<WikiPeek
	selectedId={wikiId}
	expanded={wikiExpanded}
	onBack={closeWiki}
	onOpen={(id) => {
		wikiId = id;
		wikiExpanded = false;
	}}
	onExpand={() => (wikiExpanded = true)}
	onCollapse={() => (wikiExpanded = false)}
/>

<style>
	/* Night is the site default. Day is Wikipedia's paper. Both use the same tokens. */
	:global(html:has(.vector-page)) {
		color-scheme: dark;
		--wp-bg: #101418;
		--wp-paper: #202122;
		--wp-sunken: #27292d;
		--wp-ink: #eaecf0;
		--wp-muted: #a2a9b1;
		--wp-link: #88a3e8;
		--wp-visited: #b9a3e3;
		--wp-border: #54595d;
		--wp-head: #2c2f33;
		--wp-nav-title: #3c4f66;
		--wp-nav-label: #32363b;
		--wp-select: #3d4d6e;
		background: var(--wp-bg);
	}

	:global(html[data-theme='light']:has(.vector-page)) {
		color-scheme: light;
		--wp-bg: #f8f9fa;
		--wp-paper: #ffffff;
		--wp-sunken: #f8f9fa;
		--wp-ink: #202122;
		--wp-muted: #54595d;
		--wp-link: #3366cc;
		--wp-visited: #6b4ba1;
		--wp-border: #a2a9b1;
		--wp-head: #eaecf0;
		--wp-nav-title: #b0c4de;
		--wp-nav-label: #dcdde3;
		--wp-select: #b3d4fc;
	}

	:global(html:has(.vector-page) body) {
		margin: 0;
		padding: 0 !important;
		background: var(--wp-bg);
		color: var(--wp-ink);
		font: 16px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Lato, 'Helvetica Neue', Arial, sans-serif;
		letter-spacing: -0.018em;
		text-rendering: optimizeLegibility;
	}

	:global(html:has(.vector-page) body) :global(b),
	:global(html:has(.vector-page) body) :global(strong) {
		color: inherit;
		font-weight: 700;
	}

	:global(html:has(.vector-page) body) :global(em),
	:global(html:has(.vector-page) body) :global(i) {
		color: inherit;
	}

	:global(html:has(.vector-page)) :global(::selection) {
		background: var(--wp-select);
		color: var(--wp-ink);
	}

	.vector-page {
		color: var(--wp-ink);
		background: var(--wp-bg);
		min-height: 100vh;
		letter-spacing: -0.018em;
	}

	.skip {
		position: absolute;
		left: -999px;
		top: 0;
		background: var(--wp-paper);
		padding: 0.4rem 0.6rem;
		z-index: 20;
	}

	.skip:focus {
		left: 0.5rem;
		top: 0.5rem;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	.mw-header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--wp-paper);
		border-bottom: 1px solid var(--wp-border);
		height: 3.125rem;
	}

	.mw-header-inner {
		max-width: 1516px;
		margin: 0 auto;
		height: 100%;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0 1rem;
	}

	.mw-logo {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		text-decoration: none;
		color: var(--wp-ink);
		flex: none;
	}

	.mw-wordmark {
		font-family: 'Linux Libertine', 'Georgia', 'Times New Roman', Times, serif;
		font-weight: 400;
		letter-spacing: 0.02em;
		font-size: 1.05rem;
	}

	.mw-search {
		flex: 1;
		display: flex;
		max-width: 34rem;
		margin-left: auto;
	}

	.mw-search input {
		flex: 1;
		border: 1px solid var(--wp-border);
		border-right: 0;
		border-radius: 2px 0 0 2px;
		padding: 0.3rem 0.6rem;
		font: inherit;
		font-size: 0.95rem;
		color: var(--wp-ink);
		background: var(--wp-paper);
	}

	.mw-search button {
		border: 1px solid var(--wp-border);
		background: var(--wp-sunken);
		color: var(--wp-ink);
		font: inherit;
		font-size: 0.9rem;
		padding: 0 0.85rem;
		border-radius: 0 2px 2px 0;
		cursor: pointer;
	}

	.mw-search button:hover {
		background: var(--wp-paper);
	}

	.mw-personal {
		display: flex;
		gap: 0.85rem;
		font-size: 0.875rem;
	}

	.mw-personal a {
		color: var(--wp-link);
		text-decoration: none;
	}

	.mw-personal a:hover {
		text-decoration: underline;
	}

	.mw-page-container {
		max-width: 1516px;
		margin: 0 auto;
		display: flex;
		align-items: flex-start;
	}

	.vector-toc {
		width: 220px;
		flex: none;
		position: sticky;
		top: 3.125rem;
		max-height: calc(100vh - 3.125rem);
		overflow: auto;
		padding: 1.1rem 0.85rem 2rem 1rem;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	.vector-toc.is-hidden ul {
		display: none;
	}

	.vector-toc-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-weight: 700;
		margin-bottom: 0.45rem;
	}

	.vector-toc-head button {
		background: none;
		border: 0;
		color: var(--wp-link);
		font: inherit;
		font-weight: 400;
		cursor: pointer;
		padding: 0;
	}

	.vector-toc ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.vector-toc li {
		margin: 0.28rem 0;
	}

	.vector-toc ul ul {
		margin-left: 1rem;
	}

	.vector-toc a {
		color: var(--wp-link);
		text-decoration: none;
	}

	.vector-toc a:hover {
		text-decoration: underline;
	}

	.tocnumber {
		color: var(--wp-muted);
		margin-right: 0.25rem;
	}

	.mw-content-container {
		flex: 1;
		min-width: 0;
		background: var(--wp-paper);
		border-left: 1px solid var(--wp-head);
		padding: 1.15rem 2rem 3rem;
	}

	article {
		max-width: 960px;
	}

	h1,
	h2,
	h3 {
		font-family: 'Linux Libertine', Georgia, 'Times New Roman', Times, serif;
		font-weight: 400;
		color: var(--wp-ink);
		line-height: 1.3;
		letter-spacing: -0.02em;
		overflow: hidden;
		scroll-margin-top: 4.2rem;
	}

	h1 {
		font-size: 1.9rem;
		border-bottom: 1px solid var(--wp-border);
		margin: 0 0 0.25rem;
		padding-bottom: 0.15rem;
	}

	h2 {
		font-size: 1.5rem;
		border-bottom: 1px solid var(--wp-border);
		margin: 1.15rem 0 0.45rem;
		padding-bottom: 0.1rem;
	}

	h3 {
		font-size: 1.2rem;
		font-weight: 700;
		margin: 1rem 0 0.35rem;
	}

	p {
		margin: 0.5em 0 0.85em;
	}

	a {
		color: var(--wp-link);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	a:visited {
		color: var(--wp-visited);
	}

	.siteSub {
		font-style: italic;
		color: var(--wp-muted);
		font-size: 0.8125rem;
		margin: 0 0 0.7rem;
	}

	.hatnote {
		font-style: italic;
		color: var(--wp-muted);
		padding-left: 1.6em;
		margin: 0 0 0.6em;
		font-size: 0.875rem;
	}

	.mw-editsection {
		float: right;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.72rem;
		font-weight: 400;
		margin-left: 0.6rem;
		color: var(--wp-muted);
		line-height: 2.2;
	}

	.reference {
		font-size: 0.75em;
		line-height: 1;
		color: var(--wp-link);
	}

	.reference a {
		text-decoration: none;
	}

	.infobox {
		float: right;
		clear: right;
		width: 22.5em;
		max-width: 100%;
		margin: 0.4em 0 1em 1.4em;
		border: 1px solid var(--wp-border);
		border-spacing: 3px;
		background: var(--wp-sunken);
		color: var(--wp-ink);
		font-size: 88%;
		line-height: 1.5;
		border-collapse: separate;
	}

	.infobox-subbox {
		margin-top: 0;
	}

	.infobox-title {
		font-size: 125%;
		font-weight: 700;
		text-align: center;
		padding: 0.2em;
		background: transparent;
	}

	.infobox th,
	.infobox td {
		vertical-align: top;
		padding: 0.2em 0.4em;
		text-align: left;
	}

	.infobox th[scope='row'] {
		width: 7.2em;
		font-weight: 700;
	}

	.infobox-image {
		text-align: center;
		padding: 0.4em;
	}

	.infobox-image img {
		max-width: 100%;
		height: auto;
		background: #000;
	}

	.infobox-caption {
		font-size: 92%;
		padding: 0.35em 0.6em 0.5em;
		text-align: left;
	}

	.infobox-below {
		text-align: center;
		padding: 0.45em;
	}

	.thumb {
		border: 1px solid var(--wp-border);
		background: var(--wp-sunken);
		width: 220px;
		margin: 0.4em 0 1em;
		padding: 3px;
		font-size: 88%;
		line-height: 1.4;
	}

	.thumb img {
		width: 100%;
		height: auto;
		display: block;
		background: var(--wp-head);
	}

	.thumb figcaption {
		padding: 0.35em 0.4em 0.25em;
		text-align: left;
	}

	.gallery {
		clear: both;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		gap: 0.7rem;
		list-style: none;
		margin: 0.6em 0 1.2em;
		padding: 0;
	}

	.gallery figure {
		margin: 0;
		border: 1px solid var(--wp-border);
		background: var(--wp-sunken);
		padding: 3px;
	}

	.gallery img {
		display: block;
		width: 100%;
		height: auto;
		background: var(--wp-head);
	}

	.gallery figcaption {
		padding: 0.3em 0.35em 0.2em;
		font-size: 0.78rem;
		line-height: 1.35;
		color: var(--wp-muted);
	}

	.tright {
		float: right;
		clear: right;
		margin-left: 1.4em;
	}

	.tleft {
		float: left;
		clear: left;
		margin-right: 1.4em;
	}

	blockquote {
		margin: 1em 0;
		padding: 0 32px;
		font-family: Georgia, 'Times New Roman', Times, serif;
	}

	blockquote p {
		margin: 0;
	}

	.wikitable {
		background: var(--wp-sunken);
		border: 1px solid var(--wp-border);
		border-collapse: collapse;
		width: 100%;
		margin: 1em 0;
		font-size: 0.92rem;
	}

	.wikitable th,
	.wikitable td {
		border: 1px solid var(--wp-border);
		padding: 0.35em 0.55em;
		vertical-align: top;
	}

	.wikitable th {
		background: var(--wp-head);
		text-align: center;
		font-weight: 700;
	}

	.toc-mobile {
		display: none;
		border: 1px solid var(--wp-border);
		background: var(--wp-sunken);
		padding: 0.7em 1em;
		margin: 0.6em 0 1em;
		font-size: 0.92rem;
	}

	.toc-mobile-title {
		font-weight: 700;
		text-align: center;
		margin-bottom: 0.3em;
	}

	.toc-mobile ol {
		margin: 0.2em 0 0.2em 1.4em;
		padding: 0;
	}

	.references {
		font-size: 90%;
		line-height: 1.5;
		padding-left: 1.6em;
	}

	.references li {
		margin: 0.45em 0;
	}

	.back {
		margin-right: 0.25em;
	}

	.navbox {
		clear: both;
		border: 1px solid var(--wp-border);
		margin: 1.4em 0 0.6em;
		font-size: 90%;
	}

	.navbox-title {
		background: var(--wp-nav-title);
		text-align: center;
		font-weight: 700;
		padding: 0.3em;
	}

	.navbox-row {
		display: flex;
		border-top: 1px solid var(--wp-border);
	}

	.navbox-label {
		flex: none;
		width: 7rem;
		background: var(--wp-nav-label);
		font-weight: 700;
		text-align: right;
		padding: 0.3em 0.5em;
	}

	.navbox-list {
		padding: 0.3em 0.6em;
	}

	.catlinks {
		clear: both;
		background: var(--wp-sunken);
		border: 1px solid var(--wp-border);
		margin-top: 1.2em;
		padding: 0.45em 0.7em;
		font-size: 0.85rem;
	}

	.catlinks-label {
		font-weight: 700;
		margin-bottom: 0.15em;
	}

	.catlinks ul {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.15em 0.8em;
		margin: 0;
		padding: 0;
	}

	.mw-footer {
		clear: both;
		border-top: 1px solid var(--wp-border);
		background: var(--wp-sunken);
		color: var(--wp-ink);
		padding: 1rem 1.5rem 2rem;
		font-size: 0.85rem;
	}

	.mw-footer p {
		max-width: 60rem;
		margin: 0 auto 0.4rem;
	}

	.mw-footer ul {
		max-width: 60rem;
		margin: 0 auto;
		padding: 0;
		list-style: none;
		display: flex;
		gap: 1rem;
	}

	@media (max-width: 1100px) {
		.vector-toc {
			display: none;
		}

		.toc-mobile {
			display: block;
		}

		.mw-content-container {
			border-left: 0;
			padding: 1rem 1rem 2.5rem;
		}

		.mw-personal {
			display: none;
		}
	}

	@media (max-width: 720px) {
		.infobox,
		.thumb {
			float: none;
			clear: both;
			width: auto;
			margin: 0.6em 0 1em;
		}

		.navbox-row {
			flex-direction: column;
		}

		.navbox-label {
			width: auto;
			text-align: left;
		}

		h1 {
			font-size: 1.6rem;
		}
	}
</style>
