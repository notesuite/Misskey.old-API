// import * as express from 'express';
import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import update from '../../endpoints/account/update-icon';

export default function updateIcon(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	update(req.misskeyUser, req.body['file-id']).then((me: Object) => {
		res.apiRender(me);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
