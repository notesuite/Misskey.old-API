// import * as express from 'express';
import { Request, Response } from '../../misskey-express';
import show from '../../endpoints/notifications/show';

export default function showPost(req: Request, res: Response): void {
	'use strict';
	show(req.misskeyUser, req.query['notification-id']).then((notification: Object) => {
		res.apiRender(notification);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
