import {IApplication, IUser} from '../../../db/interfaces';
import move from '../../../endpoints/album/files/move';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';

	move(user, req.payload['file-id'], req.payload['folder-id']).then(file => {
		res(file);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
