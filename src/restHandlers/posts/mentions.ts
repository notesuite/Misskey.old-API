import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import mentions from '../../endpoints/posts/mentions';

export default function timeline(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	mentions(req.misskeyUser, req.query['limit'], req.query['since-cursor'], req.query['max-cursor']).then((timeline: Object[]) => {
		res.apiRender(timeline);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
