import { Match } from 'powerful';
import * as hapi from 'hapi';
import createAccount from '../../endpoints/account/create';
import { IApplication, IUser } from '../../interfaces';

export default function create(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	createAccount(
		req.payload['screen-name'],
		req.payload['password']
	).then((created: IUser) => {
		res({
			user: created.toObject()
		});
	}, (err: any) => {
		const statusCode = new Match<string, number>(err)
			.is('empty-screen-name', () => 400)
			.is('invalid-screen-name', () => 400)
			.is('empty-password', () => 400)
			.toOption().getValue(500);

		res({error: err}).code(statusCode);
	});
}
