<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { DiagramId } from '$lib/research';
	import { reading } from '$lib/reading.svelte';
	import KitStage from '$lib/components/diagrams/three/KitStage.svelte';
	import { hasWebGL } from '$lib/components/diagrams/three/kit.svelte';
	import { BAEKJE_RANKS, BONES, RANK_COLOR as COLOR, SILLA_RANKS, baekjeColor, sillaColor } from '$lib/researchRanks';

	let { id }: { id: DiagramId } = $props();
	let ko = $derived(reading.lang === 'ko');
	const t = (en: string, k: string) => (ko ? k : en);

	/** The 3D model plays once the figure is on screen; the reader can switch back to the drawing. */
	let flat = $state(false);
	let active = $state(false);
	let gl = $state(false);

	const seen: Attachment<HTMLElement> = (node) => {
		gl = hasWebGL();
		if (typeof IntersectionObserver === 'undefined') return void (active = true);
		const io = new IntersectionObserver(([e]) => {
			if (!e.isIntersecting) return;
			active = true;
			io.disconnect();
		}, { threshold: 0.25 });
		io.observe(node);
		return () => io.disconnect();
	};

	const caption = $derived(
		({
			jougwan: t('After the Goguryeo murals (Muyongchong), the Silla wing ornaments of Cheonmachong and the Baekje silver ornaments of Neungsan-ri. Simplified; not to scale.', '고구려 무용총 벽화, 신라 천마총 날개 장식, 백제 능산리 은제 관식을 바탕으로 단순화. 축척 아님.'),
			crown: t('After the crowns of Hwangnam Daechong (north mound) and Cheonmachong. An inner cap, with its own gold wing ornament, was worn inside the band.', '황남대총 북분·천마총 금관을 바탕으로. 관테 안에는 금 날개 장식을 단 안쪽 모자를 따로 썼다.'),
			layers: t('After the Goguryeo murals of Muyongchong, Susan-ri and Anak Tomb No. 3, and the Book of Zhou. Shared, with local variations, across all three kingdoms until Silla took up Tang dress.', '고구려 무용총·수산리·안악3호분 벽화와 《주서》를 바탕으로. 신라가 당의 옷을 받아들이기 전까지 세 나라가 지역 차이를 두고 함께 입던 옷.'),
			armor: t('After excavated armour from Bokcheon-dong (Busan), Daeseong-dong (Gimhae) and Jjoksaem (Gyeongju), and the cavalry in the Goguryeo murals.', '부산 복천동, 김해 대성동, 경주 쪽샘 출토 갑옷과 고구려 벽화의 기병을 바탕으로.'),
			ranks: t('From the Samguk Sagi treatise on dress, the Book of Zhou, the Northern Histories and the Old Book of Tang.', '《삼국사기》 색복지, 《주서》, 《북사》, 《구당서》를 바탕으로.')
		}) as Record<DiagramId, string>
	);

	/** A barred pheasant feather from (x, y) along `angle` (degrees, 0 = up), `len` long. */
	function feather(x: number, y: number, angle: number, len: number) {
		const a = (angle * Math.PI) / 180;
		const dx = Math.sin(a);
		const dy = -Math.cos(a);
		const nx = -dy;
		const ny = dx;
		const w = len * 0.09;
		const tip = [x + dx * len, y + dy * len];
		const at = (k: number, side: number) => [x + dx * len * k + nx * w * side * Math.sin(Math.PI * k) * 1.2, y + dy * len * k + ny * w * side * Math.sin(Math.PI * k) * 1.2];
		const l = at(0.5, 1);
		const r = at(0.5, -1);
		const vane = `M${x},${y}Q${l[0]},${l[1]} ${tip[0]},${tip[1]}Q${r[0]},${r[1]} ${x},${y}Z`;
		let bars = '';
		for (let k = 0.2; k < 0.9; k += 0.1) {
			const p = at(k, 1);
			const q = at(k, -1);
			bars += `M${p[0].toFixed(1)},${p[1].toFixed(1)}L${q[0].toFixed(1)},${q[1].toFixed(1)}`;
		}
		return { vane, quill: `M${x},${y}L${tip[0]},${tip[1]}`, bars };
	}

	/** One 出-shaped upright: a stem with three tiers of arms turned up at the ends. */
	function chul(x: number, base: number, top: number) {
		const h = base - top;
		let d = `M${x},${base}V${top}`;
		for (let i = 0; i < 3; i++) {
			const y = base - h * (0.3 + i * 0.3);
			const arm = 26 - i * 4;
			d += `M${x - arm},${y - 20}V${y}H${x + arm}V${y - 20}`;
		}
		return d;
	}

	function antler(x: number, base: number, flip: number) {
		const s = flip;
		return `M${x},${base}C${x},${base - 50} ${x + 10 * s},${base - 90} ${x + 4 * s},${base - 140}M${x + 2 * s},${base - 70}C${x + 18 * s},${base - 80} ${x + 26 * s},${base - 96} ${x + 28 * s},${base - 112}M${x + 6 * s},${base - 106}C${x + 18 * s},${base - 116} ${x + 22 * s},${base - 128} ${x + 22 * s},${base - 140}`;
	}

	/** Silla rank strip: left margin for the bone-class labels, cell width. */
	const X0 = 84;
	const CW = 30;
