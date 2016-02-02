import {IApplication, IUser} from '../../db/interfaces';
import unfollow from '../../endpoints/users/unfollow';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	if (req.payload['user-id'] === undefined || req.payload['user-id'] === null) {
		res('user-id-is-empty').code(400);
	} else {
		unfollow(user, req.payload['user-id']).then(() => {
			res({kyoppie: 'yuppie'});
		}, (err: any) => {
			res({error: err}).code(500);
		});
	}
};
