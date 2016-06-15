"use strict";
function isColor(str) {
    "use strict";
    return /^#[a-fA-F0-9]{6}$/.test(str);
}
exports.isColor = isColor;
function isName(str) {
    "use strict";
    return 1 <= str.length && str.length <= 30;
}
exports.isName = isName;
