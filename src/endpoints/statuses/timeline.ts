import {UserFollowing, IUserFollowing} from '../../models/userFollowing';
import {ITimelineItem} from '../../models/timelineItem';
import getTimeline from '../../core/getTimeline';
import serializeTimeline from '../../core/serializeTimeline';

/**
 * ユーザーのStatusタイムラインを取得します
 * @userId: ユーザーID
 * @limit: 取得するStatusの最大数
 * @sinceCursor: 取得するStatusを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @maxCursor: 取得するStatusを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @includeUserEntity: Statusを作成したユーザーのUserオブジェクトを含めるかどうか
 */
export default function(userId: string, limit?: number, sinceCursor?: number, maxCursor?: number, includeUserEntity?: boolean)
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

				getTimeline(followingIds, ['status', 'status-repost'], limit, sinceCursor, maxCursor)
						.then((timeline: ITimelineItem[]) => {
					if (timeline === null || timeline.length === 0) {
						resolve(null);
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
