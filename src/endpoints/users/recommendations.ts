import {User} from '../../models';
import {IUser} from '../../interfaces';
import serializeUser from '../../core/serializeUser';

/**
 * おすすめのユーザーを取得します(現在は未実装で、ただ最新のユーザーを取得します)
 * @param me API利用ユーザー
 */
export default function search(me: IUser): Promise<Object[]> {
	'use strict';
	return new Promise<Object[]>((resolve, reject) => {
		User.find({
			_id: { $not: me.id }
		})
		.sort('-createdAt')
		.limit(4)
		.exec((searchErr: any, users: IUser[]) => {
			if (searchErr !== null) {
				reject('something-happened');
			} else if (users.length === 0) {
				resolve(null);
			} else {
				Promise.all(users.map((user: IUser) => {
					return serializeUser(me, user);
				})).then((serializedUsers: Object[]) => {
					resolve(serializedUsers);
				}, (err: any) => {
					reject('something-happened');
				});
			}
		});
	});
}
