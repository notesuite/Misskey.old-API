import {IUser, ITalkMessage} from '../interfaces';
import publishStream from './publish-streaming-message';

/**
 * メッセージを既読にします
 * @param user ユーザー
 * @param message 対象のメッセージ
 */
export default function(
	user: IUser,
	message: ITalkMessage
): Promise<void> {
	'use strict';

	const otherpartyId: string = typeof message.user === 'string'
		? message.user
		: (<any>message.user).id;

	return new Promise<void>((resolve, reject) => {
		message.isRead = true;
		message.save();

		// ストリームメッセージ発行
		publishStream(`talk-stream:${otherpartyId}-${user.id}`, JSON.stringify({
			type: 'read',
			value: message.id
		}));
	});
}
