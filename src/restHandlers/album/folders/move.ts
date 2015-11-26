import { Request, Response } from '../../../misskey-express';
import move from '../../../endpoints/album/folders/move';

export default function moveFolder(req: Request, res: Response): void {
	'use strict';

	move(req.misskeyUser, req.body['folder-id'], req.body['destination-folder-id']).then((folder: Object) => {
		res.apiRender(folder);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
