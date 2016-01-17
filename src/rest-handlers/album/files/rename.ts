import {IApplication, IUser} from '../../../interfaces';
import rename from '../../../endpoints/album/files/rename';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';

	rename(user, req.payload['file-id'], req.payload['name']).then(file => {
		res(file);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
