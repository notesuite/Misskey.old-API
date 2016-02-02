import {Match} from 'powerful';
import {Notification} from '../../db/db';
import {IUser, INotification} from '../../db/interfaces';
import serializeNotification from '../../core/serialize-notification';

/**
 * 通知を取得します
 * @param user API利用ユーザー
 * @param limit 取得する通知の最大数
 * @param sinceCursor 取得する通知を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得する通知を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 * @return 通知オブジェクトの配列
 */
export default function(
	user: IUser,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null
): Promise<Object[]> {
	limit = parseInt(<any>limit, 10);

	if (limit < 1) {
		return <Promise<any>>Promise.reject('1 kara');
	} else if (limit > 30) {
		return <Promise<any>>Promise.reject('30 made');
	}

	return new Promise<Object[]>((resolve, reject) => {
		// タイムライン取得用のクエリを生成
		const query = new Match<void, any>(null)
			.when(() => sinceCursor !== null, () => {
				return {
					user: user.id,
					cursor: {$gt: sinceCursor}
				};
			})
			.when(() => maxCursor !== null, () => {
				return {
					user: user.id,
					cursor: {$lt: maxCursor}
				};
			})
			.getValue({user: user.id});

		// クエリを発行してタイムラインを取得
		Notification
		.find(query)
		.sort({createdAt: -1})
		.limit(limit)
		.exec((err: any, notifications: INotification[]) => {
			if (err !== null) {
				return reject(err);
			} else if (notifications.length === 0) {
				return resolve([]);
			}

			Promise.all(notifications.map(notification => serializeNotification(notification.toObject(), user)))
			.then(resolve);

			// 全て既読にする
			notifications.forEach(notification => {
				notification.isRead = true;
				notification.save();
			});
		});
	});
}
