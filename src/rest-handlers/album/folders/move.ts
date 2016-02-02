import {IApplication, IUser} from '../../../db/interfaces';
import move from '../../../endpoints/album/folders/move';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	move(
		user,
		req.payload['folder-id'],
		req.payload['destination-folder-id']
	).then(folder => {
		res(folder);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
