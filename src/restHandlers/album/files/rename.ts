import { Request, Response } from '../../../misskey-express';
import rename from '../../../endpoints/album/files/rename';

export default function renameFile(req: Request, res: Response): void {
	'use strict';

	rename(req.misskeyUser, req.body['file-id'], req.body['name']).then((file: Object) => {
		res.apiRender(file);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
