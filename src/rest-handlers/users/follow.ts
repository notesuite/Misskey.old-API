import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import follow from '../../endpoints/users/follow';

export default function followUser(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	if (req.payload['user-id'] === undefined || req.payload['user-id'] === null) {
		res('user-id-is-empty').code(400);
	} else {
		follow(user, req.payload['user-id']).then(() => {
			res({kyoppie: 'yuppie'});
		}, (err: any) => {
			res({error: err}).code(500);
		});
	}
};
