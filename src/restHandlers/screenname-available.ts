// import * as express from 'express';
import { Request, Response } from '../misskey-express';
import screennameAvailable from '../endpoints/screenname-available';

export default function isScreennameAvailable(req: Request, res: Response): void {
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
