import {IApplication, IUser} from '../../db/interfaces';
import search from '../../endpoints/users/search-by-screen-name';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	search(user, req.payload['screen-name']).then(users => {
		res(users);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
