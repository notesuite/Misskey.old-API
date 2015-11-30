import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import readMessage from '../../endpoints/talks/read';

export default function talksRead(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	readMessage(
		user,
		req.payload['message-id']
	).then(() => {
		res({status: 'success'});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
