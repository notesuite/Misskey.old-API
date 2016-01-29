/* tslint:disable:variable-name */

import * as redis from 'redis';
const Limiter: any = require('ratelimiter');
import authenticate from './authenticate';
import config from './config';

const limiterDB = redis.createClient(
	config.redis.port,
	config.redis.host,
	{
		auth_pass: config.redis.password
	});

export default function(endpoint: any, req: any, res: any): void {
	'use strict';
	console.log(`${req.method} ${req.path}`);

	function reply(data: any): any {
		return res(data).header('Access-Control-Allow-Origin', '*');
	}

	authenticate(req).then((context: any) => {
		if (endpoint.login) {
			const limitKey = endpoint.hasOwnProperty('limitKey') ? endpoint.limitKey : endpoint.name;

			if (endpoint.hasOwnProperty('minInterval')) {
				detectBriefInterval();
			} else if (endpoint.hasOwnProperty('limitDuration') && endpoint.hasOwnProperty('limitMax')) {
				rateLimit();
			} else {
				call();
			}

			// 短い期間の方のリミット
			function detectBriefInterval(): void {
				const minIntervalLimiter = new Limiter({
					id: `${context.user.id}:${endpoint.name}:for-detect-brief-interval`,
					duration: endpoint.minInterval,
					max: 1,
					db: limiterDB
				});

				minIntervalLimiter.get((limitErr: any, limit: any) => {
					if (limitErr !== null) {
						return reply({
							error: 'something-happened'
						}).code(500);
					} else if (limit.remaining === 0) {
						return reply({
							error: 'brief-interval-detected'
						}).code(429);
					} else {
						if (endpoint.hasOwnProperty('limitDuration') && endpoint.hasOwnProperty('limitMax')) {
							rateLimit();
						} else {
							call();
						}
					}
				});
			}

			// 長い期間の方のリミット
			function rateLimit(): void {
				const limiter = new Limiter({
					id: `${context.user.id}:${limitKey}`,
					duration: endpoint.limitDuration,
					max: endpoint.limitMax,
					db: limiterDB
				});

				limiter.get((limitErr: any, limit: any) => {
					if (limitErr !== null) {
						return reply({
							error: 'something-happened'
						}).code(500);
					} else if (limit.remaining === 0) {
						return reply({
							error: 'rate-limit-exceeded'
						}).code(429);
					} else {
						call();
					}
				});
			}
		} else {
			call();
		}

		function call(): void {
			require(`${__dirname}/rest-handlers/${endpoint.name}`).default(
				context.app, context.user, req, reply, context.isOfficial);
		}
	}, (err: any) => {
		reply({
			error: 'authentication-failed'
		}).code(403);
	});
}
