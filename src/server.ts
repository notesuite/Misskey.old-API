/* tslint:disable:variable-name */

import * as cluster from 'cluster';
import * as hapi from 'hapi';
import * as redis from 'redis';
const Limiter: any = require('ratelimiter');
import {User} from './models';
import {IUser} from './interfaces';
import endpoints from './endpoints';
import config from './config';

const limiterDb = redis.createClient(config.redis.port, config.redis.host);

export default function startServer(): void {
	'use strict';

	console.log(`Initing server... (${cluster.worker.id})`);

	const server = new hapi.Server();
	server.connection({ port: config.port.http });

	endpoints.forEach(endpoint => {
		server.route({
			method: endpoint.httpMethod,
			path: `/${endpoint.endpoint}`,
			handler: (request, reply): void => {
				apiHandler(endpoint, request, reply);
			}
		});
	});

	server.route({ method: '*', path: '/{p*}', handler: notFoundHandler });

	server.start(() => {
		console.log(`MisskeyAPI server (${cluster.worker.id}) listening at ${server.info.uri}`);
	});
}

function apiHandler(endpoint: any, req: hapi.Request, res: hapi.IReply): void {
	'use strict';
	console.log(`${req.method} ${req.path}`);

	authorize(req).then((context: any) => {
		if (endpoint.login) {
			const limiter = new Limiter({
				id: `${context.user.id}:${endpoint.endpoint}`,
				duration: endpoint.limitDuration,
				max: endpoint.limitMax,
				db: limiterDb
			});

			limiter.get((limitErr: any, limit: any) => {
				if (limitErr !== null) {
					return res('something-happened').code(500);
				} else if (limit.remaining === 0) {
					return res('rate-limit-exceeded').code(429);
				} else {
					require(`${__dirname}/rest-handlers/${endpoint.endpoint}`).default(
						context.app, context.user, req, res);
				}
			});
		} else {
			require(`${__dirname}/rest-handlers/${endpoint.endpoint}`).default(
				context.app, context.user, req, res);
		}
	}, (err: any) => {
		res('authentication-failed').code(403);
	});
}

function authorize(req: hapi.Request): Promise<any> {
	'use strict';
	return new Promise<Object>((resolve, reject) => {
		if (req.headers['passkey'] !== null) {
			if (req.headers['passkey'] === config.apiPasskey) {
				if (req.headers['user-id'] !== null) {
					User.findById(req.headers['user-id'], (err: any, user: IUser) => {
						resolve({
							app: null,
							user: user
						});
					});
				} else {
					resolve({
						app: null,
						user: null
					});
				}
			} else {
				reject();
			}
		} else {
			// todo: sauth
		}
	});
}

function notFoundHandler(req: hapi.Request, res: hapi.IReply): hapi.Response {
	'use strict';
	return res('API not found').code(404);
}
