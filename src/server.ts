import * as cluster from 'cluster';
import * as hapi from 'hapi';
import endpoints from './endpoints';
import config from './config';

import apiHandler from './api-handler';

export default function startServer(): void {
	'use strict';

	console.log(`Initing server... (${cluster.worker.id})`);

	const server = new hapi.Server();
	server.connection({ port: config.port.http });

	endpoints.forEach(endpoint => {
		if (endpoint.endpoint === 'album/files/upload') {
			server.route({
				method: endpoint.httpMethod,
				path: `/${endpoint.endpoint}`,
				config: {
					payload: {
						output: 'file',
						parse: true,
						allow: 'multipart/form-data'
					},
					handler: (request: any, reply: any): void => {
						apiHandler(endpoint, <hapi.Request>request, reply);
					}
				}
			});
		} else {
			server.route({
				method: endpoint.httpMethod,
				path: `/${endpoint.endpoint}`,
				handler: (request, reply): void => {
					apiHandler(endpoint, request, reply);
				}
			});
		}
	});

	server.route({ method: '*', path: '/{p*}', handler: notFoundHandler });

	server.start(() => {
		console.log(`MisskeyAPI server (${cluster.worker.id}) listening at ${server.info.uri}`);
	});
}

function notFoundHandler(req: hapi.Request, res: hapi.IReply): hapi.Response {
	'use strict';
	return res('API not found').code(404);
}
