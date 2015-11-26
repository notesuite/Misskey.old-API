import { Request, Response } from '../../../misskey-express';
import rename from '../../../endpoints/album/folders/rename';

export default function renameFolder(req: Request, res: Response): void {
	'use strict';

	rename(req.misskeyUser, req.body['folder-id'], req.body['name']).then((folder: Object) => {
		res.apiRender(folder);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
