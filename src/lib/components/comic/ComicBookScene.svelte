<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { ContactShadows } from '@threlte/extras';
	import { DoubleSide } from 'three';

	let { angle = 0 }: { angle: number } = $props();

	const H = 2.22;
	const W = H * (210 / 297);
	const cover = '#1c1814';
	const paper = '#f3eee4';
</script>

<T.PerspectiveCamera
	makeDefault
	fov={26}
	position={[W * 0.5, 0.04, 4.85]}
	near={0.1}
	far={40}
	oncreate={(cam) => {
		cam.lookAt(W * 0.5, 0, 0);
	}}
/>

<T.AmbientLight intensity={0.62} />
<T.DirectionalLight position={[2.4, 3.6, 4]} intensity={1.15} castShadow />
<T.DirectionalLight position={[-2.2, 1.2, 1.4]} intensity={0.28} color="#8aa0c8" />

<!-- Left cover, just off the spine -->
<T.Mesh position={[-0.055, 0, -0.03]} rotation.y={0.035} receiveShadow>
	<T.BoxGeometry args={[0.07, H + 0.1, W + 0.12]} />
	<T.MeshStandardMaterial color={cover} roughness={0.82} />
</T.Mesh>

<!-- Page stack under the turning leaf -->
<T.Mesh position={[W / 2 + 0.012, 0, -0.028]} receiveShadow>
	<T.BoxGeometry args={[W, H, 0.045]} />
	<T.MeshStandardMaterial color={paper} roughness={0.92} />
</T.Mesh>

<!-- Turning leaf: thickness reads at the 90° edge -->
<T.Group rotation.y={-angle}>
	<T.Mesh position={[W / 2, 0, 0]} castShadow>
		<T.BoxGeometry args={[W, H, 0.012]} />
		<T.MeshStandardMaterial color={paper} roughness={0.88} side={DoubleSide} />
	</T.Mesh>
</T.Group>

<ContactShadows
	position={[W / 2, -H / 2 - 0.04, 0]}
	opacity={0.42}
	scale={5.4}
	blur={2.2}
	far={3}
	color="#000000"
/>
