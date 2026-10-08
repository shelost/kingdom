import type { EpisodeKind as StoredKind } from '$lib/story';

/** TOC categories: the stored `kinds` on an entry, plus `flashback` derived from `flash`. */
export type EpisodeKind = StoredKind | 'flashback';

/** Icon, label and colour per kind. Kept free of runtime imports so outline pages don’t load the story. */
export const EPISODE_KIND_META: Record<EpisodeKind, { icon: string; label: string; ko: string; color: string }> = {
	love: { icon: 'favorite', label: 'Love story', ko: '사랑', color: '#e879a8' },
	flashback: { icon: 'undo', label: 'Flashback', ko: '회상', color: '#f4f1e8' },
	myth: { icon: 'chat_bubble', label: 'Myth', ko: '신화', color: '#c4b5fd' },
	founding: { icon: 'egg', label: 'Founding myth', ko: '건국 신화', color: '#8fd3c1' },
	battle: { icon: 'swords', label: 'Battle', ko: '전투', color: '#e8563f' },
	siege: { icon: 'castle', label: 'Siege', ko: '공성', color: '#d9a066' },
	naval: { icon: 'sailing', label: 'Naval battle', ko: '해전', color: '#5fb3c9' },
	coup: { icon: 'local_fire_department', label: 'Coup & rebellion', ko: '정변', color: '#f97316' },
	coronation: { icon: 'crown', label: 'Coronation', ko: '즉위', color: '#ffcb51' }
};
