import {User} from '../../models';
import {IUser} from '../../interfaces';
import serializeUser from '../../core/serialize-user';

/**
 * ユーザー情報を取得します
 * @param me API利用ユーザー
 * @param id 対象ユーザーのID
 * @param screenName 対象ユーザーのScreen name
 */
export default function show(me: IUser, id?: string, screenName?: string): Promise<Object> {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		function resolver(user: IUser): void {
			if (user === null) {
				return reject('not-found');
			}
			serializeUser(me, user).then(serializedUser => {
				resolve(serializedUser);
			}, (err: any) => {
				reject('something-happened');
			});
		}

		if (id !== undefined && id !== null) {
			User.findById(id, (err: any, user: IUser) => {
				if (err !== null) {
					reject(err);
				} else {
					resolver(user);
				}
			});
		} else if (screenName !== undefined && screenName !== null) {
			User.findOne({screenNameLower: screenName.toLowerCase()}, (err: any, user: IUser) => {
				if (err !== null) {
					reject(err);
				} else {
					resolver(user);
				}
			});
		} else {
			reject('empty-query');
		}
	});
}
