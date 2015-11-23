import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import follow from '../../endpoints/users/follow';

export default function followUser(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	if (req.body['user-id'] === undefined || req.body['user-id'] === null) {
		res.apiError(400, "user-id-is-empty");
	} else {
		follow(req.misskeyUser, req.body['user-id']).then(() => {
			res.apiRender({kyoppie: 'yuppie'});
		}, (err: any) => {
			res.apiError(500, err);
		});
	}
};
