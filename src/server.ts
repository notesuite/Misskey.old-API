import * as http from 'http';
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

app.use((req: MisskeyExpressRequest, res: MisskeyExpressResponse, next: () => void) => {
	res.apiRender = data => {
		res.json(data);
	};

	res.apiError = (httpStatusCode, error) => {
		res.status(httpStatusCode);
		res.apiRender({error});
	};
	next();
});

router(app);

// Not found handler
app.use((req, res) => {
	res.status(404);
	res.json({
		error: 'API not found.'
	});
});

const server: http.Server = app.listen(config.port.http, () => {
	const host: string = server.address().address;
	const port: number = server.address().port;

	console.log(`MisskeyAPI server listening at ${host}:${port}`);
});
