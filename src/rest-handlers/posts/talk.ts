import { Request, Response } from '../../misskey-express';
import talk from '../../endpoints/posts/talk';

export default function talkPost(req: Request, res: Response): void {
	'use strict';
	talk(req.misskeyUser, req.query['post-id'], req.query['limit']).then((posts: Object[]) => {
		res.apiRender(posts);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
