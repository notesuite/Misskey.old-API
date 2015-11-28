import {TalkMessage} from '../../models';
import {ITalkMessage, IUser, IAlbumFile} from '../../interfaces';

/**
 * Talkのストリームを取得します
 * @param user API利用ユーザー
 * @param otherpartyId 相手のユーザーのID
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得するメッセージを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得するメッセージを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function stream(
	user: IUser,
	otherpartyId: string,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	'use strict';

	if (otherpartyId === '')  {
		return <Promise<any>>Promise.reject('empty-otherparty-id');
	}

	return new Promise<Object[]>((resolve, reject) => {
		const baseQuery: any = {
			$or: [
				{
					user: user.id,
					otherparty: otherpartyId
				},
				{
					user: otherpartyId,
					otherparty: user.id
				},
			]
		};

		const query: any = ((): any => {
			if (sinceCursor === null && maxCursor === null) {
				return baseQuery;
			} else if (sinceCursor !== null) {
				return {
					baseQuery,
					cursor: {$gt: sinceCursor}
				};
			} else if (maxCursor !== null) {
				return {
					baseQuery,
					cursor: {$lt: maxCursor}
				};
			}
		})();

		TalkMessage
		.find(query)
		.sort('-createdAt')
		.limit(limit)
		.populate('user otherparty file')
		.exec((err: any, messages: ITalkMessage[]) => {
			if (err !== null) {
				return reject(err);
			} else if (messages.length === 0) {
				return resolve([]);
			}

			resolve(messages.map(message => {
				const serializedMessage: any = message.toObject();
				serializedMessage.user = (<IUser>message.user).toObject();
				serializedMessage.otherparty = (<IUser>message.otherparty).toObject();
				serializedMessage.file = (<IAlbumFile>message.file).toObject();
				return message;
			}));

			// 既読にする
			messages.forEach(message => {
				if (message.user.toString() === otherpartyId) {
					message.isRead = true;
					message.save();
				}
			});
		});
	});
}
