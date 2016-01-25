import {IApplication, IUser} from '../../db/interfaces';
import create from '../../endpoints/posts/create';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	create(
		app,
		user,
		req.payload['text'],
		req.payload['files']
	).then(post => {
		res(post);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
