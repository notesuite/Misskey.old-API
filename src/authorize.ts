import {User} from './models';
import {IUser} from './interfaces';
import config from './config';

export default function(req: any): Promise<any> {
	'use strict';
	return new Promise<any>((resolve, reject) => {
		if (req.headers['passkey'] === undefined || req.headers['passkey'] === null) {
			resolve({ app: null, user: null });
		} else if (req.headers['passkey'] !== config.apiPasskey) {
			reject();
		} else if (req.headers['user-id'] === null) {
			resolve({ app: null, user: null });
		} else {
			User.findById(req.headers['user-id'], (err: any, user: IUser) => {
				resolve({
					app: null,
					user: user
				});
			});
		}
	});
}
