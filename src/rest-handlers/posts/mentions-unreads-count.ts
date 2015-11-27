import { Request, Response } from '../../misskey-express';
import mentionsUnreadsCount from '../../endpoints/posts/mentions-unreads-count';

export default function unreadsCount(req: Request, res: Response): void {
	'use strict';
	mentionsUnreadsCount(
		req.misskeyUser
	).then((count: number) => {
		res.apiRender(count);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
