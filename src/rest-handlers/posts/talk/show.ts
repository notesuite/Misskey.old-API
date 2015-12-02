import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import talk from '../../../endpoints/posts/talk/show';

export default function show(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	talk(
		user,
		req.payload['post-id'],
		req.payload['limit']
	).then(posts => {
		res(posts);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
