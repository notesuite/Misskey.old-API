import {IApplication, IUser} from '../../../../db/interfaces';
import timelineUnreadsCount from '../../../../endpoints/posts/timeline/unread/count';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	timelineUnreadsCount(
		user
	).then(count => {
		res(count);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
