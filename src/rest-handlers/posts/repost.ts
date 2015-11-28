import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import create from '../../endpoints/posts/repost';

export default function repost(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	create(
		app,
		user,
		req.body['post-id']
	).then((repost: Object) => {
		res(repost);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
