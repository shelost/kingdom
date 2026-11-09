/**
 * /scenes — still + soundtrack pairs (TikTok-style feed).
 * Prefer local `static/mu_*.mp3` theme files; MacLeod beds under `/music/` as fallback.
 */

import { TRACKS, type Track } from '$lib/music.svelte';

export type SceneAudio =
	| {
			kind: 'file';
			/** Public path under static/ */
			file: string;
			title: string;
			/** In-story singer / performer (chronicle voice), not the real-world credit. */
			artist?: string;
			credit: string;
			loop?: boolean;
	  }
	| {
			kind: 'local';
			/** Key into TRACKS (cue name). */
			cue: keyof typeof TRACKS;
	  }
	| {
			kind: 'youtube';
			/** YouTube video id — played in a hidden official player, not a local file. */
			youtubeId: string;
			title: string;
			/** In-story singer / performer (chronicle voice), not the real-world credit. */
			artist?: string;
			credit: string;
			loop?: boolean;
	  };

export interface Scene {
	id: string;
	/** Public path under static/ — poster / thumb (usually frames[0]). */
	image: string;
	/** Optional looping still sequence (crossfades while the slide is live). */
	frames?: readonly string[];
	/** Ms per frame when `frames` is set. Default 1100. */
	frameMs?: number;
	title: string;
	/** One-line place / beat */
	place: string;
	/**
	 * Album art for the right-hand scene. Omit to use the first frame
	 * (`frames[0]`, else `image`).
	 */
	cover?: string;
	audio: SceneAudio;
	/** Romance / couple theme — pink dot in the scenes rail. */
	love?: boolean;
}

/** Love-theme scene ids (ten couples’ soundtracks + directional Yushin/Sunduk beats). */
export const LOVE_SCENE_IDS = new Set<string>([
	'ibiga-ridge-gaya-love',
	'sunduk-little-fall-of-rain',
	'gotaso-pumsuk',
	'yushin-sunduk-flower',
	'sunduk-loves-yushin',
	'young-yushin-loves-sunduk',
	'birch-old-joseon',
	'suro-heo-goodbye',
	'jumong-sosuno-talk',
	'xue-lady-liu',
	'haemosu-bae-bae',
	'yushin-always-dukman',
	'chunchu-munhee-moonlight',
	'bupmin-jahee-nagging'
]);

export function isLoveScene(scene: Scene | string): boolean {
	const id = typeof scene === 'string' ? scene : scene.id;
	if (LOVE_SCENE_IDS.has(id)) return true;
	return typeof scene !== 'string' && scene.love === true;
}

/** One signature theme per person. Second themes for the same person stay unmarked. */
const PERSON_SCENE_IDS = new Set<string>([
	'gyebek-who-am-i',
	'bidam-never-again',
	'euija-ambition',
	'gesomun-promise',
	'sadaham-try-again',
	'chunchu-revenge',
	'haemosu-bae-bae',
	'yushin-sword',
	'dangun-founding',
	'xue-rengui-war',
	'wuzetian-screen',
	'taizong-qin-wang',
	'gotaso-hers',
	'bupmin-resolve'
]);

export function isPersonScene(scene: Scene | string): boolean {
	const id = typeof scene === 'string' ? scene : scene.id;
	return PERSON_SCENE_IDS.has(id);
}

function file(opts: {
	file: string;
	title: string;
	artist?: string;
	credit: string;
	loop?: boolean;
}): SceneAudio {
	return { kind: 'file', loop: true, ...opts };
}

function local(cue: keyof typeof TRACKS): SceneAudio {
	return { kind: 'local', cue };
}

function youtube(opts: {
	youtubeId: string;
	title: string;
	artist?: string;
	credit: string;
	loop?: boolean;
}): SceneAudio {
	return { kind: 'youtube', loop: true, ...opts };
}

/** Album art. An explicit `cover` wins; otherwise the first frame in the sequence. */
export function sceneCover(scene: Scene): string {
	return scene.cover ?? sceneFrames(scene)[0];
}

/** Frames to animate — falls back to a single still. */
export function sceneFrames(scene: Scene): readonly string[] {
	/* Array holes (`'a',,'b'`) read as undefined and break keyed loops. */
	const frames = scene.frames?.filter((frame) => typeof frame === 'string' && frame.length > 0);
	return frames && frames.length > 0 ? frames : [scene.image];
}

