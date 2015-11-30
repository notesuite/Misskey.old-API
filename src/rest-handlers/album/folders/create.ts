import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import create from '../../../endpoints/album/folders/create';

export default function createFolder(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';

	create(
		user,
		req.payload['parent-folder-id'],
		req.payload['name']
	).then((folder: Object) => {
		res(folder);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
