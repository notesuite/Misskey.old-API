import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import updateComment from '../../../endpoints/account/comment/update';

export default function updateAccountComment(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
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
