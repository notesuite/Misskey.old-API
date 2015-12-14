import { IApplication, IUser } from '../../interfaces';
import showMessage from '../../endpoints/talks/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	showMessage(
		user,
		req.payload['message-id']
	).then(message => {
		res(message);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
