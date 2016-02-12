import {IApplication, IUser} from '../../../db/interfaces';
import show from '../../../endpoints/album/folders/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	show(user, req.payload['folder-id']).then(folder => {
		res(folder);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
