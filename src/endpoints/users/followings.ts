import { List, Match } from 'powerful';
const isEmpty = List.isEmpty;
import {UserFollowing} from '../../models';
import {IUser, IUserFollowing} from '../../interfaces';

/**
 * 対象ユーザーがフォローしているユーザーの一覧を取得します。
 * @param user 対象ユーザー
 * @param limit 取得するユーザーの最大数
 * @param sinceCursor 取得するユーザーを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得するユーザーを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function(
	user: IUser,
	limit: number = 30,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	'use strict';
	return new Promise<Object[]>((resolve, reject) => {
		const query = Object.assign({
			follower: user.id
		}, new Match<void, any>(null)
			.when(() => sinceCursor !== null, () => {
				return { cursor: { $gt: sinceCursor } };
			})
			.when(() => maxCursor !== null, () => {
				return { cursor: { $lt: maxCursor } };
			})
			.getValue({})
		);
		UserFollowing
		.find(query)
		.sort('-createdAt')
		.limit(limit)
		.populate('followee')
		.exec((err: any, userFollowings: IUserFollowing[]) => {
			if (err === null) {
				const followees: any[] = !isEmpty(userFollowings)
					? userFollowings.map((userFollowing) => (<IUser>userFollowing.followee).toObject())
					: [];
				resolve(followees);
			} else {
				reject(err);
			}
		});
	});
};
