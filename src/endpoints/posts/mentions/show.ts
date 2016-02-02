import {Match} from 'powerful';
import {PostMention} from '../../../db/db';
import {IUser, IPost, IPostMention} from '../../../db/interfaces';
import serializePosts from '../../../core/serialize-posts';

/**
 * メンションを取得します
 * @param user API利用ユーザー
 * @param limit 取得する投稿の最大数
 * @param sinceCursor 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return 投稿オブジェクトの配列
 */
export default function(
	user: IUser,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	limit = parseInt(<any>limit, 10);

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 30) {
		return <Promise<any>>Promise.reject('30 made');
	}

	const query = Object.assign({
		user: user.id
	}, new Match<void, any>(null)
		.when(() => sinceCursor !== null, () => {
			return { cursor: { $gt: sinceCursor } };
		})
		.when(() => maxCursor !== null, () => {
			return { cursor: { $lt: maxCursor } };
		})
		.getValue({})
	);

	return new Promise<Object[]>((resolve, reject) => {
		// メンションドキュメントを取得
		PostMention.find(query)
		.sort({createdAt: -1})
		.limit(limit)
		.populate('post')
		.exec((err: any, mentions: IPostMention[]) => {
			if (err !== null) {
				return reject(err);
			}

			const posts = mentions.map(mention => <IPost>mention.post);

			// Resolve promise
			serializePosts(posts, user).then(serializedTimeline => {
				resolve(serializedTimeline);
			}, (serializeErr: any) => {
				reject(serializeErr);
			});

			// 全て既読にする
			mentions.forEach(mention => {
				mention.isRead = true;
				mention.save();
			});
		});
	});
}
