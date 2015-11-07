import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import updateName from '../../endpoints/account/update-name';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';

	updateName(req.misskeyUser, req.body['name']).then((user: Object) => {
		res.apiRender(user);
	}, (err: any) => {
		res.apiError(500,err);
	});
};
