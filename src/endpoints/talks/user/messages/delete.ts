import {TalkUserMessage} from '../../../../models';
import {ITalkUserMessage, IUser} from '../../../../interfaces';
import publishStream from '../../../../core/publish-streaming-message';

/**
 * Talkのメッセージを削除します
 * @param user API利用ユーザー
 * @param messageId メッセージのID
 */
export default function(
	user: IUser,
	messageId: string
): Promise<void> {
	'use strict';

	if (messageId === '')  {
		return <Promise<any>>Promise.reject('empty-message-id');
	}

	return new Promise<void>((resolve, reject) => {
		// 対象のメッセージを取得
		TalkUserMessage.findOne({
			_id: messageId,
			type: 'user-message'
		}, (findErr: any, message: ITalkUserMessage) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (message === null) {
				return reject('message-not-found');
			} else if (message.user.toString() !== user.id.toString()) {
				return reject('message-not-found');
			} else if (message.isDeleted) {
				return reject('this-message-has-already-been-deleted');
			}

			message.isDeleted = true;
			message.save((saveErr: any) => {
				if (saveErr !== null) {
					return reject(saveErr);
				}

				resolve();

				// ストリームメッセージ発行
				publishStream(`talk-user-stream:${message.otherparty}-${user.id}`, JSON.stringify({
					type: 'otherparty-message-delete',
					value: message.id
				}));
				publishStream(`talk-user-stream:${user.id}-${message.otherparty}`, JSON.stringify({
					type: 'me-message-delete',
					value: message.id
				}));
			});
		});
	});
}
