import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import like from '../../endpoints/posts/like';

export default function likePost(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	like(req.misskeyUser, req.body['post-id']).then(() => {
		res.apiRender({ kyoppie: "yuppie" });
	}, (err: any) => {
		const statuscode: number = (() => {
			switch (err) {
				case 'post-not-found':
					return 400;
				case 'already-liked':
					return 400;
				default:
					return 500;
			}
		})();
		res.apiError(statuscode, err);
	});
};
