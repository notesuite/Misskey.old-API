import {Notification} from '../../models';
import {IUser, INotification} from '../../interfaces';
import serializeNotification from '../../core/serializeNotification';

/**
 * 通知を取得します
 * @param user API利用ユーザー
 * @param limit 取得する通知の最大数
 * @param sinceCursor 取得する通知を、設定されたカーソルよりも大きなカーソルを持つもののみに制限します
 * @param maxCursor 取得する通知を、設定されたカーソルよりも小さなカーソルを持つもののみに制限します
 */
export default function timeline(
	user: IUser,
	limit: number = 10,
	sinceCursor: number = null,
	maxCursor: number = null)
		: Promise<Object[]> {
	'use strict';

	return new Promise<Object[]>((resolve, reject) => {
		// タイムライン取得用のクエリを生成
		const query: any = ((): any => {
			if (sinceCursor === null && maxCursor === null) {
				return {user: user.id};
			} else if (sinceCursor !== null) {
				return {
					user: user.id,
					cursor: {$gt: sinceCursor}
				};
			} else if (maxCursor !== null) {
				return {
					user: user.id,
					cursor: {$lt: maxCursor}
				};
			}
		})();

		// クエリを発行してタイムラインを取得
		Notification
			.find(query)
			.sort('-createdAt')
			.limit(limit)
			.exec((err: any, notifications: INotification[]) => {
			if (err !== null) {
				return reject(err);
			}

			Promise.all(notifications.map(notification => {
				return serializeNotification(notification.toObject(), user);
			})).then(serializedNotifications => {
				resolve(serializedNotifications);
			});
		});
	});
}
