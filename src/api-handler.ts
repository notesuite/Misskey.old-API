/* tslint:disable:variable-name */

import * as redis from 'redis';
const Limiter: any = require('ratelimiter');
import * as hapi from 'hapi';
import authorize from './authorize';
import config from './config';

const limiterDb = redis.createClient(config.redis.port, config.redis.host);

export default function apiHandler(endpoint: any, req: hapi.Request, res: hapi.IReply): void {
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
