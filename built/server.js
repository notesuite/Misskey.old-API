"use strict";
const powerful_1 = require('powerful');
const log_cool_1 = require('log-cool');
const cluster = require('cluster');
const hapi = require('hapi');
const endpoints_1 = require('./endpoints');
const config_1 = require('./config');
const api_handler_1 = require('./api-handler');
function default_1() {
    log_cool_1.logInfo(`(cluster: ${cluster.worker.id}) Initializing server`);
    const server = new hapi.Server();
    server.connection({ port: config_1.default.port.http });
    endpoints_1.default.forEach(endpoint => {
        if (endpoint.name === 'album/files/upload') {
            server.route({
                method: 'post',
                path: `/${endpoint.name}`,
                config: {
                    payload: {
                        output: 'file',
                        parse: true,
                        maxBytes: powerful_1.dataSize.fromMiB(100),
                        allow: 'multipart/form-data'
                    },
                    handler: (request, reply) => {
                        api_handler_1.default(endpoint, request, reply);
                    }
                }
            });
        }
        else {
            server.route({
                method: 'post',
                path: `/${endpoint.name}`,
                handler: (request, reply) => {
                    api_handler_1.default(endpoint, request, reply);
                }
            });
        }
    });
    server.route({ method: '*', path: '/{p*}', handler: notFoundHandler });
    server.start(() => {
        log_cool_1.logInfo(`(cluster: ${cluster.worker.id}) Listening at ${server.info.uri}`);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function notFoundHandler(req, res) {
    log_cool_1.logWarn(`Request not handled: ${req.method.toUpperCase()} ${req.path}`);
    return res({
        error: 'api-not-found'
    }).code(404);
}
