import {TalkMessage} from '../../models';
import {ITalkMessage, IUser} from '../../interfaces';
import serialize from '../../core/serialize-talk-message';
import readTalkMessage from '../../core/read-talk-message';

/**
 * メッセージを取得します
 * @param user API利用ユーザー
 * @param messageId 対象のメッセージのID
 */
export default function show(
	user: IUser,
	messageId: string
): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		// 対象のメッセージを取得
		TalkMessage
		.findById(messageId)
		.populate('user otherparty file')
		.exec((findErr: any, message: ITalkMessage) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (message === null) {
				return reject('message-not-found');
			} else if (
				(<IUser>message.otherparty).id.toString() !== user.id.toString() &&
				(<IUser>message.user).id.toString() !== user.id.toString()
			) {
				return reject('access-denied');
			} else if (message.isDeleted) {
				return reject('this-message-has-been-deleted');
			}

			serialize(message, user).then(resolve, reject);

			// 既読にする
			readTalkMessage(user, message);
		});
	});
}
