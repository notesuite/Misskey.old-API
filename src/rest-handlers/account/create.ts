import {Match} from 'powerful';
import createAccount from '../../endpoints/account/create';
import {IApplication, IUser} from '../../db/interfaces';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any,
	isOfficial: boolean
): void {
	createAccount(
		isOfficial,
		req.payload['screen-name'],
		req.payload['password']
	).then(created => {
		res({
			user: created.toObject()
		});
	}, (err: any) => {
		const statusCode = new Match<string, number>(err)
			.is('empty-screen-name', () => 400)
			.is('invalid-screen-name', () => 400)
			.is('empty-password', () => 400)
			.getValue(500);

		res({error: err}).code(statusCode);
	});
}
