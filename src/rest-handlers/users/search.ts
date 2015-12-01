import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import search from '../../endpoints/users/search';

export default function searchUsers(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	search(user, req.payload['query'], req.payload['limit']).then(users => {
		res(users);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
