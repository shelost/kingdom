<script lang="ts">
	import { resolve } from '$app/paths';
	import { episodeQueryForTitle } from '$lib/lifeArcView';
	import { EP_QUERY } from '$lib/reading.svelte';
	import WikiPeek from '$lib/components/WikiPeek.svelte';

	const read = resolve('/read');
	const wiki = resolve('/wiki');
	const episodes = resolve('/episodes');
	const about = resolve('/about');
	const guide = resolve('/guide');
	const map = resolve('/map');
	const stories = resolve('/stories');
	const home = resolve('/');
	const comic = resolve('/comic');
	const images = resolve('/images');
	const tree = resolve('/tree');
	const timeline = resolve('/timeline');
	const wikipedia = resolve('/wikipedia');
	const threadsPage = `${resolve('/dashboard')}?view=threads`;

	function person(id: string) {
		return `${wiki}?id=${id}`;
	}

	function ep(title: string) {
		const q = episodeQueryForTitle(title);
		return q ? `${read}?${EP_QUERY}=${encodeURIComponent(q)}` : read;
	}

	type Toc = { id: string; n: string; title: string; children?: { id: string; n: string; title: string }[] };

	const TOC: Toc[] = [
		{ id: 'overview', n: '1', title: '개요' },
		{
			id: 'plot',
			n: '2',
			title: '줄거리',
			children: [
				{ id: 'prologue', n: '2.1', title: '프롤로그' },
				{ id: 'part-1', n: '2.2', title: '삼한산천' },
				{ id: 'part-2', n: '2.3', title: '삼한공신' },
				{ id: 'part-3', n: '2.4', title: '삼한일통' }
			]
		},
		{
			id: 'cast',
			n: '3',
			title: '등장인물',
			children: [
				{ id: 'silla', n: '3.1', title: '신라' },
				{ id: 'baekje', n: '3.2', title: '백제' },
				{ id: 'goguryeo', n: '3.3', title: '고구려' },
				{ id: 'tang', n: '3.4', title: '당' },
				{ id: 'gods', n: '3.5', title: '신과 저승' }
			]
		},
		{ id: 'lines', n: '4', title: '명대사' },
		{
			id: 'bait',
			n: '5',
			title: '떡밥',
			children: [
				{ id: 'bait-yongsu', n: '5.1', title: '비형 · 용수' },
				{ id: 'bait-gaya', n: '5.2', title: '가야' },
				{ id: 'bait-gods', n: '5.3', title: '신과 물건' },
				{ id: 'bait-sword', n: '5.4', title: '칼과 들판' },
				{ id: 'bait-open', n: '5.5', title: '안 회수한 것' }
			]
		},
		{
			id: 'inquiry',
			n: '6',
			title: '탐구',
			children: [
				{ id: 'inq-order', n: '6.1', title: '연표를 꼬아 놓은 이유' },
				{ id: 'inq-voice', n: '6.2', title: '화자는 누구인가' },
				{ id: 'inq-room', n: '6.3', title: '방이 주제인 이유' },
				{ id: 'inq-tongue', n: '6.4', title: '영어만 갈리는 이유' },
				{ id: 'inq-2009', n: '6.5', title: '2009년과의 거리' }
			]
		},
		{ id: 'record', n: '7', title: '고증' },
		{ id: 'places', n: '8', title: '보는 곳' },
		{
			id: 'reception',
			n: '9',
			title: '평가',
			children: [
				{ id: 'praise', n: '9.1', title: '이 문서가 치는 점' },
				{ id: 'pan', n: '9.2', title: '이 문서가 까는 점' }
			]
		},
		{ id: 'trivia', n: '10', title: '여담' },
		{ id: 'see', n: '11', title: '관련 문서' },
		{ id: 'notes', n: '12', title: '각주' }
	];

	const NOTES: Record<number, string> = {
		1: '출판사 판본은 없다. 숫자와 목적의 출처는 작가 노트, 작품 안내. 서평란을 만들고 싶어도 끌어올 기사가 없다.',
		2: '영문이 King for All인 이유. 법민이 소년 때 하는 말과 같은 문장이고, 한국어로는 “모두를 위한 왕이요.”',
		3: '후속 구상 후삼제왕(Reignmaker)은 828–943, 후삼국. 대본이 아니라 구상이다. 미리 적어 두는 건 이쪽 문서의 버릇이기도 하다.',
		4: '김부식, 『삼국사기』(1145). 조서·비문·편지는 서술과 종이를 나누고, 기록의 문장은 고치지 않는다. 각색한 척 하지 말라는 쪽.',
		5: '신화와 전기는 『삼국유사』, 야마토 함대는 『일본서기』, 장안 조정은 당측 기록. 셋의 온도가 같을 리가 없어서, 그 차이를 숨기지 않는다.',
		6: '작가가 출발점으로 이름을 올린 드라마가 2009년 MBC 선덕여왕이다. 미실이 무게를 가져가는 구도, 덕만·천명 쌍둥이, 화랑세기 재구성은 이 연대기가 걷는 길이 아니다.',
		7: '화자는 이름을 끝까지 안 말한다. 하늘을 경전이 아니라 집안 소문처럼 말한다. “나는 누구다”는 없고, 눈치채는 건 독자 몫이다.',
		8: '갈리는 건 영어 단어뿐이다. 한국어 경어는 그 사람 것으로 둔다. 양쪽을 같이 안 읽으면 이 각주는 그냥 지나간다.',
		9: '신화 컷은 수묵, 전투는 그 나라의 배와 깃발, 가까운 싸움은 만화 각도. 얼굴은 위키 초상에서 벗어나지 않게 되어 있다.',
		10: '청대 장학성이 삼국지연의에 붙인 칠실삼허를 비율로 받지 않는다. 어느 문장이 사료인지만 보이게 한다는 쪽. 공부용으로 펼치면 큰일난다.',
		11: '아소는 사서에 없는 이름이다. 계백의 동생으로 나온다. 그가 맡는 동쪽 지붕은 강의 이름을 그대로 쓴다.',
		12: '강림의 질문은 큰 죽음마다 같은 문장이다. 퇴장 인터뷰로 바꾸지 않고, 다른 누구의 입에도 그 형식을 주지 않는다.',
		13: '101화는 프롤로그와 세 후기를 넣은 대본 기준. 회상은 기억하는 해를 달고, 그 회상을 품은 묶음은 독자가 서 있는 해를 단다. 연표대로 읽으면 이 책이 아니다.',
		14: '야스히사 하라의 『킹덤』, 유키무라 마코토의 『빈란드 사가』, 그리고 삼국지연의. 앞의 둘은 연재로 먼 전쟁을 데려오는 선반이고, 연의는 그 쾌감이 사료를 집어삼킨 선배로 불린다. 비교 기사에서 베낀 문장이 아니다.',
		15: '골품·팔족·오부는 주제를 수집하라고 깔아 둔 카드가 아니다. 연회가 반란이 되는 이유를 방에 심어 둔 것이다.',
		16: '같은 밤의 재서술은 떡밥으로 안 센다. 비형이 용수를 말하고 용수가 비형을 말하는 건 같은 일의 양면이다. 한 장면에서 묻고 그 장면에서 답하는 것도 아니다.',
		17: '화자 이름은 이 문서가 확정하지 않는다. 후보를 적어 확정하는 순간, 작품이 안 한 일을 문서가 해 버린다. 추정 난립해도 결론은 같다. 작품이 안 말한다.',
		18: '고깔의 주인은 앞 화에서 이름이 안 나온다. 회수 칸에 적는 건 떡밥 문서의 버릇이고, 본문은 그 이름을 미리 안 준다.',
		19: '대시보드의 스레드와 이 표는 같은 자료를 본다. 표는 추린 것이고, 대시보드에는 스틸이 붙는다.',
		20: '아래 호평·혹평은 기사 인용이 아니다. 외부 평이 없어서, 나무위키라면 문서가 스스로 정리하는 그 칸을 비우지 않았다. 출처는 이 문서 자신이다.'
	};

	let tocOpen = $state(true);
	let query = $state('');
	let open = $state<number | null>(null);
	let shown = $state<Record<string, boolean>>({});
	let folds = $state<Record<string, boolean>>({});
	let wikiId = $state<string | null>(null);
	let wikiExpanded = $state(false);

	function pop(n: number, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		open = open === n ? null : n;
	}

	function reveal(id: string) {
		shown = { ...shown, [id]: true };
	}

	function toggleFold(id: string) {
		folds = { ...folds, [id]: !folds[id] };
	}

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
		window.location.assign(q ? `${wiki}?q=${encodeURIComponent(q)}` : wiki);
	}
</script>

<svelte:window
	onclick={(e) => {
		const t = e.target as Element | null;
		if (t?.closest?.('.fn-wrap')) return;
		open = null;
	}}
	onkeydown={(e) => {
		if (e.key === 'Escape' && wikiId) closeWiki();
	}}
/>

<svelte:head>
	<title>삼한왕검 - 나무위키</title>
	<meta
		name="description"
		content="삼한왕검(King for All)은 안희원이 쓰는 한영 병기 연대기다. 632년 서라벌의 농담에서 시작해, 신화는 이야기가 필요로 할 때 나온다."
	/>
</svelte:head>

