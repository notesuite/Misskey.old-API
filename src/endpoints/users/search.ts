import {User} from '../../models';
import {IUser} from '../../interfaces';
import serializeUser from '../../core/serialize-user';

/**
 * ユーザーを検索します
 * @param me API利用ユーザー
 * @param query クエリ
 * @param limit 取得数
 */
export default function search(me: IUser, query: string, limit: number = 5): Promise<Object[]> {
	'use strict';
	query = query.toLowerCase();
	let searchType: string = null;
	let dbQuery: any = null;
	if (/^@?[a-zA-Z0-9\-]+$/.exec(query)) {
		dbQuery = {
			screenNameLower: new RegExp(query.replace('@', ''))
		};
		searchType = 'screen-name';
	} else {
		dbQuery = {
			name: new RegExp(query, 'i')
		};
		searchType = 'name';
	}
	return new Promise<Object[]>((resolve, reject) => {
		User
		.find(dbQuery)
		.sort({
			followersCount: -1
		})
		.limit(limit)
		.exec((err: any, users: IUser[]) => {
			if (searchType === 'screen-name' && users.length < limit) {
				User.find({
					name: new RegExp(query, 'i'),
					_id: {$nin: users.map(user => user.id)}
				}).sort({
					followersCount: -1
				})
				.limit(limit - users.length)
				.exec((err2: any, users2: IUser[]) => {
					resolver([...users, ...users2]);
				});
			} else {
				resolver(users);
			}
		});

		function resolver(users: IUser[]): void {
			Promise.all(users.map(user => serializeUser(me, user)))
			.then(serializedUsers => {
				resolve(serializedUsers);
			}, (err: any) => {
				reject('something-happened');
			});
		}
	});
}
