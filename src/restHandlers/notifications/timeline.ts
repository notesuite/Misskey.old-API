import { Request, Response } from '../../misskey-express';
import getTimeline from '../../endpoints/notifications/timeline';

export default function timeline(req: Request, res: Response): void {
	'use strict';
	getTimeline(req.misskeyUser, req.query['limit'], req.query['since-cursor'], req.query['max-cursor']).then((timeline: Object[]) => {
		res.apiRender(timeline);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
