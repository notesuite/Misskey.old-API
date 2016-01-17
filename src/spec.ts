export function isScreenName(str: string): boolean {
	"use strict";
	return /^[a-zA-Z0-9\-]{1,20}$/.test(str);
}
