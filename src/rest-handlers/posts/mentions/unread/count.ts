import { IApplication, IUser } from '../../../../interfaces';
import mentionsUnreadsCount from '../../../../endpoints/posts/mentions/unread/count';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	mentionsUnreadsCount(
		user
	).then(count => {
		res(count);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
