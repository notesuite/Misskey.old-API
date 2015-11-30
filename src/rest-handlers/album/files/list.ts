import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import files from '../../../endpoints/album/files/list';

export default function list(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';

	files(user, req.query['folder-id'], req.query['include-folders']).then(files => {
		res(files);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
