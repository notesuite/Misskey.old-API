import { Request, Response } from '../../misskey-express';
import followers from '../../endpoints/users/followers';

export default function userFollowers(req: Request, res: Response): void {
	'use strict';
	followers(req.misskeyUser, req.query['limit'], req.query['since-cursor'], req.query['max-cursor']).then((followerList: Object[]) => {
		res.apiRender(followerList);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
