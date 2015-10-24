import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import getTimeline from '../../endpoints/statuses/timeline';
import {IStatus} from '../../models/status';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';
	getTimeline(req.misskeyUserId, req.body['limit'], req.body['since-cursor'], req.body['max-cursor']).then((timeline: IStatus[]) => {
		res.apiRender(timeline.map((status: IStatus) => {
			return status.toObject();
		}));
	}, (err: any) => {
		res.apiError(500, err);
	});
};
