import {IUser} from '../../interfaces';

/**
 * ユーザーのウェブサイトのURLを更新します
 * @param user API利用ユーザー
 * @param url 新しいURL
 */
export default function updateUrl(user: IUser, url: string): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		user.websiteUrl = url;
		user.save((saveErr: any, afterUser: IUser) => {
			if (saveErr !== null) {
				return reject(saveErr);
			}
			resolve(afterUser.toObject());
		});
	});
}
