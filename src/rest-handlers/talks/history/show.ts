import {IApplication, IUser} from '../../../db/interfaces';
import show from '../../../endpoints/talks/history/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	const type = req.payload['type'];
	const limit = req.payload['limit'];
	show(
		user,
		type,
		limit
	).then(messages => {
		res(messages);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
