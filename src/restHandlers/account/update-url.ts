import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import updateUrl from '../../endpoints/account/update-url';

export default function updateAccountUrl(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';

	updateUrl(req.misskeyUser, req.body['url']).then((user: Object) => {
		res.apiRender(user);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
