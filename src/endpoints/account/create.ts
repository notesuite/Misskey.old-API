import * as bcrypt from 'bcrypt';
import {User} from '../../db/db';
import {IUser} from '../../db/interfaces';
import {isScreenName, isReservedScreenName} from '../../spec/user';

export default function(isOfficial: boolean, screenName: string, password: string): Promise<IUser> {
	return (!isOfficial) ?
		<Promise<any>>Promise.reject('access-denied')
	: (screenName === undefined || screenName === null || screenName === '') ?
		<Promise<any>>Promise.reject('empty-screen-name')
	: (!isScreenName(screenName) || isReservedScreenName(screenName)) ?
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
