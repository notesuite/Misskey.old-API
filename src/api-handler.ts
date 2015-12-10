/* tslint:disable:variable-name */

import * as redis from 'redis';
const Limiter: any = require('ratelimiter');
import * as hapi from 'hapi';
import authorize from './authorize';
import config from './config';

const limiterDb = redis.createClient(config.redis.port, config.redis.host);

export default function apiHandler(endpoint: any, req: hapi.Request, reply: hapi.IReply): void {
	'use strict';
	console.log(`${req.method} ${req.path}`);

	const response = (<any>reply)()
		.header('Access-Control-Allow-Origin', '*')
		.hold().send;

	authorize(req).then((context: any) => {
		if (endpoint.login) {
			if (endpoint.hasOwnProperty('limitDuration') && endpoint.hasOwnProperty('limitMax')) {
				const limitKey = endpoint.hasOwnProperty('limitKey') ? endpoint.limitKey : endpoint.endpoint;
				const limiter = new Limiter({
					id: `${context.user.id}:${limitKey}`,
					duration: endpoint.limitDuration,
					max: endpoint.limitMax,
					db: limiterDb
				});

				limiter.get((limitErr: any, limit: any) => {
					if (limitErr !== null) {
						return response({
							error: 'something-happened'
						}).code(500);
					} else if (limit.remaining === 0) {
						return response({
							error: 'rate-limit-exceeded'
						}).code(429);
					} else {
						require(`${__dirname}/rest-handlers/${endpoint.endpoint}`).default(
							context.app, context.user, req, response);
					}
				});
			} else {
				require(`${__dirname}/rest-handlers/${endpoint.endpoint}`).default(
					context.app, context.user, req, response);
			}
		} else {
			require(`${__dirname}/rest-handlers/${endpoint.endpoint}`).default(
				context.app, context.user, req, response);
		}
	}, (err: any) => {
		response({
			error: 'authentication-failed'
		}).code(403);
	});
}
