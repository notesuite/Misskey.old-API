import { IApplication, IUser } from '../../interfaces';
import photo from '../../endpoints/posts/photo';

export default function photoPost(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	'use strict';
	const text: string = req.payload['text'];
	const photosJson = req.payload['photos'];
	if (photosJson === undefined || photosJson === null) {
		res('photos-required').code(400);
		return;
	}
	const photos = JSON.parse(photosJson);
	const inReplyToPostId: string = req.payload['in-reply-to-post-id'];
	photo(
		app,
		user,
		photos,
		text,
		inReplyToPostId
	).then(photoPost => {
		res(photoPost);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
