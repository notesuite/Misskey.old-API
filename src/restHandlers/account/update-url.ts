import { Request, Response } from '../../misskey-express';
import updateUrl from '../../endpoints/account/update-url';

export default function updateAccountUrl(req: Request, res: Response): void {
	'use strict';

	updateUrl(req.misskeyUser, req.body['url']).then((user: Object) => {
		res.apiRender(user);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
