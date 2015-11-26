import { Request, Response } from '../../misskey-express';
import update from '../../endpoints/account/update-avatar';

export default function updateIcon(req: Request, res: Response): void {
	'use strict';
	update(req.misskeyUser, req.body['file-id']).then((me: Object) => {
		res.apiRender(me);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
