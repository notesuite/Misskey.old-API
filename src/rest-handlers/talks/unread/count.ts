import { IApplication, IUser } from '../../../interfaces';
import talksUnreadCount from '../../../endpoints/talks/unread/count';

export default function count(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
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
