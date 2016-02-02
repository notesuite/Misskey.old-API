import {IUser} from '../../../db/interfaces';

/**
 * ユーザーのLocationを更新します
 * @param user API利用ユーザー
 * @param location 新しいLocation
 * @return ユーザーオブジェクト
 */
export default function(user: IUser, location: string): Promise<Object> {
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
