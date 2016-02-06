import * as cluster from 'cluster';
import {logInfo} from 'log-cool';
import forkForEachCpu from 'fork-for-each-cpu';
import checkDependencies from './check-dependencies';
import startServer from './server';

forkForEachCpu({
	master: (): void => {
		logInfo('Welcome to Misskey API');
		checkDependencies();
	},
	worker: (): void => {
		startServer();
	}
});

// Fork when a worker died.
cluster.on('exit', worker => {
	logInfo(`(cluster: ${worker.id}) Died`);
	cluster.fork();
});
