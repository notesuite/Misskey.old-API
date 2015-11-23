import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import search from '../../endpoints/hashtags/search';

export default function searchHashtags(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	search(req.query['name']).then(hashtags => {
		res.apiRender(hashtags);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
