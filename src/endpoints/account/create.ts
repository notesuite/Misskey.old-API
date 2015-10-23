// import Core from 'misskey-core';
import * as bcrypt from 'bcrypt';
import {User, Users} from '../../models/user';

export default function(screenName: string, password: string): Promise<User> {
	'use strict';
	return new Promise((resolve: (user: User) => void, reject: (err: any) => void) => {
		if (screenName === undefined || screenName === null) {
			reject('empty-screen-name');
		} else if (!/^[a-zA-Z0-9\-]{1,20}$/.test(screenName)) {
			reject('invalid-screen-name');
		} else {
			const salt = bcrypt.genSaltSync(14);
			const hashedPassword = bcrypt.hashSync(password, salt);
			Users.create({
				screenName: screenName,
				screenNameLower: screenName.toLowerCase(),
				password: hashedPassword
			}, (err: any, createdUser: User) => {
				
			});
		}
	});
}
