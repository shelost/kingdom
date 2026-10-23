export type ArcKind = 'section' | 'story' | 'scene' | 'day' | 'flashback';

export type ArcNode = {
	kind: ArcKind | string;
	label: string;
	ko?: string;
	words: number;
	at?: number;
	implicit?: boolean;
	kids?: ArcNode[];
};

export type ArcBeat = {
	label: string;
	kind: string;
	words: number;
	at: number;
	tension: number;
	climax?: boolean;
	start?: boolean;
};

export type ArcReview = {
	lean: 'up' | 'down';
	by: string;
	text: string;
};

export function shortLabel(label: string): string {
	if (label.length > 28 && !label.includes('·')) return label;
	const cut = label.indexOf('·');
	return (cut < 0 ? label : label.slice(0, cut)).trim();
}

export function sameName(a: string, b: string): boolean {
	const fold = (s: string) =>
		s
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^\p{L}\p{N}]+/gu, '');
	return fold(a) === fold(b);
}

export function collectKind(nodes: ArcNode[] | undefined, kind: string, out: ArcNode[] = []): ArcNode[] {
	for (const n of nodes ?? []) {
		if (n.kind === kind) out.push(n);
		collectKind(n.kids, kind, out);
	}
	return out;
}
