/**
 * Shared profile-peek state — PersonLayer and the relationship chart both open
 * the same side panel through this.
 */

import { byId, type Person } from '$lib/people';

export const profiles = $state({
	peeked: null as Person | null,
	/** Story year when the profile was opened — picks life-stage name/portrait. */
	year: null as number | null
});

export function openProfile(
	id: string | Person | null | undefined,
	year?: number | null
) {
	if (!id) {
		profiles.peeked = null;
		profiles.year = null;
		return;
	}
	// Always resolve through byId so avatar/quote/events stay canonical.
	const key = typeof id === 'string' ? id : id.id;
	profiles.peeked = byId.get(key) ?? (typeof id === 'string' ? null : id);
	profiles.year = year ?? null;
}

export function closeProfile() {
	profiles.peeked = null;
	profiles.year = null;
}
