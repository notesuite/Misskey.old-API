// import Core from 'misskey-core';
import * as bcrypt from 'bcrypt';
import {User} from '../../models';
import {IUser} from '../../interfaces';

export default function(screenName: string, password: string): Promise<IUser> {
	'use strict';

	return (screenName === undefined || screenName === null || screenName === '') ?
		<Promise<any>>Promise.reject('empty-screen-name')
	: (!/^[a-zA-Z0-9\-]{1,20}$/.test(screenName)) ?
		<Promise<any>>Promise.reject('invalid-screen-name')
	: (password === undefined || password === null || password === '') ?
		<Promise<any>>Promise.reject('empty-password')
	:
		(() => {
			// Generate hash of password
			const salt = bcrypt.genSaltSync(14);
			const encryptedPassword = bcrypt.hashSync(password, salt);

			return Promise.resolve(User.create({
				screenName: screenName,
				screenNameLower: screenName.toLowerCase(),
				name: 'no name',
				lang: 'ja',
				credit: 3000,
				encryptedPassword: encryptedPassword
			}));
		})();
}
