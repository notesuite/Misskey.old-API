import { IApplication, IUser } from '../../../interfaces';
import rename from '../../../endpoints/album/folders/rename';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
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
