export function isName(str: string): boolean {
	"use strict";
	if (str.indexOf('\\') !== -1) {
		return false;
	} else if (str.indexOf('/') !== -1) {
		return false;
	} else if (str.indexOf('..') !== -1) {
		return false;
	}
	return 1 <= str.length && str.length <= 1000;
}
