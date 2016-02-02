import {IApplication, IUser} from '../../db/interfaces';
import recommendations from '../../endpoints/users/recommendations';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	recommendations(
		user,
		req.payload['limit']
	).then(recommendationUsers => {
		res(recommendationUsers);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
