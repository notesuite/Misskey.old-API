import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import getStream from '../../endpoints/talks/stream';

export default function timeline(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	getStream(
		user,
		req.query['otherparty-id'],
		req.query['limit'],
		req.query['since-cursor'],
		req.query['max-cursor']
	).then((stream: Object[]) => {
		res(stream);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
