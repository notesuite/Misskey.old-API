import {User} from './db/db';
import {IUser} from './db/interfaces';
import config from './config';

export default function(req: any): Promise<{ app: any, user: any, isOfficial: boolean }> {
	return new Promise<{ app: any, user: any, isOfficial: boolean }>((resolve, reject) => {
		if (req.headers['passkey'] === undefined || req.headers['passkey'] === null) {
			resolve({ app: null, user: null, isOfficial: false });
		} else if (req.headers['passkey'] !== config.apiPasskey) {
			reject();
		} else if (req.headers['user-id'] === undefined || req.headers['user-id'] === null || req.headers['user-id'] === 'null') {
			resolve({ app: null, user: null, isOfficial: true });
		} else {
			User.findById(req.headers['user-id'], (err: any, user: IUser) => {
				resolve({
					app: null,
					user: user,
					isOfficial: true
				});
			});
		}
	});
}
