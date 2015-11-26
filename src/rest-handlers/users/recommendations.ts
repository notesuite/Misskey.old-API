import { Request, Response } from '../../misskey-express';
import recommendations from '../../endpoints/users/recommendations';

export default function userFollowings(req: Request, res: Response): void {
	'use strict';
	recommendations(
		req.misskeyUser
	).then((recommendationUsers: Object[]) => {
		res.apiRender(recommendationUsers);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
