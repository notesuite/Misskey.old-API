import {IApplication, IUser} from '../../interfaces';
import search from '../../endpoints/users/search-by-screen-name';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	search(user, req.payload['screen-name']).then(users => {
		res(users);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
