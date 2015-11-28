import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import getPhotoStatuses from '../../endpoints/posts/get-photo-statuses';

export default function getPostPhotoStatuses(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	getPhotoStatuses(
		user,
		req.query['user-id'],
		req.query['limit'],
		req.query['since-cursor'],
		req.query['max-cursor'])
	.then((timeline: Object[]) => {
		res(timeline);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
