import { Match } from 'powerful';
import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import like from '../../endpoints/posts/like';

export default function likePost(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	like(user, req.payload['post-id']).then(() => {
		res({ kyoppie: "yuppie" });
	}, (err: any) => {
		const statusCode = new Match<string, number>(err)
			.is('post-not-found', () => 400)
			.is('already-liked', () => 400)
			.toOption().getValue(500);

		res({error: err}).code(statusCode);
	});
};
