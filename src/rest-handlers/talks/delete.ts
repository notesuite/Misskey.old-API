import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import deleteMessage from '../../endpoints/talks/delete';

export default function talksDelete(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	deleteMessage(
		user,
		req.payload['message-id']
	).then(() => {
		res({status: 'success'});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
