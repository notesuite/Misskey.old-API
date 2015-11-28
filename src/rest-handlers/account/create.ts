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
		const statuscode: number = (() => {
			switch (err) {
				case 'empty-screen-name':
					return 400;
				case 'invalid-screen-name':
					return 400;
				case 'empty-password':
					return 400;
				default:
					return 500;
			}
		})();
		res({error: err}).code(statuscode);
	});
}
