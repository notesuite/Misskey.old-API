import { Request, Response } from '../../../misskey-express';
import move from '../../../endpoints/album/files/move';

export default function moveFile(req: Request, res: Response): void {
	'use strict';

	move(req.misskeyUser, req.body['file-id'], req.body['folder-id']).then((file: Object) => {
		res.apiRender(file);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
