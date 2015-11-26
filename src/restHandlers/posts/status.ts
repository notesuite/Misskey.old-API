import { Request, Response } from '../../misskey-express';
import create from '../../endpoints/posts/status';

export default function status(req: Request, res: Response): void {
	'use strict';
	const text: string = req.body['text'];
	if (text === undefined) {
		return res.apiError(400, 'text is required');
	}
	create(req.misskeyApp, req.misskeyUser, text, req.body['in-reply-to-post-id']).then((status: Object) => {
		res.apiRender(status);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
