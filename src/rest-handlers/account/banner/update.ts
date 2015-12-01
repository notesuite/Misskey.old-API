import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import update from '../../../endpoints/account/banner/update';

export default function updateIcon(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	update(user, req.payload['file-id']).then(me => {
		res(me);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
