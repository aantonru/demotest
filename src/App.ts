import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { sup3 } from './base/Support3';
import { now3 } from './Now3';
import { cfg3 } from './Config3';
import { Import3 } from './base/Import3';
import topubsub from './util/Topubsub';
import { autosub } from './base/AUTO';

class App {
	// class App can be extended from Component to use with react.js
	debug: boolean;

	container: HTMLElement;

	manager: THREE.LoadingManager;

	_loadingDone: boolean;

	import: Import3;

	renderer: THREE.WebGLRenderer;

	width: number;

	height: number;

	live: boolean;

	touchTime: number;

	constructor() {
		this.debug = cfg3.DEBUG;
		this.container = document.getElementById('container3');
		this.manager = new THREE.LoadingManager();

		this.live = true;
		this.touchTime = performance.now();

		this.manager.onLoad = () => {
			this._loadingDone = true;
			this.import.onLoadingComplete();
			now3.pub('import3.load');
		};
		this.manager.onProgress = (url, current, total) => {
			now3.pub('import3.process', {
				url,
				current,
				total,
				value: current / total,
			});
		};
		this.manager.onError = (url) => {
			now3.pub(`import.error at \n${url}`);
		};
		this.import = new Import3(this.manager).setModelsPath('').setMapsPath('./maps/');
	}

	touch(){
		this.live = true;
		this.touchTime = performance.now();
		console.log('touch');
	}

	hold(){
		this.live = false;
		this.touchTime = performance.now();
		console.log('hold');
	}

	mount() {
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
		renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
		renderer.shadowMap.enabled = true;
		renderer.setClearColor(new THREE.Color(0), 0);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer = renderer;

		topubsub(now3, 'now3');
		autosub(now3);
		now3.pub(`now3.constructed${cfg3.DEBUG ? '.debug' : ''}`);
		now3.sub('app3start', () => {
			this.play();
			now3.controls = new OrbitControls(now3.camera, renderer.domElement);
			now3.controls.maxPolarAngle = Math.PI * 0.49;
		});

		now3.setup(this);
		this.container.appendChild(this.renderer.domElement);
		window.addEventListener('resize', this.autosize);
//		window.addEventListener('mousemove', this.touch);
		if (cfg3.DEBUG) now3.pub('app3.mounted');
		return this;
	}

	play() {
		const render = () => {
			now3.animate();
			this.renderer.render(now3.scene, now3.camera);
		};

		this.renderer.setAnimationLoop(render);

		return this;
	}

	autosize = () => {
		if (sup3.isValid(document.querySelector('#container3'))) {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
			const { width } = this;
			const { height } = this;
			now3.camera.aspect = window.innerWidth / window.innerHeight;
			now3.camera.updateProjectionMatrix();
			if (this.renderer) this.renderer.setSize(width, height);
		}
	};

	pause() {
		this.renderer.setAnimationLoop(null);

		return this;
	}

	configure(config: any) {
		this.import.import(config);
		if (cfg3.DEBUG) now3.pub('app3.configured');
		return this;
	}
}

export default App;
