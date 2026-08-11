/**
 * Tiny UI bridge so the bento map tile can open the full StoryMap modal.
 */
export const mapUi = $state({
	open: false
});

export function openStoryMap() {
	mapUi.open = true;
}

export function closeStoryMap() {
	mapUi.open = false;
}
