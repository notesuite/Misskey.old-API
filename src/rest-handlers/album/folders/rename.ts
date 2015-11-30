import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import rename from '../../../endpoints/album/folders/rename';

export default function renameFolder(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';

	rename(
		user,
		req.payload['folder-id'],
		req.payload['name']
	).then(folder => {
		res(folder);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
