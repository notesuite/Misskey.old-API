import {IApplication, IUser} from '../../../interfaces';
import deleteAll from '../../../endpoints/posts/mentions/delete-all';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	deleteAll(
		user
	).then(() => {
		res({
			'kyoppie': 'yuppie'
		});
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
