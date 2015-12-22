import { IApplication, IUser } from '../../../../interfaces';
import invite from '../../../../endpoints/talks/group/members/invite';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	const groupId: string = req.payload['group-id'];
	const userId: string = req.payload['user-id'];
	invite(
		app,
		user,
		groupId,
		userId
	).then(group => {
		res(group);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
