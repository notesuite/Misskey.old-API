import { IApplication, IUser } from '../../interfaces';
import create from '../../endpoints/posts/status';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	const text: string = req.payload['text'];
	if (text === undefined) {
		res('text is required').code(400);
		return;
	}
	create(
		app,
		user,
		text,
		req.payload['in-reply-to-post-id']
	).then(status => {
		res(status);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
