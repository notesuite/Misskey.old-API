import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import mentionsUnreadsCount from '../../endpoints/posts/mentions-unreads-count';

export default function unreadsCount(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	mentionsUnreadsCount(
		user
	).then(count => {
		res(count);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
