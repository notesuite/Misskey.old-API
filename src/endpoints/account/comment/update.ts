import {IUser} from '../../../db/interfaces';

/**
 * ユーザーのコメントを更新します
 * @param user: API利用ユーザー
 * @param comment: 新しいコメント
 * @return ユーザーオブジェクト
 */
export default function(user: IUser, comment: string): Promise<Object> {
	comment = comment.trim();

	if (comment.length > 50) {
		return <Promise<any>>Promise.reject('too-long-comment');
	}

	return new Promise<Object>((resolve, reject) => {
		user.comment = comment;
		user.save((saveErr: any, afterUser: IUser) => {
			if (saveErr !== null) {
				return reject(saveErr);
			}
			resolve(afterUser.toObject());
		});
	});
}
