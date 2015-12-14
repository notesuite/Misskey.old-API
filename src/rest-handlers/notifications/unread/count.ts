import { IApplication, IUser } from '../../../interfaces';
import notificationsUnreadCount from '../../../endpoints/notifications/unread/count';

export default function count(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	notificationsUnreadCount(
		user
	).then(count => {
		res(count);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
