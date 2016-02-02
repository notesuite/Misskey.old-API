import {IApplication, IUser} from '../db/interfaces';
import doLogin from '../endpoints/login';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any,
	isOfficial: boolean
): void {
	const screenName: string = req.payload['screen-name'];
	const password: string = req.payload['password'];
	if (isOfficial) {
		doLogin(screenName, password).then(loginer => {
			res(loginer);
		}, (err: any) => {
			res({error: err}).code(500);
		});
	} else {
		res({error: 'access-denied'}).code(403);
	}
}
