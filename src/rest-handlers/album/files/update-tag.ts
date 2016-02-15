import {IApplication, IUser} from '../../../db/interfaces';
import update from '../../../endpoints/album/files/update-tag';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	update(user, req.payload['file-id'], req.payload['tags']).then(file => {
		res(file);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
