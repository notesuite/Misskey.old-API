import { MisskeyExpressRequest } from '../../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../../misskeyExpressResponse';
import create from '../../../endpoints/album/folders/create';

export default function createFolder(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';

	create(req.misskeyUser, req.body['parent-folder-id'], req.body['name']).then((folder: Object) => {
		res.apiRender(folder);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
