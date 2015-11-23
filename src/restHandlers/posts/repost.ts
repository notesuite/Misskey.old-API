import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import create from '../../endpoints/posts/repost';

export default function repost(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	create(req.misskeyApp, req.misskeyUser.id, req.body['post-id']).then((repost: Object) => {
		res.apiRender(repost);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
