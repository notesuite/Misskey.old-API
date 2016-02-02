import {List} from 'powerful';
const isEmpty = List.isEmpty;
import {User} from '../../db/db';
import {IUser} from '../../db/interfaces';
import serializeUser from '../../core/serialize-user';
import escapeRegexp from '../../core/escape-regexp';

/**
 * ユーザーをScreen nameで検索します
 * @param me API利用ユーザー
 * @param screenName クエリ
 * @return ユーザーオブジェクトの配列
 */
export default function(me: IUser, screenName: string): Promise<Object[]> {
	const screenNameLower = escapeRegexp(screenName.toLowerCase());

	return new Promise<Object[]>((resolve, reject) => {
		User.find({
			screenNameLower: new RegExp(screenNameLower)
		})
		.sort({
			followersCount: -1
		})
		.limit(30)
		.exec((searchErr: any, users: IUser[]) => {
			if (searchErr !== null) {
				return reject('something-happened');
			} else if (isEmpty(users)) {
				return resolve([]);
			}
			Promise.all(users.map(user => serializeUser(me, user)))
			.then(serializedUsers => {
				resolve(serializedUsers);
			}, (err: any) => {
				reject('something-happened');
			});
		});
	});
}
