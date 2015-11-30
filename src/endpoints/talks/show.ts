import {TalkMessage} from '../../models';
import {ITalkMessage, IUser, IAlbumFile} from '../../interfaces';
import readTalkMessage from '../../core/read-talk-message';

/**
 * メッセージを取得します
 * @param user API利用ユーザー
 * @param messageId 対象のメッセージのID
 */
export default function read(
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
			} else if (message.otherparty.toString() !== user.id.toString()) {
				return reject('message-not-found');
			} else if (message.isDeleted) {
				return reject('this-message-has-been-deleted');
			}

			const serializedMessage: any = message.toObject();
			serializedMessage.user = (<IUser>message.user).toObject();
			serializedMessage.otherparty = (<IUser>message.otherparty).toObject();
			serializedMessage.file = (<IAlbumFile>message.file).toObject();

			resolve(serializedMessage);

			// 既読にする
			readTalkMessage(user, message);
		});
	});
}