<div class="namu-root">
	<a class="skip" href="#content">본문으로</a>
	<header class="mast">
		<a class="logo" href="#top">
			<span class="seed" aria-hidden="true"></span>
			나무위키
		</a>
		<nav class="mast-links">
			<a href={read}>읽기</a>
			<a href={wiki}>위키</a>
			<a href={wikipedia}>Wikipedia</a>
			<a href={home}>연대기</a>
		</nav>
		<form class="search" onsubmit={onSearch}>
			<label class="visually-hidden" for="namu-q">검색</label>
			<input id="namu-q" bind:value={query} placeholder="여기에서 검색" autocomplete="off" />
			<button type="submit" aria-label="검색">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
					<path d="M15.5 15.5 L20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
		</form>
	</header>

	<div class="frame">
		<div class="doc">
			<nav class="toc" aria-label="목차">
				<div class="toc-head">
					<b>목차</b>
					<button type="button" aria-label={tocOpen ? '목차 접기' : '목차 펼치기'} aria-expanded={tocOpen} onclick={() => (tocOpen = !tocOpen)}>
						<svg viewBox="0 0 24 24" aria-hidden="true" class={{ open: tocOpen }}>
							<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" />
						</svg>
					</button>
				</div>
				{#if tocOpen}
					<ol>
						{#each TOC as item (item.id)}
							<li>
								<a href={`#${item.id}`}><span class="num">{item.n}.</span> {item.title}</a>
								{#if item.children}
									<ol>
										{#each item.children as child (child.id)}
											<li>
												<a href={`#${child.id}`}><span class="num">{child.n}.</span> {child.title}</a>
											</li>
										{/each}
									</ol>
								{/if}
							</li>
						{/each}
					</ol>
				{/if}
			</nav>

			<article id="content" {@attach watchNames}>
				<div class="title-row">
					<h1 id="top">삼한왕검</h1>
					<div class="tools">
						<span class="tool" title="별">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="M12 3.2l2.4 5.6 6 .6-4.5 4 1.3 5.9L12 16.6 6.8 19.3l1.3-5.9L3.6 9.4l6-.6z" fill="none" stroke="currentColor" stroke-width="1.4" />
							</svg>
						</span>
						<span class="tool">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="M4 16.5V20h3.5L18 9.5 14.5 6 4 16.5zM14.5 6l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.4" />
							</svg>
							편집
						</span>
						<span class="tool">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="M5 6h14v9H8l-3 3z" fill="none" stroke="currentColor" stroke-width="1.4" />
							</svg>
							토론
						</span>
						<span class="tool">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="1.4" />
								<path d="M12 8v5l3 2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
							</svg>
							역사
						</span>
					</div>
				</div>
				<p class="edited">최근 수정 시각: 2026-11-16 03:42:00</p>

				<p class="cats">
					분류:
					<a href={stories}>연대기</a>
					<span aria-hidden="true"> | </span>
					<a href={wiki}>삼국</a>
					<span aria-hidden="true"> | </span>
					<a href={comic}>웹툰</a>
					<span aria-hidden="true"> | </span>
					<a href="#record">역사 소설</a>
				</p>

				<p class="hat">
					<svg class="hat-arrow" viewBox="0 0 24 24" aria-hidden="true">
						<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7" />
						<path d="M8 12h8M13 8.5L16.5 12 13 15.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					<span>2009년 MBC 드라마에 대한 내용은 <a href="#origin">출발점</a> 문단을 참고하십시오.</span>
				</p>
				<p class="hat">
					<svg class="hat-arrow" viewBox="0 0 24 24" aria-hidden="true">
						<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7" />
						<path d="M8 12h8M13 8.5L16.5 12 13 15.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					<span>실존 인물에 대한 내용은 <a href={person('sunduk')}>선덕여왕</a> 문서를 참고하십시오.</span>
				</p>

				<aside class="infobox">
					<table>
						<tbody>
							<tr>
								<th colspan="2" class="ib-title">삼한왕검</th>
							</tr>
							<tr>
								<td colspan="2" class="ib-en">King for All</td>
							</tr>
							<tr>
								<td colspan="2" class="ib-img">
									<img src="/album_sunduk.png" alt="붉은 옷을 입은 여왕이 푸른 빛줄기를 올려다본다." />
									<p class="cap">표지 쪽 그림. <a href={person('sunduk')}>선덕여왕</a>과 한국어 제목.</p>
								</td>
							</tr>
							<tr>
								<th scope="row">작</th>
								<td>안희원</td>
							</tr>
							<tr>
								<th scope="row">원제</th>
								<td>삼한왕검<br /><span class="han">三韓王儉</span></td>
							</tr>
							<tr>
								<th scope="row">언어</th>
								<td>한국어 · 영어, 병기</td>
							</tr>
							<tr>
								<th scope="row">장르</th>
								<td>역사, 신화, 정치 풍자, 웹툰</td>
							</tr>
							<tr>
								<th scope="row">배경</th>
								<td>한반도, 탐라, 장안. 신화의 시간부터 698년</td>
							</tr>
							<tr>
								<th scope="row">분량</th>
								<td>101화. 13개 이야기, 3부{@render fn(13)}</td>
							</tr>
							<tr>
								<th scope="row">상태</th>
								<td>웹 공개. 2026년 현재 출판 전{@render fn(1)}</td>
							</tr>
							<tr>
								<td colspan="2" class="ib-below"><a href={read}>본문 읽기</a></td>
							</tr>
						</tbody>
					</table>
				</aside>

				<h2 id="overview">1. 개요 <span class="edit">[편집]</span></h2>
				<p>
					<b>삼한왕검</b>(三韓王儉, King for All)은 안희원이 쓰는 한영 병기 연대기.{@render fn(1)}
					처음 구상은 웹툰이었는데 지금 손에 잡히는 건 그림이 화 안에 박힌 대본이고, 같은 글이
					<a href={comic}>만화</a>로도, 인물 위키로도, 해마다 국경이 움직이는 <a href={map}>지도</a>로도 앉아 있다.
					무대만 보면 신화의 시간부터 698년 발해까지인데, 정치가 실제로 문을 여는 해는 632년 서라벌이다.
					한 줄로 줄이면 <b>조정이 농담으로 맞이한 여왕이 나라가 되는 이야기</b>고, 제목의 “모두를 위한 왕”은 훗날 문무가 되는
					<a href={person('munmu')}>김법민</a>이 소년 때 하는 말에서 왔다.{@render fn(2)}
					한국어 제목은 그 문장에 옛 왕호 왕검을 붙여 둔 것. 후속 구상 <b>후삼제왕</b>은 828–943인데, 대본이 아니다. 구상이다.{@render fn(3)}
				</p>
				<p id="origin">
					2009년 MBC <b>선덕여왕</b>을 작가가 출발점으로 적어 두긴 했다.{@render fn(6)}
					다만 그 드라마 보고 들어온 사람이 찾는 물건은 여기 없다. 미실이 제목보다 무거워지는 구도, 덕만·천명 쌍둥이, 남장으로 사람 모아서 왕이 되는 줄.
					<s>미실 문서 아닙니다</s> 이쪽 첫 줄은 “여왕? 웃기지도 않는군.”이고, 대야를 통과하는 사람은 <a href={person('gumilwife')}>매화</a>다.
					화랑세기 논쟁은 그 드라마 문서가 이미 충분히 길다. 연표를 일부러 꼬아 놓은 이유, 이름 안 말하는 화자, 영어만 갈리는 단어는 개요에 늘어놓으면 설명이 돼서 <a href="#inquiry">탐구</a>로 뺐다.
					던져 두고 나중에 주운 질문은 <a href="#bait">떡밥</a>.
				</p>

				{@render fold('eps', '화 수', eps)}

				<h2 id="plot">2. 줄거리 <span class="edit">[편집]</span></h2>
				<p class="warn">
					이 문단의 내용 중 전체 또는 일부는 스포일러를 포함하고 있습니다. 특수한 목적이 있지 않은 이상 열람을 삼가는 것을 권장합니다.
					<s>안 삼가실 거면서</s>
				</p>
				<p>
					검은 막대는 누르면 열린다. 화 목록을 여기 다시 베끼지는 않는다. 아래는 이 책이 독자를 데리고 다니는 고비고, 던져 둔 질문의 장부는 아래 <a href="#bait">떡밥</a>이다.
					떠났다가 돌아온다. 건국이든 진 전쟁이든, 나중 장면이 그것을 필요로 할 때 말하고, 책은 떠나온 방으로 돌아온다. 항상 그 다음이다.
				</p>

				<h3 id="prologue">2.1. 프롤로그 <span class="edit">[편집]</span></h3>
				<p>
					「호랑이 담배 피우던 시절」로 연다. 나라도 아직 없고, 세상은 혼을 만드는 법부터 모른다.
					하늘공주는 생명꽃을 찾고, 천지왕은 이름을 붙이고, 바다의 딸에게도 이름을 붙여 맞세운다.
					프롤로그가 남기는 문장은 제목이기도 하다. <b>모두를 위한 왕</b>. 사람을 어둠에서 데리고 나올 우두머리를 세우는 이야기.
				</p>

				<h3 id="part-1">2.2. 삼한산천 <span class="edit">[편집]</span></h3>
				<p>
					632년 서라벌. 여왕이라는 말을 조정이 웃음으로 받는다. 선덕이 왕관을 쓰고, 그 화백이 같이 살아야 한다.
					넉 겨울 뒤 늙은 화랑 둘이 서쪽으로 옥문곡에 보내진다. 이름은 공손하고, 뒤에는 전쟁이 있다.
					그다음에야 이 조정을 만든 더 오래된 신라가 나온다. 구름왕 <a href={person('jinheung')}>진흥</a>. 서라벌은 그의 돌을 좋아하고, 사비는 화제를 돌린다.
				</p>
				<p>
					백제는 자기 미래에 늦은 남자로 입장한다. 서른둘의 <a href={person('euija')}>의자</a>가 이제야 태자다. 대성들은 그 전에 이미, 아들들 중 누구를 가져갈지 여러 해를 썼다.
					사택, 연비, 진모, 목리, 해, 백, 국, 안. 점호처럼 불린다. 봉인된 함과 바위 위의 밤이 지나도 여덟 집은 하늘을 돕는 일을 그만두지 않는다.
					회상의 끝은 북으로 달리는 <a href={person('gyeonggeunchogo')}>근초고왕</a>과, 그를 맞는 <a href={person('gogugwon')}>고국원왕</a>, 그리고 빗나간 화살 하나다.
				</p>
				<p>
					같은 시절의 고구려는 <a href={person('gesomun')}>연개소문</a> 이야기를 잠자리용으로 하지 않는다.
					다섯 부족, 달이 찬 아내, 왕이 앉기도 전에 들리는 발굽. <a href={person('gwanggaeto')}>광개토왕</a>의 비는 예순네 성을 인정받고, 그 다음 돌이 적지 않은 것과 만난다.
				</p>
				<figure class="thumb right">
					<img src="/album_jumong.png" alt="붉은 머리띠의 젊은 남자가 활시위 너머로 웃으며 운다." />
					<figcaption>
						<a href={person('jumong')}>주몽</a>. 아직 이 부에는 안 나온다. 당과의 전쟁 한가운데서, 웃는 유배자이자 궁수로 나중에 말해진다.
					</figcaption>
				</figure>
				<p>
					세속오계 묶음은 이 세기를 끝내야 할 애들이다. <a href={person('munmu')}>법민</a>은 열다섯. 화랑 띠를 두르기엔 충분하고, 나라를 혼자 만들기엔 어리다.
					<a href={person('sadaham')}>사다함</a>은 이미 유령인데 연병장은 아직도 그를 불러 구른다. 문희의 이야기는 꿈이 팔리는 데서 시작한다.
					의자는 미리 붙는 시호에 유머가 있다. 그 아래는 더 오래된 백제의 상처다. 성왕, 그리고 적에게서 오지 않는 배신. 개로, 그리고 고구려가 백 년을 기다려 가져간 머리.
				</p>
				<p>
					642년은 제도가 모아 둔 것을 쓰는 해다. <a href={person('gumil')}>검일</a>은 뼈가 정해 준 천장까지 정확히 올라간다. 매화는 연회에서 술을 따른다.
					반란은, 절을 하는 여름이 왕이 찾아오는 연회가 되는 과정이다.
					<a href={person('chunchu')}>춘추</a>는 신라를 살리려고 평양으로 걸어 들어가, 삼한에서 가장 위험한 남자에게 청을 넣는다.
					시장의 <a href={person('gyebek')}>계백</a>은 아직 직함이 침으로 시작하는 이름이다. 그는 아직 그 남자를 못 만났다고, 작은 목소리로 덧붙이는 쪽이 이 책답다.
					그해의 마지막 박자는 같은 별, 같은 순간, 세 장소다.
				</p>
				<p>
					후기는 반도를 떠난다. 643년, 먼 서쪽. 세상의 반을 가진 남자가 새 이름을, 아직 먹을지 정하지 않은 포도처럼 혀 위에서 굴린다.
				</p>

				<h3 id="part-2">2.3. 삼한공신 <span class="edit">[편집]</span></h3>
				<p>
					고구려·당은 그 황제에게 칭호를 준다. 천책상장, 천가한. 그리고 나라가 바닥난다는 문제를 같이 준다.
					북쪽은 십사 년을 성에 썼다. 안시는 밤새 춤추고, 게으른 눈의 남자를 따르고, 아무에게도 대답하지 않다가, 황제가 문 앞에 선다.
					<a href={person('munduk')}>을지문덕</a>은 남쪽으로 가며 일곱 번 항복하고, 강은 가까워진다.
					그 다음에야 — 이 책은 항상 그 다음이다 — 이 북쪽이 어디서 왔는지 말한다.
					<a href={person('haemosu')}>해모수</a>가 해의 길에서 내려다보고, 주몽은 창이 그를 찾을 때 아직 강물에서 젖어 있다. 호동의 북이 건국을 닫는다. 소년을 위해 북을 가르는 공주.
				</p>
				<p>
					춘추의 시대는 서라벌로 돌아온다. <a href={person('bidam')}>비담</a>은 회의의 첫 의자를 맡고, 여왕의 사촌에 맞서 혼자 손을 안 내린다.
					여왕이 쓰러지면 문은 닫힌다. 그 사이 책은 <a href={person('suro')}>수로</a>와, 능선을 너무 오래 본 하늘의 신을 말하고, 진영 사이의 닷새 차를 말한다.
					점수는 아직 동점이고, 비담은 유신이 서라벌에서 한 번도 답하지 않은 질문을 던진다.
					무력은 아버지가 해가 닿는 모든 것을 약속한 가야의 왕자고, 그 다음 신라가 쇼핑을 온다.
					동굴이 비담을 쫓아낸다. 흰 말이 떨어지는 별을 위해 탄다. 가야 남자 셋이 김 속에서 기다린다. 문은 안에서 열린다.
				</p>
				<p>
					<a href={person('jinduk')}>진덕</a>은 사촌 머리에 맞춰 만든 왕관을, 관자놀이에 솜을 넣어 쓴다.
					서쪽으로 가는 배는 남쪽 해안에 부서진다. 왜 조정은 백제의 옛 약속을 고수하고, 춘추를 새벽 배에 태워 돌려보낸다.
					춘추는 <a href={person('taizong')}>이세민</a>에게 제안을 들고 간다. 다른 모두가 조공을 가져오는 도시에서.
					도장 하나와 속도 하나가 집사부가 되고, 숙부는 줄어든다.
					654년, 여왕 머리에 칠 년을 앉아 있던 왕관이 옮겨진다. 일은 이미 조카의 책상 위에 있었고, 춘추는 무열왕이 된다.
					그 책상에서 멀리, <a href={person('jayi')}>자희</a>는 이미 왕자의 산수가 허술하다고 결론 냈다. 부두는 그가 왕자인 것을 신경 쓰지 않는다.
				</p>
				<p>
					해동증자는 조정이 좋아하는 이름으로 부르는 의자의 치세다. 동쪽의 증자.
					사택왕후가 죽고, 왕은 거절할 권리를 잃는다. 은고의 여덟 원한과 마흔한 아들은 그가 칙서로 만든 충성이다.
					온조의 건국 — 돌팔매의 소년, 그리고 부여를 한 번도 언급하지 않는 아버지의 대청 — 은 백제의 끝 안에서 백제의 시작으로 말해진다.
					성충은 한 단어를 청하고 술단지를 받았다. 흥수는, 맞아서 쫓겨났기 때문에 불려 온다.
					계백은 세지 않고 배에서 내린다. 그가 맹세한 나라는 이미 자신을 먹고 있다.
				</p>
				<p>
					이 부의 후기는 해를 아예 떠난다. 삼계. 강림의 첫 회합이고, 세 강과, 어떤 달력도 지나온 누각과, 그가 묻지 말았어야 할 질문.
				</p>

				<h3 id="part-3">2.4. 삼한일통 <span class="edit">[편집]</span></h3>
				<figure class="thumb left">
					<img src="/album_gyebek.png" alt="갑옷을 입은 남자가 등을 보이고 무릎을 꿇는다. 곧은 칼이 흙에 박혀 있다." />
					<figcaption>
						<a href={person('gyebek')}>계백</a>. 황산은 그가 탐라의 모래에서 깨어난 뒤, 섬이 신화를 다 말한 다음에야 페이지에서 싸운다.
					</figcaption>
				</figure>
				<p>
					백제의 멸망은 해변에서 시작한다. <a href={person('yuridora')}>유리도라</a>의 섬에는, 자기가 어디 있는지 모르는 남자가 모래에 있다.
					들판보다 섬이 먼저다. 천지왕과 두 해, 생명의 자리를 원하는 두 딸, 그 자리를 얻는 정원사, 죽은 자의 재판관을 잡으러 산 채로 내려온 강림, 구멍에서 나오는 세 왕자, 바위에서 나오는 산방덕.
					그런 다음이 오천이다. 제국과 한 나라를 상대하고, 계백은 이미 산수를 끝냈다.
					{@render bar('gyebek', '그 산수는 그의 죽음으로 닫힌다. 사서는 오천과 황산벌을 적고, 이 책은 그 전에 섬을 먼저 보여 준다.')}
					서쪽 수도에는 자백이 이미 씌어 있고, 맨 아래에 의자 이름을 넣을 칸이 비어 있다. 그 일을 꾸민 춘추는 쉰여덟이고 자리에서 일어나지 못한다.
					{@render bar('baekje', '백제는 끝났다고 모두가 말한다. 백제만 빼고.')}
					<a href={person('pung')}>풍</a>은 바다 건너에서 이십 년을 살았다. 662년 사수에서 백호는 아직도 강이 길이라고 믿고, 연은 그렇게 생각하는 남자를 기다려 왔다.
				</p>
				<p>
					고구려의 멸망은 원정에 이름이 오른 열아홉 장군으로 연다. 그중 둘이 몸져눕고, 경기장에서 목격된다.
					<a href={person('boksin')}>귀실복신</a>은 병상에 누워서 방문을 청한다. 왕은 다른 저녁을 기억한다.
					663년 백강에서 서와 삼한과 동이 한 물목에서 만나고, 조수는 누구의 편도 아니다.
					665년, 세 형제와 도장 하나. 남건, 그 다음 남산, 그리고 고리가 도성을 닫을 때 그들은 승려를 고른다.
					{@render bar('goguryeo', '668년 평양이 닫힌다. 이 책은 그 문을, 이미 여러 화에 걸쳐 예고한 뒤에야 닫는다.')}
				</p>
				<p>
					나당은 동맹이 동맹을 먹는 전쟁이다. 싸움 전에 신라가 어떻게 시작됐는지를 말한다.
					<a href={person('hyukgose')}>박혁거세</a>와 우물가의 흰 말, 물결 위 궤짝의 탈해, 밤에 우는 닭과 알지, 그리고 흙 한 조각을 세어 달라고 제삼자에게 묻는 작은 왕 둘.
					<a href={person('xuerengui')}>설인귀</a>는 편지로 이기고 싶어 한다. 왕은 잠자리에 들지 않는다.
					<a href={person('wonsul')}>원술</a>은 살아서 돌아온다. 아버지는 왕에게 그를 처형하라 하고, 왕은 열다섯에 했던 말로 답한다.
					단군은 여기, 어떤 나라도 있기 전에. 숙부의 장례 다음 날, 문무는 질문 하나를 김 속으로 가져오고 열다섯 세대가 답하러 온다.
					서쪽이 상륙했던 강어귀 기벌포에서, 한 번도 이겨 본 적 없는 대장이 일부러 두 번 진다.
				</p>
				<p>
					삼한의 왕은 문무가 대청을 마당에 여는 아침이다. 다섯 여름 뒤 강림이 질문을 던진다.
					마지막 후기는 698년의 발해. 평양이 넘어진 겨울, 노인이 왕관 조각을 눈 속으로 가지고 간다.
				</p>

				<h2 id="cast">3. 등장인물 <span class="edit">[편집]</span></h2>
				<figure class="thumb right">
					<img src="/album_chunchu.png" alt="검은 조복의 남자가 빛 쐐기 안에 서서 한 손을 든다." />
					<figcaption>
						<a href={person('chunchu')}>김춘추</a>. 뼈 때문에 왕좌에 못 가는 남자. 이 책이 방법의 사례로 두는 사람. 도장, 속도, 집사부.
					</figcaption>
				</figure>
				<p>
					배역은 크고, 위키의 경력은 해마다 바뀐다. 왕자가 왕이 되면 얼굴은 두고 이름만 새로 받는다.
					아래는 작중 포지션이다. 행적을 연표로 다시 풀지는 않는다. 이름을 누르면 그 사람 문서가 옆에서 열린다.
				</p>

				<h3 id="silla">3.1. 신라 <span class="edit">[편집]</span></h3>
				<h4><a href={person('sunduk')}>선덕여왕</a></h4>
				<p class="more">자세한 내용은 <a href={person('sunduk')}>선덕여왕</a> 문서를 참고하십시오.</p>
				<p>
					문이다. 왕관을 씌우는 조정이 여왕을 진지한 문장으로 믿지 않고, 그 다음 그 아래에서 정치를 해야 한다.
					첫 줄이 문서 맨 위에 있는 이유다. “여왕? 웃기지도 않는군.”
				</p>
				<h4><a href={person('chunchu')}>김춘추</a></h4>
				<p class="more">자세한 내용은 <a href={person('chunchu')}>김춘추</a> 문서를 참고하십시오.</p>
				<p>
					여러 해 동안, 다스릴 허락이 없는 방에서 가장 영리한 남자. 폐위된 왕의 손자고 뼈가 왕좌를 막는다.
					그가 주장하는 서쪽은 복장이 아니라 방법이다. 도장, 속도, 집사부.
					한도는, 대야가 딸을 죽이기 전에는 서울이 대야에서 어떻게 보이는지 모른다는 것. 왕좌를 받고, 아들에게는 반쯤 이긴 전쟁과 청구서를 남긴다.
				</p>
				<h4><a href={person('yushin')}>김유신</a></h4>
				<p class="more">자세한 내용은 <a href={person('yushin')}>김유신</a> 문서를 참고하십시오.</p>
				<p>
					대장군. 유자고, 절의 사람이 아니다. 본인이 직함을 발표하지 않는다.
					흰 말이 능선에 서면 초병이 밥을 다 못 먹고, 고구려 기병이 이름을 외치면 추격이 깨진다. 평판은 그쪽으로 쌓인다.
				</p>
				<h4><a href={person('munmu')}>김법민</a></h4>
				<p class="more">자세한 내용은 <a href={person('munmu')}>김법민</a> 문서를 참고하십시오.</p>
				<p>
					제목을 소년 때 말하고, 그것을 참으로 만들어야 하는 왕. 아버지가 초대한 동맹에 대해서도.
					춘추나 연이나 의자처럼 나이를 휘지 않는다. 누이가 집에 못 오는 것을 보고, 아버지가 나라를 발명하는 것을 보고, 지도를 거꾸로 쥐고 전쟁을 배운다.
					원하는 것은 부두를 포함하는 나라고, 상처는 빈자리다.
				</p>
				<h4><a href={person('bidam')}>비담</a></h4>
				<p>
					회의에서 손을 안 내리는 남자. 불교도이고, 동시에 이 흙의 사람이다. 구슬과 연꽃과 향은 그의 것이고, 유신의 것은 아니다.
					반란은 날짜를 단 머리글로 진행된다. 동굴의 여신들이 그를 쫓아낼 때는, 김씨 남자의 목욕이 아니라 위협하는 짐승의 형이다.
				</p>
				<h4><a href={person('munhee')}>문희</a>, <a href={person('jayi')}>자희</a></h4>
				<p>
					김 집안의 사적인 반쪽. 하나는 팔린 꿈과 붙든 살림이고, 하나는 부두와 여백과 나중의 나라 장부다.
					자희는 왕자의 산수를 고치고, 왕후가 되어서도 나라를 조석표처럼 다룬다.
				</p>

				<h3 id="baekje">3.2. 백제 <span class="edit">[편집]</span></h3>
				<h4><a href={person('euija')}>의자왕</a></h4>
				<p>
					늦은 후계자. 나라는 하나의 이야기가 다스리는 영역이라고 믿게 되고, 여덟 대성이 살아남지 못하는 이야기를 쓴다.
					이 책에서 주제를 입 밖으로 내도 되는 목소리는 그뿐이다. 잃을 사람이기 때문이다.
					아들에게 씨족이 하나씩 소유권을 갖도록 낳고, 집안을 숙청하고, 궁을 봉하고, 그 이야기가 처음부터 자기 것이 아니었다는 것을 발견한다.
				</p>
				<h4><a href={person('gyebek')}>계백</a></h4>
				<p>
					칼을 거꾸로 쥔다. 고리가 엄지 위에 오고, 곧은 날이 팔뚝을 따라 뒤로 간다.
					이름은 처음에는 안 큰다. “칼을 거꾸로 드는 백제 대장”으로, 남의 두려움 속에서 커진다. 황산의 오천은 탐라가 이미 신화를 말한 뒤다.
				</p>
				<h4><a href={person('gumilwife')}>매화</a></h4>
				<p>
					사서가 이름을 안 준 여자에게 이 책이 붙인 이름. 대야의 함락은 그를 통과한다.
					2009년 드라마의 미실 자리를 찾는 사람이 여기로 오면, 자리가 다르다. 이쪽의 그 자리는 매화다.
				</p>

				<h3 id="goguryeo">3.3. 고구려 <span class="edit">[편집]</span></h3>
				<h4><a href={person('gesomun')}>연개소문</a></h4>
				<p>
					영주도대장군. 말은 거칠고, 인용은 자기 나라의 왕과 장수에게서만 한다. 아들 셋, 도장 하나.
					잠자리 이야기가 아닌 소문으로 먼저 오고, 최고 회의에 앉기도 전에 발굽이 들린다.
					대중매체의 연개소문 — 폭군 아니면 영웅 — 과 이 책의 연개소문은 온도가 다르다. 이쪽은 그 이분법을 다시 판결하지 않고, 방 안의 남자로 둔다.
				</p>
				<h4><a href={person('jumong')}>주몽</a>, <a href={person('haemosu')}>해모수</a></h4>
				<p>
					서곡이 아니다. 당과의 전쟁 한가운데서 말해진다. 알과 강과, 한 번 멈추는 해.
					주몽의 얼굴은 즐겁다. 소서노가 심술일 때 웃고, 눈을 가늘게 뜬다. 건국 동상으로 세워 두지 않는다.
					왕이기 전의 그는 수염이 없다. 유배 초상에 얇은 콧수염이 있어도, 작중 지시가 그것을 무시한다.
				</p>

				<h3 id="tang">3.4. 당 <span class="edit">[편집]</span></h3>
				<h4><a href={person('taizong')}>태종</a></h4>
				<p>
					643년에 이름을 듣고, 645년에 안시에 있다. 춘추가 쓸 수 있다고 믿는 동맹.
					칭호는 화려하고, 문제는 바깥이 없는 지도를 원한다는 것이다. 이름을 포도처럼 혀 위에서 굴리는 장면이, 이 인물의 입장권이다.
				</p>
				<h4><a href={person('xuerengui')}>설인귀</a></h4>
				<p>
					마지막 전쟁을 편지로 이기고 싶어 한다. 반도는 계속 그를 몸소 오게 만든다.
					매소로 돌아올 때는 신라 소년이 안내하고, 그 소년의 아버지는 왕이 죽인 사람이다.
				</p>

				<h3 id="gods">3.5. 신과 저승 <span class="edit">[편집]</span></h3>
				<h4><a href={person('kangrim')}>강림</a></h4>
				<p>
					산 사람을 저승으로 걷게 하고, 큰 삶의 끝에서 질문 하나를 던진다. 의식이고, 인터뷰가 아니다. 문장은 안 바뀐다.{@render fn(12)}
					삼계의 첫 회합에서 묻지 말았어야 할 질문을 갖고, 문무의 뒤에도 다시 온다.
				</p>
				<h4><a href={person('narim')}>나림</a>, <a href={person('golhwa')}>골화</a>, <a href={person('hyulle')}>혈례</a></h4>
				<p>
					서라벌 아래 김 속의 셋. 신라의 한 세기 내내 거기 있다. 선포할 때만 눈 전체가 제 색으로 빛나고, 그 밖의 밤에는 눈이 살아 있다.
					비담을 쫓아낼 때는 각각 불의 호랑이, 물의 뱀, 이끼의 곰이 된다. 유신이 늙어서 찾아와도 나이는 늘 그대로다.
				</p>
				<p>
					단군, 혁거세, 수로, 탐라의 신화는 정치가 까먹고 지나가는 오프닝으로 앞에 놓이지 않는다.
					탐라의 창조는, 이미 진 백제 장군에게 말해진다. 독자를 길들이려고 맨 앞에 두는 용도와는 쓰는 자리가 다르다.
				</p>

				<h2 id="lines">4. 명대사 <span class="edit">[편집]</span></h2>
				<ul class="quotes">
					<li>
						<blockquote>여왕? 웃기지도 않는군.</blockquote>
						<p>632년, 서라벌이 선덕을 만나는 첫 호흡. 이 문서가 개요에서부터 붙들고 있는 문장. 농담으로 시작된 방이, 그 뒤로 나라를 한다.</p>
					</li>
					<li>
						<blockquote>모두를 위한 왕이요.</blockquote>
						<p>법민. 소년 때 말하고, 대청이 자기 것이 된 아침까지 책이 그에게 맡긴다. 영문 제목이 여기서 나왔다.{@render fn(2)}</p>
					</li>
					<li>
						<blockquote>나라는, 하나의 이야기가 다스리는 영역이다.</blockquote>
						<p>의자. 주제를 입 밖으로 내도 되는 목소리. 이유는 멋있어서가 아니라, 그가 그 문장에 지기 때문이다.</p>
					</li>
				</ul>

				<h2 id="bait">5. 떡밥 <span class="edit">[편집]</span></h2>
				<p class="warn">
					이 문단의 내용 중 전체 또는 일부는 스포일러를 포함하고 있습니다. 연재를 따라 읽는 중이면 여기서 멈추는 편이 낫습니다.
					<s>이미 스크롤하셨죠</s>
				</p>
				<p>
					나무위키에서 말하는 떡밥은, 작중이 던져 두고 나중에 주워 가는 질문이다. 이 책은 그 질문을
					<a href={threadsPage}>대시보드</a>에도 모아 두었고, 이 표는 그중 문서에 남을 만한 것을 추린 것이다.{@render fn(19)}
					같은 밤의 재서술, 한 장면에서 묻고 그 장면에서 답하는 것은 여기 안 넣는다.{@render fn(16)}
					상태는 거의 다 <b class="got">회수</b>다. 대본이 이 지점까지 온 지금은 주요 떡밥을 이미 써 버렸다. 빈 미회수 칸을 만들어 채우는 척하지 않는다.
					<s>미회수 칸 만들고 싶었음</s> 이름을 일부러 안 말한 것 하나는 아래 5.5와 <a href="#inq-voice">탐구</a>에 따로 둔다.
				</p>

				<h3 id="bait-yongsu">5.1. 비형 · 용수 <span class="edit">[편집]</span></h3>
				<p>
					이 묶음이 제일 길다. 마당이 먼저 별명을 붙이고, 그 별명이 두 화 뒤에야 사람 이야기가 된다. 귀신 아이, 미친 아버지, 말하는 물, 아무도 안 시킨 다리. 독자가 농담으로 넘긴 문장이 장부다.
				</p>
				<table class="grid">
					<thead>
						<tr>
							<th>떡밥</th>
							<th>투척</th>
							<th>회수</th>
							<th>상태</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>도깨비</td>
							<td><a href={ep('Queen Sunduk')}>선덕</a>, 632. 발 없는 도깨비가 밤에 다리를 놓고, 여우는 할아버지에게 절한다. 춘추에게 가는 말은 농담이다. 할아버지 말 그만 듣고, 다음엔 개울하고 얘기하겠다.</td>
							<td><a href={ep('Bihyung')}>비형</a>. 아침에 다리가 있다. 조정은 귀교라 부르고 멀리 돌아간다.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>귀신 아이</td>
							<td><a href={ep('Munhee')}>문희</a>, 625. “야, 귀신 아이.” 대문 앞에 선 아버지가 엄마랑 말하는지, 문이랑 말하는지. 마당이 이미 이름을 갖고 있다. <a href={ep('Bupmin')}>법민</a> 641에 또 나온다. 어느 무리도 그 애를 안 받는다.</td>
							<td><a href={ep('Kim Yongsu')}>용수</a>. “비형 아닙니다. 귀신 아이도 아닙니다. 폐하.”</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>귀신 아이, 한 번 더</td>
							<td>문희. 무리에 안 넣는다. “귀신의 손자라니. 그 집안은 인기가 많아도 위험하다.” 같은 말이 법민 641에 반복된다.</td>
							<td><a href={ep('Bihyung')}>비형</a>. 서라벌이 그 이름을 욕으로 돌려 쓴다. 엄마들은 아이 겁주는 데 쓴다.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>두 가지</td>
							<td><a href={ep('Harmony Council')}>화백</a>, 632. 죽는 왕이 사위에게, 예전에 부탁한 두 가지를 둘 다 했다고 한다. 부탁의 내용은 아직 안 보여 줬다.</td>
							<td>용수. 아내가 약속시킨 것. 아버지가 제 집에서 늙어 죽게.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>이미 바쁜 노인</td>
							<td><a href={ep('Seohyun')}>서현</a>, 593. 술보가 연애를 혼내며 딸을 가둔다. 그때 읽으면 딸 문제로 보인다.</td>
							<td>비형. 귀교를 한 번 걷고, 돌마다 두드리고, 도깨비 마흔이 뭘 먹는지 묻는다. 진짜 바쁜 일은 그거였다.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>귀교</td>
							<td>화백, 632. 아침에, 누가 시킨 적 없는 돌다리가 놓여 있다.</td>
							<td>용수. 가면을 쓴 마흔, 창고에서 깎은 돌. 귀교는 그렇게 놓였다.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>말하지 마</td>
							<td>화백, 632. 밤중에 아이를 개울로 데려간다. 궁이 못 듣는 곳. 한 말은 독자에게 안 들린다.</td>
							<td>용수. “가서. 친구가 기다린다. 말하지 마. 내가 없으면 그 이름을 기억할 사람이 있어야지.”</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>물은 말 안 한다</td>
							<td>문희. 마당의 농담. 네 아버지는 물이랑 얘기한다. 너는 뭐랑 얘기하는데.</td>
							<td>용수. “도깨비도, 귀신도, 말하는 개울도 없었다. 나는 미치지 않았다.”</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>그 방</td>
							<td>선덕. 춘추는 정치를 더 작은 삶을 사는 남자들 몫이라 하고, 화백은 경고한다. 그 방은 재미있어하는 남자를 먹는다. 다리에 앉아라.</td>
							<td>용수에서 같은 문장이 아버지의 말로 돌아온다. 의자 여섯 달린 방.</td>
							<td><b class="got">회수</b></td>
						</tr>
					</tbody>
				</table>

				<h3 id="bait-gaya">5.2. 가야 <span class="edit">[편집]</span></h3>
				<p>
					“가야”는 한참 동안 욕이고, 피붙이고, 침상이지 나라가 아니다. 나라가 되는 화는 따로 있고, 그 전에 고깔만 방을 보고 있다. 앞 화는 그 고깔의 주인을 이름으로 안 부른다.{@render fn(18)}
				</p>
				<table class="grid">
					<thead>
						<tr>
							<th>떡밥</th>
							<th>투척</th>
							<th>회수</th>
							<th>상태</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>가야라는 말</td>
							<td><a href={ep('Back When Tigers Smoked')}>호랑이 담배 피우던 시절</a>의 욕, 화백의 “가야의 김이로군. 그 대장의 피는 왕족이다”, <a href={ep('Munhee')}>문희</a>의 침상, <a href={ep('Seung')}>승</a>에서 또 한 번. 말은 잔뜩인데 설명이 없다.</td>
							<td><a href={ep('Muryuk')}>무력</a>. 넘어진 왕이 올려다보고, 신라보다 먼저 가야를 본다.{@render fn(18)}</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>너는 왕이 돼</td>
							<td>선덕, 632. “모두를 위한 왕. 너는 그거 해. 나는 옆에 서 있을게.” 왜 본인이 왕이 안 되는지는 안 말한다.</td>
							<td>무력. 고깔은 그대로다. 산 피의 투구를 벗지 않는 장군. 서현의 집 안에서는 그 투구가 문 옆 받침대에 앉아 방을 본다.{@render fn(18)}</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>고깔</td>
							<td>서현, 593. 소년은 아침마다 고깔을 쓰고 나간다. 집 안에서는 문 옆 받침대가 방을 본다.</td>
							<td>무력. 자기 투구를 들어 아이 머리에 씌운다. 눈이 가린다.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>왜 당신</td>
							<td><a href={ep('King Seong')}>성왕</a>. “신라…? 이 길에, 오늘 밤에. 왜 당신인가.”</td>
							<td>무력. 넘어진 왕이 신라보다 먼저 가야를 본다. <a href={ep('Sadaham')}>사다함</a>은 몇 해 뒤, 고깔 투구의 장군이 자기가 베는 것을 보고도 말리지 않는 장면을 지나간다. 아직 말을 안 나눴다. 시점 떡밥이라 답이 한 입에 안 들어온다.{@render fn(18)}</td>
							<td><b class="got">회수</b></td>
						</tr>
					</tbody>
				</table>

				<h3 id="bait-gods">5.3. 신과 물건 <span class="edit">[편집]</span></h3>
				<p>
					물건이 먼저 화면에 있고, 이름은 나중이다. 나무위키가 제일 좋아하는 종류. 장승, 색 빠진 그림, 비에 쓰겠다는 말, 왕 머리에 올린 신.
				</p>
				<table class="grid">
					<thead>
						<tr>
							<th>떡밥</th>
							<th>투척</th>
							<th>회수</th>
							<th>상태</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>장승</td>
							<td><a href={ep('Lady Ungo')}>은고</a>. 골목이 할아버니 할머니다 부르는 기둥 둘. 창과 검은 띠, 눈이 반쯤 감긴 넓은 갓.</td>
							<td><a href={ep('Grim Reaper')}>저승사자</a>에서 이름이 붙고, <a href={ep('Three Realms')}>삼계</a>에서 바리가 그 갓이 누구 것이었는지 길을 가리킨다.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>삼신</td>
							<td><a href={ep('High Summit')}>최고 회의</a>. 세 세대가 만져 색이 빠진 출산의 그림.</td>
							<td>삼계. 천지왕이 그 그림의 주인에게 이름을 붙인다.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>비</td>
							<td><a href={ep('King Gwanggeto')}>광개토</a>. “그 이름을 비에 쓰겠다. 문은 지금 열린다.”</td>
							<td><a href={ep('The Stele')}>그 비</a>가 나중 화다. 가족은 돌 앞에 작게 서고, 비는 신라보다 그 일을 곱게 기억한다.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>그 신</td>
							<td>광개토가 왕 머리에 신을 올리고, 왕자들을 북으로 데려간다.</td>
							<td><a href={ep('Momal')}>모말</a>. “너는 남아. 그 신을 기억할 사람이 있어야지.” 한 화가 다음 화로 이어지는 쪽.</td>
							<td><b class="got">회수</b></td>
						</tr>
					</tbody>
				</table>

				<h3 id="bait-sword">5.4. 칼과 들판 <span class="edit">[편집]</span></h3>
				<p>
					체호프의 총 쪽. 속삭임은 안 들리고, 한 단어짜리 약속은 상대가 없고, 잔치에 나온 얼굴은 대부분 아직 중요하지 않다. 나중에 전부 쓴다.
				</p>
				<table class="grid">
					<thead>
						<tr>
							<th>떡밥</th>
							<th>투척</th>
							<th>회수</th>
							<th>상태</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>반쪽 칼</td>
							<td><a href={ep('Haemosu')}>해모수</a>. 주몽이 예씨에게 속삭인다. 말은 페이지까지 안 온다.</td>
							<td><a href={ep('Onjo')}>온조</a>. 소나무, 칠각석, 갈라진 틈의 반쪽. 주몽이 나머지 반쪽을 꺼내 맞춘다.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>계백의 말</td>
							<td><a href={ep('Gyebek')}>계백</a>. “나는 약속을 했다.” 누구에게인지는 안 말한다.</td>
							<td><a href={ep('Hwangsan Field')}>황산</a>. 마지막 진이 그 약속이다.</td>
							<td><b class="got">회수</b></td>
						</tr>
						<tr>
							<td>혼례</td>
							<td>문희. 한 잔치. 커플, 신부의 아버지, 그리고 신라에서 제일 좋은 칼에 얼굴을 묻고 우는 노인. 대부분 아직 안 중요하다.</td>
							<td>비형에서 그 노인이 누구인지, 문 앞에서 술보가 왜 멈추는지가 붙는다. 같은 밤을 여러 눈으로 보는 쪽.</td>
							<td><b class="got">회수</b></td>
						</tr>
					</tbody>
				</table>

				<h3 id="bait-open">5.5. 안 회수한 것 <span class="edit">[편집]</span></h3>
				<p>
					미회수 표를 만들고 싶은 사람이 있는데, 채울 칸이 거의 없다. 대본이 주요 질문을 이미 써 버렸기 때문이다.
					남는 것은 <b class="held">의도적 미회수</b> 하나. 화자의 이름.{@render fn(17)}
					작품이 “말 안 한다”를 장치로 박아 둔 거라, 작가가 까먹고 안 주운 떡밥이랑은 종류가 다르다. 폐기 떡밥 칸도 비어 있다. 억지로 “이거 버림”을 만들지 않는다.
					후삼제왕(828–943)은 떡밥이 아니라 구상이다. 회수 대기열에 넣지 말 것.{@render fn(3)}
				</p>

				<h2 id="inquiry">6. 탐구 <span class="edit">[편집]</span></h2>
				<p>
					줄거리가 “무슨 일이 있었나”라면, 이 문단은 “왜 이렇게 써 놨나”다. 나무위키 탐구란의 버릇대로, 문서는 의견을 갖고 단정은 아낀다. 외부 논문 인용은 없다. 있으면 각주에 출처를 달았을 것이다.
				</p>

				<h3 id="inq-order">6.1. 연표를 꼬아 놓은 이유 <span class="edit">[편집]</span></h3>
				<p>
					주몽은 당과의 전쟁 한가운데 나오고, 단군은 나라가 이미 선 뒤에 나오고, 온조는 백제가 끝나는 부에 있다. 앞에서 활이니 우물이니 “부여의 피”니 하고 장난을 쳐도, 족보 수업은 그 신화 자기 화까지 미룬다.{@render fn(13)}
					연표파 입장에서는 거의 악의다. 이 문서의 정리는 이렇다. 독자가 먼저 만나는 방을 632년으로 고정해 두고, 신화는 그 방의 누군가가 원인을 필요로 할 때 날씨처럼 불러 오는 쪽.
					건국을 1화에 몰아넣으면 뒤의 정치가 설화가 되고, 설화를 뒤로 빼면 정치가 설화의 청구서가 된다. 이 책은 후자를 골랐다. 탐라의 창조가 이미 진 장군에게 말해지는 것도 같은 버릇이다. 입문서 맨 앞에 두는 용도가 아니다.
				</p>
				<p>
					평판도 같은 방식으로 미룬다. 김유신이라는 이름이 길을 비우는 이유는 본인 소개가 아니라, 밥을 다 못 먹는 초병과 이름을 듣는 순간 깨지는 추격이다. 계백은 한참 “칼을 거꾸로 드는 백제 대장”으로만 큰다.
					같은 일을 서술과 연설과 인용으로 세 번 말하지도 않는다. 장면이 이미 했으면 본기에게 그 일을 다시 안 시킨다. 사극이 좋아하는 “자, 이제 해설”이 이 책에는 없다. <s>아쉽다</s> 일부러다.
				</p>

				<h3 id="inq-voice">6.2. 화자는 누구인가 <span class="edit">[편집]</span></h3>
				<p>
					삼인칭으로 독자에게 말을 건다. 어떻게 끝나는지 아는 사람처럼, 이 집안에 옛 정이 있는 사람처럼. 하늘을 경전처럼 읊지 않고 집안 소문처럼 말한다. 이름은 끝까지 안 나온다.{@render fn(7)}
					눈치채면 그때부터 날씨 얘기가 조금 달라지는데, “나는 누구다”는 없다. 나무위키 탐구가 좋아하는 종류, 그러니까 설은 많고 결론은 작품이 안 주는 종류다.
				</p>
				<ul>
					<li>
						<b>그냥 작가 설.</b> 해설자가 똑똑한 척하는 것뿐이다. 반론은 온도다. 평범한 해설자는 신을 친척 소문처럼 안 다루고, 죽음을 미리 알고 놀리지도 않는다. 말투가 한 사람의 버릇으로 읽힌다.
					</li>
					<li>
						<b>작중 인물 설.</b> 나중에 등장하는 누군가가 전부 돌아보며 말하는 회고다. 반론은 형식이다. “나는 누구다”가 없고, 죽은 인물이 현재 시제로 방을 해설하지도 않는다. 회상이면 회상으로 표시하는 책이, 이 목소리는 표시하지 않는다.
					</li>
					<li>
						<b>이름을 알면 끝나는 설.</b> 독자가 눈치채라고 빈칸을 둔 것이다. 이쪽이 문서의 잠정 정리에 제일 가깝다. 다만 이름을 적는 순간 잠정이 결론이 되고, 작품이 안 한 일을 각주가 해 버린다.{@render fn(17)} 그래서 후보 이름은 이 문단에 안 적는다. <s>적고 지움</s>
					</li>
				</ul>
				<p>
					떡밥 표의 상태로는 <b class="held">의도적 미회수</b>. 까먹은 게 아니다. 회수하면 장치가 죽는다. 2차 창작으로 이름을 붙이는 건 독자 자유고, 이 문서의 일은 아니다.
				</p>

				<h3 id="inq-room">6.3. 방이 주제인 이유 <span class="edit">[편집]</span></h3>
				<blockquote>여왕? 웃기지도 않는군.</blockquote>
				<p>
					서라벌은 이 문장으로 <a href={person('sunduk')}>선덕</a>을 맞는다. 화백 — 귀족 여섯, 화로 하나, 다 동의하기 전에는 아무도 못 일어나는 방 — 이 그 농담과 같이 산다.
					이 책이 좋아하는 단위가 그 방이다. 골품, 팔족, 오부, 바깥이 없는 지도를 원하는 당의 식욕은 칠판에 안 올라간다. 연회가 반란이 되고, 봉인된 함이 회의가 되고, 맞아서 쫓겨난 남자가 무너지는 왕에게 불려 오는 이유로 방에 심어 둔다.{@render fn(15)}
				</p>
				<p>
					주제를 입 밖으로 내도 되는 목소리는 의자뿐이다. “나라는, 하나의 이야기가 다스리는 영역이다.” 멋있어서 허락한 대사가 아니다. 그 문장에 지는 사람이라 허락한 것이다.
					다른 누가 같은 말을 하면 이 책은 갑자기 논문이 된다. 그래서 안 시킨다. 춘추의 “정치는 더 작은 삶을 사는 남자들 몫”도 주제 선언이 아니라, 나중에 아버지 입으로 회수되는 떡밥이다. 6.3과 5.1이 같은 문장을 보는 이유가 그거다.
				</p>

				<h3 id="inq-tongue">6.4. 영어만 갈리는 이유 <span class="edit">[편집]</span></h3>
				<p>
					새 문단은 영어와 한국어가 같이 있다. 한국어는 그 사람 말투다. 높임, 반말, 형제끼리 말이 끊기는 것, 조정에서의 격식. 이쪽은 안 건드린다.
					갈리는 건 영어 단어뿐이다.{@render fn(8)} 고구려 쪽 입은 옛말을 집어 오고, 백제 쪽 입은 고전 선반을 뒤지고, 신라 쪽 입은 새 제도의 단어를 고른다. 당과 야마토는 이 놀이에 안 끼워 준다.
					양쪽을 같이 읽는 사람만 눈치채는 장치라, 한 언어로만 보면 그냥 대본이다. 번역투로 “정치적 어휘의 분화”라고 쓰면 이 문단이 죽는다. 입이 어느 선반을 뒤지는지의 문제다.
				</p>
				<p>
					그림도 같은 원칙이다. 한 컷에 장치가 하나. 얼굴은 위키 초상에서 오고, 신화는 빈 종이 위의 먹이라 한눈에 신화로 보인다.{@render fn(9)}
					둘레의 역사는 보통 채색으로 남는다. 초상이 카타나를 쥐고 있어도 작중의 검은 환두대도로 통일인데, 이건 탐구라기보다 여담에 가깝다. 나무위키는 겹쳐도 적으니 여담에도 적어 둔다.
				</p>

				<h3 id="inq-2009">6.5. 2009년과의 거리 <span class="edit">[편집]</span></h3>
				<p>
					출발점으로 이름만 올리고 줄거리는 안 따라간 경우다.{@render fn(6)} 그 드라마의 탐구가 길어지는 지점 — 미실이 제목을 집어삼킨 일, 화랑세기를 얼마나 믿었는가 — 은 이 책의 질문이 아니다.
					이쪽에서 그 질문에 해당하는 건 “한 명의 악역이 방을 대신하는가”인데, 이 책은 안 그렇다. 미실이 하던 일, 그러니까 방을 무겁게 만드는 일을, 악역 한 명에게 몰아주지 않고 방 자체에 맡긴다.
					대야를 통과하는 이름 없는 여자는 매화가 맡는다. 미실 포지션을 찾는 검색은 여기서 끊긴다.
				</p>
				<p>
					다만 출발점이라는 말을 완전히 무시할 수도 없다. 여왕을 조정 농담에서 시작하는 것, 사람을 모으는 정치, 화랑이 군사인 동시에 사교인 것. 공기만 가져오고 플롯은 안 가져왔다.
					“사람을 얻는 자가 천하를 얻는다”를 이 책의 주제어로 옮기면 그 드라마 문서를 베끼는 것이 된다. 이 책의 주제어는 그 문장이 아니라, 법민이 소년 때 한 말과 의자가 지고 마는 말이다. 둘은 같은 백 년의 반대편이다.
				</p>

				<h2 id="record">7. 고증 <span class="edit">[편집]</span></h2>
				<p>
					등뼈는 한국 사서고, 한가운데가 『삼국사기』다.{@render fn(4)} 신화는 『삼국유사』, 야마토 함대는 『일본서기』, 장안은 당측 기록.{@render fn(5)}
					본기·비문·편지는 화 안에서 자기 종이로 나오고, 그 문장은 고치지 않는다. 각색한 척 하는 순간 이 책이 연의가 된다.
					사서가 안 주는 것 — 사적인 이름, 동기, 마당에서 하는 말 — 은 이 책 몫이다. 지어낸 해는 그 사람에게 지어낸 것으로 표시해 둔다. 공부용으로 펼치면 <s>큰일난다</s>.
				</p>
				<p>
					삼국지연의에 붙던 칠실삼허는, 여기서는 경고로만 불린다. 비율을 내놓지 않고 이음새를 보이게 둔다.{@render fn(10)}
					참고로 이 표는 전부가 아니다. 본기인 줄 알고 지나가기 쉬운 갈림만 골라 둔 것이다.
				</p>
				<table class="grid">
					<thead>
						<tr>
							<th>사안</th>
							<th>사서</th>
							<th>이 책</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>선덕, 632</td>
							<td>즉위를 적는다.</td>
							<td>첫 조정이 그 즉위를 농담으로 듣는다.</td>
						</tr>
						<tr>
							<td>황산벌, 660</td>
							<td>오천, 그리고 들판에서의 죽음.</td>
							<td>들판은 탐라가 신화를 다 말한 다음에야 온다.</td>
						</tr>
						<tr>
							<td><a href={person('gumilwife')}>매화</a></td>
							<td>이름이 없다.</td>
							<td>이름을 붙이고, 대야를 그 사람으로 통과시킨다.</td>
						</tr>
						<tr>
							<td>계백의 동생</td>
							<td>그런 이름이 없다.</td>
							<td>아소. 동쪽 지붕은 강의 이름을 유지한다.{@render fn(11)}</td>
						</tr>
						<tr>
							<td>모두를 위한 왕</td>
							<td>문무의 전쟁, 당을 밀어내는 일은 역사다.</td>
							<td>문장은 이 책 것. 소년이 말하고, 왕이 되어서 답한다.</td>
						</tr>
						<tr>
							<td>건국 신화</td>
							<td>주로 『삼국유사』.</td>
							<td>필요할 때 나오고, 먹으로 그린다. 둘레의 역사는 보통 문체로 남는다.</td>
						</tr>
						<tr>
							<td><a href={person('kangrim')}>강림</a></td>
							<td>본기의 인물이 아니다.</td>
							<td>큰 죽음마다 한 질문. 문장은 그대로다.{@render fn(12)}</td>
						</tr>
						<tr>
							<td>화자</td>
							<td>그런 사람이 없다.</td>
							<td>이름 없이, 하늘을 집안 소문처럼 말한다.{@render fn(7)}</td>
						</tr>
					</tbody>
				</table>

				<h2 id="places">8. 보는 곳 <span class="edit">[편집]</span></h2>
				<p>
					한 몸이고, 앉는 의자가 여러 개다. 만화나 지도가 다른 손의 각색은 아니다.
					문장이 그 문장이 부른 사람을 열고, 지도의 국경은 그 화가 걷는 국경이고, 위키 초상은 스틸이 맞춰야 하는 얼굴이다.
				</p>
				<table class="grid">
					<thead>
						<tr>
							<th>자리</th>
							<th>하는 일</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><a href={read}>읽기</a></td>
							<td>대본. 영어와 한국어, 화 안의 그림, 기록의 종이.</td>
						</tr>
						<tr>
							<td><a href={comic}>만화</a></td>
							<td>같은 글을 컷으로 앉힌 보기.</td>
						</tr>
						<tr>
							<td><a href={wiki}>위키</a></td>
							<td>인물, 신, 장소, 씨족, 칼, 말. 해에 따라 이름과 직이 바뀐다.</td>
						</tr>
						<tr>
							<td><a href={map}>지도</a></td>
							<td>해마다 움직이는 국경. 패자는 나라 전체의 바깥 빛으로 보인다.</td>
						</tr>
						<tr>
							<td><a href={timeline}>연표</a></td>
							<td>국경의 시간. 당과 왜의 최대 강역, 일본이라는 이름의 전환.</td>
						</tr>
						<tr>
							<td><a href={tree}>가계</a></td>
							<td>신라 왕실의 나무.</td>
						</tr>
						<tr>
							<td><a href={images}>그림</a></td>
							<td>화의 스틸. 초상과 같은 얼굴.</td>
						</tr>
						<tr>
							<td><a href={episodes}>화 목록</a></td>
							<td>101화의 로그라인. 이 문서가 일부러 다시 안 베끼는 곳.</td>
						</tr>
					</tbody>
				</table>

				<h2 id="reception">9. 평가 <span class="edit">[편집]</span></h2>
				<p>
					외부 평은 없다. 출판 전이고, 서평이 없다.{@render fn(1)}
					나무위키라면 그래도 호평·혹평 칸을 만드는데, 기사 인용인 척하면 거짓말이 된다. 그래서 칸은 나누되 출처를 이 문서 자신이라고 적는다.{@render fn(20)}
					작가 노트가 정해 둔 순서는 따로 있다. 먼저 재미, 그다음 형식, 독자를 넓히겠다는 말은 세 번째고 본인도 희망에 가깝게 적는 쪽. 아래 목록은 그 노트의 요약이 아니라, 이 문서를 쓰면서 남긴 점수다.
				</p>
				<h3 id="praise">9.1. 이 문서가 치는 점 <span class="edit">[편집]</span></h3>
				<ul>
					<li>
						<b>방이 먼저다.</b> 골품이니 팔족이니를 칠판에 안 적고, 그 방이 사람을 어떻게 먹는지로 보여 준다. 연회가 반란이 되는 이유가 설명 문장이 아니라 그 방에 있다.{@render fn(15)}
					</li>
					<li>
						<b>순서를 일부러 꼬아 놨다.</b> 주몽이 서곡이 아닌 게 단점이 아니라 이 책의 자랑이다. 연표파에게는 불친절하고, 떡밥 문서를 좋아하는 사람에게는 서비스다. 자세한 건 <a href="#inquiry">탐구</a>.
					</li>
					<li>
						<b>사료와 대사를 종이를 나눈다.</b> 연의가 한 일, 그러니까 쾌감이 본기를 집어삼키는 일을 알면서, 어느 문장이 본기였는지는 남겨 둔다.{@render fn(10)}{@render fn(14)}
					</li>
					<li>
						<b>평판을 본인 입으로 안 한다.</b> 유신은 흰 말과 깨지는 추격으로 커지고, 계백은 “칼을 거꾸로 드는 백제 대장”으로 커진다. 칭호 발표가 없다.
					</li>
				</ul>
				<h3 id="pan">9.2. 이 문서가 까는 점 <span class="edit">[편집]</span></h3>
				<ul>
					<li>
						<b>사극을 기대하면 문을 잘못 찾는다.</b> 미실이 없다. 쌍둥이가 없다. 남장 공주가 사람을 모으는 줄도 없다. 출발점으로 적어 둔 드라마와 결과물이 이렇게 다르면, 들어오는 사람 절반은 한 번 당한다.{@render fn(6)}
					</li>
					<li>
						<b>정사 공부용으로 쓰면 큰일난다.</b> 작가가 먼저 말려 뒀는데도 외울 사람은 외운다. 사적인 이름, 지어낸 해, 마당의 말이 본기 옆에 앉는다. 이음새는 보이게 해 뒀으니, 안 보고 외우면 그건 독자 책임이다. <s>그래도 외운다</s>
					</li>
					<li>
						<b>읽는 순서가 불친절하다.</b> 족보를 먼저 달라는 사람한테 이 책은 거의 장난이다. 앞에서 부여의 피니 우물이니 던져 놓고 설명은 그 신화 화까지 미룬다. 입문서로 펼치면 악의로 느껴질 만하다.
					</li>
					<li>
						<b>바깥 삶이 없다.</b> 번역도, 각색도, 집계된 독자도 없다. 영향력을 적는 순간 이 문서는 거짓말이 된다. 그래서 안 적는다. 전망을 영향인 것처럼 쓰는 문서를 이 문서가 까면, 자기가 그 문서가 된다.
					</li>
				</ul>

				<h2 id="trivia">10. 여담 <span class="edit">[편집]</span></h2>
				<ul>
					<li>
						역사 공부용으로 펼치면 <s>큰일난다</s>. 작가가 먼저, 사료와 대사를 나누라고 적어 뒀다. 비율 대신 이음새.{@render fn(10)}
					</li>
					<li>
						2009년 선덕여왕을 출발점으로 적어 놓고, 그 드라마가 유명해진 이유 — 미실이 제목보다 무거워진 일 — 는 안 따라간다.
						대야의 자리는 매화다. 미실을 찾으러 왔으면 출구는 <a href="#origin">위쪽</a>에 있다.{@render fn(6)}
					</li>
					<li>
						화랑 기수는 입대한 해로 센다. 제1기(560), 제51기, 제84기. n기 = 그 해 − 559. “유신의 기수”라고 부르지 않고, 선배와 우리 기수로 말한다.
					</li>
					<li>
						김유신 초상은 카타나에 가깝게 보여도, 작중의 검은 죄다 같은 환두대도다. 손잡이와 날의 비는 1:3, 고리는 자루 끝에만 있다.
						계백의 봉황은 고리 안에 있고, 칼이 휘어서 봉황인 게 아니다. 초상을 그대로 믿으면 일본도가 나온다. <s>나온다.</s>
					</li>
					<li>
						주몽은 결투의 검사가 아니다. 궁수다. 왕이기 전의 얼굴에는 수염을 붙이지 않는다. 유배 초상에 콧수염이 있어도 무시하라는 지시가 있다.
					</li>
					<li>
						강림이 “너는 이것이었느냐, 저것이었느냐”를 묻는 것은 퇴장 인터뷰가 아니다. 큰 죽음마다 돌아오는 의식이고, 다른 누구 입에 그 형식을 안 준다.{@render fn(12)}
					</li>
					<li>
						읽는 순서는 연대가 아니다. 주몽은 당 전쟁 한가운데, 단군은 나라가 이미 선 뒤, 온조는 백제가 끝나는 부에 있다.
						앞에서 활과 우물로 장난을 쳐도 족보 설명은 그 신화 화까지 미룬다. 연표파에게는 좀 불친절하다.
					</li>
					<li>
						이름이 먼저 나오고 몸은 나중 화에 나타나는 인물이 있다. 위키 프로필이 그 순서를 적어 둔다. 한 화에서 암시와 이름과 등장이 다 끝나면, 그 칸은 비운다. 굳이 같은 말을 세 번 안 한다.
					</li>
					<li>
						여담으로, 고구려를 작중에서 그냥 고려라고 부르는 문장이 있다. 당대 호칭을 그대로 둔 것이다. 왕건의 고려랑 헷갈리라고 심어 둔 건 <s>맞다</s> 아니다.
					</li>
				</ul>

				<div class="navbox">
					<p class="navbox-title">삼한왕검 둘러보기</p>
					<p>
						<a href="#part-1">삼한산천</a>
						<span aria-hidden="true"> · </span>
						<a href="#part-2">삼한공신</a>
						<span aria-hidden="true"> · </span>
						<a href="#part-3">삼한일통</a>
					</p>
					<p>
						<a href={read}>읽기</a>
						<span aria-hidden="true"> · </span>
						<a href={episodes}>화 목록</a>
						<span aria-hidden="true"> · </span>
						<a href={wiki}>위키</a>
						<span aria-hidden="true"> · </span>
						<a href={map}>지도</a>
						<span aria-hidden="true"> · </span>
						<a href={wikipedia}>영문 문서</a>
					</p>
				</div>

				<h2 id="see">11. 관련 문서 <span class="edit">[편집]</span></h2>
				<ul>
					<li><a href={read}>연대기 본문</a></li>
					<li><a href={episodes}>에피소드 목록</a></li>
					<li><a href={wiki}>인물·장소 위키</a></li>
					<li><a href={map}>해마다 바뀌는 지도</a></li>
					<li><a href={about}>작가 노트</a></li>
					<li><a href={guide}>작품 안내</a></li>
					<li><a href={stories}>후속 구상</a></li>
					<li><a href={wikipedia}>King for All — Wikipedia</a></li>
					<li>
						<a href={person('sunduk')}>선덕여왕</a> ·
						<a href={person('chunchu')}>김춘추</a> ·
						<a href={person('yushin')}>김유신</a> ·
						<a href={person('euija')}>의자왕</a> ·
						<a href={person('gyebek')}>계백</a> ·
						<a href={person('gesomun')}>연개소문</a>
					</li>
				</ul>

				<h2 id="notes">12. 각주 <span class="edit">[편집]</span></h2>
				<ol class="footnotes">
					{#each Object.entries(NOTES) as [num, text] (num)}
						<li id={`n-${num}`} value={Number(num)}>{text}</li>
					{/each}
				</ol>
			</article>
		</div>

		<aside class="rail" aria-label="사이드바">
			<section>
				<h2>
					<span class="rail-mark" aria-hidden="true"></span>
					이 문서
				</h2>
				<ul>
					<li><a href={read}>본문 읽기</a></li>
					<li><a href={episodes}>화 목록</a></li>
					<li><a href={wiki}>인물 위키</a></li>
					<li><a href={map}>지도</a></li>
					<li><a href={timeline}>연표</a></li>
					<li><a href={tree}>가계</a></li>
					<li><a href={about}>작가 노트</a></li>
					<li><a href={wikipedia}>영문 문서</a></li>
					<li><a href="#bait">떡밥</a></li>
					<li><a href="#inquiry">탐구</a></li>
					<li><a href={threadsPage}>스레드 장부</a></li>
				</ul>
			</section>
			<section>
				<h2>
					<span class="rail-mark" aria-hidden="true"></span>
					이 문서에서
				</h2>
				<ol>
					<li><a href={person('sunduk')}>선덕여왕</a></li>
					<li><a href={person('chunchu')}>김춘추</a></li>
					<li><a href={person('yushin')}>김유신</a></li>
					<li><a href={person('munmu')}>김법민</a></li>
					<li><a href={person('euija')}>의자왕</a></li>
					<li><a href={person('gyebek')}>계백</a></li>
					<li><a href={person('gesomun')}>연개소문</a></li>
					<li><a href={person('jumong')}>주몽</a></li>
					<li><a href={person('kangrim')}>강림</a></li>
				</ol>
			</section>
		</aside>
	</div>

	{#if wikiId}
		<WikiPeek
			selectedId={wikiId}
			expanded={wikiExpanded}
			onBack={closeWiki}
			onOpen={(id) => (wikiId = id)}
			onExpand={() => (wikiExpanded = true)}
			onCollapse={() => (wikiExpanded = false)}
		/>
	{/if}
</div>

{#snippet eps()}
	<table class="grid">
		<thead>
			<tr>
				<th>부</th>
				<th>묶음</th>
				<th>해</th>
				<th>화</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td rowspan="5">앞, 그리고 1부<br />삼한산천</td>
				<td>프롤로그</td>
				<td>신화의 시간</td>
				<td>1</td>
			</tr>
			<tr>
				<td>삼국시대</td>
				<td>632–642</td>
				<td>12</td>
			</tr>
			<tr>
				<td>세속오계</td>
				<td>641</td>
				<td>12</td>
			</tr>
			<tr>
				<td>철의 의지</td>
				<td>642</td>
				<td>9</td>
			</tr>
			<tr>
				<td>후기 · 네 마리 용</td>
				<td>643</td>
				<td>1</td>
			</tr>
			<tr>
				<td rowspan="4">2부<br />삼한공신</td>
				<td>고구려·당 전쟁</td>
				<td>643–645</td>
				<td>9</td>
			</tr>
			<tr>
				<td>춘추의 시대</td>
				<td>643–654</td>
				<td>15</td>
			</tr>
			<tr>
				<td>해동증자</td>
				<td>655–660</td>
				<td>7</td>
			</tr>
			<tr>
				<td>후기 · 삼계</td>
				<td>—</td>
				<td>1</td>
			</tr>
			<tr>
				<td rowspan="4">3부<br />삼한일통</td>
				<td>백제의 멸망</td>
				<td>660–662</td>
				<td>14</td>
			</tr>
			<tr>
				<td>고구려의 멸망</td>
				<td>662–668</td>
				<td>6</td>
			</tr>
			<tr>
				<td>나당전쟁</td>
				<td>670–676</td>
				<td>14</td>
			</tr>
			<tr>
				<td>후기 · 발해</td>
				<td>698</td>
				<td>1</td>
			</tr>
		</tbody>
	</table>
	<p class="fold-note">회상은 기억하는 해를 달고, 그 회상을 품은 묶음은 독자가 서 있는 해를 단다.{@render fn(13)}</p>
{/snippet}

{#snippet fold(id: string, title: string, content: import('svelte').Snippet)}
	<div class="fold">
		<p class="fold-title">{title}</p>
		<button type="button" aria-expanded={!!folds[id]} onclick={() => toggleFold(id)}>[ 펼치기 · 접기 ]</button>
		{#if folds[id]}
			<div class="fold-body">
				{@render content()}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet fn(n: number)}
	<span class="fn-wrap">
		<button type="button" class="fn" aria-expanded={open === n} onclick={(e) => pop(n, e)}>[{n}]</button>
		{#if open === n}
			<span class="fn-pop" role="note">{NOTES[n]}</span>
		{/if}
	</span>
{/snippet}

{#snippet bar(id: string, text: string)}
	<button type="button" class={['bar', { on: shown[id] }]} onclick={() => reveal(id)}>{text}</button>
{/snippet}

<style>
	:global(body) {
		background: #141414;
	}

	.namu-root {
		--ink: #e6e6e6;
		--muted: #9a9a9a;
		--link: #e6b325;
		--line: #333;
		--paper: #1a1a1a;
		--seed: #00a495;
		min-height: 100vh;
		background: var(--paper);
		color: var(--ink);
		color-scheme: dark;
		font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Pretendard', sans-serif;
		font-size: 15.5px;
		line-height: 1.78;
	}

	.skip {
		position: absolute;
		left: -999px;
	}

	.mast {
		position: sticky;
		top: 0;
		z-index: 30;
		display: flex;
		align-items: center;
		gap: 1.1rem;
		height: 54px;
		padding: 0 1rem;
		background: #111;
		border-bottom: 1px solid #2a2a2a;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		color: #fff;
		font-weight: 750;
		font-size: 1.12rem;
		text-decoration: none;
		letter-spacing: -0.03em;
	}

	.seed {
		width: 1.1rem;
		height: 1.1rem;
		border-radius: 50% 50% 50% 0;
		background: var(--seed);
		transform: rotate(-35deg);
	}

	.mast-links {
		display: flex;
		gap: 0.9rem;
		font-size: 0.86rem;
	}

	.mast-links a {
		color: #c8c8c8;
		text-decoration: none;
	}

	.mast-links a:hover {
		color: var(--link);
	}

	.search {
		margin-left: auto;
		display: flex;
		align-items: center;
		width: min(280px, 36vw);
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 4px;
		overflow: hidden;
	}

	.search input {
		flex: 1;
		min-width: 0;
		height: 2rem;
		padding: 0 0.7rem;
		border: 0;
		background: transparent;
		color: var(--ink);
		font: inherit;
		font-size: 0.86rem;
	}

	.search button {
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2rem;
		border: 0;
		border-left: 1px solid #3a3a3a;
		background: #222;
		color: #ddd;
		cursor: pointer;
	}

	.search svg {
		width: 1rem;
		height: 1rem;
	}

	.frame {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 240px;
		gap: 1.4rem;
		max-width: 1240px;
		margin: 0 auto;
		padding: 1.1rem 1.1rem 4rem;
	}

	.doc {
		display: grid;
		grid-template-columns: 188px minmax(0, 1fr);
		gap: 1.35rem;
		align-items: start;
		min-width: 0;
	}

	.toc {
		position: sticky;
		top: 68px;
		width: 100%;
		font-size: 0.92rem;
	}

	.toc-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.35rem;
		color: #ddd;
	}

	.toc-head button {
		display: grid;
		place-items: center;
		width: 1.6rem;
		height: 1.6rem;
		border: 0;
		background: transparent;
		color: #aaa;
		cursor: pointer;
	}

	.toc-head svg {
		width: 1rem;
		height: 1rem;
		transition: transform 0.15s ease;
	}

	.toc-head svg.open {
		transform: rotate(180deg);
	}

	.toc ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.toc ol ol {
		padding-left: 0.85rem;
	}

	.toc li {
		margin: 0.12rem 0;
	}

	.toc a {
		color: var(--link);
		text-decoration: none;
	}

	.toc a:hover {
		text-decoration: underline;
	}

	.toc .num {
		margin-right: 0.2rem;
	}

	article {
		min-width: 0;
	}

	article :global(a) {
		color: var(--link);
		text-decoration: none;
	}

	article :global(a:hover) {
		text-decoration: underline;
	}

	.title-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}

	h1 {
		margin: 0;
		color: #fff;
		font-size: 1.85rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.25;
	}

	.tools {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.35rem;
		padding-top: 0.25rem;
	}

	.tool {
		display: inline-flex;
		align-items: center;
		gap: 0.28rem;
		padding: 0.22rem 0.5rem;
		border: 1px solid #3a3a3a;
		border-radius: 6px;
		background: #2a2a2a;
		color: #ddd;
		font-size: 0.78rem;
	}

	.tool svg {
		width: 0.95rem;
		height: 0.95rem;
	}

	.edited {
		margin: 0.2rem 0 0.55rem;
		color: var(--muted);
		font-size: 0.8rem;
	}

	.cats {
		margin: 0 0 0.7rem;
		color: #bdbdbd;
		font-size: 0.82rem;
	}

	.hat {
		display: flex;
		align-items: flex-start;
		gap: 0.45rem;
		margin: 0.35rem 0;
		font-size: 0.95rem;
	}

	.hat-arrow {
		flex: none;
		width: 1.05rem;
		height: 1.05rem;
		margin-top: 0.28rem;
		color: #3cb043;
	}

	.infobox {
		float: right;
		width: min(280px, 100%);
		margin: 0 0 0.8rem 1rem;
		border: 1px solid #3a3a3a;
		background: #202020;
		font-size: 0.88rem;
	}

	.infobox table {
		width: 100%;
		border-collapse: collapse;
	}

	.infobox th,
	.infobox td {
		padding: 0.35rem 0.55rem;
		border-top: 1px solid #333;
		text-align: left;
		vertical-align: top;
	}

	.ib-title {
		background: #2c2c2c;
		color: #fff;
		font-size: 1.05rem;
		text-align: center;
	}

	.ib-en,
	.ib-below {
		color: var(--muted);
		text-align: center;
	}

	.ib-img {
		padding: 0.5rem;
		text-align: center;
	}

	.ib-img img,
	.thumb img {
		display: block;
		width: 100%;
		height: auto;
	}

	.cap,
	.thumb figcaption,
	.fold-note {
		margin: 0.35rem 0 0;
		color: var(--muted);
		font-size: 0.78rem;
		line-height: 1.45;
	}

	.han {
		color: #aaa;
		font-size: 0.82rem;
	}

	.infobox th[scope='row'] {
		width: 4.2rem;
		color: #ccc;
		font-weight: 600;
		background: #262626;
	}

	h2 {
		clear: both;
		margin: 1.7rem 0 0.55rem;
		padding-bottom: 0.2rem;
		border-bottom: 1px solid #333;
		color: #fff;
		font-size: 1.32rem;
		font-weight: 700;
	}

	h3 {
		margin: 1.15rem 0 0.35rem;
		color: #fff;
		font-size: 1.08rem;
	}

	h4 {
		margin: 0.9rem 0 0.15rem;
		color: #fff;
		font-size: 1rem;
	}

	.edit {
		color: #777;
		font-size: 0.72rem;
		font-weight: 400;
	}

	p {
		margin: 0.55rem 0;
	}

	.more {
		margin: 0.1rem 0 0.25rem;
		color: var(--muted);
		font-size: 0.86rem;
	}

	.warn {
		margin: 0.4rem 0 0.6rem;
		padding: 0.35rem 0.6rem;
		border-left: 3px solid #c9a227;
		background: #242015;
		color: #f0e2b0;
		font-size: 0.9rem;
	}

	blockquote {
		margin: 0.45rem 0;
		padding: 0.35rem 0.75rem;
		border-left: 4px solid #555;
		background: #242424;
		color: #f3f3f3;
	}

	.quotes {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.quotes li {
		margin: 0.85rem 0;
	}

	.thumb {
		width: min(240px, 46%);
		margin: 0.2rem 0 0.6rem;
	}

	.thumb.right {
		float: right;
		margin-left: 0.9rem;
	}

	.thumb.left {
		float: left;
		margin-right: 0.9rem;
	}

	.grid {
		width: 100%;
		margin: 0.7rem 0 1rem;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.grid th,
	.grid td {
		padding: 0.4rem 0.5rem;
		border: 1px solid #3a3a3a;
		text-align: left;
		vertical-align: top;
	}

	.grid th {
		background: #2a2a2a;
		color: #fff;
		font-weight: 650;
	}

	.grid tr:nth-child(even) td {
		background: #202020;
	}

	.fold {
		clear: both;
		margin: 0.9rem 0 1rem;
		border: 1px solid #3f3f3f;
		background: #1e1e1e;
	}

	.fold-title {
		margin: 0;
		padding: 0.55rem 0.6rem 0;
		color: #fff;
		text-align: center;
		font-weight: 700;
	}

	.fold button {
		display: block;
		width: 100%;
		padding: 0.28rem 0.4rem 0.45rem;
		border: 0;
		background: transparent;
		color: #cfcfcf;
		font: inherit;
		font-size: 0.88rem;
		cursor: pointer;
	}

	.fold button:hover {
		color: var(--link);
	}

	.fold-body {
		padding: 0.2rem 0.7rem 0.75rem;
		border-top: 1px solid #333;
	}

	.fn {
		border: 0;
		padding: 0 0.05rem;
		background: none;
		color: var(--link);
		font-size: 0.75em;
		vertical-align: super;
		cursor: pointer;
	}

	.fn-wrap {
		position: relative;
		display: inline;
	}

	.fn-pop {
		position: absolute;
		z-index: 6;
		left: 0;
		top: 1.35rem;
		width: min(300px, 72vw);
		padding: 0.55rem 0.7rem;
		border: 1px solid #444;
		background: #2a2a2a;
		box-shadow: 0 8px 22px rgb(0 0 0 / 45%);
		color: var(--ink);
		font-size: 0.82rem;
		line-height: 1.5;
		text-align: left;
	}

	.bar {
		display: inline;
		margin: 0 0.12rem;
		padding: 0 0.2rem;
		border: 0;
		box-shadow: 0 0 0 1px #555;
		background: #111;
		color: transparent;
		font: inherit;
		line-height: inherit;
		cursor: pointer;
		text-align: left;
	}

	.bar.on {
		box-shadow: none;
		background: transparent;
		color: inherit;
		cursor: text;
	}

	.navbox {
		clear: both;
		margin: 1.3rem 0;
		border: 1px solid #3a3a3a;
		background: #1e1e1e;
		text-align: center;
	}

	.navbox-title {
		margin: 0;
		padding: 0.4rem 0.5rem;
		background: #2a2a2a;
		color: #fff;
		font-weight: 700;
	}

	.navbox p {
		margin: 0.45rem 0.6rem;
	}

	.footnotes {
		padding-left: 1.4rem;
		color: #ccc;
		font-size: 0.88rem;
	}

	.footnotes li {
		margin: 0.35rem 0;
	}

	ul {
		padding-left: 1.2rem;
	}

	li {
		margin: 0.35rem 0;
	}

	s {
		color: #8d8d8d;
	}

	.got {
		color: #8fd9a4;
	}

	.held {
		color: #e7a0a0;
	}

	.rail {
		position: sticky;
		top: 68px;
		align-self: start;
		justify-self: stretch;
		width: 100%;
		font-size: 0.88rem;
	}

	.rail section {
		margin-bottom: 1.3rem;
	}

	.rail h2 {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0 0 0.4rem;
		padding: 0;
		border: 0;
		color: #ddd;
		font-size: 0.95rem;
	}

	.rail-mark {
		width: 0.7rem;
		height: 0.7rem;
		border: 2px solid #888;
		border-radius: 50%;
	}

	.rail ul,
	.rail ol {
		margin: 0;
		padding-left: 1.15rem;
	}

	.rail a {
		color: var(--link);
		text-decoration: none;
	}

	.rail a:hover {
		text-decoration: underline;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	@media (max-width: 980px) {
		.frame,
		.doc {
			grid-template-columns: 1fr;
		}

		.toc,
		.rail {
			position: static;
		}

		.mast-links a:not(:last-child) {
			display: none;
		}
	}

	@media (max-width: 720px) {
		.infobox,
		.thumb.right,
		.thumb.left {
			float: none;
			width: 100%;
			margin: 0.8rem 0;
		}

		.title-row {
			flex-direction: column;
		}
	}
</style>
