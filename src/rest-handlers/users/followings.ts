import { IApplication, IUser } from '../../interfaces';
import followings from '../../endpoints/users/followings';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
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
