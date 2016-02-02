import {IApplication, IUser} from '../../db/interfaces';
import show from '../../endpoints/notifications/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	show(
		user,
		req.payload['notification-id']
	).then(notification => {
		res(notification);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
