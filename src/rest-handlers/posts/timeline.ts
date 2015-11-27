import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import getTimeline from '../../endpoints/posts/timeline';

export default function timeline(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	getTimeline(
		user,
		req.query['limit'],
		req.query['since-cursor'],
		req.query['max-cursor']
	).then((timeline: Object[]) => {
		res(timeline);
	}, (err: any) => {
		res(err).code(500);
	});
}
