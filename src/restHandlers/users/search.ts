// import * as express from 'express';
import { Request, Response } from '../../misskey-express';
import search from '../../endpoints/users/search';

export default function searchUsers(req: Request, res: Response): void {
	'use strict';
	search(req.misskeyUser, req.query['screen-name']).then((users: Object[]) => {
		res.apiRender(users);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
