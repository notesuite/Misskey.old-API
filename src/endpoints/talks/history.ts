import {TalkHistory} from '../../models';
import {ITalkMessage, IUser, ITalkHistory, IAlbumFile} from '../../interfaces';

/**
 * Talkの履歴を取得します
 * @param user API利用ユーザー
 * @param limit 取得する投稿の最大数
 */
export default function talksHistory(
	user: IUser,
	limit: number = 10
): Promise<Object[]> {
	'use strict';

	return new Promise<Object[]>((resolve, reject) => {
		TalkHistory
		.find({
			user: user.id
		})
		.sort('-updatedAt')
		.limit(limit)
		.populate('message.user message.otherparty message.file')
		.exec((err: any, histories: ITalkHistory[]) => {
			if (err !== null) {
				return reject(err);
			} else if (histories.length === 0) {
				return resolve([]);
			}

			// const messages: ITalkMessage[] = histories.map(history => <ITalkMessage>history.message);

			resolve(histories.map(history => {
				const serializedMessage: any = (<ITalkMessage>history.message).toObject();
				serializedMessage.user = (<IUser>(<ITalkMessage>history.message).user).toObject();
				serializedMessage.otherparty = (<IUser>(<ITalkMessage>history.message).otherparty).toObject();
				serializedMessage.file = (<IAlbumFile>(<ITalkMessage>history.message).file).toObject();
				return serializedMessage;
			}));
		});
	});
}
