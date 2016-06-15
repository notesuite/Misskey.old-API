"use strict";
function isName(str) {
    "use strict";
    if (str.indexOf('\\') !== -1) {
        return false;
    }
    else if (str.indexOf('/') !== -1) {
        return false;
    }
    else if (str.indexOf('..') !== -1) {
        return false;
    }
    return 1 <= str.length && str.length <= 1000;
}
exports.isName = isName;
