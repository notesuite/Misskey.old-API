import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import followers from '../../endpoints/users/followers';

export default function userFollowers(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	followers(req.misskeyUser, req.query['limit'], req.query['since-cursor'], req.query['max-cursor']).then((followerList: Object[]) => {
		res.apiRender(followerList);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
