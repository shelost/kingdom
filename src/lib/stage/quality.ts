/** How hard the stage works per frame: the toolbar switch, read by the scene and the post chain. */
export type StageQuality = 'low' | 'medium' | 'high';

export type QualitySettings = {
	/** Highest pixel ratio a still camera renders at. */
	dpr: number;
	/** Ambient occlusion in the creases (it draws the scene a second time). */
	ao: boolean;
	/** MSAA samples on the scene render. */
	samples: number;
	/** Sun shadow map size, per side. */
	shadow: number;
	/** Scales every near/far switch distance on the ground and the trees. */
	detail: number;
};

export const QUALITY: Record<StageQuality, QualitySettings> = {
	low: { dpr: 1, ao: false, samples: 0, shadow: 2048, detail: 0.55 },
	medium: { dpr: 1.5, ao: true, samples: 4, shadow: 4096, detail: 1 },
	high: { dpr: 2, ao: true, samples: 4, shadow: 4096, detail: 1.7 }
};

export const STAGE_QUALITIES: { id: StageQuality; en: string; ko: string }[] = [
	{ id: 'low', en: 'Low', ko: '낮음' },
	{ id: 'medium', en: 'Medium', ko: '보통' },
	{ id: 'high', en: 'High', ko: '높음' }
];

export function isStageQuality(v: unknown): v is StageQuality {
	return v === 'low' || v === 'medium' || v === 'high';
}
