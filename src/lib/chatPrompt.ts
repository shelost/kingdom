/**
 * “Chat as…” LLM system prompts for wiki character profiles.
 * Prefer hand-authored `Person.prompt` / `llmPrompt` + `personality`;
 * otherwise synthesize from nature / arc / events.
 */

import {
	KINGDOMS,
	nameOf,
	titleOf,
	koreanOf,
	type Person
} from '$lib/people';
import { kindOf, formatYear, clanOf, familyOf } from '$lib/wiki';

/** Flesh-and-blood figures and gods (not nations, places, phrases, bonds, systems). */
export function isChatPersona(p: Person): boolean {
	const k = kindOf(p);
	return k === 'character' || k === 'god';
}

/** Resolved hand-authored system prompt, if any. */
export function authoredChatPrompt(p: Person): string {
	return (p.llmPrompt ?? p.prompt ?? '').trim();
}

/**
 * System prompt for roleplaying as this person.
 * Returns empty string when the entry is not a chat persona.
 */
export function buildChatPrompt(p: Person): string {
	if (!isChatPersona(p)) return '';
	const authored = authoredChatPrompt(p);
	if (authored) {
		const extras: string[] = [];
		if (p.personality?.length) {
			extras.push(`Trait tags: ${p.personality.join('; ')}.`);
		}
		const clan = clanOf(p);
		if (clan) extras.push(`Clan / house: ${clan}.`);
		if (!extras.length) return authored.endsWith('\n') ? authored : authored + '\n';
		return `${authored}\n\n${extras.join('\n')}\n`;
	}

	const name = nameOf(p);
	const ko = koreanOf(p);
	const title = titleOf(p);
	const kingdom = KINGDOMS[p.kingdom]?.label ?? p.kingdom;
	const sobriquets = (p.sobriquets ?? []).filter(Boolean);
	const clan = clanOf(p);
	const family = familyOf(p);

	const identity: string[] = [];
	identity.push(name);
	if (ko && ko !== name) identity.push(ko);
	if (p.hanja) identity.push(p.hanja);

	let open = `You are ${identity.join(' / ')}`;
	if (sobriquets.length) open += ` (also known as ${sobriquets.join('; ')})`;
	if (title) open += `, ${title}`;
	else open += `, a figure of ${kingdom}`;
	open += '.';

	const blocks: string[] = [open, ''];

	if (p.personality?.length) {
		blocks.push(`Personality traits: ${p.personality.join('; ')}.`, '');
	}

	if (p.quote) {
		blocks.push(`Your defining motto (좌우명): "${p.quote}"`, '');
	}

	if (p.nature) {
		blocks.push('Personality and temperament:', p.nature, '');
	}

	if (p.arc) {
		blocks.push('Life arc and deeds (in-world knowledge you may draw on):', p.arc, '');
	}

	// Hard name-collision guards for chat (same 연 / Namsan surface forms, different people/places).
	if (p.id === 'yun') {
		blocks.push(
			'Name disambiguation (do not confuse yourself with these):',
			'- You are Prince Yun / Buyeo Yun (부여연 / 扶餘演), a Baekje prince. English: Prince Yun or Buyeo Yun — never bare “Yeon.”',
			'- You are not Yeon Gesomun (연개소문 / 淵蓋蘇文) and not of the Goguryeo Yeon (淵) clan.',
			'- You are not Prince Yung (융), not Yunbi (연비), and your Korean is 연 — not 윤.',
			''
		);
	} else if (p.id === 'gesomun') {
		blocks.push(
			'Name disambiguation (do not confuse yourself with these):',
			'- You are Yeon Gesomun of Goguryeo (연 / 淵 clan). Bare “Yeon” in English chronicle prose means you.',
			'- You are not Baekje’s Prince Yun / Buyeo Yun (부여연 / 扶餘演).',
			''
		);
	} else if (p.id === 'namsan') {
		blocks.push(
			'Name disambiguation (do not confuse yourself with these):',
			'- You are Yeon Namsan (연남산 / 淵男産), Gesomun’s youngest son — a person.',
			'- You are not Mount Namsan (남산 / 南山) above Surabol/Gyeongju — that is a Silla mountain/place.',
			''
		);
	}

	if (p.events?.length) {
		blocks.push('Key events you remember living through:');
		for (const ev of p.events) {
			const when = ev.year != null ? `${formatYear(ev.year)}: ` : '';
			blocks.push(`- ${when}${ev.label}`);
		}
		blocks.push('');
	}

	const facts: string[] = [];
	if (clan) facts.push(`Clan / house: ${clan}`);
	if (p.boneRank) facts.push(`Bone rank / station: ${p.boneRank}`);
	if (p.stages?.length) {
		const stages = p.stages
			.map((st) => {
				const label = st.title ?? st.name ?? 'stage';
				const from = st.from != null ? formatYear(st.from) : '…';
				const until = st.until != null ? formatYear(st.until) : '…';
				return `${label} (${from}–${until})`;
			})
			.join('; ');
		facts.push(`Titles across life: ${stages}`);
	}
	if (p.blade) facts.push(`Blade: ${p.blade}`);
	if (p.binyeo) facts.push(`Binyeo: ${p.binyeo}`);
	if (p.likes) facts.push(`Likes / soft spots: ${p.likes}`);
	if (p.ideology) {
		facts.push(
			p.ideologyNote
				? `Political affiliation / ideology: ${p.ideology} — ${p.ideologyNote}`
				: `Political affiliation / ideology: ${p.ideology}`
		);
	}
	if (family.length) {
		facts.push(
			`Close bonds: ${family.map((f) => `${f.role} — ${nameOf(f.person)}`).join('; ')}`
		);
	}
	if (facts.length) {
		blocks.push('Fixed facts:', ...facts.map((f) => `- ${f}`), '');
	}

	blocks.push('How to speak and behave:');
	blocks.push(
		'- Stay in character at all times. Speak in first person as this person would — period diction, pride, wit, or bluntness matching your nature.'
	);
	blocks.push(
		'- You live in the Samhan chronicle world (Silla, Baekje, Goguryeo/Goryeo, Tang, and their neighbors). Treat its politics, gods, and manners as real.'
	);
	blocks.push(
		'- Do not break character with modern slang, meta commentary, or encyclopedia narration about “the story.”'
	);
	blocks.push(
		'- Do not invent modern technology, nations after your age, or out-of-world spoilers.'
	);
	if (p.died != null) {
		blocks.push(
			`- Your lived knowledge ends with your death in ${formatYear(p.died)}. Do not speak of later years as memories you lived.`
		);
	} else if (p.born != null) {
		blocks.push(
			`- You were born ${p.bornApprox ? 'around ' : ''}${formatYear(p.born)}; answer from within your lifetime’s horizon.`
		);
	}
	blocks.push(
		'- When you lack knowledge a courtier of your station would lack, admit it in character — evade, boast, or dismiss — rather than lecturing like a modern historian.'
	);
	if (sobriquets.length) {
		blocks.push(
			`- Epithets others use for you (${sobriquets.join(', ')}) may colour how you answer praise or insult.`
		);
	}

	return blocks.join('\n').trim() + '\n';
}
