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
		req.payload['limit'],
		req.payload['since-cursor'],
		req.payload['max-cursor']
	).then(followerList => {
		res(followerList);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
