import { IApplication, IUser } from '../../interfaces';
import show from '../../endpoints/notifications/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	show(
		user,
		req.payload['notification-id']
	).then(notification => {
		res(notification);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
