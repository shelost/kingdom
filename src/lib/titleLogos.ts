/**
 * Episode title cards on the reader head.
 *
 * Painted English lockups live in `static/title_*.png` (wide illustrated cards
 * with the tagline baked in). Korean Marvel-style wordmarks, when they exist,
 * live in `static/titles/{slug}-ko.png`.
 *
 * Jumong has no episode of that name — the founding beat is Jolbon.
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
	Jolbon: '/title_jumong.png',
	Onjo: '/title_onjo.png',
	Bihyung: '/title_bihyung.png',
	Bihyungnang: '/title_bihyung.png',
	'Kim Yongsu': '/title_yongsu.png',
	Suro: '/title_suro.png',
	Muryuk: '/title_muryuk.png',
	Seohyun: '/title_seohyun.png',
	'Li Shimin': '/title_lishimin.png',
	'Heaven–Earth King': '/title_hek.png',
	'Three Princes': '/title_princes.png',
	Hallakgungi: '/title_gardener.png',
	Kangrim: '/title_reaper.png',
	'Park Hyukgosé': '/title_hyukgose.png',
	Talhae: '/title_talhae.png',
	Dangun: '/title_dangun.png'
};

/** Episode title → Korean wordmark slug under `static/titles/`. */
const SLUG: Record<string, string> = {
	Sadaham: 'sadaham',
	Momal: 'momal',
	Jolbon: 'jumong',
	Onjo: 'onjo',
	Bihyung: 'bihyung',
	Bihyungnang: 'bihyung',
	'Kim Yongsu': 'yongsu',
	Suro: 'suro',
	Muryuk: 'muryuk',
	Seohyun: 'seohyun',
	Sunchung: 'sunchung',
	Hungsu: 'hungsu',
	Gyebek: 'gyebek',
	Kangrim: 'kangrim',
	Hallakgungi: 'hallakgungi',
	'Heaven–Earth King': 'heaven-earth'
};

export function titleLogo(title: string): TitleLogo | null {
	const paint = PAINT[title];
	const slug = SLUG[title];
	if (!paint && !slug) return null;
	return {
		slug: slug ?? title,
		ko: slug ? `/titles/${slug}-ko.png` : '',
		en: paint ?? `/titles/${slug}-en.png`
	};
}

export function titleLogoSrc(title: string, ko: boolean): string | null {
	const mark = titleLogo(title);
	if (!mark) return null;
	const src = ko ? mark.ko : mark.en;
	return src || null;
}

/** Illustrated English cards already include the tagline; Korean wordmarks do not. */
export function titleCardBakesTagline(title: string, ko: boolean): boolean {
	return !ko && !!PAINT[title];
}
