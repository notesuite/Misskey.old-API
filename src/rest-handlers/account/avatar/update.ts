import {IApplication, IUser} from '../../../db/interfaces';
import update from '../../../endpoints/account/avatar/update';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	update(user, req.payload['file-id']).then(me => {
		res(me);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
