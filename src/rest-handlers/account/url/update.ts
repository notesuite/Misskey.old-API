import {IApplication, IUser} from '../../../interfaces';
import updateUrl from '../../../endpoints/account/url/update';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';

	updateUrl(
		user,
		req.payload['url']
	).then(saved => {
		res(saved);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
