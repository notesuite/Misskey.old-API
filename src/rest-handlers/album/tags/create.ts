import {IApplication, IUser} from '../../../db/interfaces';
import create from '../../../endpoints/album/tags/create';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	create(
		user,
		req.payload['name'],
		req.payload['color']
	).then(tag => {
		res(tag);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
