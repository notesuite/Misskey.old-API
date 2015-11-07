import { MisskeyExpressRequest } from '../../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../../misskeyExpressResponse';
import move from '../../../endpoints/album/files/move';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';

	move(req.misskeyUser, req.body['file-id'], req.body['folder-id']).then((file: Object) => {
		res.apiRender(file);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
