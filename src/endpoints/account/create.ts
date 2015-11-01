// import Core from 'misskey-core';
import * as bcrypt from 'bcrypt';
import {User} from '../../models';
import {IUser} from '../../interfaces';

export default function(screenName: string, password: string): Promise<IUser> {
	'use strict';
	return new Promise((resolve: (user: IUser) => void, reject: (err: any) => void) => {
		if (screenName === undefined || screenName === null || screenName === '') {
			reject('empty-screen-name');
		} else if (!/^[a-zA-Z0-9\-]{1,20}$/.test(screenName)) {
			reject('invalid-screen-name');
		} else if (password === undefined || password === null || password === '') {
			reject('empty-password');
		} else {
			// Generate hash of password
			const salt: string = bcrypt.genSaltSync(14);
			const encryptedPassword: string = bcrypt.hashSync(password, salt);

			User.create({
				screenName: screenName,
				screenNameLower: screenName.toLowerCase(),
				name: 'no name',
				lang: 'ja',
				credit: 3000,
				encryptedPassword: encryptedPassword
			}, (err: any, createdUser: IUser) => {
				if (err) {
					reject(err);
				} else {
					resolve(createdUser);
				}
			});
		}
	});
}
