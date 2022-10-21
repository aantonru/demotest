import { sup3 } from './Support3';

export function autosub(item: any) {
	item.sub('*', (pth: string) => {
		if (sup3.isValid(pth) && pth.indexOf('frame') < 0 && pth.indexOf('.updated') < 0) {
			window.console.log(`%c> ${pth}`, 'color:#393;font-size:9px;padding:0;marging:0;line-height:10px');
		}
	});

	return item;
}