</script>

<figure class="diagram" {@attach seen}>
	{#if gl}
		<div class="mode" role="group" aria-label={t('View', '보기')}>
			<button type="button" class:on={!flat} onclick={() => (flat = false)}>3D</button>
			<button type="button" class:on={flat} onclick={() => (flat = true)}>{t('Drawing', '그림')}</button>
		</div>
	{/if}
	<KitStage id="research-{id}" {active} {flat}>
		{#snippet fallback()}
	<div class="scroll">
		{#if id === 'jougwan'}
			<svg viewBox="-40 0 680 300" role="img" aria-label={t('How the feather cap was worn, and its gold and silver versions', '조우관을 쓰는 법과 금·은 장식')}>
				<!-- Goguryeo: jeolpung + two feathers -->
				<g transform="translate(100 0)">
					{#each [feather(-22, 112, -32, 120), feather(22, 112, 32, 120)] as f, i (i)}
						<path d={f.vane} class="feather" /><path d={f.bars} class="bar" /><path d={f.quill} class="ink thin" />
					{/each}
					<ellipse cx="0" cy="160" rx="34" ry="42" class="skin" />
					<path d="M-30,124Q0,62 30,124Z" class="cap" />
					<path d="M-28,128Q-40,170 -14,196M28,128Q40,170 14,196M-14,196Q0,204 14,196" class="cord" />
					<path d="M-12,214V236M12,214V236" class="ink thin" />
				</g>
				<!-- Silla: cap with gold wings -->
				<g transform="translate(300 0)">
					<path d="M0,150C-26,120 -66,90 -78,30C-60,58 -30,80 -6,112Z" class="gold" />
					<path d="M0,150C26,120 66,90 78,30C60,58 30,80 6,112Z" class="gold" />
					<path d="M0,152V40" class="gold-line" />
					{#each [[-60, 60], [-44, 84], [-28, 104], [60, 60], [44, 84], [28, 104], [0, 60], [0, 90]] as [x, y], i (i)}
						<circle cx={x} cy={y} r="3.2" class="spangle" />
					{/each}
					<path d="M-34,206L-26,132Q0,118 26,132L34,206Z" class="bark" />
					<ellipse cx="0" cy="236" rx="30" ry="22" class="skin faint" />
				</g>
				<!-- Baekje: black silk cap with silver flower -->
				<g transform="translate(500 0)">
					<path d="M0,170V58M0,140C-18,132 -30,116 -26,98M0,140C18,132 30,116 26,98M0,112C-14,104 -22,90 -18,76M0,112C14,104 22,90 18,76" class="silver" />
					{#each [[-26, 96], [26, 96], [-18, 74], [18, 74], [0, 54]] as [x, y], i (i)}
						<path d="M{x},{y - 9}C{x + 7},{y - 4} {x + 6},{y + 5} {x},{y + 7}C{x - 6},{y + 5} {x - 7},{y - 4} {x},{y - 9}Z" class="silver-bud" />
					{/each}
					<path d="M-32,206Q-34,160 0,156Q34,160 32,206Z" class="silk" />
					<ellipse cx="0" cy="236" rx="30" ry="22" class="skin faint" />
				</g>
				<g class="labels">
					<text x="100" y="270" class="lt">{t('Goguryeo · jeolpung and two feathers', '고구려 · 절풍과 새 깃 둘')}</text>
					<text x="100" y="286" class="ls">{t('cap tied under the chin; feathers mark office', '턱 밑에서 끈을 매고, 깃이 벼슬을 나타냄')}</text>
					<text x="300" y="270" class="lt">{t('Silla · gold bird wings', '신라 · 금제 새 날개 장식')}</text>
					<text x="300" y="286" class="ls">{t('slotted into a birch-bark or silk cap', '자작나무 껍질·비단 관에 꽂음')}</text>
					<text x="500" y="270" class="lt">{t('Baekje · silver flower', '백제 · 은제 꽃 장식')}</text>
					<text x="500" y="286" class="ls">{t('on a black silk cap, 6th rank and up', '검은 비단 관, 6품 이상')}</text>
					<text x="148" y="200" class="tag">{t('chin cords', '갓끈')}</text>
				</g>
			</svg>
		{:else if id === 'crown'}
			<svg viewBox="0 0 600 340" role="img" aria-label={t('The parts of a Silla gold crown', '신라 금관의 구조')}>
				<path d="M150,236Q300,262 450,236" class="band-back" />
				<path d={antler(186, 232, -1)} class="gold-line thick" />
				<path d={antler(414, 232, 1)} class="gold-line thick" />
				<path d={chul(236, 240, 70)} class="gold-line thick" />
				<path d={chul(300, 246, 50)} class="gold-line thick" />
				<path d={chul(364, 240, 70)} class="gold-line thick" />
				<path d="M140,226Q300,262 460,226L460,250Q300,286 140,250Z" class="gold" />
				{#each Array.from({ length: 13 }, (_, i) => i) as i (i)}
					<circle cx={160 + i * 23} cy={244 + Math.sin((i / 12) * Math.PI) * 12} r="3" class="spangle" />
				{/each}
				{#each [[236, 130], [236, 190], [300, 110], [300, 170], [364, 130], [364, 190]] as [x, y], i (i)}
					<path d="M{x + 6},{y}a7,7 0 1 1 -7,-7q0,5 7,7Z" class="jade" />
				{/each}
				{#each [[210, 150], [262, 150], [276, 110], [324, 110], [338, 150], [390, 150], [166, 160], [434, 160]] as [x, y], i (i)}
					<circle cx={x} cy={y} r="3" class="spangle" />
				{/each}
				<path d="M150,252V300M450,252V300" class="gold-line" />
				{#each [270, 286, 302] as y (y)}
					<path d="M150,{y}l-6,6l6,6l6,-6Z" class="gold" /><path d="M450,{y}l-6,6l6,6l6,-6Z" class="gold" />
				{/each}
				<path d="M156,318a8,8 0 1 1 -8,-8q0,6 8,8Z" class="jade" />
				<path d="M458,318a8,8 0 1 1 -8,-8q0,6 8,8Z" class="jade" />
				<g class="labels left">
					<text x="20" y="250" class="tag">{t('headband', '관테(대륜)')}</text>
					<text x="20" y="306" class="tag">{t('pendants', '드리개(수하식)')}</text>
					<text x="20" y="120" class="tag">{t('antler uprights', '사슴뿔 모양 세움장식')}</text>
				</g>
				<g class="labels">
					<text x="440" y="60" class="tag">{t('three 出-shaped tree uprights', '出자 모양 세움장식 셋')}</text>
					<text x="470" y="140" class="tag">{t('comma jades (gogok)', '곱은옥')}</text>
					<text x="470" y="160" class="tag">{t('gold spangles that shiver', '흔들리는 달개')}</text>
				</g>
				<path d="M92,246H140M92,302H140M110,116H178M436,64H316M466,136H372M466,156H398" class="leader" />
			</svg>
		{:else if id === 'layers'}
			<svg viewBox="0 0 600 360" role="img" aria-label={t('The layers of men’s and women’s dress', '남녀 옷의 짜임')}>
				<!-- man -->
				<g transform="translate(170 0)">
					<path d="M-48,96L-40,320H40L48,96Z" class="coat" />
					<circle cx="0" cy="44" r="22" class="skin" />
					<path d="M-8,20q8,-14 16,0" class="ink" />
					<path d="M-40,78L-78,170L-62,176L-30,112L-34,190H34L30,112L62,176L78,170L40,78Q0,66 -40,78Z" class="cloth" />
					<path d="M-14,72L18,150M-40,78L-78,170M40,78L78,170" class="trim-line" />
					<path d="M-34,190H34" class="trim-line" />
					<path d="M-36,150H36" class="belt" />
					<path d="M-34,190L-50,318H-14L0,214L14,318H50L34,190Z" class="trousers" />
					<path d="M-50,306H-14M14,306H50" class="trim-line" />
					<path d="M-52,318h40v16h-44zM12,318h40l4,16h-44z" class="boot" />
				</g>
				<!-- woman -->
				<g transform="translate(430 0)">
					<circle cx="0" cy="44" r="22" class="skin" />
					<path d="M-20,30Q0,-6 20,30Q28,10 0,8Q-28,10 -20,30Z" class="hair" />
					<path d="M-38,80L-72,168L-56,174L-28,112L-32,184H32L28,112L56,174L72,168L38,80Q0,68 -38,80Z" class="cloth" />
					<path d="M-12,74L16,146M-38,80L-72,168M38,80L72,168M-32,184H32" class="trim-line" />
					<path d="M-34,180L-64,336H64L34,180Z" class="skirt" />
					{#each [-48, -32, -16, 0, 16, 32, 48] as x (x)}
						<path d="M{x * 0.5},184L{x},336" class="pleat" />
					{/each}
					<path d="M-64,326H64" class="trim-line" />
				</g>
				<g class="labels">
					<text x="20" y="90" class="tag">{t('jacket (yu) to the hip,', '엉덩이까지 오는 저고리(유),')}</text>
					<text x="20" y="104" class="tag">{t('crossed and belted', '여미고 띠를 맴')}</text>
					<text x="20" y="190" class="tag">{t('contrast trim (襈)', '선(襈)')}</text>
					<text x="20" y="250" class="tag">{t('wide trousers,', '통 넓은 바지,')}</text>
					<text x="20" y="264" class="tag">{t('gathered at the ankle', '발목에서 오므림')}</text>
					<text x="20" y="330" class="tag">{t('leather boots', '가죽 장화')}</text>
					<text x="236" y="314" class="tag">{t('coat (po) over all,', '그 위에 포,')}</text>
					<text x="236" y="328" class="tag">{t('for rank and weather', '신분과 날씨에 따라')}</text>
					<text x="510" y="40" class="tag">{t('coiled hair', '틀어 올린 머리')}</text>
					<text x="510" y="250" class="tag">{t('pleated skirt', '주름치마')}</text>
					<text x="510" y="264" class="tag">{t('to the ground', '땅에 닿게')}</text>
				</g>
				<path d="M130,98H150M118,186H140M126,256H150M98,326H118M226,310H218M506,36H452M506,246H470" class="leader" />
			</svg>
		{:else if id === 'armor'}
			<svg viewBox="0 0 600 320" role="img" aria-label={t('Plate cuirass and lamellar armour compared', '판갑과 찰갑의 비교')}>
				<!-- plate cuirass -->
				<g transform="translate(150 0)">
					<path d="M-30,46Q0,10 30,46V84H-30Z" class="steel" />
					{#each [-20, -10, 0, 10, 20] as x (x)}
						<path d="M{x},{30 + Math.abs(x) * 0.5}V84" class="seam" />
					{/each}
					{#each [-24, -12, 0, 12, 24] as x (x)}
						<circle cx={x} cy="80" r="1.6" class="rivet" />
					{/each}
					<path d="M-60,104Q0,88 60,104L56,260Q0,276 -56,260Z" class="steel" />
					{#each [130, 160, 190, 220] as y (y)}
						<path d="M-58,{y}Q0,{y - 14} 58,{y}" class="seam" />
					{/each}
					{#each [-44, -22, 0, 22, 44] as x (x)}
						{#each [128, 158, 188, 218] as y (y)}
							<circle cx={x} cy={y - 8 + Math.abs(x) * 0.08} r="1.8" class="rivet" />
						{/each}
					{/each}
				</g>
				<!-- lamellar -->
				<g transform="translate(410 0)">
					<path d="M-30,46Q0,10 30,46V84H-30Z" class="steel" />
					{#each Array.from({ length: 7 }, (_, i) => i) as i (i)}
						<rect x={-27 + i * 8} y="44" width="7" height="40" rx="2" class="lame" />
					{/each}
					<path d="M0,24V8" class="plume" />
					{#each Array.from({ length: 9 }, (_, row) => row) as row (row)}
						{#each Array.from({ length: 12 }, (_, i) => i) as i (i)}
							<rect x={-60 + i * 10 + (row % 2) * 5} y={100 + row * 18} width="9" height="22" rx="2" class="lame" />
						{/each}
					{/each}
				</g>
				<!-- detail -->
				<g transform="translate(540 120)">
					{#each [0, 1, 2] as i (i)}
						<rect x={-24 + i * 16} y="0" width="14" height="34" rx="3" class="lame big" />
						<circle cx={-17 + i * 16} cy="8" r="1.6" class="hole" /><circle cx={-17 + i * 16} cy="26" r="1.6" class="hole" />
					{/each}
					<path d="M-17,8H15M-17,26H15" class="lace" />
				</g>
				<g class="labels">
					<text x="150" y="290" class="lt">{t('Plate cuirass (판갑)', '판갑')}</text>
					<text x="150" y="306" class="ls">{t('Gaya and early Silla, 4th–5th c. · iron strips riveted, rigid', '가야·초기 신라, 4–5세기 · 철판을 못으로 이음, 단단함')}</text>
					<text x="410" y="290" class="lt">{t('Lamellar (찰갑)', '찰갑')}</text>
					<text x="410" y="306" class="ls">{t('all kingdoms, 5th–7th c. · small plates laced, flexible', '모든 나라, 5–7세기 · 작은 철편을 엮음, 유연함')}</text>
					<text x="540" y="104" class="tag">{t('laced', '끈으로 엮음')}</text>
					<text x="150" y="24" class="tag">{t('helmet of vertical plates', '세로판 투구')}</text>
				</g>
			</svg>
		{:else if id === 'ranks'}
			<svg viewBox="0 0 600 330" role="img" aria-label={t('Rank colours of Silla, Baekje and Goguryeo', '신라·백제·고구려의 관등과 옷 색')}>
				<text x="0" y="18" class="lt start">{t('Silla · 17 ranks (law of 520)', '신라 · 17관등 (520년 율령)')}</text>
				{#each SILLA_RANKS as [k, en], i (i)}
					<rect x={X0 + i * CW} y="28" width={CW - 2} height="26" rx="3" fill={sillaColor(i)} />
					<text x={X0 + i * CW + CW / 2 - 1} y="45" class="cell">{i + 1}</text>
					<text x={X0 + i * CW + CW / 2 - 4} y="66" class="rank" transform="rotate(35 {X0 + i * CW + CW / 2 - 4} 66)">{ko ? k : en}</text>
				{/each}
				{#each BONES as [en, k, top], i (i)}
					{@const y = 120 + i * 15}
					<text x={X0 + top * CW - 6} y={y + 9} class="bone">{ko ? k : en}</text>
					<rect x={X0 + top * CW} y={y} width={(17 - top) * CW - 2} height="10" rx="2" class="reach" />
				{/each}
				<text x="0" y="200" class="lt start">{t('Baekje · 16 ranks', '백제 · 16관등')}</text>
				{#each BAEKJE_RANKS as k, i (i)}
					<rect x={i * 37} y="210" width="35" height="24" rx="3" fill={baekjeColor(i)} />
					<text x={i * 37 + 17.5} y="226" class="cell">{ko ? k : i + 1}</text>
				{/each}
				<text x="0" y="252" class="ls start">{t('silver flowers on the cap for ranks 1–6', '1–6품은 관에 은꽃')}</text>
				<text x="0" y="284" class="lt start">{t('Goguryeo · rank in the cap', '고구려 · 관으로 드러낸 신분')}</text>
				<rect x="0" y="294" width="30" height="20" rx="3" fill={COLOR.blue} /><text x="38" y="308" class="ls start">{t('blue silk gauze: noblest', '푸른 비단: 가장 귀함')}</text>
				<rect x="200" y="294" width="30" height="20" rx="3" fill={COLOR.crimson} /><text x="238" y="308" class="ls start">{t('crimson gauze: next', '붉은 비단: 그다음')}</text>
				<text x="400" y="308" class="ls start">{t('+ two feathers for all in office', '+ 벼슬아치는 모두 새 깃 둘')}</text>
				<g class="legend">
					{#each [[COLOR.purple, 'purple', '자'], [COLOR.crimson, 'crimson', '비'], [COLOR.blue, 'blue', '청'], [COLOR.yellow, 'yellow', '황']] as [c, en, k], i (i)}
						<rect x={360 + i * 60} y="8" width="10" height="10" rx="2" fill={c} /><text x={374 + i * 60} y="17" class="ls start">{ko ? k : en}</text>
					{/each}
				</g>
				<text x="0" y="112" class="ls start">{t('highest rank each bone class could reach:', '골품별로 오를 수 있는 가장 높은 관등:')}</text>
			</svg>
		{/if}
	</div>
		{/snippet}
	</KitStage>
	<figcaption>{caption[id]}</figcaption>
</figure>

<style>
	.diagram {
		margin: 1.75rem 0 0.5rem;
	}

	.mode {
		display: flex;
		justify-content: flex-end;
		gap: 2px;
		margin-bottom: 0.4rem;
	}

	.mode button {
		padding: 0.25rem 0.65rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: none;
		font: 600 0.7rem/1 var(--ui);
		color: var(--fg-faint);
		cursor: pointer;
	}

	.mode button.on {
		background: var(--fg-strong);
		border-color: var(--fg-strong);
		color: var(--bg);
	}

	.scroll {
		overflow-x: auto;
		scrollbar-width: thin;
	}

	svg {
		display: block;
		width: 100%;
		min-width: 520px;
		height: auto;
		overflow: visible;
		font-family: var(--ui);
		--ink: color-mix(in srgb, var(--fg) 70%, transparent);
		--soft: color-mix(in srgb, var(--fg) 10%, transparent);
		--gold-c: #d9ad45;
	}

	figcaption {
		margin-top: 0.6rem;
		font-size: 0.74rem;
		line-height: 1.5;
		color: var(--fg-faint);
	}

	.ink {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.4;
		stroke-linecap: round;
	}

	.thin {
		stroke-width: 1;
	}

	.skin {
		fill: var(--soft);
		stroke: var(--ink);
		stroke-width: 1.2;
	}

	.skin.faint {
		opacity: 0.5;
	}

	.cap,
	.silk {
		fill: color-mix(in srgb, var(--fg) 82%, var(--bg));
		stroke: var(--ink);
	}

	:global(html[data-theme='dark']) .cap,
	:global(html[data-theme='dark']) .silk {
		fill: #1b1b20;
		stroke: color-mix(in srgb, var(--fg) 55%, transparent);
	}

	.bark {
		fill: color-mix(in srgb, #c9a77a 40%, transparent);
		stroke: var(--ink);
	}

	.cord {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.1;
		stroke-dasharray: 3 2;
	}

	.feather {
		fill: color-mix(in srgb, #b98a4e 45%, transparent);
		stroke: var(--ink);
		stroke-width: 1;
	}

	.bar {
		stroke: color-mix(in srgb, var(--fg) 55%, transparent);
		stroke-width: 1.4;
	}

	.gold {
		fill: color-mix(in srgb, var(--gold-c) 75%, transparent);
		stroke: #a87d22;
		stroke-width: 1;
	}

	.gold-line {
		fill: none;
		stroke: var(--gold-c);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.gold-line.thick {
		stroke-width: 5;
	}

	.band-back {
		fill: none;
		stroke: color-mix(in srgb, var(--gold-c) 30%, transparent);
		stroke-width: 18;
	}

	.spangle {
		fill: var(--gold-c);
		stroke: #fff6;
		stroke-width: 0.6;
	}

	.jade {
		fill: #4f9a6a;
		stroke: #2c6a44;
		stroke-width: 0.8;
	}

	.silver {
		fill: none;
		stroke: #b8c0c8;
		stroke-width: 2.4;
		stroke-linecap: round;
	}

	.silver-bud {
		fill: #d4dae0;
		stroke: #8d969f;
		stroke-width: 0.8;
	}

	.coat {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1;
		stroke-dasharray: 4 3;
	}

	.cloth,
	.trousers,
	.skirt {
		fill: var(--soft);
		stroke: var(--ink);
		stroke-width: 1.2;
		stroke-linejoin: round;
	}

	.hair {
		fill: color-mix(in srgb, var(--fg) 75%, var(--bg));
	}

	.trim-line {
		fill: none;
		stroke: #b8303f;
		stroke-width: 3.4;
		stroke-linecap: round;
	}

	.belt {
		stroke: var(--ink);
		stroke-width: 4;
	}

	.boot {
		fill: color-mix(in srgb, var(--fg) 60%, var(--bg));
	}

	.pleat {
		stroke: var(--ink);
		stroke-width: 0.8;
		opacity: 0.6;
	}

	.steel {
		fill: color-mix(in srgb, #8e99a6 35%, transparent);
		stroke: var(--ink);
		stroke-width: 1.2;
	}

	.seam {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1;
	}

	.rivet {
		fill: var(--ink);
	}

	.lame {
		fill: color-mix(in srgb, #8e99a6 45%, var(--bg));
		stroke: var(--ink);
		stroke-width: 0.8;
	}

	.lame.big {
		stroke-width: 1.2;
	}

	.hole {
		fill: var(--bg);
		stroke: var(--ink);
		stroke-width: 0.6;
	}

	.lace {
		stroke: #b8303f;
		stroke-width: 1.6;
	}

	.plume {
		stroke: #b8303f;
		stroke-width: 4;
		stroke-linecap: round;
	}

	.leader {
		fill: none;
		stroke: color-mix(in srgb, var(--fg) 35%, transparent);
		stroke-width: 0.8;
	}

	text {
		fill: var(--fg-dim);
		font-size: 11px;
	}

	.lt {
		font-size: 12.5px;
		font-weight: 600;
		fill: var(--fg-strong);
		text-anchor: middle;
	}

	.ls {
		font-size: 10.5px;
		fill: var(--fg-dim);
		text-anchor: middle;
	}

	.start {
		text-anchor: start;
	}

	.tag {
		font-size: 11px;
		font-style: italic;
		fill: var(--fg-dim);
	}

	.labels.left .tag {
		text-anchor: start;
	}

	.cell {
		font-size: 10px;
		font-weight: 700;
		fill: #fff;
		text-anchor: middle;
	}

	.rank {
		font-size: 9.5px;
		fill: var(--fg-dim);
	}

	.bone {
		font-size: 10px;
		fill: var(--fg-dim);
		text-anchor: end;
	}

	.reach {
		fill: color-mix(in srgb, var(--fg) 18%, transparent);
	}
</style>
