/**
 * Live historical briefing: Wikipedia (ko/en), Namu wiki, and the National
 * Institute of Korean History’s Samguk Sagi / Samguk Yusa database.
 * Failures are silent — the local wiki and script still answer.
 */

export type LiveRecord = { source: string; url: string; text: string };

const UA =
	'KingForAll/1.0 (삼한왕검 chronicle Ask; educational RAG; https://github.com/heewon/kingdom)';
const HIST =
	/(신라|백제|고구려|가야|삼한|삼국|新羅|百濟|高句麗|Silla|Baekje|Paekche|Goguryeo|Koguryo|Samhan|Three Kingdoms|Tang|왜|倭)/i;

function htmlText(html: string): string {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#\d+;|&[a-z]+;/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

async function pull(url: string, ms = 4500): Promise<string | null> {
	try {
		const res = await fetch(url, {
			headers: { 'user-agent': UA, accept: 'text/html,application/json;q=0.9,*/*;q=0.8' },
			signal: AbortSignal.timeout(ms)
		});
		if (!res.ok) return null;
		return await res.text();
	} catch {
		return null;
	}
}

function clip(text: string, max = 2800): string {
	const t = text.replace(/\s+/g, ' ').trim();
	if (t.length <= max) return t;
	return `${t.slice(0, max).trimEnd()}…`;
}

type WikiSearch = [string, string[], string[], string[]];

async function wikipedia(lang: 'ko' | 'en', titles: string[]): Promise<LiveRecord | null> {
	const host = `${lang}.wikipedia.org`;
	for (const title of titles) {
		if (!title.trim()) continue;
		const search = new URLSearchParams({
			action: 'opensearch',
			search: title,
			limit: '5',
			namespace: '0',
			format: 'json',
			origin: '*'
		});
		const raw = await pull(`https://${host}/w/api.php?${search}`, 4000);
		if (!raw) continue;
		let candidates: string[] = [];
		try {
			const json = JSON.parse(raw) as WikiSearch;
			const ranked = json[1].filter((_, i) => HIST.test(`${json[1][i]} ${json[2][i] ?? ''}`));
			candidates = ranked.length ? ranked : json[1];
		} catch {
			continue;
		}
		for (const found of candidates) {
			const extract = new URLSearchParams({
				action: 'query',
				prop: 'extracts',
				explaintext: '1',
				exchars: '1200',
				redirects: '1',
				titles: found,
				format: 'json',
				origin: '*'
			});
			const body = await pull(`https://${host}/w/api.php?${extract}`, 4000);
			if (!body) continue;
			try {
				const json = JSON.parse(body) as {
					query?: { pages?: Record<string, { title?: string; extract?: string; missing?: string }> };
				};
				const page = Object.values(json.query?.pages ?? {})[0];
				const text = page?.extract?.trim();
				if (!text || page?.missing != null) continue;
				if (!HIST.test(text)) continue;
				const slug = encodeURIComponent(page.title ?? found);
				return {
					source: lang === 'ko' ? '한국어 위키백과' : 'English Wikipedia',
					url: `https://${host}/wiki/${slug}`,
					text: clip(text, 2200)
				};
			} catch {
				continue;
			}
		}
	}
	return null;
}

async function namu(titles: string[]): Promise<LiveRecord | null> {
	for (const title of titles) {
		if (!title.trim()) continue;
		const slug = encodeURIComponent(title);
		const raw = (await pull(`https://namu.wiki/raw/${slug}`, 4500)) ?? (await pull(`https://namu.wiki/w/${slug}`, 4500));
		if (!raw) continue;
		let text = raw.startsWith('{') || raw.includes('<html') ? htmlText(raw) : raw;
		text = text
			.replace(/\[\[파일:[^\]]*\]\]/g, ' ')
			.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
			.replace(/\[\[([^\]]+)\]\]/g, '$1')
			.replace(/'''|''/g, '')
			.replace(/\{\{[^{}]+\}\}/g, ' ')
			.replace(/={2,}|#{2,}|\*{1,3} /g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
		if (text.length < 80) continue;
		if (!HIST.test(text) && !/모말|제상|유신|삼국/.test(text)) continue;
		return { source: '나무위키', url: `https://namu.wiki/w/${slug}`, text: clip(text, 2600) };
	}
	return null;
}

async function historyDb(titles: string[]): Promise<LiveRecord | null> {
	for (const title of titles) {
		if (!title.trim()) continue;
		const q = encodeURIComponent(title);
		const html = await pull(
			`https://db.history.go.kr/search/searchResultList.do?searchTerm=${q}&itemIds=sg,sy`,
			4500
		);
		if (!html) continue;
		const ids = [...html.matchAll(/\/id\/((?:sg|sy)_[a-z0-9_]+)/gi)].map((m) => m[1]);
		const unique = [...new Set(ids)].slice(0, 2);
		const parts: string[] = [];
		let url = `https://db.history.go.kr/search/searchResultList.do?searchTerm=${q}`;
		for (const id of unique) {
			const page = await pull(`https://db.history.go.kr/id/${id}`, 4000);
			if (!page) continue;
			const text = htmlText(page);
			const cut = text.replace(/^[\s\S]{0,80}?(삼국사기|삼국유사)/, '$1');
			if (cut.length > 120) {
				parts.push(clip(cut, 1600));
				url = `https://db.history.go.kr/id/${id}`;
			}
		}
		if (!parts.length) {
			const text = htmlText(html);
			if (text.length > 200 && HIST.test(text)) parts.push(clip(text, 1600));
		}
		if (!parts.length) continue;
		return {
			source: '한국사데이터베이스 (삼국사기 · 삼국유사)',
			url,
			text: parts.join('\n\n')
		};
	}
	return null;
}

async function encykorea(titles: string[]): Promise<LiveRecord | null> {
	for (const title of titles) {
		if (!title.trim()) continue;
		const q = encodeURIComponent(title);
		const html = await pull(`https://encykorea.aks.ac.kr/Article/Search?keyword=${q}`, 4000);
		if (!html) continue;
		const href = html.match(/\/Article\/(E\d+)/);
		if (!href) {
			const text = htmlText(html);
			if (text.length > 200 && HIST.test(text)) {
				return {
					source: '한국민족문화대백과사전',
					url: `https://encykorea.aks.ac.kr/Article/Search?keyword=${q}`,
					text: clip(text, 1600)
				};
			}
			continue;
		}
		const page = await pull(`https://encykorea.aks.ac.kr/Article/${href[1]}`, 4000);
		if (!page) continue;
		const text = htmlText(page);
		if (text.length < 120) continue;
		return {
			source: '한국민족문화대백과사전',
			url: `https://encykorea.aks.ac.kr/Article/${href[1]}`,
			text: clip(text, 2000)
		};
	}
	return null;
}

export async function fetchRecords(
	hints: { korean: string; english: string; hanja?: string }[]
): Promise<LiveRecord[]> {
	const titles = hints.flatMap((h) => [h.korean, h.hanja, h.english].filter((x): x is string => !!x));
	const koTitles = hints.map((h) => h.korean).filter(Boolean);
	const enTitles = hints.flatMap((h) =>
		[h.hanja, `${h.english} Silla`, h.korean, h.english].filter((x): x is string => !!x)
	);

	const settled = await Promise.allSettled([
		wikipedia('ko', titles),
		wikipedia('en', enTitles),
		namu(koTitles.length ? koTitles : titles),
		historyDb(koTitles.length ? koTitles : titles),
		encykorea(koTitles)
	]);

	const out: LiveRecord[] = [];
	const seen = new Set<string>();
	for (const row of settled) {
		if (row.status !== 'fulfilled' || !row.value) continue;
		if (seen.has(row.value.source)) continue;
		seen.add(row.value.source);
		out.push(row.value);
	}
	return out;
}
