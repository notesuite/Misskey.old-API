import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import show from '../../endpoints/users/show';

export default function showUser(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	show(
		user,
		req.query['user-id'],
		req.query['screen-name']
	).then((showee: Object) => {
		res(showee);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
