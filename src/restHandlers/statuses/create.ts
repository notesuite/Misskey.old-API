import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import create from '../../endpoints/statuses/create';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';
	create(req.body['text']).then((status: Object) => {
		res.apiRender(status);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
