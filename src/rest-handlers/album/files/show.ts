import {IApplication, IUser} from '../../../db/interfaces';
import show from '../../../endpoints/album/files/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	show(user, req.payload['file-id']).then(file => {
		res(file);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
