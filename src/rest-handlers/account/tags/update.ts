import {IApplication, IUser} from '../../../db/interfaces';
import update from '../../../endpoints/account/tags/update';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	update(
		user,
		req.payload['tags']
	).then(saved => {
		res(saved);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
