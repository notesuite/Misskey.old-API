import {IApplication, IUser} from '../../interfaces';
import search from '../../endpoints/hashtags/search';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	search(req.payload['name']).then(hashtags => {
		res(hashtags);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
