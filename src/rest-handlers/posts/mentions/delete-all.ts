import {IApplication, IUser} from '../../../db/interfaces';
import deleteAll from '../../../endpoints/posts/mentions/delete-all';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
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
