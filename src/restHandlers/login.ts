// import * as express from 'express';
import { MisskeyExpressRequest } from '../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../misskeyExpressResponse';
import {User, IUser} from '../models/user';
import doLogin from '../endpoints/login';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
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
};
