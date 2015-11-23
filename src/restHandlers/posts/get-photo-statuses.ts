import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import getPhotoStatuses from '../../endpoints/posts/get-photo-statuses';

export default function getPostPhotoStatuses(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
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
