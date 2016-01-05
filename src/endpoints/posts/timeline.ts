import { List, Match } from 'powerful';
const isEmpty = List.isEmpty;
import {Post, UserFollowing} from '../../models';
import {IUser, IUserFollowing, IPost} from '../../interfaces';
import serializePosts from '../../core/serialize-posts';
import populateAll from '../../core/post-populate-all';
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
	'use strict';

	return new Promise<Object[]>((resolve, reject) => {
		// 自分がフォローしているユーザーの関係を取得
		UserFollowing.find({follower: user.id}, (followingsFindErr: any, followings: IUserFollowing[]) => {
			if (followingsFindErr !== null) {
				return reject(followingsFindErr);
			}

			// 自分と自分がフォローしているユーザーのIDのリストを生成
			const followingIds = !isEmpty(followings)
				? [...followings.map(following => following.followee.toString()), user.id]
				: [user.id];

			// タイムライン取得用のクエリを生成
			const query = Object.assign({
				user: { $in: followingIds }
			}, new Match<void, any>(null)
				.when(() => sinceCursor !== null, () => {
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
			.sort('-createdAt')
			.limit(limit)
			.exec((err: any, timeline: IPost[]) => {
				if (err !== null) {
					return reject(err);
				} else if (isEmpty(timeline)) {
					return resolve([]);
				}

				// すべてpopulateする
				Promise.all(timeline.map(post => populateAll(post)))
				.then(populatedTimeline => {
					// 整形
					serializePosts(populatedTimeline, user).then(serializedTimeline => {
						resolve(serializedTimeline);
					}, (serializeErr: any) => {
						reject(serializeErr);
					});
				}, (populatedErr: any) => {
					reject(populatedErr);
				});

				// すべて既読にしておく
				timeline.forEach(post => {
					readPost(user, post);
				});
			});
		});
	});
}
