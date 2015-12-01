import { List } from 'powerful';
const isEmpty = List.isEmpty;
import {TalkMessage} from '../../models';
import {ITalkMessage, IUser} from '../../interfaces';
import serialize from '../../core/serialize-talk-message';
import readTalkMessage from '../../core/read-talk-message';

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
			} else if (isEmpty(messages)) {
				return resolve([]);
			}

			Promise.all(messages.map(message =>
				serialize(message, user)
			)).then(resolve, reject);

			// 既読にする
			messages.forEach(message => {
				if ((<IUser>message.user).id.toString() === otherpartyId) {
					readTalkMessage(user, message);
				}
			});
		});
	});
}
