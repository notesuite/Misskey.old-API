import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import show from '../../../endpoints/album/files/show';

export default function showFile(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';

	show(user, req.payload['file-id']).then(file => {
		res(file);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
