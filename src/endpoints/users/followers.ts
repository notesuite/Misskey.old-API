import { Match } from 'powerful';
import {UserFollowing} from '../../models';
import {IUser, IUserFollowing} from '../../interfaces';
import serializeUser from '../../core/serialize-user';

/**
 * 対象ユーザーのフォロワーの一覧を取得します。
 * @param user 対象ユーザー
 * @param limit 取得するユーザーの最大数
 * @param sinceCursor 取得するユーザーを、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得するユーザーを、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return ユーザーオブジェクトの配列
 */
export default function(
	user: IUser,
	limit: number = 30,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	'use strict';

	limit = parseInt(<any>limit, 10);

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 30) {
		return <Promise<any>>Promise.reject('30 made');
	}

	return new Promise<Object[]>((resolve, reject) => {
		const query = Object.assign({
			followee: user.id
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
		.populate('follower')
		.exec((err: any, userFollowing: IUserFollowing[]) => {
			if (err !== null) {
				return reject(err);
			}

			Promise.all(userFollowing.map(follow => {
				return serializeUser(user, <IUser>follow.follower);
			})).then((followers: any[]) => {
				for (let i = 0; i < followers.length; i++) {
					followers[i].cursor = userFollowing[i].cursor;
				}
				resolve(followers);
			});
		});
	});
};
