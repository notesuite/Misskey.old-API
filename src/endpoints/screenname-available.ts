import {User} from '../models';
import {IUser} from '../interfaces';

export default function(screenName: string): Promise<boolean> {
	'use strict';
	return new Promise<boolean>((resolve, reject) => {
		if (screenName) {
			User.find({
				screenNameLower: screenName.toLowerCase()
			}).limit(1).exec((err: any, user: [IUser]) => {
				resolve(user.length === 0);
			});
		} else {
			reject('empty-screen-name');
		}
	});
}
