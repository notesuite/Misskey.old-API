import {Notification} from '../../db/db';
import {IUser, INotification} from '../../db/interfaces';

/**
 * 通知を全て削除します
 * @param user API利用ユーザー
 * @return Promise<なし>
 */
export default function(user: IUser): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		Notification.find({
			user: user.id
		}, (findErr: any, notifications: INotification[]) => {
			Promise.all(notifications.map(notification => {
				return new Promise((resolve2, reject2) => {
					notification.remove(() => {
						resolve2();
					});
				});
			})).then(() => {
				resolve();
			});
		});
	});
}
