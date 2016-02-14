import {IApplication, IUser} from '../../../db/interfaces';
import remove from '../../../endpoints/album/files/remove-tag';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	remove(user, req.payload['file-id'], req.payload['tag-id']).then(file => {
		res(file);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
