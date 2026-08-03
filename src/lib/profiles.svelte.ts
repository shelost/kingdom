/**
 * Shared profile-peek state — PersonLayer and the relationship chart both open
 * the same side panel through this.
 */

import { byId, type Person } from '$lib/people';

export const profiles = $state({
	peeked: null as Person | null
});

export function openProfile(id: string | Person | null | undefined) {
	if (!id) {
		profiles.peeked = null;
		return;
	}
	const p = typeof id === 'string' ? byId.get(id) : id;
	profiles.peeked = p ?? null;
}

export function closeProfile() {
	profiles.peeked = null;
}
