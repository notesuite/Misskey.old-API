import {logInfo, logWarn} from 'log-cool';
import {exec, ExecOutputReturnValue} from 'shelljs';

export default function(): void {
	'use strict';
	checkEnv('Node.js', 'node -v', x => x.match(/^v(.*)\n$/)[1]);
	checkEnv('npm', 'npm -v', x => x.match(/^(.*)\n$/)[1]);
	checkEnv('MongoDB', 'mongo --version', x => x.match(/^MongoDB shell version: (.*)\n$/)[1]);
	checkEnv('Redis', 'redis-server --version', x => x.match(/v=([0-9\.]*)/)[1]);
}

function checkEnv(serviceName: string, command: string, transform: (x: string) => string): void {
	'use strict';
	const code = {
		success: 0,
		notFound: 127
	};
	const x = <ExecOutputReturnValue>exec(command, { silent: true });
	if (x.code === code.success) {
		logInfo(`${serviceName} ${transform(x.output)}`);
	} else if (x.code === code.notFound) {
		logWarn(`Unable to find ${serviceName}`);
	}
}
