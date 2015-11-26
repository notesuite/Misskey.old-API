import { Request, Response } from '../../misskey-express';
import followings from '../../endpoints/users/followings';

export default function userFollowings(req: Request, res: Response): void {
	'use strict';
	followings(req.misskeyUser, req.query['limit'], req.query['since-cursor'], req.query['max-cursor']).then((followingList: Object[]) => {
		res.apiRender(followingList);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
