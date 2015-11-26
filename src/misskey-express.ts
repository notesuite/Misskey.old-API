import * as express from 'express';
import {IApplication, IUser} from './interfaces';

export default function misskeyExpress(req: Request, res: Response, next: () => void): void {
	'use strict';
	res.apiRender = data => {
		res.json(data);
	};
	res.apiError = (httpStatusCode, error) => {
		res.status(httpStatusCode);
		res.apiRender({error});
	};
	next();
}

export interface Request extends express.Request {
	misskeyApp: IApplication;
	misskeyUser: IUser;
}

export interface Response extends express.Response {
	apiRender: (data: any) => void;
	apiError: (httpStatusCode: number, err: any) => void;
}
