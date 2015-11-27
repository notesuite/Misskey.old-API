import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import getTimeline from '../../endpoints/posts/user-timeline';

export default function userTimeline(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	getTimeline(
		user,
		req.query['user-id'],
		req.query['limit'],
		req.query['since-cursor'],
		req.query['max-cursor'])
	.then((timeline: Object[]) => {
		res(timeline);
	}, (err: any) => {
		res(err).code(500);
	});
}
