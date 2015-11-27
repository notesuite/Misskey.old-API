import * as cluster from 'cluster';
import { Task, print } from 'powerful';
import * as os from 'os';
import startServer from './server';

const numberOfCpu = os.cpus().length;

const fork = Task.sync<void>(() => cluster.fork());

const forkForEachCpu = Task.repeat(numberOfCpu, () => fork);

const startServers = Task.sync(() => {
	startServer();
});

(cluster.isMaster ? print('Welcome to Misskey API!').next(forkForEachCpu) : startServers).run();

// Fork when a worker died.
cluster.on('exit', (worker: cluster.Worker) => {
	console.log(`Worker ${worker.id} died :(`);
	cluster.fork();
});
