/**
 * Marvel-style wordmarks for person-life episodes (usually flashbacks).
 * Korean and English lockups live in `static/titles/{slug}-{ko|en}.png`.
 *
 * Jumong has no episode of that name — the founding beat is Jolbon.
 */

export type TitleLogo = {
	slug: string;
	ko: string;
	en: string;
};

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
	const slug = SLUG[title];
	if (!slug) return null;
	return {
		slug,
		ko: `/titles/${slug}-ko.png`,
		en: `/titles/${slug}-en.png`
	};
}

export function titleLogoSrc(title: string, ko: boolean): string | null {
	const mark = titleLogo(title);
	return mark ? (ko ? mark.ko : mark.en) : null;
}
