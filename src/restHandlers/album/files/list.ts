import { MisskeyExpressRequest } from '../../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../../misskeyExpressResponse';
import files from '../../../endpoints/album/files/list';

export default function list(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';

	files(req.misskeyUser, req.query['folder-id'], req.query['include-folders']).then((files: Object[]) => {
		res.apiRender(files);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
