import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import followers from '../../endpoints/users/followers';

export default function userFollowers(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	followers(
		user,
		req.query['limit'],
		req.query['since-cursor'],
		req.query['max-cursor']
	).then((followerList: Object[]) => {
		res(followerList);
	}, (err: any) => {
		res(err).code(500);
	});
}
