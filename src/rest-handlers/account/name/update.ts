import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import updateName from '../../../endpoints/account/name/update';

export default function updateAccountName(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';

	updateName(
		user,
		req.payload['name']
	).then(saved => {
		res(saved);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
