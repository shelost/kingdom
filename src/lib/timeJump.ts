import { PLACES } from '$lib/places';
import { plateLines, type TimeJump } from '$lib/story';

/** The small place line under a time-jump card: the named place, else the plate label's place line. */
export function jumpPlace(plate: { label: string; ko?: string; jump?: TimeJump }, ko: boolean): string {
	const place = plate.jump?.place ? PLACES[plate.jump.place] : undefined;
	if (place) return (ko && place.korean) || place.name;
	const label = ko && plate.ko ? plate.ko : plate.label;
	return plateLines(label, !ko)[0] ?? '';
}
