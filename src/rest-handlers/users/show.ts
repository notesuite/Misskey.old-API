import {IApplication, IUser} from '../../db/interfaces';
import show from '../../endpoints/users/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	show(
		user,
		req.payload['user-id'],
		req.payload['screen-name']
	).then(showee => {
		res(showee);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
