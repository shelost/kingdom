import type { EpisodeKind as StoredKind } from '$lib/story';

/** TOC categories: the stored `kinds` on an entry, plus `flashback` derived from `flash`. */
export type EpisodeKind = StoredKind | 'flashback';

/**
 * Icon, label and colour per kind. Kept free of runtime imports so outline pages don’t load the story.
 * Colours are CSS values: flashback follows the theme's strongest ink (white in dark, black in light).
 */
export const EPISODE_KIND_META: Record<
	EpisodeKind,
	{ icon: string; label: string; ko: string; color: string }
> = {
	love: { icon: 'favorite', label: 'Love story', ko: '사랑', color: '#ff2d7a' },
	flashback: { icon: 'undo', label: 'Flashback', ko: '회상', color: 'var(--fg-strong)' },
	myth: { icon: 'auto_awesome', label: 'Myth', ko: '신화', color: '#8b5cf6' },
	founding: { icon: 'egg', label: 'Founding myth', ko: '건국 신화', color: '#10b39b' },
	battle: { icon: 'swords', label: 'Battle', ko: '전투', color: '#f0362a' },
	siege: { icon: 'castle', label: 'Siege', ko: '공성', color: '#e8860c' },
	naval: { icon: 'sailing', label: 'Naval battle', ko: '해전', color: '#0b9fe0' },
	coup: { icon: 'local_fire_department', label: 'Coup & rebellion', ko: '정변', color: '#ff5a00' },
	coronation: { icon: 'crown', label: 'Coronation', ko: '즉위', color: '#f5b400' },
	person: { icon: 'person', label: 'Person', ko: '인물', color: '#3d6b9a' },
	death: { icon: 'skull', label: 'Death', ko: '죽음', color: '#5a5a68' }
};

/** The one icon that sits beside the episode title when Type is on. */
export type EpisodeTitleType = 'person' | 'battle' | 'king' | 'death';

export const EPISODE_TITLE_TYPE_META: Record<
	EpisodeTitleType,
	{ icon: string; label: string; ko: string; color: string }
> = {
	person: { icon: 'person', label: 'Person', ko: '인물', color: '#3d6b9a' },
	battle: { icon: 'swords', label: 'Battle', ko: '전투', color: '#f0362a' },
	king: { icon: 'crown', label: 'King', ko: '즉위', color: '#f5b400' },
	death: { icon: 'skull', label: 'Death', ko: '죽음', color: '#5a5a68' }
};
