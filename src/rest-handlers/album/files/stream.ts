import { IApplication, IUser } from '../../../interfaces';
import filesStream from '../../../endpoints/album/files/stream';

export default function stream(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';

	filesStream(
		user,
		req.payload['folder-id'],
		req.payload['limit'],
		req.payload['since-cursor'],
		req.payload['max-cursor']
	).then(files => {
		res(files);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
