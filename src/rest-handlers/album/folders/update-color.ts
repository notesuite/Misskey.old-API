import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import recolor from '../../../endpoints/album/folders/update-color';

export default function updateColor(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';

	recolor(
		user,
		req.payload['folder-id'],
		req.payload['color']
	).then((folder: Object) => {
		res(folder);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
