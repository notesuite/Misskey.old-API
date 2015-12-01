import { List, Match } from 'powerful';
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
		const baseQuery = {
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

		const query = new Match<void, any>(null)
			.when(() => sinceCursor !== null, () => {
				return {$and: [
					baseQuery,
					{cursor: {$gt: sinceCursor}}
				]};
			})
			.when(() => maxCursor !== null, () => {
				return {$and: [
					baseQuery,
					{cursor: {$lt: maxCursor}}
				]};
			})
			.getValue(baseQuery);

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
