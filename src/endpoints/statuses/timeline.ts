import {UserFollowing, IUserFollowing} from '../../models/userFollowing';
import {Status, IStatus} from '../../models/status';

export default function(userId: string, limit: number, sinceCursor?: number, maxCursor?: number)
		: Promise<IStatus[]> {
	'use strict';
	return new Promise((resolve: (statuses: IStatus[]) => void, reject: (err: any) => void) => {
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

				// クエリを生成
				const query: any = ((): any => {
					if (sinceCursor === null && maxCursor === null) {
						return {userId: {$in: followingIds}};
					} else if (sinceCursor) {
						return {$and: [{userId: {$in: followingIds}}, {cursor: {$gt: sinceCursor}}]};
					} else if (maxCursor) {
						return {$and: [{userId: {$in: followingIds}}, {cursor: {$lt: maxCursor}}]};
					}
				})();

				// クエリを発行
				Status.find(query).sort('-createdAt').limit(limit).exec((err: any, statuses: IStatus[]) => {
					if (err) {
						reject(err);
					} else {
						resolve(statuses);
					}
				});
			}
		});
	});
}
