import {IUser, ITalkMessage, ITalkUserMessage, ITalkGroupMessage} from '../interfaces';
import publishStream from './publish-streaming-message';

function isUserMessage(message: ITalkMessage): message is ITalkUserMessage {
	'use strict';
	return message.type === 'user-message';
}

function isGroupMessage(message: ITalkMessage): message is ITalkGroupMessage {
	'use strict';
	return message.type === 'group-message';
}

/**
 * メッセージを既読にします
 * @param me ユーザー
 * @param message 対象のメッセージ
 */
export default function(
	me: IUser,
	message: ITalkMessage
): Promise<void> {
	'use strict';

	return new Promise<void>((resolve, reject) => {
		if (isUserMessage(message)) {
			if ((<any>message)._doc.user.toString() === me.id.toString()) {
				return reject('is-me');
			}

			const otherpartyId: string = <string>(<any>message)._doc.user;

			message.isRead = true;
			message.save();

			// Publish stream message
			publishStream(`talk-user-stream:${otherpartyId}-${me.id}`, JSON.stringify({
				type: 'read',
				value: message.id
			}));
		} else if (isGroupMessage(message)) {
			if (message.user.toString() === me.id.toString()) {
				return reject('is-me');
			} else if ((<string[]>message.reads).indexOf(me.id) > 0) {
				return reject('arleady-read');
			}

			(<string[]>message.reads).push(me.id);
			message.save();

			// Publish stream message
			publishStream(`talk-group-stream:${message.group}`, JSON.stringify({
				type: 'read',
				value: message.id
			}));
		} else {
			resolve();
		}
	});
}
