export function isColor(str: string): boolean {
	"use strict";
	return /^#[a-fA-F0-9]{6}$/.test(str);
}

export function isName(str: string): boolean {
	"use strict";
	return 1 <= str.length && str.length <= 30;
}
