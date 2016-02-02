import {IApplication, IUser} from '../../../../db/interfaces';
import talksUnreadCount from '../../../../endpoints/talks/messages/unread/count';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	talksUnreadCount(
		user
	).then(count => {
		res(count);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
