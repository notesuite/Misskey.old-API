import {IApplication, IUser} from '../../db/interfaces';
import reply from '../../endpoints/posts/reply';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	reply(
		app,
		user,
		req.payload['in-reply-to-post-id'],
		req.payload['text'],
		req.payload['files']
	).then(post => {
		res(post);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
