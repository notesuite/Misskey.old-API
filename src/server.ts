import * as cluster from 'cluster';
import * as hapi from 'hapi';
import config from './config';

export default function startServer(): void {
	'use strict';

	console.log(`Initing server... (${cluster.worker.id})`);

	const server = new hapi.Server();
	server.connection({ port: config.port.http });

	server.route({ method: '*', path: '/{p*}', handler: notFoundHandler });

	server.start(() => {
		console.log(`MisskeyAPI server listening at ${server.info.uri}:${server.info.port}`);
	});
}

function notFoundHandler(req: hapi.Request, res: hapi.IReply): hapi.IReply {
	'use strict';
	return res('API not found').code(404);
}
