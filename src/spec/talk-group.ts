export function isName(str: string): boolean {
	"use strict";
	return 1 <= str.length && str.length <= 30;
}
