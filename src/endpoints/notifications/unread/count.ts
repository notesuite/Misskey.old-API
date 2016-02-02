import {Notification} from '../../../db/db';
import {IUser} from '../../../db/interfaces';

/**
 * 未読の通知の件数を取得します
 * @param user API利用ユーザー
 * @return 未読の通知の件数
 */
export default function(user: IUser): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		Notification
		.find({
			user: user.id,
			isRead: false
		})
		.limit(100)
		.count((err: any, count: number) => {
			if (err !== null) {
				return reject(err);
			}
			resolve(count);
		});
	});
}
