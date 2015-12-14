import { IApplication, IUser } from '../../../interfaces';
import update from '../../../endpoints/account/avatar/update';

export default function updateIcon(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	update(user, req.payload['file-id']).then(me => {
		res(me);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