/** Opening set — chronicle stills with house `mu_*` themes + a few MacLeod beds. */
export const SCENES: Scene[] = [
	{
		id: 'taizong-qin-wang',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong_1.png?v=1794205240553',
		cover: '/album_taizong.png',
		frames: ['https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong_1.png?v=1794205240553', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong_2.png?v=1794205240599', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong_3.png?v=1794205240849', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_2.jpg?v=1794205237266', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_3.jpg?v=1794205237864', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_4.jpg?v=1794205238219', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_12.jpg?v=1794205236583', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_13.jpg?v=1794205237088', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_14.jpg?v=1794205237366', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_26.jpg?v=1794205237491', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_35.jpg?v=1794205237968', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_41.jpg?v=1794205238538', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_42.jpg?v=1794205238636', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_43.jpg?v=1794205238751', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_44.jpg?v=1794205239340', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_45.jpg?v=1794205239387', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_46.jpg?v=1794205239388', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_47.jpg?v=1794205239632', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_48.jpg?v=1794205239911', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_taizong-qin-wang_49.jpg?v=1794205239951'],
		frameMs: 3200,
		title: 'Taizong',
		place: 'Chang’an — the Son of Heaven',
		audio: file({
			file: '/mu_qin_wang.mp3',
			title: '秦王破阵乐 / The Prince of Qin Breaks Through the Array',
			credit: 'Tang-era court-military suite · youtube.com/watch?v=UUepqkonedc'
		})
	},
	{
		id: 'ibiga-ridge-gaya-love',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga_1.png?v=1794205214746',
		cover: '/album_ibiga.png',
		frames: ['https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga_1.png?v=1794205214746', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga_2.png?v=1794205217556', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga_3.png?v=1794205217054', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga-ridge-gaya-love_2.jpg?v=1794205210234', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga-ridge-gaya-love_4.jpg?v=1794205211293', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga-ridge-gaya-love_21.jpg?v=1794205210757', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga-ridge-gaya-love_27.jpg?v=1794205210833', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga-ridge-gaya-love_35.jpg?v=1794205210858'],
		frameMs: 3400,
		title: 'As Long As There Is A Sky',
		place: 'Cloud country — the heart-ridge',
		audio: file({
			file: '/mu_gaya_love.mp3',
			title: 'Gaya love',
			artist: 'Ibiga',
			credit: 'House theme · mu_gaya_love'
		})
	},
	{
		id: 'sunduk-little-fall-of-rain',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk_1.png?v=1794205234019',
		cover: '/album_sunduk_death.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-little-fall-of-rain_2.jpg?v=1794205231037',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk_1.png?v=1794205234019',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk_2.png?v=1794205234615',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk_3.png?v=1794205234777',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-little-fall-of-rain_11.jpg?v=1794205231027',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-little-fall-of-rain_13.jpg?v=1794205230916',
			'/scene_sunduk-little-fall-of-rain_14.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-little-fall-of-rain_21.jpg?v=1794205231557',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-little-fall-of-rain_26.jpg?v=1794205231612',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-little-fall-of-rain_27.jpg?v=1794205231968',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-little-fall-of-rain_33.jpg?v=1794205232199',
			'/scene_sunduk-little-fall-of-rain_44.jpg'
		],
		frameMs: 3600,
		title: 'My Queen',
		place: 'Moon palace — Sunduk’s last bed, Yushin kneeling',
		audio: file({
			file: '/mu_little_fall_of_rain.mp3',
			title: 'Little Fall of Rain',
			artist: 'Sunduk & Yushin',
			credit: 'Les Misérables (2012 film) · Samantha Barks & Eddie Redmayne',
			loop: false
		})
	},
	{
		id: 'gotaso-pumsuk',
		image: '/img_gotaso_03.png',
		cover: '/album_gotaso_yoga.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gotaso-pumsuk_2.jpg?v=1794205200447',
			'/img_gotaso_03.png',
			'/img_gotaso_04.png',
			'/img_gotaso_06.png',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gotaso-pumsuk_4.jpg?v=1794205200777',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gotaso-pumsuk_12.jpg?v=1794205200067',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gotaso-pumsuk_35.jpg?v=1794205200839'
		],
		frameMs: 3200,
		title: 'Love Spring',
		place: 'The leap cut off mid-air',
		audio: file({
			file: '/mu_silla_love.mp3',
			title: 'Silla love',
			artist: 'Gotaso & Pumsuk',
			credit: 'House theme · mu_silla_love'
		})
	},
	{
		id: 'yushin-sunduk-flower',
		image: '/img_gotaso_07.png',
		cover: '/album_flower.png',
		frames: [
			'/img_gotaso_07.png',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sunduk-flower_2.jpg?v=1794205256328',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sunduk-flower_10.jpg?v=1794205255539',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sunduk-flower_12.jpg?v=1794205256263',
			'/scene_yushin-sunduk-flower_25.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sunduk-flower_35.jpg?v=1794205256663',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sunduk-flower_39.jpg?v=1794205256731'
		],
		title: 'As the flower blooms and falls',
		place: 'Yushin and Sunduk',
		audio: youtube({
			youtubeId: '-1JCohwW0EA',
			title: 'As the Flower Blooms and Falls',
			artist: 'Yushin & Sunduk',
			credit: 'Lee Yoon Jung — 선덕여왕 OST · youtube.com/watch?v=-1JCohwW0EA'
		})
	},
	{
		id: 'sunduk-loves-yushin',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk_sing.png?v=1794205234763',
		cover: '/album_sunduk.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk_gayageum.png?v=1794205234665',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk_sing.png?v=1794205234763',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sunduk-yushin-flush.jpg?v=1794202239793',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sunduk-yushin-back-blush.jpg?v=1794202164096',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/yushin-fans-sunduk-only.jpg?v=1794202163259',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/dukman_reaching_stars.png?v=1794204222544',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk_1.png?v=1794205234019',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-loves-yushin_2.jpg?v=1794205232796',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-loves-yushin_3.jpg?v=1794205233446',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-loves-yushin_5.jpg?v=1794205233949',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-loves-yushin_10.jpg?v=1794205232254',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-loves-yushin_14.jpg?v=1794205232312',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-loves-yushin_16.jpg?v=1794205232845',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-loves-yushin_24.jpg?v=1794205233087',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-loves-yushin_36.jpg?v=1794205233386',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sunduk-loves-yushin_38.jpg?v=1794205233429'
		],
		frameMs: 3600,
		title: 'Sunduk loves Yushin',
		place: 'The queen who already knows which marshal she will not keep',
		audio: youtube({
			youtubeId: 'GGr5ZzBanGU',
			title: 'I Believe',
			artist: 'Sunduk',
			credit: '이수영 · youtube.com/watch?v=GGr5ZzBanGU'
		})
	},
	{
		id: 'young-yushin-loves-sunduk',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin_sing.png?v=1794205263389',
		cover: '/album_fence.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin_sing.png?v=1794205263389',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/young-yushin.jpg?v=1794202554705',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sunduk-flirt-walkby.jpg?v=1794202163602',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sunduk-flirt-blush.jpg?v=1794202163859',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sunduk-yushin-flush.jpg?v=1794202239793',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sunduk-yushin-back-blush.jpg?v=1794202164096',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-youths-dukman.jpg?v=1794202518063',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_young-yushin-loves-sunduk_2.jpg?v=1794205253608',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_young-yushin-loves-sunduk_12.jpg?v=1794205253279',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_young-yushin-loves-sunduk_36.jpg?v=1794205253947'
		],
		frameMs: 3600,
		title: 'My Princess',
		place: 'The yard — he already knows which princess he will not name',
		audio: youtube({
			youtubeId: 'WmG7KWFyP5c',
			title: '내 여자라니까',
			artist: 'Young Yushin',
			credit: '이승기 · youtube.com/watch?v=WmG7KWFyP5c'
		})
	},
	{
		id: 'birch-old-joseon',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwanung-ungnyeo-birch-wide.jpg?v=1794202873251',
		cover: '/album_bear.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwanung-ungnyeo-birch-wide.jpg?v=1794202873251',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwanung-ungnyeo-kiss.jpg?v=1794202873643',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/ungnyeo-dont-closer.jpg?v=1794202873379',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_birch-old-joseon_2.jpg?v=1794205180724',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwanung-seal-forgotten.jpg?v=1794202873464',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_birch-old-joseon_3.jpg?v=1794205181023',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_birch-old-joseon_36.jpg?v=1794205181201'
		],
		frameMs: 3400,
		title: 'Under the divine birch',
		place: 'Baekdu — Hwanung & Ungnyeo',
		audio: file({
			file: '/mu_heavens.mp3',
			title: 'Heavens',
			credit: 'House theme · mu_heavens'
		})
	},
	{
		id: 'yushin-sword',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/yushin-sword-vertical.jpg?v=1794202174940',
		cover: '/album_yushin.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_3.jpg?v=1794205258584',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/yushin-sword-vertical.jpg?v=1794202174940',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/yushin_sword_vertical.png?v=1794204532445',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_2.jpg?v=1794205257847',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_12.jpg?v=1794205257239',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/statue-yushin-niche.jpg?v=1794202869387',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_14.jpg?v=1794205257558',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_15.jpg?v=1794205257905',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/statue-yushin-equestrian.jpg?v=1794202869188',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_21.jpg?v=1794205257928',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_27.jpg?v=1794205258200',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_33.jpg?v=1794205258837',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_40.jpg?v=1794205258979',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_44.jpg?v=1794205259119',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_45.jpg?v=1794205259180',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_46.jpg?v=1794205259402',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_47.jpg?v=1794205259869',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_48.jpg?v=1794205260045',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_49.jpg?v=1794205260308',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_50.jpg?v=1794205260723',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_51.jpg?v=1794205260746',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_52.jpg?v=1794205261030',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_53.jpg?v=1794205261369',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_54.jpg?v=1794205261488',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_55.jpg?v=1794205261657',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_56.jpg?v=1794205262010',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_57.jpg?v=1794205262016',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_58.jpg?v=1794205262437',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_59.jpg?v=1794205262723',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-sword_60.jpg?v=1794205262831'
		],
		frameMs: 3600,
		title: 'Yushin’s sword',
		place: 'Surabol — duty as a vertical',
		audio: file({
			file: '/mu_moonlit_pledge.mp3',
			title: 'Moonlit pledge',
			credit: 'House theme · mu_moonlit_pledge'
		})
	},
	{
		id: 'ansi-holds',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/ansi-wide.jpg?v=1794202338230',
		cover: '/album_ansi.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/ansi-wide.jpg?v=1794202338230',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/ansi-stone-ring.jpg?v=1794202339066',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/ansi-earthen-ramp.jpg?v=1794202339237',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/ansi-winter.jpg?v=1794202339025',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/taizong-ansi-face.jpg?v=1794202339730',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ansi-holds_2.jpg?v=1794205173770',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ansi-holds_4.jpg?v=1794205174262',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ansi-holds_13.jpg?v=1794205173225',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ansi-holds_22.jpg?v=1794205173794',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ansi-holds_28.jpg?v=1794205173793',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ansi-holds_44.jpg?v=1794205174342'
		],
		frameMs: 3200,
		title: 'Ansi holds',
		place: 'The wall that will not fall',
		audio: file({
			file: '/mu_goguryeo.mp3',
			title: 'Goguryeo',
			credit: 'House theme · mu_goguryeo'
		})
	},
	{
		id: 'white-river',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-white-river.jpg?v=1794202188407',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/white-river-aerial.jpg?v=1794202835614',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-white-river.jpg?v=1794202188407',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-field-face.jpg?v=1794204263190',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-last-stand-yellow.png?v=1794204263379',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_white-river_2.jpg?v=1794205245449',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_white-river_36.jpg?v=1794205245522',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_white-river_40.jpg?v=1794205245583'
		],
		frameMs: 3200,
		title: 'The White River',
		place: 'Baekgang — all sides colliding',
		audio: file({
			file: '/mu_adventure.mp3',
			title: 'Adventure',
			credit: 'House theme · mu_adventure'
		})
	},
	{
		id: 'battle-six-dragons',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-white-river.jpg?v=1794202188407',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_battle-six-dragons_2.jpg?v=1794205174448',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/white-river-aerial.jpg?v=1794202835614',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-white-river.jpg?v=1794202188407',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-field-face.jpg?v=1794204263190',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-last-stand-yellow.png?v=1794204263379',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/ansi-wide.jpg?v=1794202338230',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/salsu-red-wedge.jpg?v=1794202344777',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_battle-six-dragons_37.jpg?v=1794205175118',
			'/scene_battle-six-dragons_39.jpg'
		],
		frameMs: 3000,
		title: 'Battle',
		place: 'The field — every kingdom colliding',
		audio: youtube({
			youtubeId: 'U7FhGMqdrbI',
			title: '육룡이 나르샤 Opening',
			artist: 'The Field',
			credit: 'SBS 육룡이 나르샤 · youtube.com/watch?v=U7FhGMqdrbI'
		})
	},
	{
		id: 'dangun-founding',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/poster_dangun.jpg?v=1794202870545',
		cover: '/album_dangun.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_dangun-founding_13.jpg?v=1794205186356',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/dangun-mountain.jpg?v=1794202871472',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_dangun-founding_4.jpg?v=1794205187431',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/dangun-asadal.jpg?v=1794202871762',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/dangun-over-shoulder.jpg?v=1794202878224',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/poster_dangun.jpg?v=1794202870545',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_dangun-founding_2.jpg?v=1794205186480',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_dangun-founding_3.jpg?v=1794205186755',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_dangun-founding_36.jpg?v=1794205186861',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_dangun-founding_39.jpg?v=1794205187389'
		],
		frameMs: 3400,
		title: 'Dangun',
		place: 'Asadal — the first kingdom',
		audio: file({
			file: '/mu_the_stars.mp3',
			title: 'The stars',
			credit: 'House theme · mu_the_stars'
		})
	},
	{
		id: 'euija-coup',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-coup-rock-wide.jpg?v=1794202627636',
		cover: '/album_deer_rock.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-coup_2.jpg?v=1794205190791',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-coup-rock-wide.jpg?v=1794202627636',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-coup-empty-benches.jpg?v=1794202633684',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-coup-speech-dutch.jpg?v=1794202629175',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-coup-satek-stare.jpg?v=1794202630153',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-coup_4.jpg?v=1794205191178',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-coup_36.jpg?v=1794205191111'
		],
		frameMs: 3200,
		title: 'Deer Rock',
		place: 'Euija’s coup — the empty aisle',
		audio: file({
			file: '/mu_euija.mp3',
			title: 'Euija',
			credit: 'House theme · mu_euija'
		})
	},
	{
		id: 'fortress-omen',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/fortress_gate_red_omen.png?v=1794204235785',
		cover: '/album_fortress.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fortress-omen_2.jpg?v=1794205194076',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/fortress_gate_red_omen.png?v=1794204235785',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/goguryeo-fortress-red-storm-v2.jpg?v=1794202827210',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/eastern-fortress-wide.jpg?v=1794202332613',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fortress-omen_13.jpg?v=1794205193941',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fortress-omen_35.jpg?v=1794205194390',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fortress-omen_40.jpg?v=1794205194414'
		],
		frameMs: 3400,
		title: 'Red omen at the gate',
		place: 'Daeya seongmun — one red seam',
		audio: local('Nine Omens')
	},
	{
		id: 'wuzetian-screen',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian_sing.png?v=1794205250158',
		cover: '/album_wu.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/wuzetian_screen_power.png?v=1794204516803',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian_sing.png?v=1794205250158',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/wuzetian-seal-stamp.jpg?v=1794204516526',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/wuzetian-seduction.jpg?v=1794202575032',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_2.jpg?v=1794205247677',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_4.jpg?v=1794205249064',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_5.jpg?v=1794205249110',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_6.jpg?v=1794205249199',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_7.jpg?v=1794205249307',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_8.jpg?v=1794205249700',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_9.jpg?v=1794205249855',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_10.jpg?v=1794205245966',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_12.jpg?v=1794205246404',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_13.jpg?v=1794205246629',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_16.jpg?v=1794205246805',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_17.jpg?v=1794205246924',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_18.jpg?v=1794205247107',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_19.jpg?v=1794205247356',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_20.jpg?v=1794205247932',
			'/scene_wuzetian-screen_22.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_24.jpg?v=1794205248096',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_26.jpg?v=1794205248028',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_28.jpg?v=1794205248326',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_wuzetian-screen_38.jpg?v=1794205248715'
		],
		frameMs: 3400,
		title: 'Wu behind the screen',
		place: 'Influence without the throne',
		audio: youtube({
			youtubeId: '0WmQwxUajww',
			title: '一笑江湖',
			artist: 'Wu Zetian',
			credit: '聞人聽書 · youtube.com/watch?v=0WmQwxUajww'
		})
	},
	{
		id: 'three-realms-goddess',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-realms-01-establishing.jpg?v=1794202675470',
		cover: '/album_cavern_three.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-realms-05-principals-enter.png?v=1794202689539',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-realms-01-establishing.jpg?v=1794202675470',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-realms-wide.jpg?v=1794202675116',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-realms-06-council.png?v=1794202691750',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-realms-07-feast.png?v=1794202694680',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-realms-12-principals.png?v=1794202704303',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-realms-meeting.png?v=1794202693778',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three-realms-goddess_2.jpg?v=1794205244046',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three-realms-goddess_3.jpg?v=1794205244182',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three-realms-goddess_4.jpg?v=1794205244771',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three-realms-goddess_37.jpg?v=1794205244672'
		],
		frameMs: 3400,
		title: 'The Three Realms',
		place: '삼계정자 — Living, Dead, and the Western Flower Field',
		audio: file({
			file: '/mu_goddess.mp3',
			title: 'Goddess',
			credit: 'House theme · mu_goddess'
		})
	},
	{
		id: 'salsu-gesomun',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/salsu-red-wedge.jpg?v=1794202344777',
		cover: '/album_salsu.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_dosuryu_geomungo.png?v=1794205187578',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/salsu-red-wedge.jpg?v=1794202344777',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/salsu-ford-ribbon.jpg?v=1794202344168',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/salsu-flashback.jpg?v=1794202343407',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_salsu-gesomun_2.jpg?v=1794205228990',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_salsu-gesomun_4.jpg?v=1794205229796',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_salsu-gesomun_28.jpg?v=1794205229423',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_salsu-gesomun_33.jpg?v=1794205229669',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_salsu-gesomun_40.jpg?v=1794205229794'
		],
		frameMs: 3200,
		title: 'Salsu',
		place: 'The ford remembered in red',
		audio: file({
			file: '/mu_yeon_gesomun.mp3',
			title: 'Yeon Gesomun',
			credit: 'House theme · mu_yeon_gesomun'
		})
	},
	{
		id: 'chunchu-shadow',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/chunchu_strategist_shadow.png?v=1794204210567',
		cover: '/album_chunchu_shadow.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/chunchu_strategist_shadow.png?v=1794204210567',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/chunchu-map-pool.jpg?v=1794202577786',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/chunchu-forecast.jpg?v=1794202867123',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/chunchu-death-wide.jpg?v=1794202811848',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu-shadow_2.jpg?v=1794205184985',
			'/scene_chunchu-shadow_5.jpg',
			'/scene_chunchu-shadow_26.jpg',
			'/scene_chunchu-shadow_28.jpg'
		],
		frameMs: 3200,
		title: 'Chunchu in shadow',
		place: 'Half-face power — the strategist',
		audio: file({
			file: '/mu_chunchu.mp3',
			title: 'Chunchu',
			credit: 'House theme · mu_chunchu'
		})
	},
	{
		id: 'bidam-never-again',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_sing.png?v=1794205180060',
		cover: '/album_bidam.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_wolgeum.png?v=1794205180329',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_sing.png?v=1794205180060',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_1.png?v=1794205178175',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_2.png?v=1794205178466',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_3.png?v=1794205180168',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_4.png?v=1794205180410',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-never-again_2.jpg?v=1794205175276',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-never-again_3.jpg?v=1794205176219',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-never-again_4.jpg?v=1794205176407',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-never-again_5.jpg?v=1794205176831',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-never-again_10.jpg?v=1794205175149',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-never-again_21.jpg?v=1794205175506',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-never-again_26.jpg?v=1794205175602',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-never-again_27.jpg?v=1794205175902',
			'/scene_bidam-never-again_33.jpg',
			'/scene_bidam-never-again_40.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-never-again_44.jpg?v=1794205176798'
		],
		frameMs: 3200,
		title: 'Bidam',
		place: 'Surabol — the one who will not be seen again',
		audio: youtube({
			youtubeId: 'ePqZ9BPNsv8',
			title: 'Never See Me Again',
			artist: 'Bidam',
			credit: 'Kanye West · youtube.com/watch?v=ePqZ9BPNsv8'
		})
	},
	{
		id: 'suro-heo-goodbye',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_heo_sing.png?v=1794205209310',
		cover: '/album_red_sail.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_heo_sing.png?v=1794205209310',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/suro-court-love.jpg?v=1794202503284',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/suro-heo-tent.jpg?v=1794202506970',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/heo-court-face.jpg?v=1794202503775',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/heo-court-present.jpg?v=1794202503209',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/heo-silk-trousers.jpg?v=1794202506796',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_suro-heo-goodbye_2.jpg?v=1794205235973',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_suro-heo-goodbye_12.jpg?v=1794205235378',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_suro-heo-goodbye_22.jpg?v=1794205235916',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_suro-heo-goodbye_24.jpg?v=1794205236024',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_suro-heo-goodbye_28.jpg?v=1794205236067'
		],
		frameMs: 3400,
		title: 'The Red Sail',
		place: 'Garak — the goodbye that stays',
		audio: youtube({
			youtubeId: 'Qe8fa4b5xNU',
			title: 'Good Goodbye',
			artist: 'Queen Heo',
			credit: '화사 (HWASA) · youtube.com/watch?v=Qe8fa4b5xNU'
		})
	},
	{
		id: 'jumong-sosuno-talk',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sosuno_sing.png?v=1794205230405',
		cover: '/album_well_yoga.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sosuno_sing.png?v=1794205230405',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-sosuno-well.jpg?v=1794202429373',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-sosuno-hall-chin.jpg?v=1794202439101',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-sosuno-side-almost-kiss.jpg?v=1794202487505',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-sosuno-seq-kiss-shock.jpg?v=1794202452669',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-sosuno-seq-queen-hall.jpg?v=1794202482598',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-sosuno-pov-leave.jpg?v=1794202433341',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_2.jpg?v=1794205220558',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_4.jpg?v=1794205221681',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_10.jpg?v=1794205218894',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_12.jpg?v=1794205219145',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_14.jpg?v=1794205219167',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_16.jpg?v=1794205219362',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_17.jpg?v=1794205219894',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_18.jpg?v=1794205220289',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_19.jpg?v=1794205220259',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_20.jpg?v=1794205220720',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_22.jpg?v=1794205221000',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_24.jpg?v=1794205221221',
			'/scene_jumong-sosuno-talk_27.jpg',
			'/scene_jumong-sosuno-talk_33.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-sosuno-talk_38.jpg?v=1794205221580'
		],
		frameMs: 3200,
		title: 'Sosuno and Jumong',
		place: 'Jolbon — the well, the loft, the leaving',
		audio: youtube({
			youtubeId: 't79LDdqsOi4',
			title: '대화가 필요해',
			artist: 'Sosuno',
			credit: '자두 · youtube.com/watch?v=t79LDdqsOi4'
		})
	},
	{
		id: 'xue-rengui-war',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/poster_xuerengui.jpg?v=1794202335865',
		cover: '/album_xue.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-rengui-war_4.jpg?v=1794205252688',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/poster_xuerengui.jpg?v=1794202335865',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/xue-white-ridge.jpg?v=1794202336636',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/xue-eastern-shaft.jpg?v=1794202205580',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/xue-longmen-field-dawn.jpg?v=1794202329540',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/xue-fortress-escape.jpg?v=1794202336862',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-rengui-war_2.jpg?v=1794205252340',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-rengui-war_28.jpg?v=1794205252564'
		],
		frameMs: 3000,
		title: 'Xue Rengui',
		place: 'Longmen to Liaodong — the white coat',
		audio: file({
			file: '/mu_chinese_war.mp3',
			title: 'Chinese war',
			credit: 'House theme · mu_chinese_war'
		})
	},
	{
		id: 'xue-lady-liu',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue_liu_sing.png?v=1794205253090',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue_liu_sing.png?v=1794205253090',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/xue-longmen-field-dawn.jpg?v=1794202329540',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/xue-longmen-two-shot.jpg?v=1794202330286',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/xue-longmen-wife-close.jpg?v=1794202330233',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/xue-longmen-hut-door.jpg?v=1794202329759',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/xue-longmen-farewell.jpg?v=1794202335894',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/xue-longmen-yellow-hoe.jpg?v=1794202329778',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-lady-liu_2.jpg?v=1794205250712',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-lady-liu_3.jpg?v=1794205251395',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-lady-liu_4.jpg?v=1794205251873',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-lady-liu_12.jpg?v=1794205250574',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-lady-liu_25.jpg?v=1794205251150',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-lady-liu_26.jpg?v=1794205251273',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-lady-liu_35.jpg?v=1794205251781',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_xue-lady-liu_39.jpg?v=1794205251894'
		],
		frameMs: 3400,
		title: 'Xue and Lady Liu',
		place: 'Longmen — she names the hour, he goes',
		audio: youtube({
			youtubeId: 'paQWp82kgNI',
			title: '佳人歌 / The Beauty Song',
			artist: 'Lady Liu',
			credit: 'House of Flying Daggers (2004) · youtube.com/watch?v=paQWp82kgNI'
		})
	},
	{
		id: 'grim-reapers-killmonger',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/poster_kangrim.jpg?v=1794202746342',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_grim-reapers-killmonger_2.jpg?v=1794205201416',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/poster_kangrim.jpg?v=1794202746342',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/poster_haewonmek.jpg?v=1794202745886',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/kangrim_reaper_scroll.png?v=1794202751308',
			'/temp/kangrim-haewonmek-flight.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/kangrim-ledger-glow.jpg?v=1794202750572',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/haewonmek-sword-redbook.jpg?v=1794202751569',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-night-reaper-over.jpg?v=1794202418655',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_grim-reapers-killmonger_3.jpg?v=1794205201364',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_grim-reapers-killmonger_4.jpg?v=1794205202022',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_grim-reapers-killmonger_37.jpg?v=1794205201682'
		],
		frameMs: 3200,
		title: 'The Grim Reapers',
		place: '저승 — Kangrim and Haewonmek',
		audio: youtube({
			youtubeId: 'yYCbSl3lGq0',
			title: 'Killmonger',
			artist: 'Kangrim & Haewonmek',
			credit: 'Ludwig Göransson — Black Panther · youtube.com/watch?v=yYCbSl3lGq0'
		})
	},
	{
		id: 'haemosu-bae-bae',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu_sing.png?v=1794205208818',
		cover: '/album_haemosu_chariot.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu_sing.png?v=1794205208818',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-haemosu-sky-noon-laugh.jpg?v=1794202366875',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-haemosu-heart-yuhwa-chin.jpg?v=1794202423244',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-haemosu-sky-dusk-lean.jpg?v=1794202367574',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-haemosu-sky-sisters.jpg?v=1794202348353',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-haemosu-pov-yuhwa-grin.jpg?v=1794202370918',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-haemosu-heart-dutch-high.jpg?v=1794204333454',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-bae-bae_2.jpg?v=1794205204816',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-bae-bae_3.jpg?v=1794205205352',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-bae-bae_11.jpg?v=1794205204474',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-bae-bae_14.jpg?v=1794205204563',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-bae-bae_25.jpg?v=1794205205082',
			'/scene_haemosu-bae-bae_37.jpg'
		],
		frameMs: 3200,
		title: 'Haemosu',
		place: 'The sun’s chariot — he wants her before he asks her name',
		audio: youtube({
			youtubeId: 'TKD03uPVD-Q',
			title: 'BAE BAE',
			artist: 'Haemosu',
			credit: 'BIGBANG · youtube.com/watch?v=TKD03uPVD-Q'
		})
	},
	{
		id: 'gyebek-who-am-i',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek_tamla_sing.png?v=1794205204243',
		cover: '/album_gyebek.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek-who-am-i_27.jpg?v=1794205202886',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek_tamla_sing.png?v=1794205204243',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek_ocean_back.png?v=1794205203764',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek_ocean_front.png?v=1794205204173',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-family.jpg?v=1794202673867',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-well.jpg?v=1794202704001',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-seq-name.jpg?v=1794202190026',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-sunset.jpg?v=1794202624521',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gyebek-departs.jpg?v=1794202673714',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek-who-am-i_2.jpg?v=1794205202545',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek-who-am-i_3.jpg?v=1794205202955',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek-who-am-i_5.jpg?v=1794205203466',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek-who-am-i_15.jpg?v=1794205202162',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/statue-gyebek-field.jpg?v=1794202805631',
			'/scene_gyebek-who-am-i_21.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek-who-am-i_33.jpg?v=1794205203160',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gyebek-who-am-i_38.jpg?v=1794205203167'
		],
		frameMs: 3400,
		title: 'Gyebek',
		place: 'The well, the name, the last ride',
		audio: youtube({
			youtubeId: 'gZDYbq2ZgUI',
			title: 'Who Am I?',
			artist: 'Gyebek',
			credit: 'Les Misérables · Colm Wilkinson · youtube.com/watch?v=gZDYbq2ZgUI',
			loop: false
		})
	},
	{
		id: 'three-princesses-invite',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three_princesses_sing.png?v=1794205245064',
		cover: '/album_sisters.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three_princesses_sing.png?v=1794205245064',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-princesses.jpg?v=1794202162724',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/dukman_reaching_stars.png?v=1794204222544',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-youths-dukman.jpg?v=1794202518063',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three-princesses-invite_2.jpg?v=1794205243360',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three-princesses-invite_35.jpg?v=1794205243699',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three-princesses-invite_39.jpg?v=1794205244037'
		],
		frameMs: 3600,
		title: 'Three Princesses',
		place: 'Dukman, Seungman, Chunmyung — the invitation is theirs',
		audio: youtube({
			youtubeId: 'bYrF7cVi5vE',
			title: '나에게로의 초대',
			artist: 'The Three Princesses',
			credit: '복면가왕 · 조유진 & 박기영 · youtube.com/watch?v=bYrF7cVi5vE'
		})
	},
	{
		id: 'sadaham-try-again',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sadaham_sing.png?v=1794205228705',
		cover: '/album_sadaham.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sadaham_sing.png?v=1794205228705',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sadaham_moon_vow.png?v=1794205228349',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sadaham_gate_shaft.png?v=1794205228304',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sadaham_seven_fire.png?v=1794205228350',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sadaham-seq-gate.jpg?v=1794202526017',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sadaham-gaya-road.jpg?v=1794202230271',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sadaham-seq-vanguard.jpg?v=1794204442569',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sadaham-seq-mugwan-vow.jpg?v=1794202230893',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sadaham-seven-days.jpg?v=1794202231427',
			'/temp/sadaham-seq-free.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sadaham-try-again_2.jpg?v=1794205226963',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sadaham-try-again_4.jpg?v=1794205227287',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sadaham-try-again_5.jpg?v=1794205227850',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sadaham-try-again_37.jpg?v=1794205227034',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_sadaham-try-again_40.jpg?v=1794205227643'
		],
		frameMs: 3400,
		title: 'Sadaham',
		place: 'Gaya road — he will try the vow again',
		audio: youtube({
			youtubeId: '4LPmBiFkoBk',
			title: 'Try Again',
			artist: 'Sadaham',
			credit: 'd.ear X Jaehyun · SM STATION · youtube.com/watch?v=4LPmBiFkoBk'
		})
	},
	{
		id: 'hwarang-oxygen',
		image: '/temp/hwarang_flower_youth.png',
		frames: [
			'/temp/hwarang_flower_youth.png',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwarang-class.jpg?v=1794202517818',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwarang-spar.jpg?v=1794202518158',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/crescent-hwarang.jpg?v=1794202183542',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwarang-female-fans.jpg?v=1794202217464',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_hwarang-oxygen_2.jpg?v=1794205209584',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_hwarang-oxygen_37.jpg?v=1794205209987'
		],
		frameMs: 3200,
		title: 'The Hwarang',
		place: 'Surabol yard — flower youth, steel breath',
		audio: youtube({
			youtubeId: '7_pyar0I3Rc',
			title: '산소 같은 너',
			artist: 'The Hwarang',
			credit: 'SHINee · youtube.com/watch?v=7_pyar0I3Rc'
		})
	},
	{
		id: 'maehwa-coming-of-age',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa_sing.png?v=1794205225440',
		cover: '/album_maehwa_yoga.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa_sing.png?v=1794205225440',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/maehwa-feast-close.jpg?v=1794204374034',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_10.jpg?v=1794205223084',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_2.jpg?v=1794205224280',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_3.jpg?v=1794205225036',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_12.jpg?v=1794205223276',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_16.jpg?v=1794205223621',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_17.jpg?v=1794205223622',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_18.jpg?v=1794205224041',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_19.jpg?v=1794205224156',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_20.jpg?v=1794205224614',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_24.jpg?v=1794205224740',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_28.jpg?v=1794205224859',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_maehwa-coming-of-age_39.jpg?v=1794205225357'
		],
		frameMs: 3400,
		title: 'Maehwa',
		place: 'Daeya — she walks the yard like she owns the looking',
		audio: youtube({
			youtubeId: 'rAsMh0zyH3o',
			title: '성인식',
			artist: 'Maehwa',
			credit: '박지윤 · youtube.com/watch?v=rAsMh0zyH3o'
		})
	},
	{
		id: 'euija-anger-f',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija_anger_sing.png?v=1794205191527',
		cover: '/album_euija_yoga.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija_anger_sing.png?v=1794205191527',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-mourning-fury.jpg?v=1794202624625',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-crown-eaten.jpg?v=1794202267740',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-laugh.jpg?v=1794202809989',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-fallen.jpg?v=1794202807348',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija_king_or_slave.jpg?v=1794202320774',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-coup-speech-dutch.jpg?v=1794202629175',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-anger-f_2.jpg?v=1794205190066',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-anger-f_3.jpg?v=1794205190325',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-anger-f_36.jpg?v=1794205190569',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-anger-f_38.jpg?v=1794205190541'
		],
		frameMs: 3200,
		title: 'Euija’s anger',
		place: 'Sabi — the fury after the crown is eaten',
		audio: youtube({
			youtubeId: 'DX8sssS3Gnc',
			title: 'F',
			artist: 'Euija',
			credit: 'BOBBY · youtube.com/watch?v=DX8sssS3Gnc'
		})
	},
	{
		id: 'yushin-chunchu-bad-boy',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin_chunchu_sing.png?v=1794205262978',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-chunchu-bad-boy_2.jpg?v=1794205255023',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin_chunchu_sing.png?v=1794205262978',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/yushin-chunchu-munhee.jpg?v=1794202163191',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/harmony-council.jpg?v=1794202170140',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/chunchu_strategist_shadow.png?v=1794204210567',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/yushin-sword-vertical.jpg?v=1794202174940',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/bidam-blood-inevitable.jpg?v=1794202518284',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/council-tea-yushin.jpg?v=1794204215545',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-chunchu-bad-boy_5.jpg?v=1794205255404',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-chunchu-bad-boy_37.jpg?v=1794205255260'
		],
		frameMs: 3200,
		title: 'Yushin & Chunchu',
		place: 'Surabol — two True Bones, one hard key',
		audio: youtube({
			youtubeId: '1qnV55LUFVM',
			title: 'Bad Boy',
			artist: 'Yushin & Chunchu',
			credit: 'BIGBANG · youtube.com/watch?v=1qnV55LUFVM'
		})
	},
	{
		id: 'yushin-always-dukman',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin_sing.png?v=1794205263389',
		cover: '/album_yushin_oath.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin_sing.png?v=1794205263389',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sunduk-flirt-walkby.jpg?v=1794202163602',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sunduk-flirt-blush.jpg?v=1794202163859',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sunduk-yushin-flush.jpg?v=1794202239793',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/sunduk-yushin-back-blush.jpg?v=1794202164096',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/yushin-fans-sunduk-only.jpg?v=1794202163259',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/dukman_reaching_stars.png?v=1794204222544',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-always-dukman_2.jpg?v=1794205254422',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-always-dukman_4.jpg?v=1794205254973',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-always-dukman_12.jpg?v=1794205254169',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_yushin-always-dukman_22.jpg?v=1794205254631',
			'/scene_yushin-always-dukman_37.jpg'
		],
		frameMs: 3600,
		title: 'Yushin and Dukman',
		place: 'The yard — he already knows which one he will not name',
		audio: youtube({
			youtubeId: 'Ztu7uW6U93Y',
			title: 'Always',
			artist: 'Young Yushin',
			credit: '레떼아모르 · Phantom Singer · Bon Jovi · youtube.com/watch?v=Ztu7uW6U93Y'
		})
	},
	{
		id: 'hwarang-belle',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_hwarang_belle_sing.png?v=1794205210167',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_hwarang_belle_sing.png?v=1794205210167',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-youths-dukman.jpg?v=1794202518063',
			'/temp/hwarang_flower_youth.png',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwarang-class.jpg?v=1794202517818',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwarang-spar.jpg?v=1794202518158',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_hwarang-belle_2.jpg?v=1794205209573',
			'/scene_hwarang-belle_37.jpg'
		],
		frameMs: 3400,
		title: 'Three for Dukman',
		place: 'Youth — Yushin, Alchun, and Bidam, one princess',
		audio: youtube({
			youtubeId: 'FVnxKAoFzBg',
			title: 'Belle',
			artist: 'Yushin, Alchun & Bidam',
			credit: 'Notre-Dame de Paris · Garou, Daniel Lavoie & Patrick Fiori · youtube.com/watch?v=FVnxKAoFzBg'
		})
	},
	{
		id: 'chunchu-munhee-moonlight',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_munhee_sing.png?v=1794205225722',
		cover: '/album_munhee.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_munhee_sing.png?v=1794205225722',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/munhee-chunchu-months-quiet.jpg?v=1794202242221',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/munhee-chunchu-back.jpg?v=1794202242117',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/munhee-sewing-first.jpg?v=1794202241593',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/munhee-queen-consort.jpg?v=1794202619270',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/munhee-folded-letter.jpg?v=1794202166413',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu-munhee-moonlight_2.jpg?v=1794205183743',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu-munhee-moonlight_3.jpg?v=1794205184027',
			'/scene_chunchu-munhee-moonlight_12.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu-munhee-moonlight_16.jpg?v=1794205183498',
			'/scene_chunchu-munhee-moonlight_22.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu-munhee-moonlight_25.jpg?v=1794205183827',
			'/scene_chunchu-munhee-moonlight_37.jpg',
			'/scene_chunchu-munhee-moonlight_38.jpg'
		],
		frameMs: 3600,
		title: 'Chunchu and Munhee',
		place: 'The months she keeps the needle moving',
		audio: youtube({
			youtubeId: 'jC57MGELamw',
			title: 'Moonlight',
			artist: 'Munhee',
			credit: '月亮代表我的心 · 가야금 · youtube.com/watch?v=jC57MGELamw'
		})
	},
	{
		id: 'bupmin-jahee-nagging',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jahee_sing.png?v=1794205214982',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jahee_sing.png?v=1794205214982',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/bupmin-jahee-rain.jpg?v=1794202620092',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/bupmin-jahee-ledger.jpg?v=1794202620263',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/bupmin-jahee-almost.jpg?v=1794202620674',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bupmin-jahee-nagging_2.jpg?v=1794205181713',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bupmin-jahee-nagging_12.jpg?v=1794205181503',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bupmin-jahee-nagging_25.jpg?v=1794205181971',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bupmin-jahee-nagging_37.jpg?v=1794205182125'
		],
		frameMs: 3200,
		title: 'Bupmin and Jahee',
		place: 'The ledger, the rain, the almost',
		audio: youtube({
			youtubeId: '7_JEkO6KvVo',
			title: 'Nagging',
			artist: 'Jahee',
			credit: '아이유 & 임슬옹 · youtube.com/watch?v=7_JEkO6KvVo'
		})
	},
	{
		id: 'chunchu-revenge',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu_prison_floor.png?v=1794205185480',
		cover: '/album_chunchu.png',
		frames: [
			'/emotional_chunchu_revenge_oath.png',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu_daegeum.png?v=1794205185203',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu_prison_floor.png?v=1794205185480',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu_prison_close.png?v=1794205185471',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu_prison_window.png?v=1794205186133',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/chunchu-prison.jpg?v=1794202311520',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/chunchu-map-pool.jpg?v=1794202577786',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/chunchu-forecast.jpg?v=1794202867123',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu-revenge_2.jpg?v=1794205184273',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu-revenge_3.jpg?v=1794205184397',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu-revenge_37.jpg?v=1794205184635',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_chunchu-revenge_44.jpg?v=1794205184843'
		],
		frameMs: 3400,
		title: 'Chunchu’s revenge',
		place: 'The oath he does not say out loud',
		audio: youtube({
			youtubeId: 'RKJNMmQFz4U',
			title: 'Those Who Make Me Sad',
			artist: 'Chunchu',
			credit: '퉁키 · youtube.com/watch?v=RKJNMmQFz4U',
			loop: false
		})
	},
	{
		id: 'euija-ambition',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija_deer_sing.png?v=1794205191767',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija_gonghu.png?v=1794205192033',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija_deer_sing.png?v=1794205191767',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-crown-eaten.jpg?v=1794202267740',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-coup-speech-dutch.jpg?v=1794202629175',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-coup-rock-wide.jpg?v=1794202627636',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/euija-changan-court.jpg?v=1794202807263',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-ambition_2.jpg?v=1794205188565',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-ambition_4.jpg?v=1794205189274',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-ambition_5.jpg?v=1794205189687',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-ambition_12.jpg?v=1794205188118',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/statue-euija-gilt.jpg?v=1794202808756',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-ambition_13.jpg?v=1794205188162',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-ambition_21.jpg?v=1794205188942',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-ambition_28.jpg?v=1794205188942',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_euija-ambition_43.jpg?v=1794205189444'
		],
		frameMs: 3400,
		title: 'Euija’s ambition',
		place: 'Sabi — the crown he means to finish',
		audio: youtube({
			youtubeId: 'knb13a6oaLA',
			title: 'The More I Love',
			artist: 'Euija',
			credit: '클레오파트라 · 복면가왕 · youtube.com/watch?v=knb13a6oaLA'
		})
	},
	{
		id: 'gesomun-promise',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun_cave_symmetry.png?v=1794205199485',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun_cave_symmetry.png?v=1794205199485',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun_cave_dutch.png?v=1794205198936',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/poster_gesomun.jpg?v=1794202203423',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gesomun-five-pommels.jpg?v=1794202309835',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gesomun-rings-cross.jpg?v=1794202308271',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gesomun-seq-pyongyang-gate.jpg?v=1794202207405',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gesomun-authority-low-angle.jpg?v=1794202309148',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-promise_2.jpg?v=1794205197645',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-promise_3.jpg?v=1794205198117',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-promise_4.jpg?v=1794205198526',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-promise_5.jpg?v=1794205198809',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-promise_13.jpg?v=1794205197241',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-promise_14.jpg?v=1794205197452',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-promise_26.jpg?v=1794205197808',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-promise_37.jpg?v=1794205198357'
		],
		frameMs: 3200,
		title: 'Gesomun’s promise',
		place: 'Pyongyang — the wings, the five rings, the vow',
		audio: youtube({
			youtubeId: 'b1p0jQbpVi4',
			title: 'Take Flight',
			artist: 'Gesomun',
			credit: '임재범 · youtube.com/watch?v=b1p0jQbpVi4'
		})
	},
	{
		id: 'gardener-homage',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gardener_sing.png?v=1794205196200',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gardener_sing.png?v=1794205196200',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/poster_hallakgungi.jpg?v=1794204424156',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hallakgungi-gate.jpg?v=1794202777287',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hallakgungi-green-bloom.jpg?v=1794202777823',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hallakgungi-rows.png?v=1794202778895',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jacheongbi-flower-field.jpg?v=1794202769428',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/three-realms-08-hallakgungi-joke.png?v=1794202693609',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gardener-homage_2.jpg?v=1794205194764',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gardener-homage_3.jpg?v=1794205195211',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gardener-homage_4.jpg?v=1794205195858',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gardener-homage_5.jpg?v=1794205195857',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gardener-homage_21.jpg?v=1794205195138',,
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gardener-homage_36.jpg?v=1794205195469'
		],
		frameMs: 3600,
		title: 'The Gardener',
		place: '서천꽃밭 — Hallakgungi keeps the Western Flower Field',
		audio: youtube({
			youtubeId: '4u7kNELI76A',
			title: 'Homage',
			artist: 'Hallakgungi',
			credit: 'Mild High Club · youtube.com/watch?v=4u7kNELI76A'
		})
	},
	{
		id: 'fall-of-joseon',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/fall_of_joseon.png?v=1794204234129',
		frames: ['https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/fall_of_joseon.png?v=1794204234129', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/joseon-fall.jpg?v=1794202876512', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fall-of-joseon_2.jpg?v=1794205192203', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fall-of-joseon_3.jpg?v=1794205192654', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fall-of-joseon_4.jpg?v=1794205193312', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fall-of-joseon_26.jpg?v=1794205192613', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fall-of-joseon_37.jpg?v=1794205192998', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fall-of-joseon_39.jpg?v=1794205193053', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_fall-of-joseon_43.jpg?v=1794205193623'],
		frameMs: 3800,
		title: 'The Fall of Joseon',
		place: 'Wanggeom’s gate — opened from the inside',
		audio: youtube({
			youtubeId: 'ekghP2_w8h8',
			title: 'Road of Sorrow',
			artist: 'The Chronicle',
			credit: '새리 Saree McIntosh feat. Robert McIntosh · 원곡 김학래 · youtube.com/watch?v=ekghP2_w8h8',
			loop: false
		})
	},
	{
		id: 'three-life-gods',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_life_gods_sing.png?v=1794205222781',
		cover: '/album_life_gods.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_life_gods_sing.png?v=1794205222781',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_life_gods_point.png?v=1794205222393',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_life_gods_laugh.png?v=1794205221987',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_life_gods_shove.png?v=1794205222409',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/samsin-threefold.jpg?v=1794202210449',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga_1.png?v=1794205214746',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three-life-gods_2.jpg?v=1794205242768',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three-life-gods_3.jpg?v=1794205242846',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_three-life-gods_37.jpg?v=1794205243341'
		],
		frameMs: 3200,
		title: 'Three Life Gods',
		place: 'Haemosu, Ibiga, Samsin — the ones who keep a life going',
		audio: youtube({
			youtubeId: 'gArrZmiEddw',
			title: 'AEAO',
			artist: 'Ibiga, Haemosu & Samsin',
			credit: 'Dynamic Duo · youtube.com/watch?v=gArrZmiEddw'
		})
	},
	{
		id: 'gotaso-hers',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gotaso_sing.png?v=1794205201104',
		cover: '/album_gotaso.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gotaso-hers_2.jpg?v=1794205199555',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gotaso_sing.png?v=1794205201104',
			'/temp/gotaso-determination-forward.png',
			'/temp/gotaso-seq-market-wide.jpg',
			'/temp/gotaso-ribbon-slash.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gotaso-seq-ford.jpg?v=1794202237104',
			'/emotional_gotaso_love_longing.png',
			'/img_gotaso_01.png',
			'/scene_gotaso-hers_4.jpg',
			'/scene_gotaso-hers_11.jpg',
			'/scene_gotaso-hers_37.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gotaso-hers_43.jpg?v=1794205199825'
		],
		frameMs: 3200,
		title: 'Gotaso',
		place: 'Her own road — the leap is still hers',
		audio: youtube({
			youtubeId: '7mDDM0eBWR0',
			title: "I'll Quit",
			artist: 'Gotaso',
			credit: '소연 (SOYEON) · youtube.com/watch?v=7mDDM0eBWR0'
		})
	},
	{
		id: 'bupmin-resolve',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bupmin_sing.png?v=1794205183217',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bupmin_sing.png?v=1794205183217',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/wg-two-hands.jpg?v=1794202883345',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/wg-lineage-chain.jpg?v=1794202883636',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/wg-four-founders.jpg?v=1794202886202',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/wg-man-in-white.jpg?v=1794202886429',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/wg-lacquer-faces.jpg?v=1794202886906',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/wg-suro-mound.jpg?v=1794202887056',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/wg-munhee-well.jpg?v=1794202887547',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/bupmin-future-king.jpg?v=1794202165164',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/bupmin-five-principles.jpg?v=1794202218160',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/bupmin-hwarang-yard.jpg?v=1794202217284',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bupmin-resolve_2.jpg?v=1794205182369',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bupmin-resolve_3.jpg?v=1794205182668',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bupmin-resolve_37.jpg?v=1794205182683',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bupmin-resolve_43.jpg?v=1794205182953'
		],
		frameMs: 3400,
		title: 'Bupmin’s resolve',
		place: 'The steam cavern — fifteen generations, one question',
		audio: youtube({
			youtubeId: '3jJJcacnGVI',
			title: 'You Know Better Than I',
			artist: 'Bupmin',
			credit: 'Joseph: King of Dreams · youtube.com/watch?v=3jJJcacnGVI'
		})
	},
	{
		id: 'haemosu-yuhwa-confession',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu_yuhwa_sing.png?v=1794205208881',
		cover: '/album_haemosu.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-haemosu-heart-yuhwa-chin.jpg?v=1794202423244',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_4.jpg?v=1794205208144',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-haemosu-pov-yuhwa-grin.jpg?v=1794202370918',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-haemosu-sky-dusk-lean.jpg?v=1794202367574',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-yuhwa-haemosu-two-grin.jpg?v=1794202371556',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_2.jpg?v=1794205206922',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_5.jpg?v=1794205208634',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_10.jpg?v=1794205205430',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_12.jpg?v=1794205205892',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_13.jpg?v=1794205206172',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_14.jpg?v=1794205206460',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_16.jpg?v=1794205206563',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_21.jpg?v=1794205206974',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_24.jpg?v=1794205207245',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_27.jpg?v=1794205207485',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_33.jpg?v=1794205207646',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_38.jpg?v=1794205207895',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_haemosu-yuhwa-confession_40.jpg?v=1794205208220'
		],
		frameMs: 3400,
		title: 'The Sun and the Water',
		place: '해와 강 — he wants her before he asks',
		love: true,
		audio: youtube({
			youtubeId: 'se54TCtTFsQ',
			title: '고해',
			artist: 'Haemosu',
			credit: '임재범 · youtube.com/watch?v=se54TCtTFsQ'
		})
	},
	{
		id: 'jumong-for-sosuno',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong_sosuno_sing.png?v=1794205221778',
		cover: '/album_jumong.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_3.jpg?v=1794205217761',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong_sosuno_sing.png?v=1794205221778',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-sosuno-well.jpg?v=1794202429373',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-sosuno-seq-kiss-shock.jpg?v=1794202452669',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-sosuno-side-almost-kiss.jpg?v=1794202487505',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/jumong-sosuno-hall-chin.jpg?v=1794202439101',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_2.jpg?v=1794205216442',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_4.jpg?v=1794205218043',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_5.jpg?v=1794205218554',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_10.jpg?v=1794205215337',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_13.jpg?v=1794205216467',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_22.jpg?v=1794205216828',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_25.jpg?v=1794205216906',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_27.jpg?v=1794205217729',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_33.jpg?v=1794205218006',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_jumong-for-sosuno_40.jpg?v=1794205218302'
		],
		frameMs: 3400,
		title: "Jumong's Confession",
		place: 'Jolbon — for her, not for the well',
		love: true,
		audio: youtube({
			youtubeId: '-YQ247p0Wt8',
			title: '너를 위해',
			artist: 'Jumong',
			credit: '임재범 · youtube.com/watch?v=-YQ247p0Wt8'
		})
	},
	{
		id: 'ibiga-rightview',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga_rightview_sing.png?v=1794205214180',
		cover: '/album_ibiga_love.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga-rightview_12.jpg?v=1794205211462',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga_rightview_sing.png?v=1794205214180',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/ibiga-seq-ridge.jpg?v=1794202504107',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/rightview-ridge-guard.jpg?v=1794202505531',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/rightview-seq-face.jpg?v=1794202504818',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/ibiga-lookdown-face.jpg?v=1794202504132',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga-rightview_2.jpg?v=1794205212055',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga-rightview_3.jpg?v=1794205212096',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_ibiga-rightview_37.jpg?v=1794205212213'
		],
		frameMs: 3400,
		title: 'As Long As There Is A Sky',
		place: 'The ridge — he looks down and stays',
		love: true,
		audio: youtube({
			youtubeId: 'xiGa6SH5yxg',
			title: '민물장어의 꿈',
			artist: 'Ibiga',
			credit: '신해철 · youtube.com/watch?v=xiGa6SH5yxg'
		})
	},
	{
		id: 'bidam-rebellion',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_rebellion_sing.png?v=1794205179905',
		cover: '/album_bidam_beads.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/bidam_rebellion_torch.png?v=1794202501542',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_rebellion_sing.png?v=1794205179905',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/bidam-rebellion-wide.jpg?v=1794204198935',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_1.png?v=1794205178175',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam_3.png?v=1794205180168',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-rebellion_2.jpg?v=1794205177085',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-rebellion_3.jpg?v=1794205177247',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-rebellion_4.jpg?v=1794205177762',
			'/scene_bidam-rebellion_22.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_bidam-rebellion_35.jpg?v=1794205177455',
			'/scene_bidam-rebellion_39.jpg'
		],
		frameMs: 3200,
		title: 'Farewell, My Queen',
		place: 'Surabol — the second leaving',
		audio: youtube({
			youtubeId: 'XWFjoZ41Mm8',
			title: 'Goodbye Yellow Brick Road',
			artist: 'Bidam',
			credit: 'Elton John · youtube.com/watch?v=XWFjoZ41Mm8'
		})
	},
	{
		id: 'pumsuk-loves-gotaso',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_pumsuk_gotaso_sing.png?v=1794205226671',
		cover: '/album_branch.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gotaso-pumsuk-warmth.jpg?v=1794202237833',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_pumsuk_gotaso_sing.png?v=1794205226671',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gotaso-love-gaze.jpg?v=1794202237870',
			'/img_gotaso_04.png',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_pumsuk-loves-gotaso_2.jpg?v=1794205225999',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_pumsuk-loves-gotaso_11.jpg?v=1794205225936',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_pumsuk-loves-gotaso_37.jpg?v=1794205226409',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_pumsuk-loves-gotaso_38.jpg?v=1794205226714'
		],
		frameMs: 3400,
		title: 'Love Spring',
		place: 'The leap — this one is his',
		love: true,
		audio: youtube({
			youtubeId: 'FFkLoUwQ9a4',
			title: 'Nerdy Love',
			artist: 'Pumsuk',
			credit: 'pH-1 feat. 백예린 · youtube.com/watch?v=FFkLoUwQ9a4'
		})
	},
	{
		id: 'gesomun-my-way',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gesomun-death-black.jpg?v=1794202842749',
		cover: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-my-way_41.jpg?v=1794205196476',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/gesomun-death-black.jpg?v=1794202842749',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/yeon-deathbed.jpg?v=1794202843225',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/yeon-burning.jpg?v=1794202843630',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-my-way_41.jpg?v=1794205196476',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-my-way_42.jpg?v=1794205196575',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-my-way_43.jpg?v=1794205196851',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_gesomun-my-way_44.jpg?v=1794205197155'
		],
		frameMs: 4200,
		title: 'My Way',
		place: 'Pyongyang — the final curtain',
		audio: youtube({
			youtubeId: 'qQzdAsjWGPg',
			title: 'My Way',
			artist: 'Gesomun',
			credit: 'Frank Sinatra · youtube.com/watch?v=qQzdAsjWGPg'
		})
	},
	{
		id: 'steam-cavern',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/seohyeon-cavern-wide.jpg?v=1794202546109',
		cover: '/album_cavern_three.png',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/seohyeon-cavern-wide.jpg?v=1794202546109',
			'/img_steam_cavern_intimacy.png',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/yushin-cavern-seohyeon-hand.jpg?v=1794202558170',
			'/scene_steam-cavern_41.jpg',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_steam-cavern_42.jpg?v=1794205230321',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_steam-cavern_43.jpg?v=1794205230811',
			'/scene_steam-cavern_44.jpg'
		],
		frameMs: 3400,
		title: 'The Cavern',
		place: 'The spring — three sisters, one man',
		love: true,
		audio: youtube({
			youtubeId: 'B6_iQvaIjXw',
			title: '34+35',
			artist: 'The cavern',
			credit: 'Ariana Grande · youtube.com/watch?v=B6_iQvaIjXw'
		})
	},
	{
		id: 'the-five-thousand',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwangsan-wide.jpg?v=1794202780262',
		cover: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_the-five-thousand_41.jpg?v=1794205242203',
		frames: [
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwangsan-wide.jpg?v=1794202780262',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwangsan-three-camps.jpg?v=1794202795500',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwangsan-laststand.jpg?v=1794202790768',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/hwangsan-seq-clash.jpg?v=1794202782361',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_the-five-thousand_41.jpg?v=1794205242203',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_the-five-thousand_42.jpg?v=1794205242383',
			'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_the-five-thousand_43.jpg?v=1794205242676'
		],
		frameMs: 2800,
		title: 'The Five Thousand',
		place: 'Yellow Mountain — five thousand against the arithmetic',
		audio: youtube({
			youtubeId: 'FLI7jJOQS5k',
			title: 'Going the Distance',
			artist: 'Gyebek',
			credit: 'Bill Conti · Rocky · youtube.com/watch?v=FLI7jJOQS5k'
		})
	},
	{
		id: 'tamla-birds',
		image: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/halla-goddess.jpg?v=1794202764576',
		cover: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_tamla-birds_41.jpg?v=1794205241176',
		frames: ['https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/stills/halla-goddess.jpg?v=1794202764576', '/img_halla_goddess.png', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_tamla-birds_41.jpg?v=1794205241176', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_tamla-birds_42.jpg?v=1794205241540', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_tamla-birds_43.jpg?v=1794205241544', 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/scene_tamla-birds_44.jpg?v=1794205242024'],
		frameMs: 4000,
		title: 'Tamla',
		place: 'The orange island — every bird before the last story',
		audio: youtube({
			youtubeId: 'T_pUpFrCfJc',
			title: '새타령',
			artist: 'Tamla',
			credit: '이날치 · youtube.com/watch?v=T_pUpFrCfJc'
		})
	}
];

