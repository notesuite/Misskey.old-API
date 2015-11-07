import { MisskeyExpressRequest } from '../../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../../misskeyExpressResponse';
import del from '../../../endpoints/album/files/delete';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';

	del(req.misskeyUser, req.body['file-id']).then((file: Object) => {
		res.apiRender({
			status: 'success'
		});
	}, (err: any) => {
		res.apiError(500, err);
	});
}
