import {IApplication, IUser} from '../../../interfaces';
import updateLocation from '../../../endpoints/account/location/update';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
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
