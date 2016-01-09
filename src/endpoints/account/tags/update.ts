import {IUser} from '../../../interfaces';

/**
 * ユーザータグを更新します
 * @param user API利用ユーザー
 * @param tags タグ
 * @return ユーザーオブジェクト
 */
export default function(user: IUser, tags: string): Promise<Object> {
	'use strict';

	tags = tags.trim();

	const tagEntities: string[] = tags.split(' ');

	if (tagEntities.length > 30) {
		return <Promise<any>>Promise.reject('too-many-tags');
	}

	return new Promise<Object>((resolve, reject) => {
		user.tags = tagEntities;
		user.save((saveErr: any, afterUser: IUser) => {
			if (saveErr !== null) {
				return reject(saveErr);
			}
			resolve(afterUser.toObject());
		});
	});
}
