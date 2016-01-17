import {IApplication, IUser} from '../../../interfaces';
import updateComment from '../../../endpoints/account/comment/update';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';

	updateComment(
		user,
		req.payload['comment']
	).then(saved => {
		res(saved);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
