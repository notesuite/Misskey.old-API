import {IApplication, IUser} from '../../../db/interfaces';
import updateName from '../../../endpoints/account/name/update';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	updateName(
		user,
		req.payload['name']
	).then(saved => {
		res(saved);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
