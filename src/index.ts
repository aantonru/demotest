import App from './App';
import { BUILD_INFO } from './buildInfo';

function component() {
	const app3: App = new App().mount();
	const e: HTMLDivElement = document.createElement('div');
	e.classList.add('hidden');
	return e;
}
document.body.appendChild(component());

window.console.debug(BUILD_INFO);
