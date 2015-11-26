// import * as express from 'express';
import { Request, Response } from '../../misskey-express';
import createAccount from '../../endpoints/account/create';
import {IUser} from '../../interfaces';

export default function create(req: Request, res: Response): void {
	'use strict';
	createAccount(req.body['screen-name'], req.body['password']).then((user: IUser) => {
		res.apiRender({
			user: user.toObject()
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
		res.apiError(statuscode, err);
	});
}
