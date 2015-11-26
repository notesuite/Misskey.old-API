import { Request, Response } from '../../misskey-express';
import getPhotoStatuses from '../../endpoints/posts/get-photo-statuses';

export default function getPostPhotoStatuses(req: Request, res: Response): void {
	'use strict';
	getPhotoStatuses(
		req.misskeyUser,
		req.query['user-id'],
		req.query['limit'],
		req.query['since-cursor'],
		req.query['max-cursor'])
	.then((timeline: Object[]) => {
		res.apiRender(timeline);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
