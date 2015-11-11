import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import create from '../../endpoints/posts/status';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	create(req.misskeyApp, req.misskeyUser, req.body['text']).then((status: Object) => {
		res.apiRender(status);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
