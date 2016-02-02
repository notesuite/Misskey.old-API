import {dataSize} from 'powerful';
import {logInfo, logWarn} from 'log-cool';
import * as cluster from 'cluster';
const hapi = require('hapi');
import endpoints from './endpoints';
import config from './config';
import apiHandler from './api-handler';

export default function(): void {
	logInfo(`(cluster: ${cluster.worker.id}) Initializing server`);

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
		logInfo(`(cluster: ${cluster.worker.id}) Listening at ${server.info.uri}`);
	});
}

function notFoundHandler(req: any, res: any): any {
	logWarn(`Request not handled: ${req.method.toUpperCase()} ${req.path}`);
	return res({
		error: 'api-not-found'
	}).code(404);
}
