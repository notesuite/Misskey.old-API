import {IApplication, IUser} from '../../../db/interfaces';
import show from '../../../endpoints/posts/mentions/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	show(
		user,
		req.payload['limit'],
		req.payload['since-cursor'],
		req.payload['max-cursor']
	).then(timeline => {
		res(timeline);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
