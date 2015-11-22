import {User} from '../../models';
import {IUser} from '../../interfaces';
import serializeUser from '../../core/serializeUser';

/**
 * ユーザーを検索します
 * @param me API利用ユーザー
 * @param screenName クエリ
 */
export default function(me: IUser, screenName: string): Promise<Object[]> {
	'use strict';
	const screenNameLower: string = screenName.toLowerCase();
	return new Promise<Object[]>((resolve, reject) => {
		User.find({
			screenNameLower: new RegExp(screenNameLower, 'i')
		}, (searchErr: any, users: IUser[]) => {
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
