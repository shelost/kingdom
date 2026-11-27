/**
 * Wang Geon’s twenty-nine wives, in the order the annals give them.
 * `leader` is the father, a wiki id. Sisters share him. Wife 21 has no father in the record.
 * The number is the hojok’s `hojokOrder`.
 */
export type Wife = {
	n: number;
	en: string;
	ko: string;
	clanEn: string;
	clanKo: string;
	/** Surname character, when the annals wrote one. */
	seal?: string;
	leader?: string;
};

export const WIVES: Wife[] = [
	{ n: 1, en: 'Queen Sinhye', ko: '신혜왕후', clanEn: 'Jeongju Yoo', clanKo: '정주 유씨', seal: '柳', leader: 'yuchungung' },
	{ n: 2, en: 'Queen Janghwa', ko: '장화왕후', clanEn: 'Naju Oh', clanKo: '나주 오씨', seal: '吳', leader: 'odaryeon' },
	{ n: 3, en: 'Queen Sinmyeong', ko: '신명순성왕태후', clanEn: 'Chungju Yuh', clanKo: '충주 유씨', seal: '劉', leader: 'yugungdal' },
	{ n: 4, en: 'Queen Sinjeong', ko: '신정왕태후', clanEn: 'Hwangju Hwangbo', clanKo: '황주 황보씨', seal: '皇甫', leader: 'hwangbojegong' },
	{ n: 5, en: 'Queen Sinseong', ko: '신성왕태후', clanEn: 'Gyeongju Kim', clanKo: '경주 김씨', seal: '金', leader: 'kimeokryeom' },
	{ n: 6, en: 'Queen Jeongdeok', ko: '정덕왕후', clanEn: 'Jeongju Yoo', clanKo: '정주 유씨', seal: '柳', leader: 'yudeokyeong' },
	{ n: 7, en: 'Lady Heonmok', ko: '헌목대부인', clanEn: 'Gyeongju Pyeong', clanKo: '경주 평씨', seal: '平', leader: 'pyeongjun' },
	{ n: 8, en: 'Lady Jeongmok', ko: '정목부인', clanEn: 'Myeongju Wang', clanKo: '명주 왕씨', seal: '王', leader: 'wanggyeong' },
	{ n: 9, en: 'Lady Dongyangwon', ko: '동양원부인', clanEn: 'Pyeongju Yu', clanKo: '평주 유씨', seal: '庾', leader: 'yugeumpil' },
	{ n: 10, en: 'Lady Sukmok', ko: '숙목부인', clanEn: 'Jincheon', clanKo: '진천', leader: 'myeongpil' },
	{ n: 11, en: 'Lady of Cheonan', ko: '천안부원부인', clanEn: 'Im', clanKo: '임씨', seal: '林', leader: 'imeon' },
	{ n: 12, en: 'Lady Heungbok', ko: '흥복원부인', clanEn: 'Hongju Hong', clanKo: '홍주 홍씨', seal: '洪', leader: 'honggyu' },
	{ n: 13, en: 'Lady Hudaeryang', ko: '후대량원부인', clanEn: 'Hapju Rhie', clanKo: '합주 이씨', seal: '李', leader: 'yiwonhap' },
	{ n: 14, en: 'Lady Daemyeongju', ko: '대명주원부인', clanEn: 'Myeongju Wang', clanKo: '명주 왕씨', seal: '王', leader: 'wangye' },
	{ n: 15, en: 'Lady of Gwangju', ko: '광주원부인', clanEn: 'Gwangju Wang', clanKo: '광주 왕씨', seal: '王', leader: 'wanggyu' },
	{ n: 16, en: 'Lady of Little Gwangju', ko: '소광주원부인', clanEn: 'Gwangju Wang', clanKo: '광주 왕씨', seal: '王', leader: 'wanggyu' },
	{ n: 17, en: 'Lady Dongsan', ko: '동산원부인', clanEn: 'Seungju Park', clanKo: '승주 박씨', seal: '朴', leader: 'parkyounggyu' },
	{ n: 18, en: 'Lady Yehwa', ko: '예화부인', clanEn: 'Chunju Wang', clanKo: '춘주 왕씨', seal: '王', leader: 'wangyu' },
	{ n: 19, en: 'Lady Daeseowon', ko: '대서원부인', clanEn: 'Dongju Kim', clanKo: '동주 김씨', seal: '金', leader: 'kimhaengpa' },
	{ n: 20, en: 'Lady Soseowon', ko: '소서원부인', clanEn: 'Dongju Kim', clanKo: '동주 김씨', seal: '金', leader: 'kimhaengpa' },
	{ n: 21, en: 'Lady Seowon', ko: '서전원부인', clanEn: 'Unrecorded', clanKo: '미상' },
	{ n: 22, en: 'Lady Sinju', ko: '신주원부인', clanEn: 'Seonju Gang', clanKo: '신주 강씨', seal: '康', leader: 'ganggiju' },
	{ n: 23, en: 'Lady Wolhwa', ko: '월화원부인', clanEn: 'Unrecorded', clanKo: '미상', leader: 'yeongjang' },
	{ n: 24, en: 'Lady Sohwangju', ko: '소황주원부인', clanEn: 'Hwangju', clanKo: '황주', leader: 'sunhaeng' },
	{ n: 25, en: 'Lady Seongmu', ko: '성무부인', clanEn: 'Pyeongju Pak', clanKo: '평주 박씨', seal: '朴', leader: 'parkjiyun' },
	{ n: 26, en: 'Lady Uiseong', ko: '의성부원부인', clanEn: 'Uiseong Houng', clanKo: '의성 홍씨', seal: '洪', leader: 'hongyu' },
	{ n: 27, en: 'Lady Wolgyeong', ko: '월경원부인', clanEn: 'Pyeongju Pak', clanKo: '평주 박씨', seal: '朴', leader: 'parksumun' },
	{ n: 28, en: 'Lady Mongnyang', ko: '몽량원부인', clanEn: 'Pyeongju Pak', clanKo: '평주 박씨', seal: '朴', leader: 'parksugyeong' },
	{ n: 29, en: 'Lady Haeryang', ko: '해량원부인', clanEn: 'Haepyeong', clanKo: '해평', leader: 'seonpil' }
];

export const WIFE_LEADERS: string[] = [...new Set(WIVES.flatMap((w) => (w.leader ? [w.leader] : [])))];
