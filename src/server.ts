import * as express from 'express';
import * as bodyParser from 'body-parser';
import { MisskeyExpressRequest } from './misskeyExpressRequest';
import { MisskeyExpressResponse } from './misskeyExpressResponse';
import config from './config';
import router from './router';

console.log('Init server');

const app = express();
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(misskeyExpress);
router(app);
app.use(notFoundHandler);

function misskeyExpress(req: MisskeyExpressRequest, res: MisskeyExpressResponse, next: () => void): void {
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

function notFoundHandler(req: express.Request, res: express.Response): void {
	'use strict';
	res.status(404);
	res.json({
		error: 'API not found.'
	});
}

const server = app.listen(config.port.http, () => {
	console.log(`MisskeyAPI server listening at ${server.address().address}:${server.address().port}`);
});
