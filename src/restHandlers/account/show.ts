// import * as express from 'express';
import { Request, Response } from '../../misskey-express';
import show from '../../endpoints/account/show';

export default function showAccount(req: Request, res: Response): void {
	'use strict';
	res.apiRender(show(req.misskeyUser));
};
