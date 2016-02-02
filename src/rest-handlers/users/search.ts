import {IApplication, IUser} from '../../db/interfaces';
import search from '../../endpoints/users/search';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	search(user, req.payload['query'], req.payload['limit']).then(users => {
		res(users);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
