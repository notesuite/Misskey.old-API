import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import move from '../../../endpoints/album/files/move';

export default function moveFile(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';

	move(user, req.payload['file-id'], req.payload['folder-id']).then((file: Object) => {
		res(file);
	}, (err: any) => {
		res(err).code(500);
	});
}
