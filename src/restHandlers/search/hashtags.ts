// import * as express from 'express';
import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import search from '../../endpoints/search/hashtags';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	search(req.query['name']).then((hashtags: string[]) => {
		res.apiRender(hashtags);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
