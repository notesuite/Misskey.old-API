import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import favorite from '../../endpoints/posts/favorite';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	favorite(req.misskeyUser, req.body['post-id']).then(() => {
		res.apiRender({ kyoppie: "yuppie" });
	}, (err: any) => {
		const statuscode: number = (() => {
			switch (err) {
				case 'post-not-found':
					return 400;
				case 'already-favorite-post':
					return 400;
				default:
					return 500;
			}
		})();
		res.apiError(statuscode, err);
	});
};
