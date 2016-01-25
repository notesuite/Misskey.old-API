import {IApplication, IUser} from '../../../db/interfaces';
import create from '../../../endpoints/talks/group/create';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	const name: string = req.payload['name'];
	create(
		app,
		user,
		name
	).then(group => {
		res(group);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
