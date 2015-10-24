import {User, IUser} from '../../models/user';

export default function(id?: string, screenName?: string): Promise<Object> {
	'use strict';
	return new Promise((resolve: (user: Object) => void, reject: (err: any) => void) => {
		if (id !== undefined && id !== null) {
			User.findById(id, (err: any, user: IUser) => {
				if (err !== null) {
					reject(err);
				} else {
					resolve(user.toObject());
				}
			});
		} else if (screenName !== undefined && screenName !== null) {
			User.findOne({screenNameLower: screenName.toLowerCase()}, (err: any, user: IUser) => {
				if (err !== null) {
					reject(err);
				} else {
					resolve(user.toObject());
				}
			});
		} else {
			reject('empty-query');
		}
	});
}
