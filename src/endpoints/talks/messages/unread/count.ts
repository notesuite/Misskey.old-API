import {TalkMessage} from '../../../../models';
import {IUser} from '../../../../interfaces';

/**
 * 未読のトークメッセージの件数を取得します
 * @param user API利用ユーザー
 */
export default function count(user: IUser): Promise<number> {
	'use strict';

	return new Promise<number>((resolve, reject) => {
		TalkMessage
		.find({
			otherparty: user.id,
			isRead: false
		})
		.limit(999)
		.count((err: any, count: number) => {
			if (err !== null) {
				return reject(err);
			}
			resolve(count);
		});
	});
}
