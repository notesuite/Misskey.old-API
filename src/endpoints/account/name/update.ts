import {IUser} from '../../../db/interfaces';
import {isName} from '../../../spec/user';

/**
 * ユーザーの名前を更新します
 * @param user: API利用ユーザー
 * @param name: 新しい名前
 * @return ユーザーオブジェクト
 */
export default function(user: IUser, name: string): Promise<Object> {
	name = name.trim();

	if (!isName(name)) {
		return <Promise<any>>Promise.reject('invalid-name');
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
