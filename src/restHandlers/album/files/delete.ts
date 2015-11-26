import { Request, Response } from '../../../misskey-express';
import del from '../../../endpoints/album/files/delete';

export default function deleteFile(req: Request, res: Response): void {
	'use strict';

	del(req.misskeyUser, req.body['file-id']).then((file: Object) => {
		res.apiRender({
			status: 'success'
		});
	}, (err: any) => {
		res.apiError(500, err);
	});
}
