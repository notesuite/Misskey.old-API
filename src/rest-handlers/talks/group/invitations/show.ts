import { IApplication, IUser } from '../../../../interfaces';
import show from '../../../../endpoints/talks/group/invitations/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	show(
		app,
		user
	).then(invitations => {
		res(invitations);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
