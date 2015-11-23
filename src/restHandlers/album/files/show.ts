import { MisskeyExpressRequest } from '../../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../../misskeyExpressResponse';
import show from '../../../endpoints/album/files/show';

export default function showFile(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';

	show(req.misskeyUser, req.query['file-id']).then((file: Object) => {
		res.apiRender(file);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
