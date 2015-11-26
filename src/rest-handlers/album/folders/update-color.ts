import { Request, Response } from '../../../misskey-express';
import recolor from '../../../endpoints/album/folders/update-color';

export default function updateColor(req: Request, res: Response): void {
	'use strict';

	recolor(req.misskeyUser, req.body['folder-id'], req.body['color']).then((folder: Object) => {
		res.apiRender(folder);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
