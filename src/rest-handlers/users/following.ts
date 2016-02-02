import {IApplication, IUser} from '../../db/interfaces';
import following from '../../endpoints/users/following';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	following(
		user,
		req.payload['user-id'],
		req.payload['limit'],
		req.payload['since-cursor'],
		req.payload['max-cursor']
	).then(following => {
		res(following);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
