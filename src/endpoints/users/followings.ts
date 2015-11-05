import {User, UserFollowing} from '../../models';
import {IUser, IUserFollowing} from '../../interfaces';

/**
 * 対象ユーザーがフォローしているユーザーの一覧を取得します。
 * @user: 対象ユーザー
 * @limit: 取得するユーザーの最大数
 * @sinceCursor: 取得するユーザーを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @maxCursor: 取得するユーザーを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function(user: IUser, limit: number = 30, sinceCursor: number = null, maxCursor: number = null): Promise<Object[]> {
	'use strict';
	return new Promise((resolve: (user: Object[]) => void, reject: (err: any) => void) => {
		const query: any = ((): any => {
			if (sinceCursor !== null) {
				return { follower: user.id, cursor: { $gt: sinceCursor } };
			} else if (maxCursor !== null) {
				return { follower: user.id, cursor: { $lt: maxCursor } };
			} else {
				return { follower: user.id };
			}
		})();
		UserFollowing
			.find(query)
			.sort('-createdAt')
			.limit(limit)
			.populate('followee')
			.exec((err: any, userFollowings: IUserFollowing[]) => {
				if (err === null) {
					const followees: any[] = (userFollowings.length > 0)
						? userFollowings.map((userFollowing: IUserFollowing) => userFollowing.followee.toObject())
						: [];
					resolve(followees);
				} else {
					reject(err);
				}
			});
	});
};
