import {IUser, ITalkMessage} from '../interfaces';
import publishStream from './publish-streaming-message';

/**
 * メッセージを既読にします
 * @param user ユーザー
 * @param message 対象のメッセージ
 */
export default function read(
	user: IUser,
	message: ITalkMessage
): Promise<void> {
	'use strict';

	return new Promise<void>((resolve, reject) => {
		message.isRead = true;
		message.save();

		// ストリームメッセージ発行
		publishStream(`talk-stream:${message.otherparty}-${user.id}`, JSON.stringify({
			type: 'read',
			value: message.id
		}));
	});
}
