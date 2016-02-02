import {IApplication, IUser} from '../../../db/interfaces';
import create from '../../../endpoints/album/folders/create';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	create(
		user,
		req.payload['parent-folder-id'],
		req.payload['name']
	).then(folder => {
		res(folder);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
