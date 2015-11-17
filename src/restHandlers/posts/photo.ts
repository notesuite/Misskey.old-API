import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import photo from '../../endpoints/posts/photo';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
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
