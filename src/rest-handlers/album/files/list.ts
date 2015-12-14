import { IApplication, IUser } from '../../../interfaces';
import files from '../../../endpoints/album/files/list';

export default function list(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';

	files(user, req.payload['folder-id']).then(files => {
		res(files);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
