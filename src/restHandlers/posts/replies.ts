// import * as express from 'express';
import { Request, Response } from '../../misskey-express';
import replies from '../../endpoints/posts/replies';

export default function replyPosts(req: Request, res: Response): void {
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
