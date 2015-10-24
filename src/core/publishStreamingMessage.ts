import * as redis from 'redis';
import config from '../config';

const publisher: redis.RedisClient = redis.createClient(config.redis.port, config.redis.host);

export default function(channel: string, msg: any): void {
	'use strict';
	publisher.publish(`misskey:${channel}`, msg);
};
