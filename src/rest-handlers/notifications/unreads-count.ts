import { Request, Response } from '../../misskey-express';
import notificationsUnreadsCount from '../../endpoints/notifications/unreads-count';

export default function unreadsCount(req: Request, res: Response): void {
	'use strict';
	notificationsUnreadsCount(
		req.misskeyUser
	).then((count: number) => {
		res.apiRender(count);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
