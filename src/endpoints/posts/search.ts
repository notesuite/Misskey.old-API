import {Match} from 'powerful';
import {Post} from '../../db/db';
import {IUser, IPost} from '../../db/interfaces';
import serializePosts from '../../core/serialize-posts';
import escapeRegexp from '../../core/escape-regexp';

/**
 * 投稿を検索します
 * @param user API利用ユーザー
 * @param q クエリ
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return 投稿オブジェクトの配列
 */
export default function(
	user: IUser,
	q: string,
	limit: number = 20,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object> {
	limit = parseInt(<any>limit, 10);

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 100) {
		return <Promise<any>>Promise.reject('100 made');
	}

	const query = Object.assign({
		text: new RegExp(escapeRegexp(q), 'i')
	}, new Match<void, any>(null)
		.when(() => sinceCursor !== null, () => {
			return { cursor: { $gt: sinceCursor } };
		})
		.when(() => maxCursor !== null, () => {
			return { cursor: { $lt: maxCursor } };
		})
		.getValue({})
	);

	return new Promise<Object>((resolve, reject) => {
		Post.find(query)
		.sort({createdAt: -1})
		.limit(limit)
		.exec((searchErr: any, posts: IPost[]) => {
			if (searchErr !== null) {
				return reject(searchErr);
			} else if (posts === null) {
				return resolve([]);
			}

			// Resolve promise
			serializePosts(posts, user).then(serializedPosts => {
				resolve(serializedPosts);
			}, (serializeErr: any) => {
				reject(serializeErr);
			});
		});
	});
}
