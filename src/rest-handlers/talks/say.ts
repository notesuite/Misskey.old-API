import { Request, Response } from '../../misskey-express';
import say from '../../endpoints/talks/say';

export default function sayInTalks(req: Request, res: Response): void {
	'use strict';
	const text: string = req.body['text'];
	const otherpartyId: string = req.body['otherparty-id'];

	if (text === undefined) {
		return res.apiError(400, 'text-is-required');
	}

	if (otherpartyId === undefined) {
		return res.apiError(400, 'otherparty-id-is-required');
	}

	say(req.misskeyApp, req.misskeyUser, otherpartyId, text).then((message: Object) => {
		res.apiRender(message);
	}, (err: any) => {
		res.apiError(500, err);
	});
}
