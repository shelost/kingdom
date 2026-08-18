/**
 * Casting: which voice speaks for whom, and how.
 *
 * The chronicle has 124 speaking parts and thirteen voices, so the people we
 * hear most are cast by hand and everyone else is assigned by their id — a
 * hash, not a rotation, so a minor courtier keeps the same voice every time he
 * opens his mouth (and keeps hitting the same cached clips).
 */

import { byId, genderOf } from '$lib/people';
import type { Voice, VoiceLang } from '$lib/speech';

/**
 * Named parts — the speakers who carry the story.
 *
 * There are eight voices that read as men and five as women, against far more
 * speaking parts, so the eight most-heard men hold the male voices outright and
 * the rest double up only with someone they never share a scene with: a Tang
 * general and a Baekje one may sound alike, a father and his son may not.
 */
const CAST: Record<string, Voice> = {
	/* Silla */
	chunchu: 'ash',
	yushin: 'onyx',
	munmu: 'cedar',
	bidam: 'ballad',
	alchun: 'alloy',
	sunduk: 'sage',
	jinduk: 'marin',
	munhee: 'coral',
	gotaso: 'shimmer',
	/* Baekje */
	euija: 'fable',
	gyebek: 'echo',
	golhwa: 'nova',
	/* Goguryeo */
	gesomun: 'cedar',
	namseng: 'onyx',
	kangrim: 'alloy',
	haewonmek: 'verse',
	yumla: 'onyx',
	daebyeol: 'cedar',
	sobyeol: 'ballad',
	heavenearthking: 'fable',
	sara: 'verse',
	yuridora: 'shimmer',
	/* Tang */
	taizong: 'ballad',
	gaozong: 'echo',
	xuerengui: 'verse',
	wuzetian: 'marin',
	/* attendants and criers */
	herald: 'verse',
	courtmaid: 'coral'
};

/**
 * A sentence of direction per named part. Short on purpose: it travels in the
 * clip's URL, and a long brief makes the model act rather than speak.
 */
const TONE: Record<string, string> = {
	chunchu: 'patient and persuasive; keeps his temper in front of kings',
	yushin: 'iron discipline, quiet authority, never raises his voice',
	sunduk: 'a queen — unhurried, faintly ironic, entirely certain',
	munhee: 'bright and forward, unafraid of rank',
	munmu: 'a young king learning to sound like one',
	bidam: 'restless charm laid over grievance',
	euija: 'a king who enjoys being one — warm, sly, dangerous when bored',
	gyebek: 'a blunt soldier; plain, heavy, final',
	gesomun: 'contemptuous, amused by other men’s fear',
	kangrim: 'flat, cold, economical — an assassin',
	haewonmek: 'dry amusement, shorter sentences than Kangrim, never soft',
	yumla: 'judicial gravity with a dry joke under it',
	daebyeol: 'sovereign calm — unhurried, absolute, faintly kind',
	sobyeol: 'clever heat — hungry for the warm side, bad at apologies',
	heavenearthking: 'retired hero volume — loud, fond, done with the ledger',
	sara: 'exact gardener courtesy — unhurried, stem-precise',
	taizong: 'imperial patience with a threat under it',
	wuzetian: 'silk over steel',
	ongunhae: 'quiet, already decided; formal to his lord',
	herald: 'proclaiming to a full court, formal and carrying'
};

/** Voices that read as men, and as women, for everyone not cast by hand. */
const MEN: readonly Voice[] = ['ash', 'onyx', 'echo', 'fable', 'verse', 'cedar', 'ballad'];
const WOMEN: readonly Voice[] = ['coral', 'sage', 'nova', 'shimmer', 'marin'];

/** Deterministic pick — the same id always lands on the same voice. */
function pick(seed: string, from: readonly Voice[]): Voice {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
	return from[Math.abs(h) % from.length];
}

export function voiceFor(personId: string | null | undefined): Voice {
	if (!personId) return 'alloy';
	const cast = CAST[personId];
	if (cast) return cast;
	const person = byId.get(personId);
	const gender = person ? genderOf(person) : 'm';
	return pick(personId, gender === 'f' ? WOMEN : MEN);
}

const HOUSE: Record<VoiceLang, string> = {
	ko: 'Read only this line, in natural Korean, as a character in a 7th-century Korean court drama.',
	en: 'Read only this line, unhurried, as a character in a 7th-century Korean court drama.'
};

/** House style for the language, plus the part's own temperament when cast. */
export function instructionsFor(personId: string | null | undefined, lang: VoiceLang): string {
	const tone = personId ? TONE[personId] : undefined;
	return tone ? `${HOUSE[lang]} Voice: ${tone}.` : HOUSE[lang];
}
