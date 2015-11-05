import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import follow from '../../endpoints/users/follow';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';
	follow(req.misskeyUser, req.body['user-id']).then(() => {
		res.apiRender({kyoppie:'yuppie'});
	}, (err: any) => {
		res.apiError(500, err);
	});
};
