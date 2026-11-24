import { describe, expect, it } from 'vitest';
import type { BookVolume } from '$lib/books';
import { continueQuery, leavesOf, spreadCount, spreadOf } from './volumeLeaves';

const sample: BookVolume = {
	id: 'vol-a',
	number: 1,
	title: 'Sample',
	ko: '견본',
	part: 'Part I',
	arc: 'arc-a',
	spine: '#334155',
	episodes: 2,
	words: 1200,
	minutes: 8,
	range: '660–661',
	queryId: 'ep-1',
	slot: 0,
	partIndex: 0,
	inPart: 0,
	chapters: [
		{
			id: 'ch-1',
			queryId: 'ep-1',
			number: '01',
			title: 'First',
			ko: '첫째',
			year: '660',
			words: 600,
			minutes: 4
		},
		{
			id: 'ch-2',
			queryId: 'ep-2',
			number: '02',
			title: 'Second',
			year: '661',
			words: 600,
			minutes: 4
		}
	],
	blurb: { en: 'A short volume.', ko: '짧은 권.' },
	w: 0.175,
	h: 0.26,
	d: 0.034,
	spineInk: '#f5f0e8'
};

describe('volumeLeaves', () => {
	it('builds cover, title, and one leaf per episode', () => {
		const leaves = leavesOf(sample, false);
		expect(leaves.map((leaf) => leaf.kind)).toEqual(['cover', 'title', 'episode', 'episode']);
		expect(leaves[2]?.heading).toBe('First');
		expect(leaves[2]?.queryId).toBe('ep-1');
	});

	it('pairs leaves into spreads and prefers the right query for continue', () => {
		const leaves = leavesOf(sample, false);
		expect(spreadCount(leaves)).toBe(2);
		expect(spreadOf(leaves, 0).left?.kind).toBe('cover');
		expect(spreadOf(leaves, 0).right?.kind).toBe('title');
		expect(continueQuery(leaves, 1, sample.queryId)).toBe('ep-2');
	});
});
