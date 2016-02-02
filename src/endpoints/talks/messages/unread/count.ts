import {TalkUserMessage} from '../../../../db/db';
import {IUser} from '../../../../db/interfaces';

/**
 * 未読のトークメッセージの件数を取得します
 * @param user API利用ユーザー
 * @return 未読のトークメッセージの件数
 */
export default function(user: IUser): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		TalkUserMessage
		.find({
			recipient: user.id,
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
