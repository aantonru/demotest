import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { cfg3 } from './Config3';
import { sup3 } from './base/Support3';
import { skyenv } from './util/Sky3';

// eslint-disable-next-line import/no-mutable-exports
export let now3: any;

export interface TNow {
	camera: THREE.PerspectiveCamera;
	scene: THREE.Scene;
	clock: THREE.Clock;
	_startDone: boolean;
	_configDone: boolean;
	frame: number;
	delta: number;
	time: number;
	renderer: THREE.WebGLRenderer;
	pub?(message: string | symbol, data?: any): boolean;
	sub?(message: string | symbol, func?: (pth: string, pad: any) => void | boolean): string | boolean;
	subAll?(func: () => void): string | boolean;
	subOnce?(message: string | symbol, func: () => void): any;
	subme?(suffix: string, method: any): string | boolean;
	unsubme?(suffix: string): string | boolean;
	submeOnce?(suffix: string, method: any): any;
	pubme?(suffix: string, data: any): boolean;
	subWhile?(timeout: number, onFrame: any, onEnd?: any, eventName?: string): boolean;
	clearAllSubscriptions?(): void;
	clearSubscriptions?(topic: string): void;
	countSubscriptions?(topic: string): number;
	getSubscriptions?(topic: string): string[];
	unsub?(value: any): boolean | string;
	pr?: number;
	container: HTMLElement;
	breakAnimation?: boolean;
}

declare global {
	interface Window {
		now3: TNow;
	}
}

class Now3 implements TNow {
	camera: THREE.PerspectiveCamera;

	scene: THREE.Scene;

	clock: THREE.Clock;

	_startDone: boolean;

	_configDone: boolean;

	frame: number;

	delta: number;

	time: number;

	renderer: THREE.WebGLRenderer;

	envmap: THREE.Texture;

	immediateExceptions?: boolean;

	controls: OrbitControls;

	pub?(message: string | symbol, data?: any): boolean;

	pubSync?(message: string | symbol, data?: any): boolean;

	sub?(message: string | symbol, func?: (pth: string, pad: any) => void | boolean): string | boolean;

	subAll?(func: () => void): string | boolean;

	subOnce?(message: string | symbol, func: () => void): any;

	subme?(suffix: string, method: any): string | boolean;

	unsubme?(suffix: string): string | boolean;

	submeOnce?(suffix: string, method: any): any;

	pubme?(suffix: string, data: any): boolean;

	subWhile?(timeout: number, onFrame: any, onEnd?: any, eventName?: string): boolean;

	clearAllSubscriptions?(): void;

	clearSubscriptions?(topic: string): void;

	countSubscriptions?(topic: string): number;

	getSubscriptions?(topic: string): string[];

	unsub?(value: any): boolean | string;

	container: HTMLElement;

	constructor() {
		now3 = this;
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			cfg3.camera.min,
			cfg3.camera.max,
		);
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x333333);
		this.camera.position.fromArray(cfg3.camera.position);
		this.camera.lookAt(cfg3.camtarget[0], cfg3.camtarget[1], cfg3.camtarget[2]);
		this.camera.updateProjectionMatrix();
		this.clock = new THREE.Clock();

		this._startDone = false;
		this._configDone = false;
		this.frame = 0;
	}

	animate() {
		const delta = this.clock.getDelta();
		this.delta = delta;
		this.time = this.clock.elapsedTime;
		this.frame++;

		now3.pub(`frame.${(now3.frame % 1000).toString(2).split('').reverse().join('.')}`, delta);

		return delta;
	}

	setup(app: any) {
		app.scene = this.scene;
		app.camera = this.camera;
		this.renderer = app.renderer;

		this.container = app.container;
		this.envmap = skyenv(this.renderer, true);
		this.scene.environment = this.envmap;
		this.scene.background = this.envmap;
		if (!this._configDone) {
			app.configure(cfg3);
		}
		if (cfg3.DEBUG) this.pub('app3.registered');
	}

	toScene(content: any) {
		if (sup3.isValid3D(content)) {
			this.scene.add(content);
		} else if (sup3.isValid(content) && Array.isArray(content)) {
			content.forEach((item) => {
				if (sup3.isValid3D(item)) {
					this.scene.add(item);
				}
			});
		}
	}
}

now3 = new Now3();
