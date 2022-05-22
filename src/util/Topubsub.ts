import { sup3 } from '../base/Support3';
import { now3 } from '../Now3';

let messages: any = {};
let lastUid = -1;
const ALL_SUBSCRIBING_MSG = '*';

function hasKeys(obj: Record<string, unknown>) {
	let key;

	for (key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			return true;
		}
	}
	return false;
}

/**
 * Returns a function that throws the passed exception, for use as argument for setTimeout
 * @alias throwException
 * @function
 * @param { Object } ex An Error object
 */
function throwException(ex: Record<string, unknown>) {
	return function reThrowException() {
		throw ex;
	};
}

function callsubrWithDelayedExceptions(subr: (message: string, data: any) => void, message: string, data: any) {
	try {
		subr(message, data);
	} catch (ex) {
		setTimeout(throwException(ex), 0);
	}
}

function callsubrWithImmediateExceptions(subr: (message: string, data: any) => void, message: string, data: any) {
	subr(message, data);
}

function deliverMessage(originalMessage: string, matchedMessage: string, data: any, immediateExceptions: boolean) {
	const subrs = messages[matchedMessage];
	const callsubr = immediateExceptions ? callsubrWithImmediateExceptions : callsubrWithDelayedExceptions;
	let s;

	if (!Object.prototype.hasOwnProperty.call(messages, matchedMessage)) {
		return;
	}

	for (s in subrs) {
		if (Object.prototype.hasOwnProperty.call(subrs, s)) {
			callsubr(subrs[s], originalMessage, data);
		}
	}
}

function createDeliveryFunction(message: string, data: any, immediateExceptions: boolean) {
	return function deliverNamespaced() {
		let topic = String(message);
		let position = topic.lastIndexOf('.');

		// deliver the message as it is now
		deliverMessage(message, message, data, immediateExceptions);

		// trim the hierarchy and deliver message to each level
		while (position !== -1) {
			topic = topic.substr(0, position);
			position = topic.lastIndexOf('.');
			deliverMessage(message, topic, data, immediateExceptions);
		}

		deliverMessage(message, ALL_SUBSCRIBING_MSG, data, immediateExceptions);
	};
}

function hasDirectsubrsFor(message: string | symbol) {
	const topic = String(message);
	const found = Boolean(Object.prototype.hasOwnProperty.call(messages, topic) && hasKeys(messages[topic]));

	return found;
}

function messageHassubrs(message: string | symbol) {
	let topic = String(message);
	let found = hasDirectsubrsFor(topic) || hasDirectsubrsFor(ALL_SUBSCRIBING_MSG);
	let position = topic.lastIndexOf('.');

	while (!found && position !== -1) {
		topic = topic.substr(0, position);
		position = topic.lastIndexOf('.');
		found = hasDirectsubrsFor(topic);
	}

	return found;
}

function pub(message: string | symbol, data: any, sync: boolean, immediateExceptions: boolean) {
	message = typeof message === 'symbol' ? message.toString() : message;

	const deliver = createDeliveryFunction(message, data, immediateExceptions);
	const hassubrs = messageHassubrs(message);

	if (!hassubrs) {
		return false;
	}

	if (sync === true) {
		deliver();
	} else {
		setTimeout(deliver, 0);
	}
	return true;
}

/**
 * pubes the message, passing the data to it's subrs
 * @function
 * @alias pub
 * @param { String } message The message to pub
 * @param {} data The data to pass to subrs
 * @return { Boolean }
 */

const PubSub: {
	immediateExceptions?: boolean;
	pub?(message: string | symbol, data?: any): boolean;
	pubSync?(message: string | symbol, data?: any): boolean;
	sub?(message: string | symbol, func?: () => void): string | boolean;
	subAll?(func: () => void): string | boolean;
	subOnce?(message: string | symbol, func: () => void): any;
	clearAllSubscriptions?(): void;
	clearSubscriptions?(topic: string): void;
	countSubscriptions?(topic: string): number;
	getSubscriptions?(topic: string): string[];
	unsub?(value: any): boolean | string;
} = {};

PubSub.pub = function (message: string | symbol, data: any) {
	return pub(message, data, false, PubSub.immediateExceptions);
};

/**
 * pubes the message synchronously, passing the data to it's subrs
 * @function
 * @alias pubSync
 * @param { String } message The message to pub
 * @param {} data The data to pass to subrs
 * @return { Boolean }
 */
PubSub.pubSync = function (message: string | symbol, data: any) {
	return pub(message, data, true, PubSub.immediateExceptions);
};

/**
 * subs the passed function to the passed message. Every returned token is unique and should be stored if you need to unsub
 * @function
 * @alias sub
 * @param { String } message The message to sub to
 * @param { Function } func The function to call when a new message is pubed
 * @return { String }
 */
PubSub.sub = function (message: string | symbol, func: (pth: string, pad: any) => void = null) {
	if (typeof func !== 'function') {
		return false;
	}

	message = typeof message === 'symbol' ? message.toString() : message;

	// message is not registered yet
	if (!Object.prototype.hasOwnProperty.call(messages, message)) {
		messages[message] = {};
	}

	// forcing token as String, to allow for future expansions without breaking usage
	// and allow for easy use as key names for the 'messages' object
	const token = `uid_${String(++lastUid)}`;
	messages[message][token] = func;

	// return token for unsubscribing
	return token;
};

