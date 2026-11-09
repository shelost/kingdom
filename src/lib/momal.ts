/**
 * Momal's shared copy and navigation: the corner shell (`Momal.svelte`) and the
 * full chat page (`/momal`) both read from here.
 */
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { storyAsk } from '$lib/storyAsk.svelte';
import { EP_QUERY } from '$lib/reading.svelte';
import type { MomalLayer } from '$lib/momalTypes';

export const MOMAL_PATH = resolve('/momal');

/** The two layers every answer keeps apart, as the widgets label them. */
export const MOMAL_LAYERS: Record<MomalLayer, { en: string; ko: string; icon: string }> = {
	record: { en: 'The record', ko: '기록', icon: 'history_edu' },
	chronicle: { en: 'This chronicle', ko: '이 이야기', icon: 'auto_stories' },
	both: { en: 'Record & chronicle', ko: '기록과 이야기', icon: 'join' }
};

export function momalWikiHref(id: string): string {
	return resolve(`/wiki?id=${encodeURIComponent(id)}`);
}

export function momalEpisodeHref(queryId: string): string {
	return `${resolve('/read')}?${EP_QUERY}=${encodeURIComponent(queryId)}`;
}

export type MomalHint = { en: string; ko: string; icon: string };

/** Starter questions, most general first. The panel shows the first three. */
export const MOMAL_HINTS: readonly MomalHint[] = [
	{ en: 'Who is Momal?', ko: '모말은 누구인가', icon: 'person_search' },
	{ en: 'How are Yushin and Bidam related?', ko: '유신과 비담은 몇 촌인가', icon: 'family_history' },
	{ en: 'Who is Park Jesang?', ko: '박제상은 누구인가', icon: 'history_edu' },
	{ en: 'Why does Gyebek hold his sword backwards?', ko: '계백은 왜 칼을 거꾸로 쥐는가', icon: 'swords' },
	{ en: 'What really happened at Yellow Mountain?', ko: '황산벌에서 실제로 무슨 일이 있었나', icon: 'landscape' },
	{ en: 'Where does the chronicle part from the record?', ko: '이 이야기는 기록과 어디서 갈라지나', icon: 'menu_book' }
];

/** What Momal says he is doing while the first words are on their way. */
export const MOMAL_STATUS: readonly { en: string; ko: string }[] = [
	{ en: 'Reading the Samguk Sagi…', ko: '삼국사기를 읽는 중…' },
	{ en: 'Checking the Samguk Yusa…', ko: '삼국유사를 살피는 중…' },
	{ en: 'Looking through the wiki…', ko: '위키를 뒤지는 중…' },
	{ en: 'Finding the scene in the script…', ko: '대본에서 장면을 찾는 중…' },
	{ en: 'Weighing the record against the story…', ko: '기록과 이야기를 견주는 중…' }
];

export function openMomalPage() {
	storyAsk.show();
	void goto(MOMAL_PATH);
}

/** Leave `/momal` for the page the reader came from, as the open panel or as the pill. */
export function leaveMomalPage(asPanel: boolean) {
	if (asPanel) storyAsk.show();
	else storyAsk.hide();
	// eslint-disable-next-line svelte/no-navigation-without-resolve -- context.path was read from a resolved URL
	void goto(storyAsk.context.path || resolve('/'), { noScroll: true });
}
