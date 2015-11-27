import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import notificationsUnreadsCount from '../../endpoints/notifications/unreads-count';

export default function unreadsCount(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	notificationsUnreadsCount(
		user
	).then((count: number) => {
		res(count);
	}, (err: any) => {
		res(err).code(500);
	});
}
