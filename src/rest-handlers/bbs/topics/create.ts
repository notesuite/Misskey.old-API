import {IApplication, IUser} from '../../../interfaces';
import create from '../../../endpoints/bbs/topics/create';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	const title: string = req.payload['title'];
	create(
		app,
		user,
		title
	).then(topic => {
		res(topic);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
