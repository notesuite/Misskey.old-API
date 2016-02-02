import * as redis from 'redis';
import config from '../config';

const publisher = redis.createClient(
	config.redis.port,
	config.redis.host,
	{
		auth_pass: config.redis.password
	});

export default function<T>(channel: string, message: T): void {
	publisher.publish(`misskey:${channel}`, message);
}
