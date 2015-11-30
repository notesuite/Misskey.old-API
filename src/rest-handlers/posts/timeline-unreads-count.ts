import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import timelineUnreadsCount from '../../endpoints/posts/timeline-unreads-count';

export default function unreadsCount(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	timelineUnreadsCount(
		user
	).then(count => {
		res(count);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
