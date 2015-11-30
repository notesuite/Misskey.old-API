import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import del from '../../../endpoints/album/folders/delete';

export default function deleteFolder(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';

	del(
		user,
		req.payload['folder-id']
	).then(() => {
		res({
			status: 'success'
		});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
