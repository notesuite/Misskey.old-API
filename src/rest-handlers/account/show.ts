import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import show from '../../endpoints/account/show';

export default function showAccount(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	res(show(user));
};
