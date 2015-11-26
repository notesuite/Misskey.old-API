import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import recommendations from '../../endpoints/users/recommendations';

export default function userFollowings(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	recommendations(
		req.misskeyUser
	).then((recommendationUsers: Object[]) => {
		res.apiRender(recommendationUsers);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
