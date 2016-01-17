export function isScreenName(str: string): boolean {
	"use strict";
	return /^[a-zA-Z0-9\-]{1,20}$/.test(str);
}

export function isUserColor(str: string): boolean {
	"use strict";
	return /^#[a-fA-F0-9]{6}$/.test(str);
}
