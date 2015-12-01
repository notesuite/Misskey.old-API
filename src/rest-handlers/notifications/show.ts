import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import show from '../../endpoints/notifications/show';

export default function showPost(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
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
