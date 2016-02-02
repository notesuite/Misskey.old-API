import {IApplication, IUser} from '../../../db/interfaces';
import notificationsUnreadCount from '../../../endpoints/notifications/unread/count';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	notificationsUnreadCount(
		user
	).then(count => {
		res(count);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
