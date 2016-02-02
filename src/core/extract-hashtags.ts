export default function(text: string): string[] {
	if (text === null) {
		return [];
	}
	const tags: string[] = text.match(/(^|\s)#(\S+)/g);
	return (tags !== null ? tags : []).map(tag => tag.replace('#', '').trim());
}
