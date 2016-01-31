import * as cluster from 'cluster';
import {logInfo} from 'log-cool';
import * as os from 'os';
import checkEnv from './check-env';
import startServer from './server';

if (cluster.isMaster) {
	logInfo('Welcome to Misskey API');
	checkEnv();
	times(os.cpus().length, cluster.fork);
} else {
	startServer();
}

// Fork when a worker died.
cluster.on('exit', worker => {
	logInfo(`(cluster: ${worker.id}) Died`);
	cluster.fork();
});

function times(n: number, f: () => void): void {
	'use strict';
	for (let i = 0; i <= n; i++) {
		f();
	}
}
