import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import followings from '../../endpoints/users/followings';

export default function userFollowings(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	followings(
		user,
		req.payload['limit'],
		req.payload['since-cursor'],
		req.payload['max-cursor']
	).then(followingList => {
		res(followingList);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
