import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import talksUnreadCount from '../../../endpoints/talks/unread/count';

export default function count(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	talksUnreadCount(
		user
	).then(count => {
		res(count);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