export function scenesForPage(): Scene[] {
	return SCENES;
}

export function trackOf(scene: Scene): Track | null {
	if (scene.audio.kind === 'local') return TRACKS[scene.audio.cue] ?? null;
	if (scene.audio.kind === 'file') {
		return {
			id: scene.audio.file,
			file: scene.audio.file,
			title: scene.audio.title,
			artist: scene.audio.artist,
			credit: scene.audio.credit,
			loop: scene.audio.loop !== false
		};
	}
	if (scene.audio.kind === 'youtube') {
		return {
			id: `yt:${scene.audio.youtubeId}`,
			file: '',
			youtubeId: scene.audio.youtubeId,
			title: scene.audio.title,
			artist: scene.audio.artist,
			credit: scene.audio.credit,
			loop: scene.audio.loop !== false
		};
	}
	return null;
}

export function audioLabel(scene: Scene): string {
	if (scene.audio.kind === 'file' || scene.audio.kind === 'youtube') return scene.audio.title;
	return TRACKS[scene.audio.cue]?.title ?? String(scene.audio.cue);
}

export function audioArtist(scene: Scene): string {
	if (scene.audio.kind === 'file' || scene.audio.kind === 'youtube') {
		return scene.audio.artist?.trim() || '';
	}
	return '';
}

export function audioCredit(scene: Scene): string {
	if (scene.audio.kind === 'file' || scene.audio.kind === 'youtube') return scene.audio.credit;
	return TRACKS[scene.audio.cue]?.credit ?? '';
}
