import {IApplication, IUser} from '../../db/interfaces';
import followers from '../../endpoints/users/followers';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	followers(
		user,
		req.payload['user-id'],
		req.payload['limit'],
		req.payload['since-cursor'],
		req.payload['max-cursor']
	).then(followers => {
		res(followers);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
