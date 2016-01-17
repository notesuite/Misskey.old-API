import {IApplication, IUser} from '../../../../interfaces';
import timelineUnreadsCount from '../../../../endpoints/posts/timeline/unread/count';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	timelineUnreadsCount(
		user
	).then(count => {
		res(count);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
