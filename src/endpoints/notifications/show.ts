import {Notification} from '../../db/db';
import {IUser, INotification} from '../../db/interfaces';
import serializeNotification from '../../core/serialize-notification';

export default function(shower: IUser, id: string): Promise<Object> {
	return new Promise<Object>((resolve, reject) => {
		Notification.findById(id, (findErr: any, notification: INotification) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (notification === null) {
				return reject('not-found');
			} else if (notification.user.toString() !== shower.id.toString()) {
				return reject('not-found');
			}
			serializeNotification(notification.toObject(), shower).then((serialized: any) => {
				resolve(serialized);
			}, (err: any) => {
				reject(err);
			});
		});
	});
}
