import * as bcrypt from 'bcrypt';
import {User} from '../models';
import {IUser} from '../interfaces';

export default function login(screenName: string, password: string): Promise<boolean> {
	'use strict';

	return new Promise<boolean>((resolve, reject) => {
		if (screenName) {
			User.findOne({
				screenNameLower: screenName.toLowerCase()
			}, (findErr: any, user: IUser) => {
				if (findErr) {
					reject(findErr);
				} else if (user) {
					bcrypt.compare(password, user.encryptedPassword, (compareErr: Error, same: boolean) => {
						if (compareErr) {
							reject(compareErr);
						} else {
							resolve(same);
						}
					});
				} else {
					reject('user-not-found');
				}
			});
		} else {
			reject('empty-screen-name');
		}
	});
}
