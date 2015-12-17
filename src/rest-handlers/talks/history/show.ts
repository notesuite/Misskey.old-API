import { IApplication, IUser } from '../../../interfaces';
import show from '../../../endpoints/talks/history/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	show(
		user
	).then(messages => {
		res(messages);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
