import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import updateUrl from '../../endpoints/account/update-url';

export default function updateAccountUrl(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';

	updateUrl(
		user,
		req.payload['url']
	).then(saved => {
		res(saved);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
