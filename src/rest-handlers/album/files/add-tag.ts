import {IApplication, IUser} from '../../../db/interfaces';
import add from '../../../endpoints/album/files/add-tag';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	add(user, req.payload['file-id'], req.payload['tag-id']).then(file => {
		res(file);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
