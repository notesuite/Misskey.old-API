import { MisskeyExpressRequest } from '../../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../../misskeyExpressResponse';
import rename from '../../../endpoints/album/folders/rename';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';

	rename(req.misskeyUser, req.body['folder-id'], req.body['name']).then((folder: Object) => {
		res.apiRender(folder);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
