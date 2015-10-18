import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import config from './config';

const server: express.Express = express();
server.disable('x-powered-by');
server.use(bodyParser.urlencoded({ extended: true }));
server.use(multer());

// Not found handler
server.use((req: express.Request, res: express.Response) => {
	res.status(404);
	res.json({
		error: 'API not found.'
	});
});
