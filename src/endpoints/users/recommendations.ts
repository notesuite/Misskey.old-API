import { List } from 'powerful';
const isEmpty = List.isEmpty;
import {User, UserFollowing} from '../../models';
import {IUser, IUserFollowing} from '../../interfaces';
import serializeUser from '../../core/serialize-user';

/**
 * おすすめのユーザーを取得します(現在は未実装で、ただ最新のユーザーを取得します)
 * @param me API利用ユーザー
 */
export default function search(me: IUser): Promise<Object[]> {
	'use strict';
	return new Promise<Object[]>((resolve, reject) => {
		// 自分がフォローしているユーザーの関係を取得
		UserFollowing.find({follower: me.id}, (followingsFindErr: any, followings: IUserFollowing[]) => {
			if (followingsFindErr !== null) {
				return reject(followingsFindErr);
			}

			const ignoreIds = !isEmpty(followings)
				? [...followings.map(following => following.followee.toString()), me.id]
				: [me.id];

			User.find({
				_id: { $nin: ignoreIds }
			})
			.sort('-createdAt')
			.limit(4)
			.exec((searchErr: any, users: IUser[]) => {
				if (searchErr !== null) {
					reject('something-happened');
				} else if (isEmpty(users)) {
					resolve([]);
				} else {
					Promise.all(users.map(user => serializeUser(me, user)))
					.then(serializedUsers => {
						resolve(serializedUsers);
					}, (err: any) => {
						reject('something-happened');
					});
				}
			});
		});
	});
}
