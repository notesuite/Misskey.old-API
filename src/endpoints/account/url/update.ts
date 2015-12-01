import {IUser} from '../../../interfaces';

/**
 * ユーザーのウェブサイトのURLを更新します
 * @param user API利用ユーザー
 * @param url 新しいURL
 */
export default function update(user: IUser, url: string): Promise<Object> {
	'use strict';

	url = url.trim();

	if (url.length > 100) {
		return <Promise<any>>Promise.reject('too-long-url');
	}

	return new Promise<Object>((resolve, reject) => {
		user.url = url;
		user.save((saveErr: any, afterUser: IUser) => {
			if (saveErr !== null) {
				return reject(saveErr);
			}
			resolve(afterUser.toObject());
		});
	});
}
