import { Request, Response } from '../../misskey-express';
import timelineUnreadsCount from '../../endpoints/posts/timeline-unreads-count';

export default function unreadsCount(req: Request, res: Response): void {
	'use strict';
	timelineUnreadsCount(
		req.misskeyUser
	).then((count: number) => {
		res.apiRender(count);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
