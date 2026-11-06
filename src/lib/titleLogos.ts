/**
 * Episode title cards on the reader head.
 *
 * Painted English lockups live in `static/title_*.png` (wide illustrated cards
 * with the tagline baked in). Painted Korean Marvel-style wordmarks live in
 * `static/title_*_kr.png` when they exist; older Korean plates remain in
 * `static/titles/{slug}-ko.png`.
 *
 * Jumong’s founding beat uses `title_jumong` (ex-Jolbon / Buyeo lockup).
 * Hodong’s lockup is the Princess & the Magic Drum plate.
 * Sunchung / Hungsu / Gyebek / Li Shimin stay regular episodes (no title card).
 */

export type TitleLogo = {
	slug: string;
	ko: string;
	en: string;
};

/** Episode title → painted English card in `/static`. */
const PAINT: Record<string, string> = {
	Sadaham: '/title_sadaham.png',
	Momal: '/title_momal.png',
	Ulbul: '/title_ulbul.png',
	Haemosu: '/title_haemosu.png',
	Jumong: '/title_jumong.png',
	Onjo: '/title_onjo.png',
	Bihyung: '/title_bihyung.png',
	Bihyungnang: '/title_bihyung.png',
	'Kim Yongsu': '/title_yongsu.png',
	Suro: '/title_suro.png',
	Muryuk: '/title_muryuk.png',
	Seohyun: '/title_seohyun.png',
	'King Jinheung': '/title_jinheung.png',
	'King Geunchogo': '/title_gunchogo.png',
	'King Gwanggaeto': '/title_gwanggaeto.png',
	'Heaven–Earth King': '/title_hek.png',
	'Three Princes': '/title_princes.png',
	Gardener: '/title_gardener.png',
	'Grim Reaper': '/title_reaper.png',
	Hallakgungi: '/title_gardener.png',
	Kangrim: '/title_reaper.png',
	'Park Hyukgosé': '/title_hyukgose.png',
	Talhae: '/title_talhae.png',
	Dangun: '/title_dangun.png',
	Hodong: '/title_drum.png'
};

/** Episode title → painted Korean wordmark in `/static` (`title_*_kr.png`). */
const KO_PAINT: Record<string, string> = {
	Sadaham: '/title_sadaham_kr.png',
	Momal: '/title_momal_kr.png',
	Ulbul: '/title_ulbul_kr.png',
	Haemosu: '/title_haemosu_kr.png',
	Jumong: '/title_jumong_kr.png',
	Onjo: '/title_onjo_kr.png',
	Bihyung: '/title_bihyung_kr.png',
	Bihyungnang: '/title_bihyung_kr.png',
	'Kim Yongsu': '/title_yongsu_kr.png',
	Suro: '/title_suro_kr.png',
	Muryuk: '/title_muryuk_kr.png',
	Seohyun: '/title_seohyun_kr.png',
	'King Jinheung': '/title_jinheung_kr.png',
	'King Geunchogo': '/title_gunchogo_kr.png',
	'King Gwanggaeto': '/title_gwanggaeto_kr.png',
	'Heaven–Earth King': '/title_hek_kr.png',
	'Three Princes': '/title_princes_kr.png',
	Gardener: '/title_gardener_kr.png',
	'Grim Reaper': '/title_reaper_kr.png',
	Hallakgungi: '/title_gardener_kr.png',
	Kangrim: '/title_reaper_kr.png',
	'Park Hyukgosé': '/title_hyukgose_kr.png',
	Dangun: '/title_dangun_kr.png',
	Hodong: '/title_drum_kr.png'
};

/** Episode title → Korean wordmark slug under `static/titles/`. */
const SLUG: Record<string, string> = {
	Sadaham: 'sadaham',
	Momal: 'momal',
	Jumong: 'jumong',
	Onjo: 'onjo',
	Bihyung: 'bihyung',
	Bihyungnang: 'bihyung',
	'Kim Yongsu': 'yongsu',
	Suro: 'suro',
	Muryuk: 'muryuk',
	Seohyun: 'seohyun',
	'King Jinheung': 'jinheung',
	'King Geunchogo': 'gunchogo',
	'King Gwanggaeto': 'gwanggaeto',
	'Grim Reaper': 'kangrim',
	Gardener: 'hallakgungi',
	Kangrim: 'kangrim',
	Hallakgungi: 'hallakgungi',
	'Heaven–Earth King': 'heaven-earth'
};

export function titleLogo(title: string): TitleLogo | null {
	const paint = PAINT[title];
	const koPaint = KO_PAINT[title];
	const slug = SLUG[title];
	if (!paint && !koPaint && !slug) return null;
	return {
		slug: slug ?? title,
		ko: koPaint || (slug ? `/titles/${slug}-ko.png` : ''),
		en: paint ?? `/titles/${slug}-en.png`
	};
}

/** True when the episode has a painted English card and/or a Korean wordmark. */
export function hasTitleCard(title: string): boolean {
	return titleLogo(title) != null;
}

export function titleLogoSrc(title: string, ko: boolean): string | null {
	const mark = titleLogo(title);
	if (!mark) return null;
	const src = ko ? mark.ko : mark.en;
	return src || null;
}

/** Painted lockups (EN and `_kr`) already include the tagline; slug wordmarks do not. */
export function titleCardBakesTagline(title: string, ko: boolean): boolean {
	return ko ? !!KO_PAINT[title] : !!PAINT[title];
}
