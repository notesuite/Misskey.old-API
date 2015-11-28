import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import update from '../../endpoints/account/update-avatar';

export default function updateIcon(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	update(user, req.payload['file-id']).then((me: Object) => {
		res(me);
	}, (err: any) => {
		res(err).code(500);
	});
};
