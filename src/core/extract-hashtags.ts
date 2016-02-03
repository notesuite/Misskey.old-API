export default function(text: string): string[] {
	if (text === null) {
		return [];
	}
	const tags: string[] = text.trim().match(/(^|\s)#(\S+)/g);
	return (tags !== null ? tags : [])
		.filter(tag => tag.trim().replace('#', '').indexOf('#') === -1)
		.map(tag => tag.trim().replace('#', ''));
}
