// import * as express from 'express';
import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import replies from '../../endpoints/posts/replies';

export default function replyPosts(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	replies(
		req.misskeyUser,
		req.query['post-id'],
		req.query['limit'],
		req.query['since-cursor'],
		req.query['max-cursor']
	).then((post: Object) => {
		res.apiRender(post);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
