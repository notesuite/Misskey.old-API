// import * as express from 'express';
import { MisskeyExpressRequest } from '../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../misskeyExpressResponse';
import doLogin from '../endpoints/login';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';
	doLogin(req.query['screen-name'], req.query['password']).then((same: boolean) => {
		res.apiRender({same});
	}, (err: any) => {
		res.apiError(400, err);
	});
};
