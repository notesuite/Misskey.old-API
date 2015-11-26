import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import updateComment from '../../endpoints/account/update-comment';

export default function updateAccountComment(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';

	updateComment(req.misskeyUser, req.body['comment']).then((user: Object) => {
		res.apiRender(user);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
