import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import { MisskeyExpressRequest } from './misskeyExpressRequest';
import { MisskeyExpressResponse } from './misskeyExpressResponse';
import {User} from './models';
import {IUser} from './interfaces';
import config from './config';
import router from './router';

console.log('Init server');

const app: express.Express = express();
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.use((req: MisskeyExpressRequest, res: MisskeyExpressResponse, next: () => void) => {
	res.apiRender = (data: any) => {
		res.json(data);
	};

	res.apiError = (httpStatusCode: number, error: any) => {
		res.status(httpStatusCode);
		res.apiRender({
			error: error
		});
	};

	console.log(req.method + ' ' + req.path);

	if (req.headers['passkey'] !== null) {
		if (req.headers['passkey'] === config.apiPasskey) {
			req.misskeyApp = null;
			if (req.headers['user-id'] !== null) {
				User.findById(req.headers['user-id'], (err: any, user: IUser) => {
					req.misskeyUser = user;
					next();
				});
			} else {
				req.misskeyUser = null;
				next();
			}
		} else {
			res.send(403);
		}
	} else {
		res.send(403);
	}
});

router(app);

// Not found handler
app.use((req: express.Request, res: express.Response) => {
	res.status(404);
	res.json({
		error: 'API not found.'
	});
});

const server: http.Server = app.listen(config.port.internal, () => {
	const host: string = server.address().address;
	const port: number = server.address().port;

	console.log(`MisskeyAPI server listening at ${host}:${port}`);
});
