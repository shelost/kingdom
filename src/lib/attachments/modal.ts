import type { Attachment } from 'svelte/attachments';

/**
 * Opens a `<dialog>` as a modal the moment it mounts and closes it on teardown,
 * so `{#if open}<dialog {@attach modal}>` is the whole lifecycle.
 */
export const modal: Attachment<HTMLDialogElement> = (node) => {
	node.showModal();
	return () => node.close();
};
