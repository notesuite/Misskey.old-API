import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import getTimeline from '../../endpoints/posts/user-timeline';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	getTimeline(
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
