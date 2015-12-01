import {IUser} from '../../interfaces';

/**
 * ユーザーの名前を更新します
 * @param user: API利用ユーザー
 * @param name: 新しい名前
 */
export default function updateName(user: IUser, name: string): Promise<Object> {
	'use strict';

	name = name.trim();

	if (name === '') {
		return <Promise<any>>Promise.reject('empty-name');
	}

	if (name.length > 20) {
		return <Promise<any>>Promise.reject('too-long-name');
	}

	return new Promise<Object>((resolve, reject) => {
		user.name = name;
		user.save((saveErr: any, afterUser: IUser) => {
			if (saveErr !== null) {
				return reject(saveErr);
			}
			resolve(afterUser.toObject());
		});
	});
}
