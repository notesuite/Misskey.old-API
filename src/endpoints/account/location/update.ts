import {IUser} from '../../../interfaces';

/**
 * ユーザーのLocationを更新します
 * @param user API利用ユーザー
 * @param location 新しいLocation
 */
export default function update(user: IUser, location: string): Promise<Object> {
	'use strict';

	location = location.trim();

	if (location.length > 50) {
		return <Promise<any>>Promise.reject('too-long-location');
	}

	return new Promise<Object>((resolve, reject) => {
		user.location = location;
		user.save((saveErr: any, afterUser: IUser) => {
			if (saveErr !== null) {
				return reject(saveErr);
			}
			resolve(afterUser.toObject());
		});
	});
}