"use strict";
function default_1(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
