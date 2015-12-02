import * as bcrypt from 'bcrypt';
import {User} from '../models';
import {IUser} from '../interfaces';

export default function login(screenName: string, password: string): Promise<Object> {
	'use strict';

	screenName = screenName.trim();

	if (screenName === '') {
		return <Promise<any>>Promise.reject('empty-screen-name');
	}

	return new Promise<Object>((resolve, reject) => {
		User.findOne({
			screenNameLower: screenName.toLowerCase()
		}, (findErr: any, user: IUser) => {
			if (findErr !== null) {
				return reject(findErr);
			} else if (user === null) {
				return reject('user-not-found');
			}

			bcrypt.compare(password, user.encryptedPassword, (compareErr, same) => {
				if (compareErr !== undefined && compareErr !== null) {
					return reject(compareErr);
				} else if (!same) {
					return reject('failed');
				}

				resolve(user.toObject());
			});
		});
	});
}
