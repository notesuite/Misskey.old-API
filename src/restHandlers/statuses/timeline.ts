import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import getTimeline from '../../endpoints/statuses/timeline';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';
	getTimeline(req.misskeyUserId, req.query['limit'], req.query['since-cursor'], req.query['max-cursor']).then((timeline: Object[]) => {
		res.apiRender(timeline);
	}, (err: any) => {
		res.apiError(500, err);
	});
};