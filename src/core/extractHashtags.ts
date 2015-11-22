export default function(text: string): string[] {
	'use strict';
	const tags = text.match(/#\S+/g);

	if (tags === null) {
		return [];
	}

	return tags.map((tag: string) => {
		return tag.replace('#', '');
	});
}
