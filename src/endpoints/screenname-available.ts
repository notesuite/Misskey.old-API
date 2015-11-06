import {User} from '../models';

export default function(screenName: string): Promise<boolean> {
	'use strict';

	if (screenName) {
		return Promise.resolve(User.find({
			screenNameLower: screenName.toLowerCase()
		}).limit(1).exec()).then<boolean>(users => users.length === 0);
	} else {
		return <Promise<any>>Promise.reject('empty-screen-name');
	}
}
