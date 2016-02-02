import {User} from '../../db/db';
import {IUser} from '../../db/interfaces';
import serializeUser from '../../core/serialize-user';
import escapeRegexp from '../../core/escape-regexp';

/* tslint:disable:whitespace */

/**
 * ユーザーを検索します
 * @param me API利用ユーザー
 * @param query クエリ
 * @param limit 取得数
 * @return ユーザーオブジェクトの配列
 */
export default function(me: IUser, query: string, limit: number = 5): Promise<Object[]> {
	query = escapeRegexp(query.toLowerCase());

	limit = parseInt(<any>limit, 10);

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 30) {
		return <Promise<any>>Promise.reject('30 made');
	}

	const [searchType, dbQuery] = /^@?[a-zA-Z0-9\-]+$/.exec(query)
		? [<'screen-name'>'screen-name', {
			screenNameLower: new RegExp(query.replace('@', ''))
		}]
		: [<'name'>'name', {
			name: new RegExp(query, 'i')
		}];

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
