import {TalkMessage} from '../../../models';
import {ITalkMessage, ITalkUserMessage, ITalkGroupMessage, IUser} from '../../../interfaces';
import readTalkMessage from '../../../core/read-talk-message';

function isUserMessage(message: ITalkMessage): message is ITalkUserMessage {
	'use strict';
	return message.hasOwnProperty('recipient');
}

/**
 * メッセージを既読にします
 * @param user API利用ユーザー
 * @param messageId 対象のメッセージのID
 */
export default function(
	user: IUser,
	messageId: string
): Promise<void> {
	'use strict';

	return new Promise<void>((resolve, reject) => {
		// 対象のメッセージを取得
		TalkMessage.findById(messageId, (findErr: any, message: ITalkUserMessage | ITalkGroupMessage) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (message === null) {
				return reject('message-not-found');
			}
			if (isUserMessage(message)) {
				if (message.user.toString() === user.id.toString()) {
					return reject('access-denied');
				} else if (message.recipient.toString() !== user.id.toString()) {
					return reject('access-denied');
				} else if (message.isDeleted) {
					return reject('this-message-has-been-deleted');
				} else if (message.isRead) {
					return reject('this-message-has-already-been-read');
				}
			} else {
				return reject('not-implemented');
			}

			readTalkMessage(user, message).then(resolve, reject);
		});
	});
}
