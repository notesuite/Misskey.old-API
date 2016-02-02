import {TalkUserMessage, TalkGroupMessage} from '../db/db';
import {IUser, ITalkMessage} from '../db/interfaces';

/**
 * メッセージを既読にします
 * @param me ユーザー
 * @param message 対象のメッセージ
 */
export default function(
	me: IUser,
	message: ITalkMessage
): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		switch (message.type) {
			case 'user-message':
				if ((<any>message)._doc.user.toString() === me.id.toString()) {
					return reject('is-me');
				}

				TalkUserMessage.findByIdAndUpdate(message.id, { $set: { isRead: true }}, (_1, _2) => {
					// dummy
				});
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
				break;
			case 'group-send-invitation-activity':
			case 'group-member-join-activity':
				if ((<string[]>(<any>message)._doc.reads).indexOf(me.id.toString()) !== -1) {
					return reject('arleady-read');
				}

				TalkGroupMessage.findByIdAndUpdate(message.id, { $set: { reads: (<string[]>(<any>message)._doc.reads).concat(me.id) }}, (_1, _2) => {
					// dummy
				});
				break;
			default:
				resolve();
				break;
		}
	});
}
