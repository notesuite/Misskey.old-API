import { Request, Response } from '../../../misskey-express';
import del from '../../../endpoints/album/folders/delete';

export default function deleteFolder(req: Request, res: Response): void {
	'use strict';

	del(req.misskeyUser, req.body['folder-id']).then(() => {
		res.apiRender({
			status: 'success'
		});
	}, (err: any) => {
		res.apiError(500, err);
	});
}
