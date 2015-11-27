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
	show(user, req.query['post-id']).then((post: Object) => {
		res(post);
	}, (err: any) => {
		res(err).code(500);
	});
}
