import User from '../models/user';

export default function(screenName: string): Promise<boolean> {
	'use strict';
	return new Promise((resolve: (value: boolean) => void, reject: (err: any) => void) => {
		if (screenName) {
			User.find({
				screenNameLower: screenName.toLowerCase()
			}).limit(1).exec((err: any, user: any) => {
				resolve(user === null);
			});
		} else {
			reject('empty-screen-name');
		}
	});
}
