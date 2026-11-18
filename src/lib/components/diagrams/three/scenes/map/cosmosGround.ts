/**
 * The cosmos ground shader: one Lambert material that morphs the split world into
 * the Pangaea circle and crossfades the two paints. The uniform is all that moves
 * during the transition — the grid and both canvases stay put.
 */
import { CanvasTexture, DoubleSide, MeshLambertMaterial, Vector2 } from 'three';
import { discsAt } from '$lib/cosmos';

export type CosmosGround = {
	mat: MeshLambertMaterial;
	setSplit: (t: number) => void;
	setPangaea: (tex: CanvasTexture | null) => void;
};

export function cosmosGroundMaterial(): CosmosGround {
	const mat = new MeshLambertMaterial({
		transparent: true,
		alphaTest: 0.02,
		depthWrite: true,
		side: DoubleSide
	});
	const { living, dead } = discsAt(1);
	const uniforms = {
		uSplit: { value: 1 },
		uPangaea: { value: null as CanvasTexture | null },
		uMid: { value: new Vector2((living.x + dead.x) / 2, (living.y + dead.y) / 2) },
		uHalf: { value: (living.x - dead.x) / 2 },
		uRadius: { value: living.r },
		uLip: { value: 88 },
		uLipW: { value: 88 / 50 }
	};
	mat.onBeforeCompile = (shader) => {
		Object.assign(shader.uniforms, uniforms);
		shader.vertexShader = shader.vertexShader
			.replace(
				'#include <uv_pars_vertex>',
				`#include <uv_pars_vertex>
				attribute vec3 morphPosition;
				attribute vec3 morphNormal;
				attribute vec2 sheet;
				attribute vec2 morphSheet;
				attribute vec2 morphUv;
				varying vec2 vSheet;
				varying vec2 vMorphUv;
				uniform float uSplit;
				uniform vec2 uMid;
				uniform float uHalf;
				uniform float uRadius;
				uniform float uLip;
				uniform float uLipW;`
			)
			.replace(
				'#include <beginnormal_vertex>',
				'vec3 objectNormal = normalize(mix(morphNormal, normal, clamp(uSplit, 0.0, 1.0)));'
			)
			.replace(
				'#include <begin_vertex>',
				`vec3 transformed = mix(morphPosition, vec3(position), clamp(uSplit, 0.0, 1.0));
				float splitNow = clamp(uSplit, 0.0, 1.0);
				vSheet = mix(morphSheet, sheet, splitNow);
				vMorphUv = morphUv;
				float moving = smoothstep(0.0, 0.08, uSplit) * (1.0 - smoothstep(0.92, 1.0, uSplit));
				vec2 liveC = uMid + vec2(uHalf * uSplit, 0.0);
				vec2 deadC = uMid - vec2(uHalf * uSplit, 0.0);
				float sd = max(uRadius - length(vSheet - liveC), uRadius - length(vSheet - deadC));
				float lipT = clamp((uLip - max(sd, 0.0)) / uLip, 0.0, 1.0);
				transformed.y -= uLipW * (1.0 - cos(lipT * 1.5707963)) * moving;`
			);
		shader.fragmentShader = shader.fragmentShader
			.replace(
				'#include <uv_pars_fragment>',
				`#include <uv_pars_fragment>
				varying vec2 vSheet;
				varying vec2 vMorphUv;
				uniform float uSplit;
				uniform vec2 uMid;
				uniform float uHalf;
				uniform float uRadius;
				uniform sampler2D uPangaea;`
			)
			.replace(
				'#include <map_fragment>',
				`#ifdef USE_MAP
					vec4 sampledPresent = texture2D(map, vMapUv);
					vec4 sampledPan = texture2D(uPangaea, vMorphUv);
					float presentW = smoothstep(0.0, 0.42, uSplit);
					vec4 sampledDiffuseColor = mix(sampledPan, sampledPresent, presentW);
					diffuseColor *= sampledDiffuseColor;
				#endif
				vec2 liveC = uMid + vec2(uHalf * uSplit, 0.0);
				vec2 deadC = uMid - vec2(uHalf * uSplit, 0.0);
				float sd = max(uRadius - length(vSheet - liveC), uRadius - length(vSheet - deadC));
				if (sd < -28.0) discard;
				diffuseColor.a *= smoothstep(-8.0, 16.0, sd);`
			);
	};
	mat.customProgramCacheKey = () => 'cosmos-ground-v2';
	return {
		mat,
		setSplit(t: number) {
			uniforms.uSplit.value = t;
		},
		setPangaea(tex: CanvasTexture | null) {
			uniforms.uPangaea.value = tex;
		}
	};
}
