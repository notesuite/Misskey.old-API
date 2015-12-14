import { IApplication, IUser } from '../../interfaces';
import mentions from '../../endpoints/posts/mentions';

export default function timeline(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	mentions(
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
