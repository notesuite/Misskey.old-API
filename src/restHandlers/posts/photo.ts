import { Request, Response } from '../../misskey-express';
import photo from '../../endpoints/posts/photo';

export default function photoPost(req: Request, res: Response): void {
	'use strict';
	const text: string = req.body['text'];
	const photosJson = req.body['photos'];
	if (photosJson === undefined || photosJson === null) {
		return res.apiError(400, 'photos-required');
	}
	const photos = JSON.parse(photosJson);
	const inReplyToPostId: string = req.body['in-reply-to-post-id'];
	photo(req.misskeyApp, req.misskeyUser, photos, text, inReplyToPostId).then((photoPost: Object) => {
		res.apiRender(photoPost);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
