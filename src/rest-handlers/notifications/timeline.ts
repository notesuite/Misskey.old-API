import { IApplication, IUser } from '../../interfaces';
import getTimeline from '../../endpoints/notifications/timeline';

export default function timeline(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	getTimeline(
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
