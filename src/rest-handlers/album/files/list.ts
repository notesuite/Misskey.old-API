import {IApplication, IUser} from '../../../db/interfaces';
import files from '../../../endpoints/album/files/list';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	files(
		user,
		req.payload['folder-id'],
		req.payload['limit'],
		req.payload['since-id'],
		req.payload['max-id']
	).then(files => {
		res(files);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
