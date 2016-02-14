import {IApplication, IUser} from '../../../db/interfaces';
import del from '../../../endpoints/album/tags/delete';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	del(
		user,
		req.payload['tag-id']
	).then(tag => {
		res(tag);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
