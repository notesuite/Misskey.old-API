import {User} from '../../models';
import {IUser} from '../../interfaces';

/**
 * ユーザーの名前を更新します
 * @user: API利用ユーザー
 * @name: 新しい名前
 */
export default function(user: IUser, name: string): Promise<IUser> {
	'use strict';
	
	name = name.trim();
	
	if (name === "") {
		return <Promise<any>>Promise.reject('empty-name');
	}
	
	if (name.length > 30) {
		return <Promise<any>>Promise.reject('too-long-name');
	}
	
	return new Promise<Object>((resolve,reject) => {
		user.name = name;
		user.save((saveErr: any, afterUser: IUser) => {
			if (saveErr !== null) {
				return reject(saveErr);
			}
			resolve(afterUser.toObject());
		});
	});
}
