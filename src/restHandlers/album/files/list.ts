import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import files from '../../endpoints/album/files';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';

	files(req.misskeyUser, req.query['folder']).then((files: Object[]) => {
		res.apiRender(files);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
