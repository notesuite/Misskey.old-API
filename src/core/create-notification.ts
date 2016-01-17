import {Notification} from '../models';
import {IApplication, INotification} from '../interfaces';
import publishStreamingMessage from './publish-streaming-message';

export default function(
	app: IApplication,
	userId: string,
	type: string,
	content: any
): Promise<INotification> {
	'use strict';

	return new Promise<INotification>((resolve, reject) => {
		Notification.create({
			app: app !== null ? app.id : null,
			user: userId,
			type: type,
			content: content
		}, (createErr: any, createdNotification: INotification) => {
			if (createErr !== null) {
				reject(createErr);
			} else {
				resolve(createdNotification);
				publishStreamingMessage(`user-stream:${userId}`, JSON.stringify({
					type: 'notification',
					value: createdNotification.toObject()
				}));
			}
		});
	});
}
