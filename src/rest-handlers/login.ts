import * as hapi from 'hapi';
import {IApplication, IUser} from '../interfaces';
import doLogin from '../endpoints/login';

export default function login(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	const screenName: string = req.payload['screen-name'];
	const password: string = req.payload['password'];
	doLogin(screenName, password).then(loginer => {
		res(loginer);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
