import {List} from 'powerful';
const isEmpty = List.isEmpty;
import {User, UserFollowing} from '../../db/db';
import {IUser, IUserFollowing} from '../../db/interfaces';
import serializeUser from '../../core/serialize-user';

/**
 * おすすめのユーザーを取得します
 * @param me API利用ユーザー
 * @return ユーザーオブジェクトの配列
 */
export default function(
	me: IUser,
	limit: number = 4
): Promise<Object[]> {
	return new Promise<Object[]>((resolve, reject) => {
		// 自分がフォローしているユーザーの関係を取得
		UserFollowing.find({
			follower: me.id
		}, (followingFindErr: any, following: IUserFollowing[]) => {
			if (followingFindErr !== null) {
				return reject(followingFindErr);
			}

			const ignoreIds = !isEmpty(following)
				? [...following.map(follow => follow.followee.toString()), me.id]
				: [me.id];

			User.find({
				_id: { $nin: ignoreIds }
			})
			.sort({
				followersCount: -1
			})
			.limit(limit)
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
