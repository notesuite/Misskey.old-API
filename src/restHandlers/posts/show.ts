// import * as express from 'express';
import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import show from '../../endpoints/posts/show';

module.exports = (req: MisskeyExpressRequest, res: MisskeyExpressResponse): void => {
	'use strict';
	show(req.misskeyUser, req.query['post-id']).then((post: Object) => {
		res.apiRender(post);
	}, (err: any) => {
		res.apiError(500, err);
	});
};
