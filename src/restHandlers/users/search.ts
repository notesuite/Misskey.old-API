// import * as express from 'express';
import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import search from '../../endpoints/users/search';

export default function searchUsers(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	search(req.misskeyUser, req.query['screen-name']).then((users: Object[]) => {
		res.apiRender(users);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
