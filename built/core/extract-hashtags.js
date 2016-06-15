"use strict";
function default_1(text) {
    if (text === null) {
        return [];
    }
    const tags = text.trim().match(/(^|\s)#(\S+)/g);
    return (tags !== null ? tags : [])
        .map(tag => tag.trim())
        .map(tag => tag.replace('#', ''))
        .filter(tag => tag !== '')
        .filter(tag => tag.indexOf('#') === -1);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
