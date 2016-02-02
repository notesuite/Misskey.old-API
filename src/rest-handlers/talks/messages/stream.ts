import {IApplication, IUser} from '../../../db/interfaces';
import getStream from '../../../endpoints/talks/messages/stream';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	getStream(
		user,
		req.payload['limit'],
		req.payload['since-cursor'],
		req.payload['max-cursor'],
		req.payload['user-id'],
		req.payload['group-id']
	).then(stream => {
		res(stream);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
