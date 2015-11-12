import {User} from '../../models';
import {IUser} from '../../interfaces';
import lookupFollowState from '../../core/lookupFollowState';

/**
 * ユーザー情報を取得します
 * @me: API利用ユーザー
 * @id?: 対象ユーザーのID
 * @screenName?: 対象ユーザーのScreen name
 */
export default function(me: IUser, id?: string, screenName?: string): Promise<Object> {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		function resolver(user: IUser): void {
			if (user === null) {
				return reject('not-found');
			}
			const userObj: any = user.toObject();
			if (me !== null) {
				lookupFollowState(me.id, user.id).then((isFollowing: boolean) => {
					lookupFollowState(user.id, me.id).then((isFollowingMe: boolean) => {
						userObj.isFollowing = isFollowing;
						userObj.isFollowingMe = isFollowingMe;
						resolve(userObj);
					}, (err: any) => {
						reject(err);
					});
				}, (err: any) => {
					reject(err);
				});
			} else {
				resolve(userObj);
			}
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
