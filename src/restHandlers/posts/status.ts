import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import create from '../../endpoints/posts/status';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	const text: string = req.body['text'];
	if (text === undefined) {
		return res.apiError(400, 'text is required');
	}
	create(req.misskeyApp, req.misskeyUser, text, req.body['in-reply-to-post-id']).then((status: Object) => {
		res.apiRender(status);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
