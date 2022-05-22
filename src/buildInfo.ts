declare const __VERSION__: string;
declare const __MODE__: string;

export const BUILD_INFO = {
	version: __VERSION__,
	mode: __MODE__,

	toString() {
		return `Build v: ${this.version} (${this.mode})`;
	},
};
