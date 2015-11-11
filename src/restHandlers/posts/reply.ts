import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import create from '../../endpoints/posts/reply';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	create(req.misskeyApp, req.misskeyUser, req.body['text'], req.body['in-reply-to-post-id']).then((status: Object) => {
		res.apiRender(status);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
