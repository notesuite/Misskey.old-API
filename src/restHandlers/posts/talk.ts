import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import talk from '../../endpoints/posts/talk';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	talk(req.misskeyUser, req.query['post-id'], req.query['limit']).then((posts: Object[]) => {
		res.apiRender(posts);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
