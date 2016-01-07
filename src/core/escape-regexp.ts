export default function(s: string): string {
	'use strict';
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
