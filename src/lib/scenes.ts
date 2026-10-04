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
		image: '/scene_taizong_1.png',
		cover: '/album_taizong.png',
		frames: ['/scene_taizong_1.png', '/scene_taizong_2.png', '/scene_taizong_3.png', '/scene_taizong-qin-wang_2.jpg', '/scene_taizong-qin-wang_3.jpg', '/scene_taizong-qin-wang_4.jpg', '/scene_taizong-qin-wang_12.jpg', '/scene_taizong-qin-wang_13.jpg', '/scene_taizong-qin-wang_14.jpg', '/scene_taizong-qin-wang_26.jpg', '/scene_taizong-qin-wang_35.jpg', '/scene_taizong-qin-wang_41.jpg', '/scene_taizong-qin-wang_42.jpg', '/scene_taizong-qin-wang_43.jpg', '/scene_taizong-qin-wang_44.jpg', '/scene_taizong-qin-wang_45.jpg', '/scene_taizong-qin-wang_46.jpg', '/scene_taizong-qin-wang_47.jpg', '/scene_taizong-qin-wang_48.jpg', '/scene_taizong-qin-wang_49.jpg'],
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
		image: '/scene_ibiga_1.png',
		cover: '/album_ibiga.png',
		frames: ['/scene_ibiga_1.png', '/scene_ibiga_2.png', '/scene_ibiga_3.png', '/scene_ibiga-ridge-gaya-love_2.jpg', '/scene_ibiga-ridge-gaya-love_4.jpg', '/scene_ibiga-ridge-gaya-love_21.jpg', '/scene_ibiga-ridge-gaya-love_27.jpg', '/scene_ibiga-ridge-gaya-love_35.jpg'],
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
		image: '/scene_sunduk_1.png',
		cover: '/album_sunduk_death.png',
		frames: [
			'/scene_sunduk-little-fall-of-rain_2.jpg',
			'/scene_sunduk_1.png',
			'/scene_sunduk_2.png',
			'/scene_sunduk_3.png',
			'/scene_sunduk-little-fall-of-rain_11.jpg',
			'/scene_sunduk-little-fall-of-rain_13.jpg',
			'/scene_sunduk-little-fall-of-rain_14.jpg',
			'/scene_sunduk-little-fall-of-rain_21.jpg',
			'/scene_sunduk-little-fall-of-rain_26.jpg',
			'/scene_sunduk-little-fall-of-rain_27.jpg',
			'/scene_sunduk-little-fall-of-rain_33.jpg',
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
			'/scene_gotaso-pumsuk_2.jpg',
			'/img_gotaso_03.png',
			'/img_gotaso_04.png',
			'/img_gotaso_06.png',
			'/scene_gotaso-pumsuk_4.jpg',
			'/scene_gotaso-pumsuk_12.jpg',
			'/scene_gotaso-pumsuk_35.jpg'
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
			'/scene_yushin-sunduk-flower_2.jpg',
			'/scene_yushin-sunduk-flower_10.jpg',
			'/scene_yushin-sunduk-flower_12.jpg',
			'/scene_yushin-sunduk-flower_25.jpg',
			'/scene_yushin-sunduk-flower_35.jpg',
			'/scene_yushin-sunduk-flower_39.jpg'
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
		image: '/scene_sunduk_sing.png',
		cover: '/album_sunduk.png',
		frames: [
			'/scene_sunduk_gayageum.png',
			'/scene_sunduk_sing.png',
			'/temp/sunduk-yushin-flush.jpg',
			'/temp/sunduk-yushin-back-blush.jpg',
			'/temp/yushin-fans-sunduk-only.jpg',
			'/temp/dukman_reaching_stars.png',
			'/scene_sunduk_1.png',
			'/scene_sunduk-loves-yushin_2.jpg',
			'/scene_sunduk-loves-yushin_3.jpg',
			'/scene_sunduk-loves-yushin_5.jpg',
			'/scene_sunduk-loves-yushin_10.jpg',
			'/scene_sunduk-loves-yushin_14.jpg',
			'/scene_sunduk-loves-yushin_16.jpg',
			'/scene_sunduk-loves-yushin_24.jpg',
			'/scene_sunduk-loves-yushin_36.jpg',
			'/scene_sunduk-loves-yushin_38.jpg'
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
		image: '/scene_yushin_sing.png',
		cover: '/album_fence.png',
		frames: [
			'/scene_yushin_sing.png',
			'/temp/young-yushin.jpg',
			'/temp/sunduk-flirt-walkby.jpg',
			'/temp/sunduk-flirt-blush.jpg',
			'/temp/sunduk-yushin-flush.jpg',
			'/temp/sunduk-yushin-back-blush.jpg',
			'/temp/three-youths-dukman.jpg',
			'/scene_young-yushin-loves-sunduk_2.jpg',
			'/scene_young-yushin-loves-sunduk_12.jpg',
			'/scene_young-yushin-loves-sunduk_36.jpg'
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
		image: '/temp/hwanung-ungnyeo-birch-wide.jpg',
		cover: '/album_bear.png',
		frames: [
			'/temp/hwanung-ungnyeo-birch-wide.jpg',
			'/temp/hwanung-ungnyeo-kiss.jpg',
			'/temp/ungnyeo-dont-closer.jpg',
			'/scene_birch-old-joseon_2.jpg',
			'/temp/hwanung-seal-forgotten.jpg',
			'/scene_birch-old-joseon_3.jpg',
			'/scene_birch-old-joseon_36.jpg'
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
		image: '/temp/yushin-sword-vertical.jpg',
		cover: '/album_yushin.png',
		frames: [
			'/scene_yushin-sword_3.jpg',
			'/temp/yushin-sword-vertical.jpg',
			'/temp/yushin_sword_vertical.png',
			'/scene_yushin-sword_2.jpg',
			'/scene_yushin-sword_12.jpg',
			'/temp/statue-yushin-niche.jpg',
			'/scene_yushin-sword_14.jpg',
			'/scene_yushin-sword_15.jpg',
			'/temp/statue-yushin-equestrian.jpg',
			'/scene_yushin-sword_21.jpg',
			'/scene_yushin-sword_27.jpg',
			'/scene_yushin-sword_33.jpg',
			'/scene_yushin-sword_40.jpg',
			'/scene_yushin-sword_44.jpg',
			'/scene_yushin-sword_45.jpg',
			'/scene_yushin-sword_46.jpg',
			'/scene_yushin-sword_47.jpg',
			'/scene_yushin-sword_48.jpg',
			'/scene_yushin-sword_49.jpg',
			'/scene_yushin-sword_50.jpg',
			'/scene_yushin-sword_51.jpg',
			'/scene_yushin-sword_52.jpg',
			'/scene_yushin-sword_53.jpg',
			'/scene_yushin-sword_54.jpg',
			'/scene_yushin-sword_55.jpg',
			'/scene_yushin-sword_56.jpg',
			'/scene_yushin-sword_57.jpg',
			'/scene_yushin-sword_58.jpg',
			'/scene_yushin-sword_59.jpg',
			'/scene_yushin-sword_60.jpg'
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
		image: '/temp/ansi-wide.jpg',
		cover: '/album_ansi.png',
		frames: [
			'/temp/ansi-wide.jpg',
			'/temp/ansi-stone-ring.jpg',
			'/temp/ansi-earthen-ramp.jpg',
			'/temp/ansi-winter.jpg',
			'/temp/taizong-ansi-face.jpg',
			'/scene_ansi-holds_2.jpg',
			'/scene_ansi-holds_4.jpg',
			'/scene_ansi-holds_13.jpg',
			'/scene_ansi-holds_22.jpg',
			'/scene_ansi-holds_28.jpg',
			'/scene_ansi-holds_44.jpg'
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
		image: '/temp/gyebek-white-river.jpg',
		frames: [
			'/temp/white-river-aerial.jpg',
			'/temp/gyebek-white-river.jpg',
			'/temp/gyebek-field-face.jpg',
			'/temp/gyebek-last-stand-yellow.png',
			'/scene_white-river_2.jpg',
			'/scene_white-river_36.jpg',
			'/scene_white-river_40.jpg'
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
		image: '/temp/gyebek-white-river.jpg',
		frames: [
			'/scene_battle-six-dragons_2.jpg',
			'/temp/white-river-aerial.jpg',
			'/temp/gyebek-white-river.jpg',
			'/temp/gyebek-field-face.jpg',
			'/temp/gyebek-last-stand-yellow.png',
			'/temp/ansi-wide.jpg',
			'/temp/salsu-red-wedge.jpg',
			'/scene_battle-six-dragons_37.jpg',
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
		image: '/temp/poster_dangun.jpg',
		cover: '/album_dangun.png',
		frames: [
			'/scene_dangun-founding_13.jpg',
			'/temp/dangun-mountain.jpg',
			'/scene_dangun-founding_4.jpg',
			'/temp/dangun-asadal.jpg',
			'/temp/dangun-over-shoulder.jpg',
			'/temp/poster_dangun.jpg',
			'/scene_dangun-founding_2.jpg',
			'/scene_dangun-founding_3.jpg',
			'/scene_dangun-founding_36.jpg',
			'/scene_dangun-founding_39.jpg'
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
		image: '/temp/euija-coup-rock-wide.jpg',
		cover: '/album_deer_rock.png',
		frames: [
			'/scene_euija-coup_2.jpg',
			'/temp/euija-coup-rock-wide.jpg',
			'/temp/euija-coup-empty-benches.jpg',
			'/temp/euija-coup-speech-dutch.jpg',
			'/temp/euija-coup-satek-stare.jpg',
			'/scene_euija-coup_4.jpg',
			'/scene_euija-coup_36.jpg'
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
		image: '/temp/fortress_gate_red_omen.png',
		cover: '/album_fortress.png',
		frames: [
			'/scene_fortress-omen_2.jpg',
			'/temp/fortress_gate_red_omen.png',
			'/temp/goguryeo-fortress-red-storm-v2.jpg',
			'/temp/eastern-fortress-wide.jpg',
			'/scene_fortress-omen_13.jpg',
			'/scene_fortress-omen_35.jpg',
			'/scene_fortress-omen_40.jpg'
		],
		frameMs: 3400,
		title: 'Red omen at the gate',
		place: 'Daeya seongmun — one red seam',
		audio: local('Nine Omens')
	},
	{
		id: 'wuzetian-screen',
		image: '/scene_wuzetian_sing.png',
		cover: '/album_wu.png',
		frames: [
			'/temp/wuzetian_screen_power.png',
			'/scene_wuzetian_sing.png',
			'/temp/wuzetian-seal-stamp.jpg',
			'/temp/wuzetian-seduction.jpg',
			'/scene_wuzetian-screen_2.jpg',
			'/scene_wuzetian-screen_4.jpg',
			'/scene_wuzetian-screen_5.jpg',
			'/scene_wuzetian-screen_6.jpg',
			'/scene_wuzetian-screen_7.jpg',
			'/scene_wuzetian-screen_8.jpg',
			'/scene_wuzetian-screen_9.jpg',
			'/scene_wuzetian-screen_10.jpg',
			'/scene_wuzetian-screen_12.jpg',
			'/scene_wuzetian-screen_13.jpg',
			'/scene_wuzetian-screen_16.jpg',
			'/scene_wuzetian-screen_17.jpg',
			'/scene_wuzetian-screen_18.jpg',
			'/scene_wuzetian-screen_19.jpg',
			'/scene_wuzetian-screen_20.jpg',
			'/scene_wuzetian-screen_22.jpg',
			'/scene_wuzetian-screen_24.jpg',
			'/scene_wuzetian-screen_26.jpg',
			'/scene_wuzetian-screen_28.jpg',
			'/scene_wuzetian-screen_38.jpg'
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
		image: '/temp/three-realms-01-establishing.jpg',
		cover: '/album_cavern_three.png',
		frames: [
			'/temp/three-realms-05-principals-enter.png',
			'/temp/three-realms-01-establishing.jpg',
			'/temp/three-realms-wide.jpg',
			'/temp/three-realms-06-council.png',
			'/temp/three-realms-07-feast.png',
			'/temp/three-realms-12-principals.png',
			'/temp/three-realms-meeting.png',
			'/scene_three-realms-goddess_2.jpg',
			'/scene_three-realms-goddess_3.jpg',
			'/scene_three-realms-goddess_4.jpg',
			'/scene_three-realms-goddess_37.jpg'
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
		image: '/temp/salsu-red-wedge.jpg',
		cover: '/album_salsu.png',
		frames: [
			'/scene_dosuryu_geomungo.png',
			'/temp/salsu-red-wedge.jpg',
			'/temp/salsu-ford-ribbon.jpg',
			'/temp/salsu-flashback.jpg',
			'/scene_salsu-gesomun_2.jpg',
			'/scene_salsu-gesomun_4.jpg',
			'/scene_salsu-gesomun_28.jpg',
			'/scene_salsu-gesomun_33.jpg',
			'/scene_salsu-gesomun_40.jpg'
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
		image: '/temp/chunchu_strategist_shadow.png',
		cover: '/album_chunchu_shadow.png',
		frames: [
			'/temp/chunchu_strategist_shadow.png',
			'/temp/chunchu-map-pool.jpg',
			'/temp/chunchu-forecast.jpg',
			'/temp/chunchu-death-wide.jpg',
			'/scene_chunchu-shadow_2.jpg',
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
		image: '/scene_bidam_sing.png',
		cover: '/album_bidam.png',
		frames: [
			'/scene_bidam_wolgeum.png',
			'/scene_bidam_sing.png',
			'/scene_bidam_1.png',
			'/scene_bidam_2.png',
			'/scene_bidam_3.png',
			'/scene_bidam_4.png',
			'/scene_bidam-never-again_2.jpg',
			'/scene_bidam-never-again_3.jpg',
			'/scene_bidam-never-again_4.jpg',
			'/scene_bidam-never-again_5.jpg',
			'/scene_bidam-never-again_10.jpg',
			'/scene_bidam-never-again_21.jpg',
			'/scene_bidam-never-again_26.jpg',
			'/scene_bidam-never-again_27.jpg',
			'/scene_bidam-never-again_33.jpg',
			'/scene_bidam-never-again_40.jpg',
			'/scene_bidam-never-again_44.jpg'
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
		image: '/scene_heo_sing.png',
		cover: '/album_red_sail.png',
		frames: [
			'/scene_heo_sing.png',
			'/temp/suro-court-love.jpg',
			'/temp/suro-heo-tent.jpg',
			'/temp/heo-court-face.jpg',
			'/temp/heo-court-present.jpg',
			'/temp/heo-silk-trousers.jpg',
			'/scene_suro-heo-goodbye_2.jpg',
			'/scene_suro-heo-goodbye_12.jpg',
			'/scene_suro-heo-goodbye_22.jpg',
			'/scene_suro-heo-goodbye_24.jpg',
			'/scene_suro-heo-goodbye_28.jpg'
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
		image: '/scene_sosuno_sing.png',
		cover: '/album_well_yoga.png',
		frames: [
			'/scene_sosuno_sing.png',
			'/temp/jumong-sosuno-well.jpg',
			'/temp/jumong-sosuno-hall-chin.jpg',
			'/temp/jumong-sosuno-side-almost-kiss.jpg',
			'/temp/jumong-sosuno-seq-kiss-shock.jpg',
			'/temp/jumong-sosuno-seq-queen-hall.jpg',
			'/temp/jumong-sosuno-pov-leave.jpg',
			'/scene_jumong-sosuno-talk_2.jpg',
			'/scene_jumong-sosuno-talk_4.jpg',
			'/scene_jumong-sosuno-talk_10.jpg',
			'/scene_jumong-sosuno-talk_12.jpg',
			'/scene_jumong-sosuno-talk_14.jpg',
			'/scene_jumong-sosuno-talk_16.jpg',
			'/scene_jumong-sosuno-talk_17.jpg',
			'/scene_jumong-sosuno-talk_18.jpg',
			'/scene_jumong-sosuno-talk_19.jpg',
			'/scene_jumong-sosuno-talk_20.jpg',
			'/scene_jumong-sosuno-talk_22.jpg',
			'/scene_jumong-sosuno-talk_24.jpg',
			'/scene_jumong-sosuno-talk_27.jpg',
			'/scene_jumong-sosuno-talk_33.jpg',
			'/scene_jumong-sosuno-talk_38.jpg'
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
		image: '/temp/poster_xuerengui.jpg',
		cover: '/album_xue.png',
		frames: [
			'/scene_xue-rengui-war_4.jpg',
			'/temp/poster_xuerengui.jpg',
			'/temp/xue-white-ridge.jpg',
			'/temp/xue-eastern-shaft.jpg',
			'/temp/xue-longmen-field-dawn.jpg',
			'/temp/xue-fortress-escape.jpg',
			'/scene_xue-rengui-war_2.jpg',
			'/scene_xue-rengui-war_28.jpg'
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
		image: '/scene_xue_liu_sing.png',
		frames: [
			'/scene_xue_liu_sing.png',
			'/temp/xue-longmen-field-dawn.jpg',
			'/temp/xue-longmen-two-shot.jpg',
			'/temp/xue-longmen-wife-close.jpg',
			'/temp/xue-longmen-hut-door.jpg',
			'/temp/xue-longmen-farewell.jpg',
			'/temp/xue-longmen-yellow-hoe.jpg',
			'/scene_xue-lady-liu_2.jpg',
			'/scene_xue-lady-liu_3.jpg',
			'/scene_xue-lady-liu_4.jpg',
			'/scene_xue-lady-liu_12.jpg',
			'/scene_xue-lady-liu_25.jpg',
			'/scene_xue-lady-liu_26.jpg',
			'/scene_xue-lady-liu_35.jpg',
			'/scene_xue-lady-liu_39.jpg'
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
		image: '/temp/poster_kangrim.jpg',
		frames: [
			'/scene_grim-reapers-killmonger_2.jpg',
			'/temp/poster_kangrim.jpg',
			'/temp/poster_haewonmek.jpg',
			'/temp/kangrim_reaper_scroll.png',
			'/temp/kangrim-haewonmek-flight.jpg',
			'/temp/kangrim-ledger-glow.jpg',
			'/temp/haewonmek-sword-redbook.jpg',
			'/temp/jumong-night-reaper-over.jpg',
			'/scene_grim-reapers-killmonger_3.jpg',
			'/scene_grim-reapers-killmonger_4.jpg',
			'/scene_grim-reapers-killmonger_37.jpg'
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
		image: '/scene_haemosu_sing.png',
		cover: '/album_haemosu_chariot.png',
		frames: [
			'/scene_haemosu_sing.png',
			'/temp/jumong-haemosu-sky-noon-laugh.jpg',
			'/temp/jumong-haemosu-heart-yuhwa-chin.jpg',
			'/temp/jumong-haemosu-sky-dusk-lean.jpg',
			'/temp/jumong-haemosu-sky-sisters.jpg',
			'/temp/jumong-haemosu-pov-yuhwa-grin.jpg',
			'/temp/jumong-haemosu-heart-dutch-high.jpg',
			'/scene_haemosu-bae-bae_2.jpg',
			'/scene_haemosu-bae-bae_3.jpg',
			'/scene_haemosu-bae-bae_11.jpg',
			'/scene_haemosu-bae-bae_14.jpg',
			'/scene_haemosu-bae-bae_25.jpg',
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
		image: '/scene_gyebek_tamla_sing.png',
		cover: '/album_gyebek.png',
		frames: [
			'/scene_gyebek-who-am-i_27.jpg',
			'/scene_gyebek_tamla_sing.png',
			'/scene_gyebek_ocean_back.png',
			'/scene_gyebek_ocean_front.png',
			'/temp/gyebek-family.jpg',
			'/temp/gyebek-well.jpg',
			'/temp/gyebek-seq-name.jpg',
			'/temp/gyebek-sunset.jpg',
			'/temp/gyebek-departs.jpg',
			'/scene_gyebek-who-am-i_2.jpg',
			'/scene_gyebek-who-am-i_3.jpg',
			'/scene_gyebek-who-am-i_5.jpg',
			'/scene_gyebek-who-am-i_15.jpg',
			'/temp/statue-gyebek-field.jpg',
			'/scene_gyebek-who-am-i_21.jpg',
			'/scene_gyebek-who-am-i_33.jpg',
			'/scene_gyebek-who-am-i_38.jpg'
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
		image: '/scene_three_princesses_sing.png',
		cover: '/album_sisters.png',
		frames: [
			'/scene_three_princesses_sing.png',
			'/temp/three-princesses.jpg',
			'/temp/dukman_reaching_stars.png',
			'/temp/three-youths-dukman.jpg',
			'/scene_three-princesses-invite_2.jpg',
			'/scene_three-princesses-invite_35.jpg',
			'/scene_three-princesses-invite_39.jpg'
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
		image: '/scene_sadaham_sing.png',
		cover: '/album_sadaham.png',
		frames: [
			'/scene_sadaham_sing.png',
			'/scene_sadaham_moon_vow.png',
			'/scene_sadaham_gate_shaft.png',
			'/scene_sadaham_seven_fire.png',
			'/temp/sadaham-seq-gate.jpg',
			'/temp/sadaham-gaya-road.jpg',
			'/temp/sadaham-seq-vanguard.jpg',
			'/temp/sadaham-seq-mugwan-vow.jpg',
			'/temp/sadaham-seven-days.jpg',
			'/temp/sadaham-seq-free.jpg',
			'/scene_sadaham-try-again_2.jpg',
			'/scene_sadaham-try-again_4.jpg',
			'/scene_sadaham-try-again_5.jpg',
			'/scene_sadaham-try-again_37.jpg',
			'/scene_sadaham-try-again_40.jpg'
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
			'/temp/hwarang-class.jpg',
			'/temp/hwarang-spar.jpg',
			'/temp/crescent-hwarang.jpg',
			'/temp/hwarang-female-fans.jpg',
			'/scene_hwarang-oxygen_2.jpg',
			'/scene_hwarang-oxygen_37.jpg'
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
		image: '/scene_maehwa_sing.png',
		cover: '/album_maehwa_yoga.png',
		frames: [
			'/scene_maehwa_sing.png',
			'/temp/maehwa-garrison-01-well.jpg',
			'/temp/maehwa-garrison-02-store.jpg',
			'/temp/maehwa-garrison-03-post.jpg',
			'/temp/maehwa-feast-close.jpg',
			'/temp/maehwa-feast-hands.jpg',
			'/temp/maehwa-feast-families.jpg',
			'/scene_maehwa-coming-of-age_10.jpg',
			'/scene_maehwa-coming-of-age_2.jpg',
			'/scene_maehwa-coming-of-age_3.jpg',
			'/scene_maehwa-coming-of-age_12.jpg',
			'/scene_maehwa-coming-of-age_16.jpg',
			'/scene_maehwa-coming-of-age_17.jpg',
			'/scene_maehwa-coming-of-age_18.jpg',
			'/scene_maehwa-coming-of-age_19.jpg',
			'/scene_maehwa-coming-of-age_20.jpg',
			'/scene_maehwa-coming-of-age_24.jpg',
			'/scene_maehwa-coming-of-age_28.jpg',
			'/scene_maehwa-coming-of-age_39.jpg'
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
		image: '/scene_euija_anger_sing.png',
		cover: '/album_euija_yoga.png',
		frames: [
			'/scene_euija_anger_sing.png',
			'/temp/euija-mourning-fury.jpg',
			'/temp/euija-crown-eaten.jpg',
			'/temp/euija-laugh.jpg',
			'/temp/euija-fallen.jpg',
			'/temp/euija_king_or_slave.jpg',
			'/temp/euija-coup-speech-dutch.jpg',
			'/scene_euija-anger-f_2.jpg',
			'/scene_euija-anger-f_3.jpg',
			'/scene_euija-anger-f_36.jpg',
			'/scene_euija-anger-f_38.jpg'
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
		image: '/scene_yushin_chunchu_sing.png',
		frames: [
			'/scene_yushin-chunchu-bad-boy_2.jpg',
			'/scene_yushin_chunchu_sing.png',
			'/temp/yushin-chunchu-munhee.jpg',
			'/temp/harmony-council.jpg',
			'/temp/chunchu_strategist_shadow.png',
			'/temp/yushin-sword-vertical.jpg',
			'/temp/bidam-blood-inevitable.jpg',
			'/temp/council-tea-yushin.jpg',
			'/scene_yushin-chunchu-bad-boy_5.jpg',
			'/scene_yushin-chunchu-bad-boy_37.jpg'
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
		image: '/scene_yushin_sing.png',
		cover: '/album_yushin_oath.png',
		frames: [
			'/scene_yushin_sing.png',
			'/temp/sunduk-flirt-walkby.jpg',
			'/temp/sunduk-flirt-blush.jpg',
			'/temp/sunduk-yushin-flush.jpg',
			'/temp/sunduk-yushin-back-blush.jpg',
			'/temp/yushin-fans-sunduk-only.jpg',
			'/temp/dukman_reaching_stars.png',
			'/scene_yushin-always-dukman_2.jpg',
			'/scene_yushin-always-dukman_4.jpg',
			'/scene_yushin-always-dukman_12.jpg',
			'/scene_yushin-always-dukman_22.jpg',
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
		image: '/scene_hwarang_belle_sing.png',
		frames: [
			'/scene_hwarang_belle_sing.png',
			'/temp/three-youths-dukman.jpg',
			'/temp/hwarang_flower_youth.png',
			'/temp/hwarang-class.jpg',
			'/temp/hwarang-spar.jpg',
			'/scene_hwarang-belle_2.jpg',
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
		image: '/scene_munhee_sing.png',
		cover: '/album_munhee.png',
		frames: [
			'/scene_munhee_sing.png',
			'/temp/munhee-chunchu-months-quiet.jpg',
			'/temp/munhee-chunchu-back.jpg',
			'/temp/munhee-sewing-first.jpg',
			'/temp/munhee-queen-consort.jpg',
			'/temp/munhee-folded-letter.jpg',
			'/scene_chunchu-munhee-moonlight_2.jpg',
			'/scene_chunchu-munhee-moonlight_3.jpg',
			'/scene_chunchu-munhee-moonlight_12.jpg',
			'/scene_chunchu-munhee-moonlight_16.jpg',
			'/scene_chunchu-munhee-moonlight_22.jpg',
			'/scene_chunchu-munhee-moonlight_25.jpg',
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
		image: '/scene_jahee_sing.png',
		frames: [
			'/scene_jahee_sing.png',
			'/temp/bupmin-jahee-rain.jpg',
			'/temp/bupmin-jahee-ledger.jpg',
			'/temp/bupmin-jahee-almost.jpg',
			'/scene_bupmin-jahee-nagging_2.jpg',
			'/scene_bupmin-jahee-nagging_12.jpg',
			'/scene_bupmin-jahee-nagging_25.jpg',
			'/scene_bupmin-jahee-nagging_37.jpg'
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
		image: '/scene_chunchu_prison_floor.png',
		cover: '/album_chunchu.png',
		frames: [
			'/emotional_chunchu_revenge_oath.png',
			'/scene_chunchu_daegeum.png',
			'/scene_chunchu_prison_floor.png',
			'/scene_chunchu_prison_close.png',
			'/scene_chunchu_prison_window.png',
			'/temp/chunchu-prison.jpg',
			'/temp/chunchu-map-pool.jpg',
			'/temp/chunchu-forecast.jpg',
			'/scene_chunchu-revenge_2.jpg',
			'/scene_chunchu-revenge_3.jpg',
			'/scene_chunchu-revenge_37.jpg',
			'/scene_chunchu-revenge_44.jpg'
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
		image: '/scene_euija_deer_sing.png',
		frames: [
			'/scene_euija_gonghu.png',
			'/scene_euija_deer_sing.png',
			'/temp/euija-crown-eaten.jpg',
			'/temp/euija-coup-speech-dutch.jpg',
			'/temp/euija-coup-rock-wide.jpg',
			'/temp/euija-changan-court.jpg',
			'/scene_euija-ambition_2.jpg',
			'/scene_euija-ambition_4.jpg',
			'/scene_euija-ambition_5.jpg',
			'/scene_euija-ambition_12.jpg',
			'/temp/statue-euija-gilt.jpg',
			'/scene_euija-ambition_13.jpg',
			'/scene_euija-ambition_21.jpg',
			'/scene_euija-ambition_28.jpg',
			'/scene_euija-ambition_43.jpg'
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
		image: '/scene_gesomun_cave_symmetry.png',
		frames: [
			'/scene_gesomun_cave_symmetry.png',
			'/scene_gesomun_cave_dutch.png',
			'/temp/poster_gesomun.jpg',
			'/temp/gesomun-five-pommels.jpg',
			'/temp/gesomun-rings-cross.jpg',
			'/temp/gesomun-seq-pyongyang-gate.jpg',
			'/temp/gesomun-authority-low-angle.jpg',
			'/scene_gesomun-promise_2.jpg',
			'/scene_gesomun-promise_3.jpg',
			'/scene_gesomun-promise_4.jpg',
			'/scene_gesomun-promise_5.jpg',
			'/scene_gesomun-promise_13.jpg',
			'/scene_gesomun-promise_14.jpg',
			'/scene_gesomun-promise_26.jpg',
			'/scene_gesomun-promise_37.jpg'
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
		image: '/scene_gardener_sing.png',
		frames: [
			'/scene_gardener_sing.png',
			'/temp/poster_hallakgungi.jpg',
			'/temp/hallakgungi-gate.jpg',
			'/temp/hallakgungi-green-bloom.jpg',
			'/temp/hallakgungi-rows.png',
			'/temp/jacheongbi-flower-field.jpg',
			'/temp/three-realms-08-hallakgungi-joke.png',
			'/scene_gardener-homage_2.jpg',
			'/scene_gardener-homage_3.jpg',
			'/scene_gardener-homage_4.jpg',
			'/scene_gardener-homage_5.jpg',
			'/scene_gardener-homage_21.jpg',,
			'/scene_gardener-homage_36.jpg'
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
		image: '/temp/fall_of_joseon.png',
		frames: ['/temp/fall_of_joseon.png', '/temp/joseon-fall.jpg', '/scene_fall-of-joseon_2.jpg', '/scene_fall-of-joseon_3.jpg', '/scene_fall-of-joseon_4.jpg', '/scene_fall-of-joseon_26.jpg', '/scene_fall-of-joseon_37.jpg', '/scene_fall-of-joseon_39.jpg', '/scene_fall-of-joseon_43.jpg'],
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
		image: '/scene_life_gods_sing.png',
		cover: '/album_life_gods.png',
		frames: [
			'/scene_life_gods_sing.png',
			'/scene_life_gods_point.png',
			'/scene_life_gods_laugh.png',
			'/scene_life_gods_shove.png',
			'/temp/samsin-threefold.jpg',
			'/scene_ibiga_1.png',
			'/scene_three-life-gods_2.jpg',
			'/scene_three-life-gods_3.jpg',
			'/scene_three-life-gods_37.jpg'
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
		image: '/scene_gotaso_sing.png',
		cover: '/album_gotaso.png',
		frames: [
			'/scene_gotaso-hers_2.jpg',
			'/scene_gotaso_sing.png',
			'/temp/gotaso-determination-forward.png',
			'/temp/gotaso-seq-market-wide.jpg',
			'/temp/gotaso-ribbon-slash.jpg',
			'/temp/gotaso-seq-ford.jpg',
			'/emotional_gotaso_love_longing.png',
			'/img_gotaso_01.png',
			'/scene_gotaso-hers_4.jpg',
			'/scene_gotaso-hers_11.jpg',
			'/scene_gotaso-hers_37.jpg',
			'/scene_gotaso-hers_43.jpg'
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
		image: '/scene_bupmin_sing.png',
		frames: [
			'/scene_bupmin_sing.png',
			'/temp/bupmin-future-king.jpg',
			'/temp/bupmin-five-principles.jpg',
			'/temp/bupmin-hwarang-yard.jpg',
			'/scene_bupmin-resolve_2.jpg',
			'/scene_bupmin-resolve_3.jpg',
			'/scene_bupmin-resolve_37.jpg',
			'/scene_bupmin-resolve_43.jpg'
		],
		frameMs: 3400,
		title: 'Bupmin’s resolve',
		place: 'The yard — he already knows the answer',
		audio: youtube({
			youtubeId: '3jJJcacnGVI',
			title: 'You Know Better Than I',
			artist: 'Bupmin',
			credit: 'Joseph: King of Dreams · youtube.com/watch?v=3jJJcacnGVI'
		})
	},
	{
		id: 'haemosu-yuhwa-confession',
		image: '/scene_haemosu_yuhwa_sing.png',
		cover: '/album_haemosu.png',
		frames: [
			'/temp/jumong-haemosu-heart-yuhwa-chin.jpg',
			'/scene_haemosu-yuhwa-confession_4.jpg',
			'/temp/jumong-haemosu-pov-yuhwa-grin.jpg',
			'/temp/jumong-haemosu-sky-dusk-lean.jpg',
			'/temp/jumong-yuhwa-haemosu-two-grin.jpg',
			'/scene_haemosu-yuhwa-confession_2.jpg',
			'/scene_haemosu-yuhwa-confession_5.jpg',
			'/scene_haemosu-yuhwa-confession_10.jpg',
			'/scene_haemosu-yuhwa-confession_12.jpg',
			'/scene_haemosu-yuhwa-confession_13.jpg',
			'/scene_haemosu-yuhwa-confession_14.jpg',
			'/scene_haemosu-yuhwa-confession_16.jpg',
			'/scene_haemosu-yuhwa-confession_21.jpg',
			'/scene_haemosu-yuhwa-confession_24.jpg',
			'/scene_haemosu-yuhwa-confession_27.jpg',
			'/scene_haemosu-yuhwa-confession_33.jpg',
			'/scene_haemosu-yuhwa-confession_38.jpg',
			'/scene_haemosu-yuhwa-confession_40.jpg'
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
		image: '/scene_jumong_sosuno_sing.png',
		cover: '/album_jumong.png',
		frames: [
			'/scene_jumong-for-sosuno_3.jpg',
			'/scene_jumong_sosuno_sing.png',
			'/temp/jumong-sosuno-well.jpg',
			'/temp/jumong-sosuno-seq-kiss-shock.jpg',
			'/temp/jumong-sosuno-side-almost-kiss.jpg',
			'/temp/jumong-sosuno-hall-chin.jpg',
			'/scene_jumong-for-sosuno_2.jpg',
			'/scene_jumong-for-sosuno_4.jpg',
			'/scene_jumong-for-sosuno_5.jpg',
			'/scene_jumong-for-sosuno_10.jpg',
			'/scene_jumong-for-sosuno_13.jpg',
			'/scene_jumong-for-sosuno_22.jpg',
			'/scene_jumong-for-sosuno_25.jpg',
			'/scene_jumong-for-sosuno_27.jpg',
			'/scene_jumong-for-sosuno_33.jpg',
			'/scene_jumong-for-sosuno_40.jpg'
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
		image: '/scene_ibiga_rightview_sing.png',
		cover: '/album_ibiga_love.png',
		frames: [
			'/scene_ibiga-rightview_12.jpg',
			'/scene_ibiga_rightview_sing.png',
			'/temp/ibiga-seq-ridge.jpg',
			'/temp/rightview-ridge-guard.jpg',
			'/temp/rightview-seq-face.jpg',
			'/temp/ibiga-lookdown-face.jpg',
			'/scene_ibiga-rightview_2.jpg',
			'/scene_ibiga-rightview_3.jpg',
			'/scene_ibiga-rightview_37.jpg'
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
		image: '/scene_bidam_rebellion_sing.png',
		cover: '/album_bidam_beads.png',
		frames: [
			'/temp/bidam_rebellion_torch.png',
			'/scene_bidam_rebellion_sing.png',
			'/temp/bidam-rebellion-wide.jpg',
			'/scene_bidam_1.png',
			'/scene_bidam_3.png',
			'/scene_bidam-rebellion_2.jpg',
			'/scene_bidam-rebellion_3.jpg',
			'/scene_bidam-rebellion_4.jpg',
			'/scene_bidam-rebellion_22.jpg',
			'/scene_bidam-rebellion_35.jpg',
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
		image: '/scene_pumsuk_gotaso_sing.png',
		cover: '/album_branch.png',
		frames: [
			'/temp/gotaso-pumsuk-warmth.jpg',
			'/scene_pumsuk_gotaso_sing.png',
			'/temp/gotaso-love-gaze.jpg',
			'/img_gotaso_04.png',
			'/scene_pumsuk-loves-gotaso_2.jpg',
			'/scene_pumsuk-loves-gotaso_11.jpg',
			'/scene_pumsuk-loves-gotaso_37.jpg',
			'/scene_pumsuk-loves-gotaso_38.jpg'
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
		image: '/temp/gesomun-death-black.jpg',
		cover: '/scene_gesomun-my-way_41.jpg',
		frames: [
			'/temp/gesomun-death-black.jpg',
			'/temp/yeon-deathbed.jpg',
			'/temp/yeon-burning.jpg',
			'/scene_gesomun-my-way_41.jpg',
			'/scene_gesomun-my-way_42.jpg',
			'/scene_gesomun-my-way_43.jpg',
			'/scene_gesomun-my-way_44.jpg'
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
		image: '/temp/seohyeon-cavern-wide.jpg',
		cover: '/album_cavern_three.png',
		frames: [
			'/temp/seohyeon-cavern-wide.jpg',
			'/img_steam_cavern_intimacy.png',
			'/temp/yushin-cavern-seohyeon-hand.jpg',
			'/scene_steam-cavern_41.jpg',
			'/scene_steam-cavern_42.jpg',
			'/scene_steam-cavern_43.jpg',
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
		image: '/temp/hwangsan-wide.jpg',
		cover: '/scene_the-five-thousand_41.jpg',
		frames: [
			'/temp/hwangsan-wide.jpg',
			'/temp/hwangsan-three-camps.jpg',
			'/temp/hwangsan-laststand.jpg',
			'/temp/hwangsan-seq-clash.jpg',
			'/scene_the-five-thousand_41.jpg',
			'/scene_the-five-thousand_42.jpg',
			'/scene_the-five-thousand_43.jpg'
		],
		frameMs: 2800,
		title: 'The Five Thousand',
		place: 'Hwangsanbeol — five thousand against the arithmetic',
		audio: youtube({
			youtubeId: 'FLI7jJOQS5k',
			title: 'Going the Distance',
			artist: 'Gyebek',
			credit: 'Bill Conti · Rocky · youtube.com/watch?v=FLI7jJOQS5k'
		})
	},
	{
		id: 'tamla-birds',
		image: '/temp/halla-goddess.jpg',
		cover: '/scene_tamla-birds_41.jpg',
		frames: ['/temp/halla-goddess.jpg', '/img_halla_goddess.png', '/scene_tamla-birds_41.jpg', '/scene_tamla-birds_42.jpg', '/scene_tamla-birds_43.jpg', '/scene_tamla-birds_44.jpg'],
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
