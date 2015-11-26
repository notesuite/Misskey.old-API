import { Request, Response } from '../../../misskey-express';
import create from '../../../endpoints/album/folders/create';

export default function createFolder(req: Request, res: Response): void {
	'use strict';

	create(req.misskeyUser, req.body['parent-folder-id'], req.body['name']).then((folder: Object) => {
		res.apiRender(folder);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
