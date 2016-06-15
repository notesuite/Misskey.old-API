"use strict";
const argv = require('argv');
argv.option({
    name: 'skip-check-dependencies',
    type: 'string',
    description: '依存関係のチェックをスキップします',
    example: "npm start --skip-check-dependencies"
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = argv.run();
