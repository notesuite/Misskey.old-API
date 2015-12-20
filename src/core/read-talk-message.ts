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
			if (message.user.toString() === me.id.toString()) {
				return reject('is-me');
			}

			const otherpartyId: string = typeof message.user === 'string'
				? message.user
				: (<any>message.user).id;

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
			}

			// message.reads.push(me.id);
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
