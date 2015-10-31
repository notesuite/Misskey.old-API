import {User, IUser} from '../models/user';
import {Post, IPost} from '../models/post';
import {UserFollowing, IUserFollowing} from '../models/userFollowing';
import serializeTimeline from '../core/serializeTimeline';

/**
 * タイムラインを取得します
 * @userId: ユーザーID
 * @limit: 取得する投稿の最大数
 * @sinceCursor: 取得する投稿を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @maxCursor: 取得する投稿を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @includeUserEntity: 投稿を作成したユーザーのUserオブジェクトを含めるかどうか
 */
export default function(userId: string, limit: number = 10, sinceCursor: number = null, maxCursor: number = null)
		: Promise<Object[]> {
	'use strict';

	return new Promise((resolve: (statuses: Object[]) => void, reject: (err: any) => void) => {
		// 自分がフォローしているユーザーの関係を取得
		UserFollowing.find({followerId: userId}, (followingsFindErr: any, followings: IUserFollowing[]) => {
			if (followingsFindErr) {
				reject(followingsFindErr);
			} else {
				// 自分と自分がフォローしているユーザーのIDのリストを生成
				const followingIds: string[] = (followings.length > 0)
					? followings.map((following: IUserFollowing) => {
						return following.followeeId.toString();
					}).concat([userId])
					: [userId];

				// タイムライン取得用のクエリを生成
				const query: any = ((): any => {
					if (sinceCursor === null && maxCursor === null) {
						return {user: {$in: followingIds}};
					} else if (sinceCursor !== null) {
						return {$and: [
							{user: {$in: followingIds}},
							{cursor: {$gt: sinceCursor}}
						]};
					} else if (maxCursor !== null) {
						return {$and: [
							{user: {$in: followingIds}},
							{cursor: {$lt: maxCursor}}
						]};
					}
				})();

				// クエリを発行してタイムラインを取得
				Post
					.find(query)
					.sort('-createdAt')
					.limit(limit)
					.populate('user')
					.exec((err: any, timeline: IPost[]) => {
					if (err !== null) {
						reject(err);
					} else {
						serializeTimeline(timeline).then((serializedTimeline: Object[]) => {
							resolve(serializedTimeline);
						}, (serializeErr: any) => {
							reject(serializeErr);
						});
					}
				});
			}
		});
	});
}
