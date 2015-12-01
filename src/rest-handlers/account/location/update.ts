import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import updateLocation from '../../../endpoints/account/location/update';

export default function updateAccountLocation(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';

	updateLocation(
		user,
		req.payload['location']
	).then(saved => {
		res(saved);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
