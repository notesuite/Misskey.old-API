import {List, Match} from 'powerful';
const isEmpty = List.isEmpty;
import {Post, UserFollowing} from '../../db/db';
import {IUser, IUserFollowing, IPost} from '../../db/interfaces';
import serializePosts from '../../core/serialize-posts';
import readPost from '../../core/read-post';

/**
 * タイムラインを取得します
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
	} else if (limit > 100) {
		return <Promise<any>>Promise.reject('100 made');
	}

	return new Promise<Object[]>((resolve, reject) => {
		// 自分がフォローしているユーザーの関係を取得
		UserFollowing.find({follower: user.id}, (followingFindErr: any, following: IUserFollowing[]) => {
			if (followingFindErr !== null) {
				return reject(followingFindErr);
			}

			// 自分と自分がフォローしているユーザーのIDのリストを生成
			const followingIds = !isEmpty(following)
				? [...following.map(follow => follow.followee.toString()), user.id]
				: [user.id];

			// タイムライン取得用のクエリを生成
			let sort: any = {createdAt: -1};
			const query = Object.assign({
				user: { $in: followingIds }
			}, new Match<void, any>(null)
				.when(() => sinceCursor !== null, () => {
					sort = {createdAt: 1};
					return { cursor: { $gt: sinceCursor } };
				})
				.when(() => maxCursor !== null, () => {
					return { cursor: { $lt: maxCursor } };
				})
				.getValue({})
			);

			// クエリを発行してタイムラインを取得
			Post
			.find(query)
			.sort(sort)
			.limit(limit)
			.exec((err: any, timeline: IPost[]) => {
				if (err !== null) {
					return reject(err);
				} else if (isEmpty(timeline)) {
					return resolve([]);
				}

				// Resolve promise
				serializePosts(timeline, user).then(serializedTimeline => {
					resolve(serializedTimeline);
				}, (serializeErr: any) => {
					reject(serializeErr);
				});

				// すべて既読にしておく
				timeline.forEach(post => {
					readPost(user, post);
				});
			});
		});
	});
}
