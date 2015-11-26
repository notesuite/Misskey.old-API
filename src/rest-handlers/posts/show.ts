import { Request, Response } from '../../misskey-express';
import show from '../../endpoints/posts/show';

export default function showPost(req: Request, res: Response): void {
	'use strict';
	show(req.misskeyUser, req.query['post-id']).then((post: Object) => {
		res.apiRender(post);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
