export default function extractHashtags(text: string): string[] {
	'use strict';
	const tags: string[] = text.match(/(^|\s)#(\S+)/g);
	return (tags !== null ? tags : []).map(tag => tag.replace('#', '').trim());
}
