import {User, IUser} from '../../models/user';

export default function(id?: string, screenName?: string): Promise<IUser> {
	'use strict';
	return new Promise((resolve: (user: IUser) => void, reject: (err: any) => void) => {
		if (id) {
			User.findById(id, (err: any, user: IUser) => {
				if (err) {
					reject(err);
				} else {
					resolve(user);
				}
			});
		} else if (screenName) {
			User.findOne({screenNameLower: screenName.toLowerCase()}, (err: any, user: IUser) => {
				if (err) {
					reject(err);
				} else {
					resolve(user);
				}
			});
		} else {
			reject('empty-query');
		}
	});
}
