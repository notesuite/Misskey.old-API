import * as cluster from 'cluster';

if (cluster.isMaster) {
	console.log('Welcome to Misskey API!');

	// Count the machine's CPUs
	const cpuCount: number = require('os').cpus().length;

	// Create a worker for each CPU
	for (var i = 0; i < cpuCount; i++) {
		cluster.fork();
	}
} else {
	require('./server');
	require('./internalServer');
}

// Listen for dying workers
cluster.on('exit', (worker: cluster.Worker) => {
	// Replace the dead worker,
	// we're not sentimental
	console.log(`Worker ${worker.id} died :(`);
	cluster.fork();
});
