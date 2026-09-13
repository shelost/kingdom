import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';
import {
	cleanGrade,
	EMPTY_GRADE_STORE,
	type ImageGrade,
	type ImageGradeStore
} from '$lib/imageGrades';
import { enrichGrade, rebuildPromptHouse, type PromptHouse } from '$lib/promptHouse';

const FILE = path.resolve('src/lib/data/image-grades.json');
const HOUSE_FILE = path.resolve('src/lib/data/image-prompt-house.json');

function normalizeStore(raw: ImageGradeStore): ImageGradeStore {
	const grades: ImageGradeStore['grades'] = {};
	for (const [id, value] of Object.entries(raw.grades ?? {})) {
		const grade = cleanGrade({ ...value, id });
		if (grade) grades[grade.id] = grade;
	}
	return { updatedAt: raw.updatedAt ?? '', grades };
}

async function readStore(): Promise<ImageGradeStore> {
	try {
		const raw = JSON.parse(await fs.readFile(FILE, 'utf-8')) as ImageGradeStore;
		if (!raw || typeof raw !== 'object' || !raw.grades || typeof raw.grades !== 'object') {
			return { ...EMPTY_GRADE_STORE, grades: {} };
		}
		return normalizeStore(raw);
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
			return { ...EMPTY_GRADE_STORE, grades: {} };
		}
		throw err;
	}
}

async function writeStore(store: ImageGradeStore): Promise<PromptHouse> {
	const house = rebuildPromptHouse(store);
	await fs.writeFile(FILE, JSON.stringify(store, null, '\t') + '\n');
	await fs.writeFile(HOUSE_FILE, JSON.stringify(house, null, '\t') + '\n');
	return house;
}

export const GET: RequestHandler = async () => {
	const store = await readStore();
	return json({ store, house: rebuildPromptHouse(store) });
};

export const POST: RequestHandler = async ({ request }) => {
	if (!dev) error(403, 'Grades write to disk only in local dev');
	const grade = cleanGrade(await request.json());
	if (!grade) error(400, 'Expected { id, score: 1–10 }');
	const store = await readStore();
	const next: ImageGrade = enrichGrade({ ...grade, gradedAt: new Date().toISOString() });
	store.grades[next.id] = next;
	store.updatedAt = next.gradedAt;
	const house = await writeStore(store);
	return json({ ok: true, grade: next, store, house });
};

export const DELETE: RequestHandler = async ({ request }) => {
	if (!dev) error(403, 'Grades write to disk only in local dev');
	const body = (await request.json()) as { id?: unknown };
	const id = typeof body.id === 'string' ? body.id.trim() : '';
	if (!id) error(400, 'Expected { id }');
	const store = await readStore();
	delete store.grades[id];
	store.updatedAt = new Date().toISOString();
	const house = await writeStore(store);
	return json({ ok: true, store, house });
};
