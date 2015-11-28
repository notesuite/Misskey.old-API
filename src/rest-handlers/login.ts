import * as hapi from 'hapi';
import {User} from '../models';
import {IApplication, IUser} from '../interfaces';
import doLogin from '../endpoints/login';

export default function login(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	const screenName: string = req.query['screen-name'];
	const password: string = req.query['password'];
	doLogin(screenName, password).then((same: boolean) => {
		if (same) {
			User.findOne({
				screenNameLower: screenName.toLowerCase()
			}, (findErr: any, loginUser: IUser) => {
				if (findErr) {
					res('something happened').code(500);
				} else if (user === null) {
					res('something happened').code(500);
				} else {
					res({
						same: true,
						user: loginUser.toObject()
					});
				}
			});
		} else {
			res({same: false});
		}
	}, (err: any) => {
		res(err).code(400);
	});
}
