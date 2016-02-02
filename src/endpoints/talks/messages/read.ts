import {TalkMessage, TalkGroup} from '../../../db/db';
import {IUser, ITalkGroup} from '../../../db/interfaces';
import readTalkMessage from '../../../core/read-talk-message';

/**
 * メッセージを既読にします
 * @param user API利用ユーザー
 * @param messageId 対象のメッセージのID
 */
export default function(
	user: IUser,
	messageId: string
): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		// 対象のメッセージを取得
		TalkMessage.findById(messageId, (findErr: any, message: any) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (message === null) {
				return reject('message-not-found');
			}
			switch (message.type) {
				case 'user-message':
					if (message._doc.user.toString() === user.id.toString()) {
						return reject('access-denied');
					} else if (message._doc.recipient.toString() !== user.id.toString()) {
						return reject('access-denied');
					} else if (message._doc.isDeleted) {
						return reject('this-message-has-been-deleted');
					} else if (message._doc.isRead) {
						return reject('this-message-has-already-been-read');
					}
					readTalkMessage(user, message).then(resolve, reject);
					break;
				case 'group-message':
					TalkGroup
					.findById(message._doc.group)
					.exec((groupFindErr: any, group: ITalkGroup) => {
						if (
							(<string[]>group.members)
							.map(member => member.toString())
							.indexOf(user.id.toString()) === -1
						) {
							return reject('access-denied');
						}
						readTalkMessage(user, message).then(resolve, reject);
					});
					break;
				default:
					break;
			}
		});
	});
}
