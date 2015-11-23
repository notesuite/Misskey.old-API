// import * as express from 'express';
import { MisskeyExpressRequest } from '../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../misskeyExpressResponse';
import screennameAvailable from '../endpoints/screenname-available';

export default function isScreennameAvailable(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	screennameAvailable(req.query['screen-name']).then((available: boolean) => {
		res.apiRender({
			available
		});
	}, (err: any) => {
		// TODO: エラーコードを判別して適切なHTTPステータスコードを返す
		res.apiError(500, err);
	});
}
