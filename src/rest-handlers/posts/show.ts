import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import show from '../../endpoints/posts/show';

export default function showPost(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	show(user, req.query['post-id']).then(post => {
		res(post);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
