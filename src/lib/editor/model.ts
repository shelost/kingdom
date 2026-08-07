// Client-side helpers for the editor. Every node gets a transient __id so
// Svelte can key lists and we can focus/drag blocks; __id is stripped on save.

export type AnyBlock = Record<string, unknown> & { __id: string; kind: string };

export function uid(): string {
	return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

export const BLOCK_KINDS = [
	{ kind: 'p', label: 'Paragraph', icon: '¶' },
	{ kind: 'dialogue', label: 'Dialogue', icon: '💬' },
	{ kind: 'cite', label: 'Attribution', icon: '•' },
	{ kind: 'verse', label: 'Verse', icon: '詩' },
	{ kind: 'table', label: 'Table', icon: '▦' },
	{ kind: 'hanja', label: 'Hanja', icon: '善' },
	{ kind: 'monologue', label: 'Monologue', icon: '◎' },
	{ kind: 'flashback', label: 'Flashback', icon: '⌛' }
] as const;

export function newBlock(kind: string): AnyBlock {
	const base = { __id: uid(), kind };
	switch (kind) {
		case 'dialogue':
			return { ...base, chip: '#111111', lines: [''] };
		case 'cite':
			return { ...base, html: '' };
		case 'verse':
			return { ...base, color: '#dc2626', lines: [''] };
		case 'table':
			return { ...base, head: ['', ''], rows: [['', '']] };
		case 'hanja':
			return { ...base, chars: [{ char: '字', gloss: '' }] };
		case 'monologue':
			return { ...base, html: '', person: 'chunchu' };
		case 'flashback':
			return { ...base, year: '', title: '', blocks: [newBlock('p')] };
		default:
			return { ...base, kind: 'p', html: '' };
	}
}

/** Best-effort text content of any block, for type conversions. */
function textOf(block: AnyBlock): string {
	if (typeof block.html === 'string') {
		const div = document.createElement('div');
		div.innerHTML = block.html;
		return div.innerText;
	}
	if (Array.isArray(block.lines)) return (block.lines as string[]).join('\n');
	if (Array.isArray(block.rows)) return (block.rows as string[][]).flat().join(' ');
	if (Array.isArray(block.chars))
		return (block.chars as { char: string }[]).map((c) => c.char).join('');
	if (Array.isArray(block.blocks))
		return (block.blocks as AnyBlock[]).map(textOf).join('\n');
	return '';
}

export function turnInto(block: AnyBlock, kind: string): AnyBlock {
	if (block.kind === kind) return block;
	const text = textOf(block);
	const nb = newBlock(kind);
	nb.__id = block.__id;
	if (kind === 'p' || kind === 'cite' || kind === 'monologue') nb.html = text.replace(/\n/g, ' ');
	else if (kind === 'dialogue' || kind === 'verse') nb.lines = text ? text.split('\n') : [''];
	return nb;
}

/** Attach __ids to everything after loading from the API. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decorate(chapters: any[]): any[] {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const walk = (blocks: any[]) => {
		for (const b of blocks ?? []) {
			b.__id = uid();
			if (Array.isArray(b.blocks)) walk(b.blocks); // nested flashbacks
		}
	};
	for (const ch of chapters) {
		ch.__id = uid();
		for (const en of ch.entries ?? []) {
			en.__id = uid();
			for (const img of en.images ?? []) img.__id = uid();
			walk(en.blocks);
		}
	}
	return chapters;
}

/** JSON.stringify replacer that drops the transient ids. */
export function stripIds(key: string, value: unknown): unknown {
	return key === '__id' ? undefined : value;
}
