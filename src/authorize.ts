import * as hapi from 'hapi';
import {User} from './models';
import {IUser} from './interfaces';
import config from './config';

export default function authorize(req: hapi.Request): Promise<any> {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		if (req.headers['passkey'] !== undefined && req.headers['passkey'] !== null) {
			if (req.headers['passkey'] === config.apiPasskey) {
				if (req.headers['user-id'] !== null) {
					User.findById(req.headers['user-id'], (err: any, user: IUser) => {
						resolve({
							app: null,
							user: user
						});
					});
				} else {
					resolve({
						app: null,
						user: null
					});
				}
			} else {
				reject();
			}
		} else {
			resolve({
				app: null,
				user: null
			});
		}
	});
}
