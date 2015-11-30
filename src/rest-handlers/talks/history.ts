import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import getHistory from '../../endpoints/talks/history';

export default function history(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	getHistory(
		user
	).then(messages => {
		res(messages);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
