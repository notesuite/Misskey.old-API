import { List, Match } from 'powerful';
const isEmpty = List.isEmpty;
import {TalkUserMessage} from '../../../models';
import {ITalkUserMessage, IUser} from '../../../interfaces';
import serialize from '../../../core/serialize-talk-message';
import readTalkUserMessage from '../../../core/read-talk-user-message';

/**
 * Talkのストリームを取得します
 * @param user API利用ユーザー
 * @param otherpartyId 相手のユーザーのID
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得するメッセージを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得するメッセージを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function(
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
		const query = Object.assign({
			type: 'user-message',
			$or: [{
				user: user.id,
				otherparty: otherpartyId
			}, {
				user: otherpartyId,
				otherparty: user.id
			}]
		}, new Match<void, any>(null)
			.when(() => sinceCursor !== null, () => {
				return { cursor: { $gt: sinceCursor } };
			})
			.when(() => maxCursor !== null, () => {
				return { cursor: { $lt: maxCursor } };
			})
			.getValue({})
		);

		TalkUserMessage
		.find(query)
		.sort('-createdAt')
		.limit(limit)
		.populate('user otherparty file')
		.exec((err: any, messages: ITalkUserMessage[]) => {
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
					readTalkUserMessage(user, message);
				}
			});
		});
	});
}
