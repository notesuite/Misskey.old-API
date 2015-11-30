import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import mentions from '../../endpoints/posts/mentions';

export default function timeline(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	mentions(
		user,
		req.query['limit'],
		req.query['since-cursor'],
		req.query['max-cursor']
	).then(timeline => {
		res(timeline);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
