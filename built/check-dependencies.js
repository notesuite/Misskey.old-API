"use strict";
const log_cool_1 = require('log-cool');
const shelljs_1 = require('shelljs');
function default_1() {
    checkDependency('Node.js', 'node -v', x => x.match(/^v(.*)\r?\n$/)[1]);
    checkDependency('npm', 'npm -v', x => x.match(/^(.*)\r?\n$/)[1]);
    checkDependency('MongoDB', 'mongo --version', x => x.match(/^MongoDB shell version: (.*)\r?\n$/)[1]);
    checkDependency('Redis', 'redis-server --version', x => x.match(/v=([0-9\.]*)/)[1]);
    log_cool_1.logDone('Checked external dependencies');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function checkDependency(serviceName, command, transform) {
    const code = {
        success: 0,
        notFound: 127
    };
    const x = shelljs_1.exec(command, { silent: true });
    if (x.code === code.success) {
        log_cool_1.logInfo(`${serviceName} ${transform(x.stdout)}`);
    }
    else if (x.code === code.notFound) {
        log_cool_1.logWarn(`Unable to find ${serviceName}`);
    }
}
