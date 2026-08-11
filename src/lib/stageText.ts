/**
 * The live line, as a stage wants it.
 *
 * `reading` holds the dialogue as it was measured off the page — one string per
 * source line, per language layer. Every stage (the immersion speaker plate,
 * the cinema dialogue strip) needs the same thing from that: one flowing
 * paragraph per language, which of them the reader asked for, and a key that
 * changes exactly when the utterance does.
 *
 * Getters rather than `$derived` so this stays a plain module: each read
 * happens inside the consumer's own reactive scope, which is what makes the
 * component update when `reading` moves.
 */

import { reading } from '$lib/reading.svelte';

/** Space-joined paragraph — not one block per source line. */
function paragraph(lines: readonly string[]): string {
	return lines
		.map((l) => l.trim())
		.filter(Boolean)
		.join(' ');
}

export const stageText = {
	get ko() {
		return paragraph(reading.linesKo);
	},
	get en() {
		return paragraph(reading.linesEn);
	},
	get zh() {
		return paragraph(reading.linesZh);
	},
	get zhLatn() {
		return paragraph(reading.linesZhLatn);
	},
	get ja() {
		return paragraph(reading.linesJa);
	},
	get jaLatn() {
		return paragraph(reading.linesJaLatn);
	},

	get showKo() {
		return reading.lang === 'ko' || reading.lang === 'both';
	},
	get showEn() {
		return reading.lang === 'en' || reading.lang === 'both';
	},

	get hasKo() {
		return this.ko.length > 0;
	},
	get hasEn() {
		return this.en.length > 0;
	},
	get hasZh() {
		return this.zh.length > 0;
	},
	get hasJa() {
		return this.ja.length > 0;
	},

	/** Nothing sayable is on stage in the reader's language. */
	get empty() {
		return (
			(this.showKo ? !this.hasKo : true) &&
			(this.showEn ? !this.hasEn : true) &&
			!this.hasZh &&
			!this.hasJa
		);
	},

	/**
	 * Remount key for the text: speaker, language preference and every layer,
	 * so a stage crossfades on a new line and holds still on a scroll.
	 */
	get key() {
		return [
			reading.speaker ?? '',
			reading.lang,
			this.ko,
			this.en,
			this.zh,
			this.zhLatn,
			this.ja,
			this.jaLatn
		].join('\u0000');
	}
};
