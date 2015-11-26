import { Request, Response } from '../../misskey-express';
import create from '../../endpoints/posts/repost';

export default function repost(req: Request, res: Response): void {
	'use strict';
	create(req.misskeyApp, req.misskeyUser.id, req.body['post-id']).then((repost: Object) => {
		res.apiRender(repost);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
