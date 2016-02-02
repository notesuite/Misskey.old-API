import {IApplication, IUser} from '../../../db/interfaces';
import del from '../../../endpoints/album/folders/delete';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	del(
		user,
		req.payload['folder-id']
	).then(() => {
		res({
			status: 'success'
		});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
