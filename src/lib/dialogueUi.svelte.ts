/**
 * How dialogue is lettered: a screenplay (`script`), message bubbles with
 * balloons over the stills (`comic`), posts and threads (`tweet`), or each
 * by the room (`hybrid`): messages between intimates, posts for the rest.
 * Mirrored onto `<html data-dialogue>` so stylesheets can follow it.
 */
import { browser } from '$app/environment';

export type DialogueStyle = 'script' | 'comic' | 'tweet' | 'hybrid';

const STYLES: DialogueStyle[] = ['script', 'comic', 'tweet', 'hybrid'];
const STORAGE_KEY = 'kingdom:dialogue';

export const dialogueUi = $state<{ style: DialogueStyle }>({ style: 'script' });

function apply(style: DialogueStyle) {
	dialogueUi.style = style;
	if (browser) document.documentElement.dataset.dialogue = style;
}

export function setDialogueStyle(style: DialogueStyle) {
	apply(style);
	try {
		localStorage.setItem(STORAGE_KEY, style);
	} catch {
		/* private mode — the choice just won't persist */
	}
}

export function loadDialogueStyle() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY) as DialogueStyle | null;
		apply(saved && STYLES.includes(saved) ? saved : 'script');
	} catch {
		apply('script');
	}
}
