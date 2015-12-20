import {IUser, ITalkMessage} from '../interfaces';
import publishStream from './publish-streaming-message';

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

	if (!message.hasOwnProperty('user')) {
		return Promise.resolve();
	}

	if (message.user.toString() === me.id.toString()) {
		return Promise.reject('isme');
	}

	return new Promise<void>((resolve, reject) => {
		switch (message.type) {
			case 'user-message':
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
				break;
			case 'group-message':
				// message.reads.push(me.id);
				message.save();

				// Publish stream message
				publishStream(`talk-group-stream:${message.group}`, JSON.stringify({
					type: 'read',
					value: message.id
				}));
				break;
			default:
				break;
		}
	});
}
