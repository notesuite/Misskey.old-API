// import * as express from 'express';
import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import show from '../../endpoints/account/show';

export default function showAccount(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	res.apiRender(show(req.misskeyUser));
};
