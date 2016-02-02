import {Match} from 'powerful';
import {Repost} from '../../../db/db';
import {IUser, IRepost} from '../../../db/interfaces';
import serializePosts from '../../../core/serialize-posts';

/**
 * 投稿のRepostを取得します
 * @param user API利用ユーザー
 * @param postId 対象の投稿のID
 * @param limit 取得するRepostの最大数
 * @param sinceCursor 取得するRepostを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得するRepostを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return 投稿オブジェクトの配列
 */
export default function(
	user: IUser,
	postId: string,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {

		const query = Object.assign({
			post: postId
		}, new Match<void, any>(null)
			.when(() => sinceCursor !== null, () => {
				return { cursor: { $gt: sinceCursor } };
			})
			.when(() => maxCursor !== null, () => {
				return { cursor: { $lt: maxCursor } };
			})
			.getValue({})
		);

		Repost
		.find(query)
		.sort({createdAt: -1})
		.limit(limit)
		.exec((err: any, reposts: IRepost[]) => {
			if (err !== null) {
				return reject(err);
			} else if (reposts.length === 0) {
				return resolve([]);
			}

			// Resolve promise
			serializePosts(reposts, user).then(serializedReposts => {
				resolve(serializedReposts);
			}, (serializeErr: any) => {
				reject(serializeErr);
			});
		});
	});
}
