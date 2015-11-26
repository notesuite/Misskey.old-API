import { Request, Response } from '../../../misskey-express';
import show from '../../../endpoints/album/files/show';

export default function showFile(req: Request, res: Response): void {
	'use strict';

	show(req.misskeyUser, req.query['file-id']).then((file: Object) => {
		res.apiRender(file);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
