import { IApplication, IUser } from '../../interfaces';
import show from '../../endpoints/account/show';

export default function showAccount(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	res(show(user));
};
