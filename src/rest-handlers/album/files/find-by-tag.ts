import {IApplication, IUser} from '../../../db/interfaces';
import find from '../../../endpoints/album/files/find-by-tag';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	find(
		user,
		req.payload['tag-id'],
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
