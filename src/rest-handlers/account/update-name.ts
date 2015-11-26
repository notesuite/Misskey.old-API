import { Request, Response } from '../../misskey-express';
import updateName from '../../endpoints/account/update-name';

export default function updateAccountName(req: Request, res: Response): void {
	'use strict';

	updateName(req.misskeyUser, req.body['name']).then((user: Object) => {
		res.apiRender(user);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
