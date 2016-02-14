import {IApplication, IUser} from '../../../db/interfaces';
import rename from '../../../endpoints/album/tags/rename';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	rename(
		user,
		req.payload['tag-id'],
		req.payload['name']
	).then(tag => {
		res(tag);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
