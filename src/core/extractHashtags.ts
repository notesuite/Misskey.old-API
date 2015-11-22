export default function(text: string): string[] {
	'use strict';
	const tags: string[] = text.match(/#\S+/g);
	return (tags !== null ? tags : []).map(tag => tag.replace('#', ''));
}
