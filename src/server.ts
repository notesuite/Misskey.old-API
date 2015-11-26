import * as cluster from 'cluster';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import misskeyExpress from './misskey-express';
import config from './config';
import router from './router';

export default function startServer(): void {
	'use strict';

	console.log(`Initing server... (${cluster.worker.id})`);

	const app = express();
	app.disable('x-powered-by');
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(misskeyExpress);
	router(app);
	app.use(notFoundHandler);

	const server = app.listen(config.port.http, () => {
		console.log(`MisskeyAPI server listening at ${server.address().address}:${server.address().port}`);
	});
}

function notFoundHandler(req: express.Request, res: express.Response): void {
	'use strict';
	res.status(404);
	res.json({
		error: 'API not found.'
	});
}
