import {IApplication, IUser} from '../../db/interfaces';
import search from '../../endpoints/posts/search';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	search(
		user,
		req.payload['query'],
		req.payload['limit'],
		req.payload['since-cursor'],
		req.payload['max-cursor']
	).then(posts => {
		res(posts);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
