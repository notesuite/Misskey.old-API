import {dataSize} from 'powerful';
import * as cluster from 'cluster';
const hapi = require('hapi');
import endpoints from './endpoints';
import config from './config';

import apiHandler from './api-handler';

export default function(): void {
	'use strict';

	console.log(`Initing server... (${cluster.worker.id})`);

	const server = new hapi.Server();
	server.connection({ port: config.port.http });

	endpoints.forEach(endpoint => {
		if (endpoint.name === 'album/files/upload') {
			server.route({
				method: 'post',
				path: `/${endpoint.name}`,
				config: {
					payload: {
						output: 'file',
						parse: true,
						maxBytes: dataSize.fromMiB(100),
						allow: 'multipart/form-data'
					},
					handler: (request: any, reply: any): void => {
						apiHandler(endpoint, request, reply);
					}
				}
			});
		} else {
			server.route({
				method: 'post',
				path: `/${endpoint.name}`,
				handler: (request: any, reply: any): void => {
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

function notFoundHandler(req: any, res: any): any {
	'use strict';
	console.log(`NOT FOUND: ${req.path}`);
	return res({
		error: 'api-not-found'
	}).code(404);
}
