import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import showMessage from '../../endpoints/talks/show';

export default function talksRead(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	showMessage(
		user,
		req.query['message-id']
	).then(message => {
		res(message);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
