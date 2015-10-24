import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import getTimeline from '../../endpoints/statuses/timeline';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';
	getTimeline(req.misskeyUserId, req.body['limit'], req.body['since-cursor'], req.body['max-cursor']).then((timeline: Object[]) => {
		res.apiRender(timeline);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
