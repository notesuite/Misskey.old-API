import {TalkUserMessage, TalkGroupMessage} from '../db/db';
import {IUser, ITalkMessage} from '../db/interfaces';
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

	return new Promise<void>((resolve, reject) => {
		switch (message.type) {
			case 'user-message':
				if ((<any>message)._doc.user.toString() === me.id.toString()) {
					return reject('is-me');
				}

				const otherpartyId: string = <string>(<any>message)._doc.user;

				TalkUserMessage.findByIdAndUpdate(message.id, { $set: { isRead: true }}, (_1, _2) => {
					// dummy
				});

				// Publish stream message
				publishStream(`talk-user-stream:${otherpartyId}-${me.id}`, JSON.stringify({
					type: 'read',
					value: message.id
				}));
				break;
			case 'group-message':
				if ((<any>message)._doc.user.toString() === me.id.toString()) {
					return reject('is-me');
				} else if ((<string[]>(<any>message)._doc.reads).indexOf(me.id.toString()) !== -1) {
					return reject('arleady-read');
				}

				TalkGroupMessage.findByIdAndUpdate(message.id, { $set: { reads: (<string[]>(<any>message)._doc.reads).concat(me.id) }}, (_1, _2) => {
					// dummy
				});

				// Publish stream message
				publishStream(`talk-group-stream:${(<any>message)._doc.group}`, JSON.stringify({
					type: 'read',
					value: message.id
				}));
				break;
			case 'group-send-invitation-activity':
			case 'group-member-join-activity':
				if ((<string[]>(<any>message)._doc.reads).indexOf(me.id.toString()) !== -1) {
					return reject('arleady-read');
				}

				TalkGroupMessage.findByIdAndUpdate(message.id, { $set: { reads: (<string[]>(<any>message)._doc.reads).concat(me.id) }}, (_1, _2) => {
					// dummy
				});

				// Publish stream message
				publishStream(`talk-group-stream:${(<any>message)._doc.group}`, JSON.stringify({
					type: 'read',
					value: message.id
				}));
				break;
			default:
				resolve();
				break;
		}
	});
}
