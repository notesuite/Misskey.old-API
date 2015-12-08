import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import show_ from '../../../endpoints/hashtags/trend/show';

export default function show(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	show_().then(hashtags => {
		res(hashtags);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
