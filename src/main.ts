import * as cluster from 'cluster';
import {logInfo} from 'log-cool';
import * as os from 'os';
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

function forkForEachCpu(callbacks: { master: () => void; worker: () => void }): void {
	if (cluster.isMaster) {
		callbacks.master();
		times(os.cpus().length, () => {
			cluster.fork();
		});
	} else {
		callbacks.worker();
	}
}

function times(n: number, f: () => void): void {
	for (let i = 1; i <= n; i++) {
		f();
	}
}
