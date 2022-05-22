import * as THREE from 'three';
// eslint-disable-next-line import/no-cycle
import { now3 } from '../Now3';
import { sup3 } from '../base/Support3';

export function ant(params: any) {
	const item = params.model.scene;
	item.scale.set(params.scale, params.scale, params.scale);
	item.traverse((it: THREE.Mesh) => {
		it.castShadow = true;
		it.frustumCulled = false;
		window.console.log(`${it.name}`);
		if (it.name.indexOf('Sneakers') !== -1) {
			window.console.log(it);
			it.visible = false;
			it.frustumCulled = true;
		} else window.console.warn(`${it.name.indexOf('Sneakers')}`);
	});
	now3.toScene(item);
}

export function gmodels(params: any) {
	Object.entries(params).forEach((ent: any, i) => {
		const item = ent[1].scene;
		item.translateX(i * 2);
		now3.toScene(item);
	});
}

export function environment() {
	const gridHelper = new THREE.GridHelper(25, 8, 0xaaaa00, 0x333333);
	(gridHelper.material as THREE.Material).transparent = true;
	(gridHelper.material as THREE.Material).opacity = 0.5;

	const geo = new THREE.CircleBufferGeometry(6, 64);
	geo.rotateX(-Math.PI / 2);
	const mesh = new THREE.Mesh(
		geo,
		new THREE.MeshStandardMaterial({ color: 0x555555, emissive: 0x110000, roughness: 0.8 }),
	);
	mesh.receiveShadow = true;
	mesh.translateY(-0.001);
	gridHelper.name = 'grid';

	now3.toScene(mesh);
	now3.toScene(gridHelper);

	now3.pub('app3start');
}

export function lights(_params: any) {
	const lightsGroup = new THREE.Group();
	const amb = new THREE.AmbientLight(0xffffff, _params.ambient);
	amb.name = 'ambientLIGHT';

	const d3 = new THREE.DirectionalLight(0xffffff, 1.2);
	d3.name = 'directLIGHT';
	d3.position.set(15, 12, 13);
	d3.castShadow = true;
	d3.shadow.mapSize.width = 1024;
	d3.shadow.mapSize.height = 1024;
	d3.shadow.radius = 2.3;
	d3.shadow.camera.left = -5;
	d3.shadow.camera.right = 5;
	d3.shadow.camera.bottom = -5;
	d3.shadow.camera.top = 5;

	lightsGroup.name = 'lights';

	lightsGroup.add(amb);
	lightsGroup.add(d3);

	now3.toScene(lightsGroup);
}
