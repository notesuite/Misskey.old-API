import {IUser} from '../../interfaces';

/**
 * ユーザーのウェブサイトのURLを更新します
 * @user: API利用ユーザー
 * @url: 新しいURL
 */
export default function(user: IUser, url: string): Promise<Object> {
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
