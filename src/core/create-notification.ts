import { Notification } from '../models';
import { IApplication, IUser, INotification } from '../interfaces';
import publishStreamingMessage from './publishStreamingMessage';

export default function createNotification(
	app: IApplication,
	user: IUser,
	type: string,
	content: any
): Promise<INotification> {
	'use strict';

	return new Promise<INotification>((resolve, reject) => {
		Notification.create({
			app: app !== null ? app.id : null,
			user: user.id,
			type: type,
			content: content
		}, (createErr: any, createdNotification: INotification) => {
			if (createErr !== null) {
				reject(createErr);
			} else {
				resolve(createdNotification);
				publishStreamingMessage(`userStream:${user.id}`, JSON.stringify({
					type: 'notification',
					value: createdNotification.toObject()
				}));
			}
		});
	});
}
