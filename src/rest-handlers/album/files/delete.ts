import {IApplication, IUser} from '../../../db/interfaces';
import del from '../../../endpoints/album/files/delete';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	del(user, req.payload['file-id']).then(file => {
		res({
			status: 'success'
		});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
