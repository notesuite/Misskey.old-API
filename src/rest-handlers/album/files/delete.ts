import { IApplication, IUser } from '../../../interfaces';
import del from '../../../endpoints/album/files/delete';

export default function deleteFile(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';

	del(user, req.payload['file-id']).then(file => {
		res({
			status: 'success'
		});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
