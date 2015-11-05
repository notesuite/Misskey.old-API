import { MisskeyExpressRequest } from '../../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../../misskeyExpressResponse';
import rename from '../../../endpoints/album/files/rename';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';

	rename(req.misskeyUser, req.body['file-id'], req.body['name']).then((file: Object) => {
		res.apiRender(file);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
