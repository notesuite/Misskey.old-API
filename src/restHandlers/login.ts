// import * as express from 'express';
import { Request, Response } from '../misskey-express';
import {User} from '../models';
import {IUser} from '../interfaces';
import doLogin from '../endpoints/login';

export default function login(req: Request, res: Response): void {
	'use strict';
	const screenName: string = req.query['screen-name'];
	const password: string = req.query['password'];
	doLogin(screenName, password).then((same: boolean) => {
		if (same) {
			User.findOne({
				screenNameLower: screenName.toLowerCase()
			}, (findErr: any, user: IUser) => {
				if (findErr) {
					res.apiError(500, 'something happened');
				} else if (user === null) {
					res.apiError(500, 'something happened');
				} else {
					res.apiRender({
						same: true,
						user: user.toObject()
					});
				}
			});
		} else {
			res.apiRender({same: false});
		}
	}, (err: any) => {
		res.apiError(400, err);
	});
}
