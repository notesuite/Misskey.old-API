import { IApplication, IUser } from '../../interfaces';
import recommendations from '../../endpoints/users/recommendations';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	recommendations(
		user
	).then(recommendationUsers => {
		res(recommendationUsers);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
