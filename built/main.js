"use strict";
const cluster = require('cluster');
const log_cool_1 = require('log-cool');
const fork_for_each_cpu_1 = require('fork-for-each-cpu');
const argv_1 = require('./argv');
const check_dependencies_1 = require('./check-dependencies');
const server_1 = require('./server');
Error.stackTraceLimit = Infinity;
const env = process.env.NODE_ENV;
fork_for_each_cpu_1.default({
    master: () => {
        log_cool_1.logInfo('Welcome to Misskey API');
        if (!argv_1.default.options.hasOwnProperty('skip-check-dependencies')) {
            check_dependencies_1.default();
        }
        if (env !== 'production') {
            log_cool_1.logWarn('Productionモードではありません。本番環境で使用しないでください。');
        }
    },
    worker: () => {
        server_1.default();
    }
});
cluster.on('exit', worker => {
    log_cool_1.logInfo(`(cluster: ${worker.id}) Died`);
    cluster.fork();
});
process.on('exit', () => {
    console.log('Bye.');
});
