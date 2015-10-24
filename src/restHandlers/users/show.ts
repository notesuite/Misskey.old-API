// import * as express from 'express';
import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import show from '../../endpoints/users/show';
import {IUser} from '../../models/user';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';
	show(req.body['id'], req.body['screen-name']).then((user: IUser) => {
		res.apiRender({
			user: user.toObject()
		});
	}, (err: any) => {
		res.apiError(500, err);
	});
};
