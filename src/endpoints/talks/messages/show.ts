import {TalkUserMessage} from '../../../models';
import {ITalkUserMessage, IUser} from '../../../interfaces';
import serialize from '../../../core/serialize-talk-message';
import readTalkUserMessage from '../../../core/read-talk-user-message';

/**
 * メッセージを取得します
 * @param user API利用ユーザー
 * @param messageId 対象のメッセージのID
 */
export default function(
	user: IUser,
	messageId: string
): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		// 対象のメッセージを取得
		TalkUserMessage
		.findOne({
			_id: messageId,
			type: 'user-message'
		})
		.populate('user otherparty file')
		.exec((findErr: any, message: ITalkUserMessage) => {
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
			if ((<IUser>message.otherparty).id.toString() === user.id.toString()) {
				readTalkUserMessage(user, message);
			}
		});
	});
}
