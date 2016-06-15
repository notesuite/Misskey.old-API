"use strict";
const redis = require('redis');
const Limiter = require('ratelimiter');
const authenticate_1 = require('./authenticate');
const config_1 = require('./config');
const log_cool_1 = require('log-cool');
const limiterDB = redis.createClient(config_1.default.redis.port, config_1.default.redis.host, {
    auth_pass: config_1.default.redis.password
});
function default_1(endpoint, req, res) {
    log_cool_1.logInfo(`Request: ${req.method} ${req.path}`);
    function reply(data) {
        return res(data).header('Access-Control-Allow-Origin', '*');
    }
    authenticate_1.default(req).then((context) => {
        if (endpoint.login) {
            const limitKey = endpoint.hasOwnProperty('limitKey') ? endpoint.limitKey : endpoint.name;
            if (endpoint.hasOwnProperty('minInterval')) {
                detectBriefInterval();
            }
            else if (endpoint.hasOwnProperty('limitDuration') && endpoint.hasOwnProperty('limitMax')) {
                rateLimit();
            }
            else {
                call();
            }
            function detectBriefInterval() {
                const minIntervalLimiter = new Limiter({
                    id: `${context.user.id}:${endpoint.name}:for-detect-brief-interval`,
                    duration: endpoint.minInterval,
                    max: 1,
                    db: limiterDB
                });
                minIntervalLimiter.get((limitErr, limit) => {
                    if (limitErr !== null) {
                        return reply({
                            error: 'something-happened'
                        }).code(500);
                    }
                    else if (limit.remaining === 0) {
                        return reply({
                            error: 'brief-interval-detected'
                        }).code(429);
                    }
                    else {
                        if (endpoint.hasOwnProperty('limitDuration') && endpoint.hasOwnProperty('limitMax')) {
                            rateLimit();
                        }
                        else {
                            call();
                        }
                    }
                });
            }
            function rateLimit() {
                const limiter = new Limiter({
                    id: `${context.user.id}:${limitKey}`,
                    duration: endpoint.limitDuration,
                    max: endpoint.limitMax,
                    db: limiterDB
                });
                limiter.get((limitErr, limit) => {
                    if (limitErr !== null) {
                        return reply({
                            error: 'something-happened'
                        }).code(500);
                    }
                    else if (limit.remaining === 0) {
                        return reply({
                            error: 'rate-limit-exceeded'
                        }).code(429);
                    }
                    else {
                        call();
                    }
                });
            }
        }
        else {
            call();
        }
        function call() {
            require(`${__dirname}/rest-handlers/${endpoint.name}`).default(context.app, context.user, req, reply, context.isOfficial);
        }
    }, (err) => {
        reply({
            error: 'authentication-failed'
        }).code(403);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
