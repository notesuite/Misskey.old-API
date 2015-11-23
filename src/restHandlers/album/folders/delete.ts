import { MisskeyExpressRequest } from '../../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../../misskeyExpressResponse';
import del from '../../../endpoints/album/folders/delete';

export default function deleteFolder(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';

	del(req.misskeyUser, req.body['folder-id']).then(() => {
		res.apiRender({
			status: 'success'
		});
	}, (err: any) => {
		res.apiError(500, err);
	});
}
