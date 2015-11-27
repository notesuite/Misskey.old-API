import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import talk from '../../endpoints/posts/talk';

export default function talkPost(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	talk(
		user,
		req.query['post-id'],
		req.query['limit']
	).then((posts: Object[]) => {
		res(posts);
	}, (err: any) => {
		res(err).code(500);
	});
}
