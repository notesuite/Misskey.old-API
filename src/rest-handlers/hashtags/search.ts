import { Request, Response } from '../../misskey-express';
import search from '../../endpoints/hashtags/search';

export default function searchHashtags(req: Request, res: Response): void {
	'use strict';
	search(req.query['name']).then(hashtags => {
		res.apiRender(hashtags);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
