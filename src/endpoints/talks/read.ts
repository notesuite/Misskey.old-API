import {TalkMessage} from '../../models';
import {ITalkMessage, IUser} from '../../interfaces';
import publishStream from '../../core/publish-streaming-message';

/**
 * メッセージを既読にします
 * @param user API利用ユーザー
 * @param messageId 対象のメッセージのID
 */
export default function read(
	user: IUser,
	messageId: string
): Promise<void> {
	'use strict';

	return new Promise<void>((resolve, reject) => {
		// 対象のメッセージを取得
		TalkMessage.findById(messageId, (findErr: any, message: ITalkMessage) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (message === null) {
				return reject('message-not-found');
			} else if (message.otherparty.toString() !== user.id.toString()) {
				return reject('message-not-found');
			} else if (message.isDeleted) {
				return reject('this-message-has-been-deleted');
			} else if (message.isRead) {
				return reject('this-message-has-already-been-read');
			}

			message.isRead = true;
			message.save();

			// ストリームメッセージ発行
			publishStream(`talk-stream:${message.otherparty}-${user.id}`, JSON.stringify({
				type: 'read',
				value: message.id
			}));
		});
	});
}
