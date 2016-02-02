import {TalkMessage, TalkGroup} from '../../../db/db';
import {ITalkMessage, ITalkUserMessage, ITalkGroupMessage, ITalkGroup, IUser} from '../../../db/interfaces';
import serialize from '../../../core/serialize-talk-message';
import readTalkMessage from '../../../core/read-talk-message';

/**
 * メッセージを取得します
 * @param user API利用ユーザー
 * @param messageId 対象のメッセージのID
 * @return 取得したメッセージ
 */
export default function(
	user: IUser,
	messageId: string
): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		// 対象のメッセージを取得
		TalkMessage
		.findById(messageId)
		.exec((findErr: any, message: ITalkMessage) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (message === null) {
				return reject('message-not-found');
			}
			switch (message.type) {
				case 'user-message':
					if (
						(<any>message)._doc.recipient.toString() !== user.id.toString() &&
						(<any>message)._doc.user.toString() !== user.id.toString()
					) {
						return reject('access-denied');
					} else if ((<ITalkUserMessage>message).isDeleted) {
						return reject('this-message-has-been-deleted');
					}
					show();
					break;
				case 'group-message':
					TalkGroup
					.findById(<string>(<any>message)._doc.group)
					.exec((groupFindErr: any, group: ITalkGroup) => {
						if (
							(<string[]>group.members)
							.map(member => member.toString())
							.indexOf(user.id.toString()) === -1
						) {
							return reject('access-denied');
						} else if ((<ITalkGroupMessage>message).isDeleted) {
							return reject('this-message-has-been-deleted');
						}
						show();
					});
					break;
				case 'group-send-invitation-activity':
				case 'group-member-join-activity':
				case 'group-member-left-activity':
				case 'rename-group-activity':
				case 'transfer-group-ownership-activity':
					TalkGroup
					.findById(<string>(<any>message)._doc.group)
					.exec((groupFindErr: any, group: ITalkGroup) => {
						if (
							(<string[]>group.members)
							.map(member => member.toString())
							.indexOf(user.id.toString()) === -1
						) {
							return reject('access-denied');
						}
						show();
					});
					break;
				default:
					break;
			}

			function show(): void {
				serialize(message, user).then(resolve, reject);

				// 既読にする
				readTalkMessage(user, message);
			}
		});
	});
}
