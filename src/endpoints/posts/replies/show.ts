import {Match} from 'powerful';
import {Reply} from '../../../db/db';
import {IUser, IPost} from '../../../db/interfaces';
import serializePosts from '../../../core/serialize-posts';

/**
 * 投稿の返信を取得します
 * @param user API利用ユーザー
 * @param id 対象の投稿のID
 * @param limit 取得する投稿の最大数
 * @param sinceId 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxId 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return 投稿オブジェクトの配列
 */
export default function(
	user: IUser,
	id: string,
	limit: number = 10,
	sinceId: number = null,
	maxId: number = null
): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {
		const query = Object.assign({inReplyToPost: id}, new Match<void, any>(null)
			.when(() => sinceId !== null, () => { return {_id: {$gt: sinceId}}; })
			.when(() => maxId !== null, () => { return {_id: {$lt: maxId}}; })
			.getValue({})
		);

		Reply
		.find(query)
		.sort({createdAt: -1})
		.limit(limit)
		.exec((err: any, replies: IPost[]) => {
			if (err !== null) {
				return reject(err);
			} else if (replies.length === 0) {
				return resolve([]);
			}

			// Resolve promise
			serializePosts(replies, user).then(serializedTimeline => {
				resolve(serializedTimeline);
			}, (serializeErr: any) => {
				reject(serializeErr);
			});
		});
	});
}
