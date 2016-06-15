"use strict";
function isScreenName(str) {
    "use strict";
    return /^[a-zA-Z0-9\-]{1,20}$/.test(str);
}
exports.isScreenName = isScreenName;
function isReservedScreenName(str) {
    "use strict";
    return /^[a-zA-Z0-9\-]{1,2}$/.test(str);
}
exports.isReservedScreenName = isReservedScreenName;
function isColor(str) {
    "use strict";
    return /^#[a-fA-F0-9]{6}$/.test(str);
}
exports.isColor = isColor;
function isName(str) {
    "use strict";
    return 1 <= str.length && str.length <= 20;
}
exports.isName = isName;
