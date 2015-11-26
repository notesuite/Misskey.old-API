// import * as express from 'express';
import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import show from '../../endpoints/notifications/show';

export default function showPost(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	show(req.misskeyUser, req.query['notification-id']).then((notification: Object) => {
		res.apiRender(notification);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
