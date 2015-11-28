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
		const statusCode = (() => {
			switch (err) {
				case 'post-not-found':
					return 400;
				case 'already-liked':
					return 400;
				default:
					return 500;
			}
		})();
		res({error: err}).code(statusCode);
	});
};
