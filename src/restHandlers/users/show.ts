// import * as express from 'express';
import { Request, Response } from '../../misskey-express';
import show from '../../endpoints/users/show';

export default function showUser(req: Request, res: Response): void {
	'use strict';
	show(req.misskeyUser, req.query['user-id'], req.query['screen-name']).then((user: Object) => {
		res.apiRender(user);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
