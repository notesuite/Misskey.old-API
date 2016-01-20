import {User} from './models';
import {IUser} from './interfaces';
import config from './config';

export default function(req: any): Promise<{ app: any, user: any, isOfficial: boolean }> {
	'use strict';
	return new Promise<{ app: any, user: any, isOfficial: boolean }>((resolve, reject) => {
		if (req.headers['passkey'] === undefined || req.headers['passkey'] === null) {
			resolve({ app: null, user: null, isOfficial: false });
		} else if (req.headers['passkey'] !== config.apiPasskey) {
			reject();
		} else if (req.headers['user-id'] === null) {
			resolve({ app: null, user: null, isOfficial: true });
		} else {
			User.findById(req.headers['user-id'], (err: any, user: IUser) => {
				resolve({
					app: null,
					user: user,
					isOfficial: true
				});
			});
		}
	});
}
