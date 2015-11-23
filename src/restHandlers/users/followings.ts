import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import followings from '../../endpoints/users/followings';

export default function userFollowings(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	followings(req.misskeyUser, req.query['limit'], req.query['since-cursor'], req.query['max-cursor']).then((followingList: Object[]) => {
		res.apiRender(followingList);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
