export const cfg3 = {
	DEBUG: true,
	camtarget: [0, 0, 0],
	camera: { position: [6, 6, 6], min: 1, max: 3000 },
	postprocessing: false,
	ant: {
		model: './models/ant/scene.gltf',
		scale: 0.8,
	},
	lights: {
		ambient: 0.8,
	},
	environment: {
		makeLast: true,
	},
	standard: {},
	matcap: {
		white: { matcap: 'white.png', color: 0xffffff },
	},
	basic: {
		wireframe: { color: 0x00ff00, wireframe: true },
	},
};
