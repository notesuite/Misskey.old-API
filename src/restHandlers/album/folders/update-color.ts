import { MisskeyExpressRequest } from '../../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../../misskeyExpressResponse';
import recolor from '../../../endpoints/album/folders/update-color';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';

	recolor(req.misskeyUser, req.body['folder-id'], req.body['color']).then((folder: Object) => {
		res.apiRender(folder);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