PubSub.subAll = function (func) {
	return PubSub.sub(ALL_SUBSCRIBING_MSG, func);
};

/**
 * subs the passed function to the passed message once
 * @function
 * @alias subOnce
 * @param { String } message The message to sub to
 * @param { Function } func The function to call when a new message is pubed
 * @return { PubSub }
 */
PubSub.subOnce = (message, func) => {
	const token = PubSub.sub(message, function () {
		// before func apply, unsub message
		PubSub.unsub(token);
		// eslint-disable-next-line prefer-rest-params
		func.apply(PubSub, arguments);
	});
	return PubSub;
};

/**
 * Clears all subscriptions
 * @function
 * @public
 * @alias clearAllSubscriptions
 */
PubSub.clearAllSubscriptions = function clearAllSubscriptions() {
	messages = {};
};

/**
 * Clear subscriptions by the topic
 * @function
 * @public
 * @alias clearAllSubscriptions
 * @return { int }
 */
PubSub.clearSubscriptions = function clearSubscriptions(topic) {
	let m;
	for (m in messages) {
		if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
			delete messages[m];
		}
	}
};

/** 
     Count subscriptions by the topic
    * @function
    * @public
    * @alias countSubscriptions
    * @return { Array }
*/
PubSub.countSubscriptions = function countSubscriptions(topic) {
	let m;
	let count = 0;
	for (m in messages) {
		if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
			count += 1;
		}
	}
	return count;
};

/** 
     Gets subscriptions by the topic
    * @function
    * @public
    * @alias getSubscriptions
*/
PubSub.getSubscriptions = function getSubscriptions(topic) {
	let m;
	const list = [];
	for (m in messages) {
		if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
			list.push(m);
		}
	}
	return list;
};

/**
 * Removes subscriptions
 *
 * - When passed a token, removes a specific subscription.
 *
 * - When passed a function, removes all subscriptions for that function
 *
 * - When passed a topic, removes all subscriptions for that topic (hierarchy)
 * @function
 * @public
 * @alias subOnce
 * @param { String | Function } value A token, function or topic to unsub from
 * @example // Unsubscribing with a token
 * var token = PubSub.sub('mytopic', myFunc);
 * PubSub.unsub(token);
 * @example // Unsubscribing with a function
 * PubSub.unsub(myFunc);
 * @example // Unsubscribing from a topic
 * PubSub.unsub('mytopic');
 */
PubSub.unsub = function (value: any) {
	const descendantTopicExists = function (topic: string) {
		let m;
		for (m in messages) {
			if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
				// a descendant of the topic exists:
				return true;
			}
		}

		return false;
	};
	const isFunction = typeof value === 'function';
	let result: string | boolean = false;
	let m;
	let message;
	let t;

	if (
		typeof value === 'string' &&
		(Object.prototype.hasOwnProperty.call(messages, value) || descendantTopicExists(value))
	) {
		PubSub.clearSubscriptions(value);
		// eslint-disable-next-line no-void
		return void 0;
	}

	for (m in messages) {
		if (Object.prototype.hasOwnProperty.call(messages, m)) {
			message = messages[m];

			if (typeof value === 'string' && message[value]) {
				delete message[value];
				result = value;
				// tokens are unique, so we can just stop here
				break;
			}

			if (isFunction) {
				for (t in message) {
					if (Object.prototype.hasOwnProperty.call(message, t) && message[t] === value) {
						delete message[t];
						result = true;
					}
				}
			}
		}
	}

	return result;
};

export default function topubsub(obj: any, xkey: boolean | string = false) {
	Object.assign(obj, PubSub);
	obj.isi = true;
	if (xkey && obj.xkey !== xkey) obj.xkey = xkey;
	if (!obj.xkey && !xkey) obj.xkey = obj.uuid; // throw(Error('Mix3 needs xkey'));
	obj.xkey = xkey || (Object.prototype.hasOwnProperty.call(obj, '_hashkey') ? obj._hashkey : obj.uuid);

	if (obj.name === '') obj.name = obj.xkey;

	try {
		obj.subme = (suffix: string, method: any) => obj.sub(`${obj.xkey}.${suffix}`, method);
		obj.unsubme = (suffix: string) => obj.unsub(`${obj.xkey}.${suffix}`);
		obj.submeOnce = (suffix: string, method: any) => obj.subOnce(`${obj.xkey}.${suffix}`, method);
		obj.pubme = (suffix: string, data: any) => obj.pub(`${obj.xkey}.${suffix}`, data);
		obj.subWhile = (timeout: number = 0, onFrame: any = null, onEnd: any = null, eventName: string = 'frame') => {
			const time0 = timeout === 0 ? 0 : now3.clock.elapsedTime;
			const live = obj.sub(eventName, (_pth: string, data: any) => {
				if (
					(timeout === 0 || now3.clock.elapsedTime - time0 < timeout) &&
					onFrame(data, now3.clock.elapsedTime - time0)
				)
					return true;
				if (sup3.isFun(onEnd)) {
					obj.unsub(live);
					const complete = !(timeout === 0 || now3.clock.elapsedTime - time0 < timeout);
					onEnd(complete);
				} else {
					obj.unsub(live);
				}

				return false;
			});
		};
	} catch (e) {
		PubSub.pub('error', 'error.pupsub');
	}

	return obj;
}
