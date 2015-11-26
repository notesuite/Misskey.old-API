import { Request, Response } from '../../../misskey-express';
import files from '../../../endpoints/album/files/list';

export default function list(req: Request, res: Response): void {
	'use strict';

	files(req.misskeyUser, req.query['folder-id'], req.query['include-folders']).then((files: Object[]) => {
		res.apiRender(files);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
