import { Request, Response } from '../../misskey-express';
import updateComment from '../../endpoints/account/update-comment';

export default function updateAccountComment(req: Request, res: Response): void {
	'use strict';

	updateComment(req.misskeyUser, req.body['comment']).then((user: Object) => {
		res.apiRender(user);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
