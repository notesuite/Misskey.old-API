import { User } from '../models';
import { IUser } from '../interfaces';

export default function(text: string): Promise<IUser[]> {
	'use strict';
	const mentions = /@[a-zA-Z0-9\-]+/g.exec(text);

	if (mentions === null) {
		return Promise.resolve(null);
	}

	return Promise.all(mentions.map((mention: string) =>{
		return new Promise<IUser>((resolve, reject) => {
			const sn: string = mention.replace('@', '');
			User.findOne({screenNameLower: sn.toLowerCase()}, (err: any, user: IUser) => {
				if (err !== null) {
					reject(err);
				} else {
					resolve(user);
				}
			});
		});
	}));
}
