import {UserFollowing} from '../../models';
import {IUser, IUserFollowing} from '../../interfaces';

/**
 * 対象ユーザーのフォロワーの一覧を取得します。
 * @param user 対象ユーザー
 * @param limit 取得するユーザーの最大数
 * @param sinceCursor 取得するユーザーを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得するユーザーを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function followers(user: IUser, limit: number = 30, sinceCursor: number = null, maxCursor: number = null)
		: Promise<Object[]> {
	'use strict';
	return new Promise((resolve: (user: Object[]) => void, reject: (err: any) => void) => {
		const query: any = ((): any => {
			if (sinceCursor !== null) {
				return { followee: user.id, cursor: { $gt: sinceCursor } };
			} else if (maxCursor !== null) {
				return { followee: user.id, cursor: { $lt: maxCursor } };
			} else {
				return { followee: user.id };
			}
		})();
		UserFollowing
			.find(query)
			.sort('-createdAt')
			.limit(limit)
			.populate('follower')
			.exec((err: any, userFollowings: IUserFollowing[]) => {
				if (err === null) {
					const followers: any[] = (userFollowings.length > 0)
						? userFollowings.map((userFollowing) => (<IUser>userFollowing.follower).toObject())
						: [];
					resolve(followers);
				} else {
					reject(err);
				}
			});
	});
};
