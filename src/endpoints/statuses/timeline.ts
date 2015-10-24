import {UserFollowing, IUserFollowing} from '../../models/userFollowing';
import {Status, IStatus} from '../../models/status';

/**
 * ユーザーのStatusタイムラインを取得します
 * @userId: ユーザーID
 * @limit: 取得するStatusの最大数
 * @sinceCursor: 取得するStatusを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @maxCursor: 取得するStatusを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @includeUserEntity: Statusを作成したユーザーのUserオブジェクトを含めるかどうか
 */
export default function(userId: string, limit?: number, sinceCursor?: number, maxCursor?: number,
		includeUserEntity?: boolean)
		: Promise<Object[]> {
	'use strict';
	limit = limit ? limit : 10;
	includeUserEntity = includeUserEntity ? includeUserEntity : true;

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
						return {userId: {$in: followingIds}};
					} else if (sinceCursor) {
						return {$and: [{userId: {$in: followingIds}}, {cursor: {$gt: sinceCursor}}]};
					} else if (maxCursor) {
						return {$and: [{userId: {$in: followingIds}}, {cursor: {$lt: maxCursor}}]};
					}
				})();

				// クエリを発行してタイムラインを取得
				Status.find(query).sort('-createdAt').limit(limit).exec((err: any, statuses: IStatus[]) => {
					if (err) {
						reject(err);
					} else {
						resolve(statuses.map((status: IStatus): Object => {
							return status.toObject({
								userId,
								includeUserEntity,
								includeApplicationEntity: true,
								includeIsFavorited: true,
								includeIsReposted: true,
							});
						}));
					}
				});
			}
		});
	});
}
